import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';
import { getUserRole } from '../utils/domainValidator';
import { UserRole } from '../constants';

// ─── AppUser shape stored in Firestore ───────────────────────────────────────
export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  createdAt: Timestamp | Date | null;
  lastLoginAt: Timestamp | Date | null;
  loginCount: number;
}

/**
 * On every successful login:
 *  - First time → creates the user document
 *  - Subsequent → updates lastLoginAt + increments loginCount
 */
export const saveUserToDatabase = async (firebaseUser: User): Promise<AppUser> => {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  const role = getUserRole(firebaseUser.email!);

  if (!snap.exists()) {
    const newUser: AppUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL,
      role,
      createdAt: serverTimestamp() as unknown as Timestamp,
      lastLoginAt: serverTimestamp() as unknown as Timestamp,
      loginCount: 1,
    };
    await setDoc(ref, newUser);
    return newUser;
  }

  const existing = snap.data() as AppUser;
  const updated = {
    lastLoginAt: serverTimestamp(),
    loginCount: (existing.loginCount || 0) + 1,
    displayName: firebaseUser.displayName || existing.displayName,
    photoURL: firebaseUser.photoURL ?? existing.photoURL,
  };
  await updateDoc(ref, updated);
  return {
    ...existing,
    ...updated,
    lastLoginAt: new Date(),
    loginCount: (existing.loginCount || 0) + 1,
  };
};

/** Fetch user document from Firestore */
export const getUserFromDatabase = async (
  uid: string
): Promise<AppUser | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
};
