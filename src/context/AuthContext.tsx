import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  getCurrentUserProfile, 
  signInUser, 
  signUpUser, 
  signOutUser, 
  addNagarPoints 
} from '../services/authService';

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, name: string, wardName: string, role?: 'citizen' | 'authority') => Promise<UserProfile>;
  logout: () => Promise<void>;
  addPoints: (points: number, reason: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile on start
  useEffect(() => {
    async function loadSession() {
      try {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setUserProfile(profile);
        }
      } catch (err) {
        console.error("Session restoration error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const profile = await signInUser(email, password);
      setUserProfile(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    wardName: string,
    role: 'citizen' | 'authority' = 'citizen'
  ) => {
    setLoading(true);
    try {
      const profile = await signUpUser(email, password, name, wardName, role);
      setUserProfile(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (points: number, reason: string) => {
    if (!userProfile) return;
    try {
      const cachedUid = localStorage.getItem("nagarseva_local_user_uid") || "mock-uid";
      const updatedProfile = await addNagarPoints(cachedUid, points);
      setUserProfile(updatedProfile);
    } catch (err) {
      console.error("Failed to add nagar points:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ userProfile, loading, signIn, signUp, logout, addPoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
