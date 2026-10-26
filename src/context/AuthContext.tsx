import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserAccount } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserAccount | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bootstrapped admin email
const PRIMARY_ADMIN_EMAIL = 'techmosarof5@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserAccount | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  // Friendly error mapping for Bengali & English users
  const getFriendlyErrorMessage = (code: string, fallback: string): string => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'এই ইমেইল দিয়ে ইতোমধ্যে একটি একাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন। (Email already registered)';
      case 'auth/invalid-email':
        return 'ইমেইল অ্যাড্রেসটি সঠিক নয়। অনুগ্রহ করে সঠিক ইমেইল লিখুন। (Invalid email format)';
      case 'auth/weak-password':
        return 'পাসওয়ার্ডটি খুবই দুর্বল। অন্তত ৬ বা ততোধিক অক্ষরের শক্তিশালী পাসওয়ার্ড দিন। (Password too weak)';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'ভুল ইমেইল অথবা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন। (Incorrect email or password)';
      case 'auth/too-many-requests':
        return 'অতিরিক্ত ভুল চেষ্টার কারণে সাময়িকভাবে স্থগিত। কিছুক্ষণ পর আবার চেষ্টা করুন। (Too many attempts)';
      case 'auth/network-request-failed':
        return 'ইন্টারনেট সংযোগে সমস্যা দেখা দিয়েছে। ইন্টারনেট চেক করে আবার চেষ্টা করুন। (Network connection error)';
      case 'auth/popup-closed-by-user':
        return 'গুগল সাইন-ইন উইন্ডো বন্ধ করা হয়েছে। (Sign-in popup closed)';
      default:
        return fallback || 'একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    }
  };

  const syncUserProfile = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const isDefaultAdmin = (user.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase());

      if (userSnap.exists()) {
        const data = userSnap.data() as UserAccount;
        setUserProfile(data);
        setIsAdmin(isDefaultAdmin || data.role === 'admin');
      } else {
        // Create initial user doc
        const newProfile: UserAccount = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          role: isDefaultAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        try {
          await setDoc(userRef, newProfile);
        } catch (err) {
          console.warn('Could not save user profile to firestore:', err);
        }
        setUserProfile(newProfile);
        setIsAdmin(isDefaultAdmin);
      }

      // Check admin collection
      if (!isDefaultAdmin) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          }
        } catch {
          // not an admin or collection restricted
        }
      }
    } catch (err) {
      console.warn('Error fetching user profile:', err);
      // Fallback state
      const isDefaultAdmin = (user.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase());
      setIsAdmin(isDefaultAdmin);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await syncUserProfile(res.user);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim()) {
        try {
          await updateProfile(res.user, { displayName: name.trim() });
        } catch (e) {
          console.warn('Could not update display name:', e);
        }
      }
      await syncUserProfile(res.user);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(res.user);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err.code, err.message);
      setAuthError(msg);
    }
  };

  const refreshUserProfile = async () => {
    if (currentUser) {
      await syncUserProfile(currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        authError,
        clearAuthError,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        resetPassword,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
