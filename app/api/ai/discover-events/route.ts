import { NextResponse } from "next/server";
import { get_events, ConferenceEvent } from "@/lib/data";

interface EventCardProps extends ConferenceEvent {
    priorityScore?: number;
    priorityReason?: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const interests = searchParams.get("interests")?.split(",") || [];
        const track = searchParams.get("track") || undefined;

        // 1. Fetch events
        const events = await get_events({ track });

        // 2. Score events based on interests (Simple keyword match for now)
        // In a full implementation, we would use Gemini here.
        const scoredEvents = events.map((event) => {
            let score = 50; // Base score
            let reason = "General conference event";

            const eventText = (event.title + " " + event.description + " " + (event.tags?.join(" ") || "")).toLowerCase();

            const matchCount = interests.reduce((count, interest) => {
                return count + (eventText.includes(interest.toLowerCase().trim()) ? 1 : 0);
            }, 0);

            if (matchCount > 0) {
                score += matchCount * 20;
                reason = `Matches your interest in ${interests.find(i => eventText.includes(i.toLowerCase()))}`;
            }

            return {
                ...event,
                priorityScore: Math.min(score, 100),
                priorityReason: reason,
            };
        });

        // 3. Sort by score
        scoredEvents.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

        return NextResponse.json({
            success: true,
            model: "keyword-matcher",
            events: scoredEvents,
            meta: {
                total: scoredEvents.length,
                userId: "demo-user",
                generatedAt: new Date().toISOString(),
            },
        });

    } catch (error) {
        console.error("Error in discover-events:", error);
        return NextResponse.json(
            { success: false, error: "Failed to discover events" },
            { status: 500 }
        );
    }
}
