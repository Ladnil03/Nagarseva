import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseActive } from "./firebase";
import { UserProfile } from "../types";

// Local storage keys for mock session fallback
const LOCAL_PROFILE_KEY = "nagarseva_local_user_profile";
const LOCAL_UID_KEY = "nagarseva_local_user_uid";

const DEFAULT_MOCK_PROFILE: UserProfile = {
  name: "Lakshmi Prasad",
  points: 380,
  level: "3",
  avatarInitials: "LP",
  rank: 12,
  wardName: "HAL 2nd Stage Ward 142",
  resolvedCount: 2,
  reportedCount: 4,
  verificationsCount: 8,
};

/**
 * Normalizes user data fetched from Firestore to local UserProfile type.
 * @param {any} data Document data
 * @returns {UserProfile} Normalized profile
 */
function normalizeProfile(data: any): UserProfile {
  return {
    name: data.name || "Anonymous Citizen",
    points: data.points ?? 0,
    level: String(data.level || "1"),
    avatarInitials: data.name ? data.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "AC",
    rank: data.rank || 100,
    wardName: data.wardName || "HAL 2nd Stage Ward 142",
    resolvedCount: data.resolvedCount ?? 0,
    reportedCount: data.reportedCount ?? 0,
    verificationsCount: data.verificationsCount ?? 0,
  };
}

/**
 * Signs up a new citizen or authority user in the platform.
 * Creates an entry in the Firestore `users` collection upon successful auth.
 * @param {string} email User email address
 * @param {string} password Secret password
 * @param {string} name Display name of citizen
 * @param {string} wardName Designated ward name
 * @param {'citizen' | 'authority'} role Profile classification
 * @returns {Promise<UserProfile>} Created profile details
 */
export async function signUpUser(
  email: string,
  password: string,
  name: string,
  wardName: string,
  role: 'citizen' | 'authority' = 'citizen'
): Promise<UserProfile> {
  if (isFirebaseActive()) {
    const auth = getFirebaseAuth();
    const db = getFirebaseFirestore();
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    const userDocRef = doc(db, "users", uid);
    
    // Check if it's the demo citizen to populate rich stats
    const isCitizenDemo = email.toLowerCase().trim() === 'citizen@nagarseva.org';
    const initialProfile = {
      uid,
      name,
      email,
      role,
      wardName,
      points: isCitizenDemo ? 380 : (role === 'citizen' ? 100 : 0),
      level: isCitizenDemo ? "3" : "1",
      resolvedCount: isCitizenDemo ? 2 : 0,
      reportedCount: isCitizenDemo ? 4 : 0,
      verificationsCount: isCitizenDemo ? 8 : 0,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(userDocRef, initialProfile);
    localStorage.setItem(LOCAL_UID_KEY, uid);
    return normalizeProfile(initialProfile);
  } else {
    // Local storage fallback mock signUp
    const mockUid = "mock-uid-" + Date.now();
    const fallbackProfile: UserProfile = {
      name,
      points: role === 'citizen' ? 100 : 0,
      level: "1",
      avatarInitials: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      rank: 25,
      wardName,
      resolvedCount: 0,
      reportedCount: 0,
      verificationsCount: 0
    };
    localStorage.setItem(LOCAL_UID_KEY, mockUid);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(fallbackProfile));
    return fallbackProfile;
  }
}

/**
 * Signs in an existing user with email credentials.
 * Includes graceful auto-creation for demo accounts if not yet registered in Firebase.
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<UserProfile>} Retrieved user profile
 */
export async function signInUser(email: string, password: string): Promise<UserProfile> {
  if (isFirebaseActive()) {
    const auth = getFirebaseAuth();
    const db = getFirebaseFirestore();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        localStorage.setItem(LOCAL_UID_KEY, uid);
        return normalizeProfile(data);
      } else {
        // Create Firestore profile if it doesn't exist for some reason
        const role = email.toLowerCase().includes('officer') ? 'authority' : 'citizen';
        const name = email.toLowerCase().includes('officer') ? 'Officer Vikram Gowda' : 'Rohan Sharma';
        const isCitizen = role === 'citizen';
        const initialProfile = {
          uid,
          name,
          email,
          role,
          wardName: "HAL 2nd Stage Ward 142",
          points: isCitizen ? 380 : 0,
          level: isCitizen ? "3" : "1",
          resolvedCount: isCitizen ? 2 : 0,
          reportedCount: isCitizen ? 4 : 0,
          verificationsCount: isCitizen ? 8 : 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, initialProfile);
        localStorage.setItem(LOCAL_UID_KEY, uid);
        return normalizeProfile(initialProfile);
      }
    } catch (err: any) {
      // If it's a demo account and failed (e.g. invalid credentials because it doesn't exist),
      // we auto-create the credential on the fly so it works seamlessly!
      const lowerEmail = email.toLowerCase().trim();
      const isCitizenDemo = lowerEmail === 'citizen@nagarseva.org' && password === 'citizen123';
      const isOfficerDemo = lowerEmail === 'officer@nagarseva.gov.in' && password === 'officer123';
      
      if (isCitizenDemo || isOfficerDemo) {
        try {
          const role = isOfficerDemo ? 'authority' : 'citizen';
          const name = isOfficerDemo ? 'Officer Vikram Gowda' : 'Rohan Sharma';
          return await signUpUser(
            email,
            password,
            name,
            "HAL 2nd Stage Ward 142",
            role
          );
        } catch (signUpErr) {
          console.error("Graceful registration of demo credentials failed:", signUpErr);
          throw err;
        }
      }
      throw err;
    }
  } else {
    // Local storage fallback login
    const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
    const profile = saved ? JSON.parse(saved) : DEFAULT_MOCK_PROFILE;
    localStorage.setItem(LOCAL_UID_KEY, "mock-authenticated-uid");
    return profile;
  }
}

/**
 * Updates the user profile points in Firestore.
 * @param {string} uid User ID
 * @param {number} pointsToAdd Number of points to add
 * @returns {Promise<UserProfile>} The updated user profile
 */
export async function addNagarPoints(uid: string, pointsToAdd: number): Promise<UserProfile> {
  if (isFirebaseActive()) {
    const db = getFirebaseFirestore();
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      const currentPoints = data.points || 0;
      const nextPoints = currentPoints + pointsToAdd;
      const nextLevel = Math.floor(nextPoints / 500) + 1; // 500 points per level
      
      const updates = {
        points: nextPoints,
        level: String(nextLevel)
      };
      
      await updateDoc(userDocRef, updates);
      return normalizeProfile({ ...data, ...updates });
    } else {
      throw new Error("Profile document does not exist.");
    }
  } else {
    // Local storage update
    const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
    const profile: UserProfile = saved ? JSON.parse(saved) : { ...DEFAULT_MOCK_PROFILE };
    profile.points += pointsToAdd;
    profile.level = String(Math.floor(profile.points / 500) + 1);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }
}

/**
 * Signs out the current active user session.
 * @returns {Promise<void>}
 */
export async function signOutUser(): Promise<void> {
  localStorage.removeItem(LOCAL_UID_KEY);
  if (isFirebaseActive()) {
    const auth = getFirebaseAuth();
    await signOut(auth);
  }
}

/**
 * Obtains current user profile, loading from database or fallback.
 * @returns {Promise<UserProfile | null>} Authenticated profile or null
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const cachedUid = localStorage.getItem(LOCAL_UID_KEY);
  if (!cachedUid) return null;

  if (isFirebaseActive()) {
    try {
      const db = getFirebaseFirestore();
      const userDocRef = doc(db, "users", cachedUid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return normalizeProfile(userDoc.data());
      }
    } catch (e) {
      console.error("Failed to read active Firebase profile:", e);
    }
  }

  // Local storage profile fallback
  const savedProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
  return savedProfile ? JSON.parse(savedProfile) : { ...DEFAULT_MOCK_PROFILE };
}

/**
 * Listens for state changes in active user session.
 * @param {(user: User | null) => void} callback Triggered on auth shift
 * @returns {() => void} Unsubscribe listener function
 */
export function listenToAuthChanges(callback: (user: User | null) => void): () => void {
  if (isFirebaseActive()) {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
  }
  // No-op unsubscribe function if Firebase not active
  return () => {};
}
