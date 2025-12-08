// lib/firebase-admin.ts
// Firebase Admin SDK Configuration with FCM Support

import * as admin from 'firebase-admin';

// Prevent re-initialization in serverless environments
if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.warn(
            'Firebase Admin SDK not initialized: Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY'
        );
    } else {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
        });
    }
}

// Admin Firestore instance
export const adminDb = admin.apps.length ? admin.firestore() : null;

// Admin Auth instance
export const adminAuth = admin.apps.length ? admin.auth() : null;

// Firebase Cloud Messaging instance
export const messaging = admin.apps.length ? admin.messaging() : null;

/**
 * Send FCM notification to multiple device tokens
 */
export async function sendMulticastNotification(
    tokens: string[],
    notification: {
        title: string;
        body: string;
        imageUrl?: string;
    },
    data?: Record<string, string>
): Promise<{
    successCount: number;
    failureCount: number;
    failedTokens: string[];
}> {
    if (!messaging) {
        throw new Error('Firebase Admin SDK not initialized');
    }

    if (tokens.length === 0) {
        return { successCount: 0, failureCount: 0, failedTokens: [] };
    }

    const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
            title: notification.title,
            body: notification.body,
            ...(notification.imageUrl && { imageUrl: notification.imageUrl }),
        },
        ...(data && { data }),
        // Android-specific settings
        android: {
            priority: 'high',
            notification: {
                sound: 'default',
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
        },
        // iOS-specific settings
        apns: {
            payload: {
                aps: {
                    sound: 'default',
                    badge: 1,
                },
            },
        },
        // Web push settings
        webpush: {
            notification: {
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
            },
            fcmOptions: {
                link: '/',
            },
        },
    };

    const response = await messaging.sendEachForMulticast(message);

    // Collect failed tokens for cleanup
    const failedTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
        if (!resp.success) {
            failedTokens.push(tokens[idx]);
            console.error(`FCM send failed for token ${idx}:`, resp.error);
        }
    });

    return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        failedTokens,
    };
}

/**
 * Get a reference to a conference collection in admin context
 */
export function getAdminConferenceCollection(
    conferenceId: string,
    collectionName: string
): admin.firestore.CollectionReference {
    if (!adminDb) {
        throw new Error('Firebase Admin SDK not initialized');
    }
    return adminDb.collection('conferences').doc(conferenceId).collection(collectionName);
}

/**
 * Get a reference to a conference document in admin context
 */
export function getAdminConferenceDoc(
    conferenceId: string,
    collectionName: string,
    docId: string
): admin.firestore.DocumentReference {
    if (!adminDb) {
        throw new Error('Firebase Admin SDK not initialized');
    }
    return adminDb.collection('conferences').doc(conferenceId).collection(collectionName).doc(docId);
}

export { admin };
