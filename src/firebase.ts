import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = !!firebaseConfig.apiKey;

// Initialize Firebase app + Firestore eagerly (cheap, and used across the public site).
const app: FirebaseApp = isConfigured ? (getApps()[0] ?? initializeApp(firebaseConfig)) : (null as any);
export const db: Firestore = isConfigured ? getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID!) : (null as any);

// Lazy Auth — initializing Firebase Auth eagerly pulled its helper iframe
// (https://<authDomain>/__/auth/iframe.js, ~90KB) plus a getProjectConfig request
// onto the homepage critical path (~1.8s on slow 4G), even though only the admin
// area ever needs auth. We defer getAuth() until something actually asks for it,
// so the public site never loads it.
let _auth: Auth | null = null;
export function getAuthInstance(): Auth {
  if (!isConfigured) return null as any;
  if (!_auth) _auth = getAuth(app);
  return _auth;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // Read the lazily-initialized auth instance without forcing it to load
  // (most Firestore reads on the public site happen with no auth at all).
  const currentUser = _auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
