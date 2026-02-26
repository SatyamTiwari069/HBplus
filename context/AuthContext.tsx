import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth, googleProvider } from '../config/firebase';
import { saveUserToDatabase, getUserFromDatabase, AppUser } from '../config/userService';
import { isAllowedDomain } from '../utils/domainValidator';
import { ALLOWED_DOMAIN, ROLES } from '../constants';

WebBrowser.maybeCompleteAuthSession();

// ─── Context shape ────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;      // initial session check
  authLoading: boolean;  // button spinner
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be called inside <AuthProvider>');
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Expo Google Auth (mobile) ────────────────────────────────────────────
  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
      '499133736624-gtn38069fhjvrc4r9bd291776fm9ur99.apps.googleusercontent.com',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  // Handle mobile OAuth response
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (response?.type === 'success') {
      const idToken = response.params?.id_token;
      const accessToken = response.authentication?.accessToken;
      if (idToken) {
        handleMobileToken(idToken, accessToken);
      } else {
        setError('Google sign-in failed. Please try again.');
        setAuthLoading(false);
      }
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Google sign-in failed.');
      setAuthLoading(false);
    } else if (response?.type === 'dismiss') {
      setAuthLoading(false);
    }
  }, [response]);

  const handleMobileToken = async (idToken: string, accessToken?: string) => {
    try {
      const credential = accessToken
        ? GoogleAuthProvider.credential(idToken, accessToken)
        : GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      await postSignIn(result.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setAuthLoading(false);
    }
  };

  // ── Core domain validation + Firestore save ──────────────────────────────
  const postSignIn = async (firebaseUser: User) => {
    const email = firebaseUser.email || '';

    if (!isAllowedDomain(email)) {
      // Immediately kill the Firebase session
      await firebaseSignOut(auth);
      setUser(null);
      setAppUser(null);
      setError(
        `Access restricted. Only @${ALLOWED_DOMAIN} email addresses are permitted.`
      );
      setAuthLoading(false);
      return;
    }

    try {
      const saved = await saveUserToDatabase(firebaseUser);
      setAppUser(saved);
    } catch (dbErr) {
      console.warn('[Firestore] Save failed (non-critical):', dbErr);
    }

    setUser(firebaseUser);
    setError(null);
    setAuthLoading(false);
  };

  // ── Sign in ──────────────────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    setAuthLoading(true);
    setError(null);

    if (Platform.OS === 'web') {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        await postSignIn(result.user);
      } catch (err: any) {
        if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          setError(null);
        } else if (err.code === 'auth/popup-blocked') {
          setError('Popup was blocked by your browser. Please allow popups for this site.');
        } else {
          setError(err.message || 'Google sign-in failed. Please try again.');
        }
        setAuthLoading(false);
      }
    } else {
      try {
        await promptAsync();
        // response handled in useEffect above
      } catch (err: any) {
        setError(err.message || 'Could not open Google sign-in.');
        setAuthLoading(false);
      }
    }
  }, [promptAsync]);

  // ── Sign out ─────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    setAuthLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setAppUser(null);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ── Firebase auth state listener ─────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Re-validate domain on every session restore
        if (!isAllowedDomain(firebaseUser.email || '')) {
          await firebaseSignOut(auth);
          setUser(null);
          setAppUser(null);
        } else {
          setUser(firebaseUser);
          try {
            const saved = await getUserFromDatabase(firebaseUser.uid);
            setAppUser(saved);
          } catch {
            // non-critical — dashboard still works without appUser
          }
        }
      } else {
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const isAdmin = appUser?.role === ROLES.ADMIN;

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        authLoading,
        error,
        signInWithGoogle,
        signOut,
        clearError,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
