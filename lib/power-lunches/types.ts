// lib/power-lunches/types.ts
// TypeScript interfaces for Power Lunches feature

/**
 * User registration for a Power Lunch session
 */
export interface PowerLunchRegistration {
    id: string;

    // User information
    userId: string;
    userName: string;
    userEmail: string;
    userCompany?: string;
    userRole?: string;
    userIndustry?: string;
    userLinkedInUrl?: string;

    // FCM token for push notifications
    fcmToken?: string;

    // Registration preferences
    lunchDate: string; // ISO date string (YYYY-MM-DD)
    timeSlotPreference?: 'early' | 'midday' | 'late' | 'any';
    dietaryRestrictions?: string[];

    // Matching criteria
    topics: string[]; // Topics user wants to discuss
    goals: string[]; // What user hopes to achieve (e.g., 'find mentor', 'explore partnerships')
    experienceLevel?: 'student' | 'early-career' | 'mid-career' | 'senior' | 'executive';

    // Optional: LinkedIn profile data for better matching
    linkedInSkills?: string[];
    linkedInHeadline?: string;

    // Status tracking
    status: 'pending' | 'matched' | 'cancelled' | 'completed';
    groupId?: string; // Set when matched

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

/**
 * A matched Power Lunch group
 */
export interface PowerLunchGroup {
    id: string;
    conferenceId: string;

    // Group details
    lunchDate: string;
    timeSlot: string; // e.g., '12:00 PM - 1:00 PM'
    venue?: string;
    tableNumber?: string;

    // Members
    memberIds: string[];
    memberCount: number;

    // Matching rationale from Claude
    matchRationale: string;
    commonTopics: string[];
    suggestedIcebreakers?: string[];

    // Status tracking
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

/**
 * Input format for Claude matching model
 */
export interface ClaudeMatchingInput {
    conferenceId: string;
    lunchDate: string;
    registrations: {
        id: string;
        userId: string;
        userName: string;
        company?: string;
        role?: string;
        industry?: string;
        topics: string[];
        goals: string[];
        experienceLevel?: string;
        dietaryRestrictions?: string[];
        timeSlotPreference?: string;
    }[];
    constraints: {
        minGroupSize: number;
        maxGroupSize: number;
        prioritizeTopicOverlap: boolean;
        prioritizeDiverseExperience: boolean;
    };
}

/**
 * Output format from Claude matching model (via match_power_lunch_group tool)
 */
export interface ClaudeMatchingOutput {
    groups: {
        memberIds: string[];
        timeSlot: string;
        matchRationale: string;
        commonTopics: string[];
        suggestedIcebreakers: string[];
    }[];
    unmatchedRegistrationIds: string[];
    matchingNotes?: string;
}

/**
 * Result from the matching orchestration
 */
export interface MatchingResult {
    success: boolean;
    conferenceId: string;
    lunchDate: string;

    // Created groups
    groups: PowerLunchGroup[];

    // Statistics
    stats: {
        totalRegistrations: number;
        matchedRegistrations: number;
        unmatchedRegistrations: number;
        groupsCreated: number;
        averageGroupSize: number;
    };

    // Unmatched registrations (if any)
    unmatchedRegistrationIds: string[];

    // Error details (if any)
    error?: string;
}

/**
 * Notification payload for Power Lunch matches
 */
export interface PowerLunchNotification {
    groupId: string;
    lunchDate: string;
    timeSlot: string;
    venue?: string;
    memberNames: string[];
    commonTopics: string[];
    suggestedIcebreakers?: string[];
}
