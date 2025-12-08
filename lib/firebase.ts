// lib/firebase.ts
// Firebase Client Configuration with Multi-Tenant Convention

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
    getFirestore,
    Firestore,
    collection,
    doc,
    CollectionReference,
    DocumentReference
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

function getFirebaseApp(): FirebaseApp {
    if (!app) {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    }
    return app;
}

function getFirestoreDb(): Firestore {
    if (!db) {
        db = getFirestore(getFirebaseApp());
    }
    return db;
}

function getFirebaseAuth(): Auth {
    if (!auth) {
        auth = getAuth(getFirebaseApp());
    }
    return auth;
}

// Multi-tenant collection helpers
// Convention: conferences/[conferenceId]/...

/**
 * Get a reference to a conference document
 */
function getConferenceRef(conferenceId: string): DocumentReference {
    return doc(getFirestoreDb(), 'conferences', conferenceId);
}

/**
 * Get a reference to a collection within a conference
 * Example: getConferenceCollection('afrotech-2025', 'users')
 */
function getConferenceCollection(
    conferenceId: string,
    collectionName: string
): CollectionReference {
    return collection(getFirestoreDb(), 'conferences', conferenceId, collectionName);
}

/**
 * Get a reference to a document within a conference collection
 * Example: getConferenceDoc('afrotech-2025', 'users', 'user-123')
 */
function getConferenceDoc(
    conferenceId: string,
    collectionName: string,
    docId: string
): DocumentReference {
    return doc(getFirestoreDb(), 'conferences', conferenceId, collectionName, docId);
}

// Available conference sub-collections
type ConferenceCollection =
    | 'users'
    | 'events'
    | 'sessions'
    | 'recommendations'
    | 'connections'
    | 'power-lunches'
    | 'power-lunch-registrations'
    | 'power-lunch-groups'
    | 'qr-codes'
    | 'feedback';

/**
 * Type-safe conference collection helper
 */
function conferenceCollection(
    conferenceId: string,
    name: ConferenceCollection
): CollectionReference {
    return getConferenceCollection(conferenceId, name);
}

export {
    getFirebaseApp,
    getFirestoreDb,
    getFirebaseAuth,
    getConferenceRef,
    getConferenceCollection,
    getConferenceDoc,
    conferenceCollection,
    type ConferenceCollection,
};

// Convenient exports
export const firebase = {
    get app() { return getFirebaseApp(); },
    get db() { return getFirestoreDb(); },
    get auth() { return getFirebaseAuth(); },
};
