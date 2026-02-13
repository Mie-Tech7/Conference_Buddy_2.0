import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

// Gemini client (default model for event discovery)
const geminiApiKey = process.env.GOOGLE_AI_API_KEY || "";
export const gemini = new GoogleGenerativeAI(geminiApiKey);

// Claude client (for networking suggestions)
const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
export const claude = new Anthropic({
    apiKey: anthropicApiKey,
});

// Model configurations
export const AI_MODELS = {
    GEMINI_DEFAULT: "gemini-1.5-flash",
    CLAUDE_NETWORKING: "claude-3-5-sonnet-20241022",
} as const;

// Tool definitions for Claude networking suggestions
export const NETWORKING_TOOLS: Anthropic.Tool[] = [
    {
        name: "generate_networking_suggestions",
        description:
            "Generates personalized networking connection suggestions based on user profile, interests, and conference context. Analyzes attendee data to find meaningful professional connections.",
        input_schema: {
            type: "object" as const,
            properties: {
                user_interests: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of user's professional interests and skills",
                },
                user_role: {
                    type: "string",
                    description: "User's current job role or title",
                },
                networking_goals: {
                    type: "array",
                    items: { type: "string" },
                    description: "User's networking objectives (e.g., 'find mentors', 'explore job opportunities')",
                },
                conference_track: {
                    type: "string",
                    description: "Primary conference track the user is attending",
                },
            },
            required: ["user_interests"],
        },
    },
];

// Networking suggestion interface
export interface NetworkingSuggestion {
    id: string;
    name: string;
    role: string;
    company: string;
    matchScore: number;
    matchReasons: string[];
    sharedInterests: string[];
    suggestedIcebreaker: string;
    linkedInUrl?: string;
}

/**
 * Execute the generate_networking_suggestions tool
 * This is called when Claude uses the tool
 */
export function executeNetworkingSuggestionsTool(input: {
    user_interests: string[];
    user_role?: string;
    networking_goals?: string[];
    conference_track?: string;
}): NetworkingSuggestion[] {
    // In production, this would query a database of attendees
    // For now, return mock suggestions based on interests
    const suggestions: NetworkingSuggestion[] = [
        {
            id: "attendee-1",
            name: "Alex Thompson",
            role: "Senior Engineering Manager",
            company: "TechCorp Inc.",
            matchScore: 95,
            matchReasons: [
                "Works in the same technology domain",
                "Actively looking to mentor developers",
                "Speaker at multiple sessions",
            ],
            sharedInterests: input.user_interests.slice(0, 2),
            suggestedIcebreaker:
                "Ask about their talk on scaling engineering teams",
            linkedInUrl: "https://linkedin.com/in/alexthompson",
        },
        {
            id: "attendee-2",
            name: "Jordan Rivera",
            role: "Staff Software Engineer",
            company: "StartupXYZ",
            matchScore: 88,
            matchReasons: [
                "Similar technical background",
                "Open to collaboration opportunities",
            ],
            sharedInterests: input.user_interests.slice(0, 3),
            suggestedIcebreaker:
                "Discuss the latest developments in your shared interest areas",
            linkedInUrl: "https://linkedin.com/in/jordanrivera",
        },
        {
            id: "attendee-3",
            name: "Sam Patel",
            role: "VP of Engineering",
            company: "Enterprise Solutions",
            matchScore: 82,
            matchReasons: [
                "Hiring for roles matching your experience",
                "Shares professional network",
            ],
            sharedInterests: input.user_interests.slice(0, 1),
            suggestedIcebreaker:
                "Inquire about their company culture and growth plans",
            linkedInUrl: "https://linkedin.com/in/sampatel",
        },
    ];

    return suggestions;
}
