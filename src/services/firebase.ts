import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: metaEnv.VITE_FIREBASE_APP_ID,
};

// Check if we have valid configs (at least API key and Project ID)
const isConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

/**
 * Lazily initializes and returns the Firebase App.
 * @returns {FirebaseApp} The initialized Firebase App
 */
export function getFirebaseApp(): FirebaseApp {
  if (!isConfigured) {
    throw new Error("Firebase is not fully configured. Please provide VITE_FIREBASE_* environment variables in Settings.");
  }
  
  if (!appInstance) {
    if (getApps().length > 0) {
      appInstance = getApp();
    } else {
      appInstance = initializeApp(firebaseConfig);
    }
  }
  return appInstance;
}

/**
 * Returns the lazy-initialized Firebase Auth instance.
 * @returns {Auth | null} Auth service or null if unconfigured
 */
export function getFirebaseAuth(): Auth {
  try {
    const app = getFirebaseApp();
    if (!authInstance) {
      authInstance = getAuth(app);
    }
    return authInstance;
  } catch (err) {
    console.warn("Firebase Auth is offline. Using local in-memory fallback. Reason:", err);
    throw err;
  }
}

/**
 * Returns the lazy-initialized Firestore instance.
 * @returns {Firestore | null} Firestore service or null if unconfigured
 */
export function getFirebaseFirestore(): Firestore {
  try {
    const app = getFirebaseApp();
    if (!firestoreInstance) {
      firestoreInstance = getFirestore(app);
    }
    return firestoreInstance;
  } catch (err) {
    console.warn("Firestore is offline. Using local in-memory fallback. Reason:", err);
    throw err;
  }
}

/**
 * Returns the lazy-initialized Firebase Storage instance.
 * @returns {FirebaseStorage | null} Storage service or null if unconfigured
 */
export function getFirebaseStorage(): FirebaseStorage {
  try {
    const app = getFirebaseApp();
    if (!storageInstance) {
      storageInstance = getStorage(app);
    }
    return storageInstance;
  } catch (err) {
    console.warn("Firebase Storage is offline. Using local in-memory fallback. Reason:", err);
    throw err;
  }
}

/**
 * Returns whether Firebase integration is fully active.
 * @returns {boolean} True if VITE_FIREBASE environment variables are configured
 */
export function isFirebaseActive(): boolean {
  return isConfigured;
}
