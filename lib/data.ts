import { adminDb } from "./firebase-admin";

// Event interface
export interface ConferenceEvent {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location: string;
    track?: string;
    speakers?: string[];
    tags?: string[];
}

/**
 * Retrieves events from Firestore for the conference
 */
export async function get_events(options?: {
    conferenceId?: string;
    track?: string;
    limit?: number;
}): Promise<ConferenceEvent[]> {
    try {
        if (!adminDb) {
            console.warn("Firebase Admin DB not initialized, returning mock data.");
            return getMockEvents();
        }

        const eventsRef = adminDb.collection("events");

        let query: FirebaseFirestore.Query = eventsRef.orderBy("startTime", "asc");

        if (options?.track) {
            query = query.where("track", "==", options.track);
        }

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        const snapshot = await query.get();

        if (snapshot.empty) {
            return getMockEvents();
        }

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            startTime: doc.data().startTime?.toDate(),
            endTime: doc.data().endTime?.toDate(),
        })) as ConferenceEvent[];
    } catch (error) {
        console.error("Error fetching events:", error);
        // Return mock events for demo
        return getMockEvents();
    }
}

// Mock events for demo/development
function getMockEvents(): ConferenceEvent[] {
    const now = new Date();
    return [
        {
            id: "event-1",
            title: "Keynote: The Future of AI",
            description: "Opening keynote exploring the latest advancements in artificial intelligence and their impact on software development.",
            startTime: new Date(now.getTime() + 3600000),
            endTime: new Date(now.getTime() + 7200000),
            location: "Main Hall A",
            track: "AI/ML",
            speakers: ["Dr. Sarah Chen"],
            tags: ["keynote", "ai", "future"],
        },
        {
            id: "event-2",
            title: "Building Scalable React Applications",
            description: "Best practices and patterns for architecting large-scale React applications.",
            startTime: new Date(now.getTime() + 10800000),
            endTime: new Date(now.getTime() + 14400000),
            location: "Room 201",
            track: "Frontend",
            speakers: ["Mike Johnson"],
            tags: ["react", "architecture", "frontend"],
        },
        {
            id: "event-3",
            title: "Networking Lunch",
            description: "Connect with fellow attendees over lunch. Great opportunity to meet speakers and sponsors.",
            startTime: new Date(now.getTime() + 18000000),
            endTime: new Date(now.getTime() + 21600000),
            location: "Grand Ballroom",
            track: "Networking",
            tags: ["networking", "lunch"],
        },
        {
            id: "event-4",
            title: "Workshop: Cloud Architecture Patterns",
            description: "Hands-on workshop covering modern cloud architecture patterns and best practices.",
            startTime: new Date(now.getTime() + 25200000),
            endTime: new Date(now.getTime() + 32400000),
            location: "Workshop Room B",
            track: "Cloud",
            speakers: ["Amy Rodriguez", "David Kim"],
            tags: ["workshop", "cloud", "architecture"],
        },
    ];
}
