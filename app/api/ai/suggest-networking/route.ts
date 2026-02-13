import { NextResponse } from "next/server";
import { executeNetworkingSuggestionsTool } from "@/lib/ai-clients";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const interests = searchParams.get("interests")?.split(",") || [];
        const role = searchParams.get("role") || undefined;
        const goals = searchParams.get("goals")?.split(",") || [];
        const track = searchParams.get("track") || undefined;

        if (interests.length === 0) {
            return NextResponse.json(
                { success: false, error: "Interests are required" },
                { status: 400 }
            );
        }

        // Use the existing mock/tool logic
        const suggestions = executeNetworkingSuggestionsTool({
            user_interests: interests,
            user_role: role,
            networking_goals: goals,
            conference_track: track,
        });

        return NextResponse.json({
            success: true,
            suggestions,
        });

    } catch (error) {
        console.error("Error in suggest-networking:", error);
        return NextResponse.json(
            { success: false, error: "Failed to suggest networking" },
            { status: 500 }
        );
    }
}
