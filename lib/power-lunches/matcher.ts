// lib/power-lunches/matcher.ts
// Power Lunch Matching Orchestration with Claude AI and Atomic Firestore Updates

import Anthropic from '@anthropic-ai/sdk';
import { adminDb, getAdminConferenceCollection } from '../firebase-admin';
import {
    PowerLunchRegistration,
    PowerLunchGroup,
    ClaudeMatchingInput,
    ClaudeMatchingOutput,
    MatchingResult,
} from './types';

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Matching constraints
const DEFAULT_CONSTRAINTS = {
    minGroupSize: 3,
    maxGroupSize: 6,
    prioritizeTopicOverlap: true,
    prioritizeDiverseExperience: true,
};

/**
 * Main orchestration function for Power Lunch matching
 * 
 * Atomic sequence:
 * 1. Retrieve pending registrations
 * 2. Delegate matching to Claude via match_power_lunch_group tool
 * 3. Execute single Firestore batch operation (create groups + update registrations)
 */
export async function runPowerLunchMatching(
    conferenceId: string,
    lunchDate: string
): Promise<MatchingResult> {
    if (!adminDb) {
        return {
            success: false,
            conferenceId,
            lunchDate,
            groups: [],
            stats: {
                totalRegistrations: 0,
                matchedRegistrations: 0,
                unmatchedRegistrations: 0,
                groupsCreated: 0,
                averageGroupSize: 0,
            },
            unmatchedRegistrationIds: [],
            error: 'Firebase Admin SDK not initialized',
        };
    }

    try {
        // Step 1: Retrieve pending registrations
        console.log(`[PowerLunch] Fetching registrations for ${conferenceId} on ${lunchDate}`);
        const registrations = await fetchPendingRegistrations(conferenceId, lunchDate);

        if (registrations.length === 0) {
            return {
                success: true,
                conferenceId,
                lunchDate,
                groups: [],
                stats: {
                    totalRegistrations: 0,
                    matchedRegistrations: 0,
                    unmatchedRegistrations: 0,
                    groupsCreated: 0,
                    averageGroupSize: 0,
                },
                unmatchedRegistrationIds: [],
            };
        }

        console.log(`[PowerLunch] Found ${registrations.length} pending registrations`);

        // Step 2: Delegate matching to Claude
        console.log('[PowerLunch] Delegating matching to Claude model');
        const claudeInput = formatRegistrationsForClaude(conferenceId, lunchDate, registrations);
        const claudeOutput = await callClaudeForMatching(claudeInput);

        if (!claudeOutput || claudeOutput.groups.length === 0) {
            return {
                success: true,
                conferenceId,
                lunchDate,
                groups: [],
                stats: {
                    totalRegistrations: registrations.length,
                    matchedRegistrations: 0,
                    unmatchedRegistrations: registrations.length,
                    groupsCreated: 0,
                    averageGroupSize: 0,
                },
                unmatchedRegistrationIds: registrations.map(r => r.id),
            };
        }

        console.log(`[PowerLunch] Claude created ${claudeOutput.groups.length} groups`);

        // Step 3: Execute atomic batch operation
        console.log('[PowerLunch] Executing atomic Firestore batch operation');
        const groups = await executeBatchUpdate(conferenceId, lunchDate, registrations, claudeOutput);

        // Calculate statistics
        const matchedCount = groups.reduce((sum, g) => sum + g.memberCount, 0);
        const stats = {
            totalRegistrations: registrations.length,
            matchedRegistrations: matchedCount,
            unmatchedRegistrations: claudeOutput.unmatchedRegistrationIds.length,
            groupsCreated: groups.length,
            averageGroupSize: groups.length > 0 ? matchedCount / groups.length : 0,
        };

        console.log('[PowerLunch] Matching completed successfully', stats);

        return {
            success: true,
            conferenceId,
            lunchDate,
            groups,
            stats,
            unmatchedRegistrationIds: claudeOutput.unmatchedRegistrationIds,
        };
    } catch (error) {
        console.error('[PowerLunch] Matching failed:', error);
        return {
            success: false,
            conferenceId,
            lunchDate,
            groups: [],
            stats: {
                totalRegistrations: 0,
                matchedRegistrations: 0,
                unmatchedRegistrations: 0,
                groupsCreated: 0,
                averageGroupSize: 0,
            },
            unmatchedRegistrationIds: [],
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Fetch pending registrations for a specific lunch date
 */
async function fetchPendingRegistrations(
    conferenceId: string,
    lunchDate: string
): Promise<PowerLunchRegistration[]> {
    const registrationsRef = getAdminConferenceCollection(conferenceId, 'power-lunch-registrations');

    const snapshot = await registrationsRef
        .where('status', '==', 'pending')
        .where('lunchDate', '==', lunchDate)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as PowerLunchRegistration));
}

/**
 * Format registrations for Claude input
 */
function formatRegistrationsForClaude(
    conferenceId: string,
    lunchDate: string,
    registrations: PowerLunchRegistration[]
): ClaudeMatchingInput {
    return {
        conferenceId,
        lunchDate,
        registrations: registrations.map(r => ({
            id: r.id,
            userId: r.userId,
            userName: r.userName,
            company: r.userCompany,
            role: r.userRole,
            industry: r.userIndustry,
            topics: r.topics,
            goals: r.goals,
            experienceLevel: r.experienceLevel,
            dietaryRestrictions: r.dietaryRestrictions,
            timeSlotPreference: r.timeSlotPreference,
        })),
        constraints: DEFAULT_CONSTRAINTS,
    };
}

/**
 * Call Claude API with match_power_lunch_group tool
 */
async function callClaudeForMatching(input: ClaudeMatchingInput): Promise<ClaudeMatchingOutput | null> {
    const systemPrompt = `You are an expert at creating meaningful professional networking matches. 
Your goal is to group conference attendees for Power Lunch sessions that maximize networking value.

Consider these factors when matching:
1. Topic overlap - Group people with shared interests
2. Experience diversity - Mix experience levels for mentorship opportunities
3. Industry connections - Create cross-pollination opportunities
4. Goal alignment - Match people with complementary objectives
5. Dietary restrictions - Ensure compatible venue options for each group

Create groups of ${input.constraints.minGroupSize}-${input.constraints.maxGroupSize} people.
Each group should have a clear rationale for why these specific people were matched.
Suggest 2-3 icebreaker questions customized for each group's common interests.`;

    const userMessage = `Please analyze these ${input.registrations.length} registrations for the ${input.lunchDate} Power Lunch at conference ${input.conferenceId} and create optimal groups.

Registrations:
${JSON.stringify(input.registrations, null, 2)}

Use the match_power_lunch_group tool to return the matched groups.`;

    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: systemPrompt,
            tools: [
                {
                    name: 'match_power_lunch_group',
                    description: 'Create Power Lunch group assignments based on registration analysis',
                    input_schema: {
                        type: 'object' as const,
                        properties: {
                            groups: {
                                type: 'array',
                                description: 'Array of matched groups',
                                items: {
                                    type: 'object',
                                    properties: {
                                        memberIds: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'Registration IDs of group members',
                                        },
                                        timeSlot: {
                                            type: 'string',
                                            description: 'Recommended time slot (e.g., "12:00 PM - 1:00 PM")',
                                        },
                                        matchRationale: {
                                            type: 'string',
                                            description: 'Explanation of why these people were matched',
                                        },
                                        commonTopics: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'Topics this group has in common',
                                        },
                                        suggestedIcebreakers: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'Customized icebreaker questions for this group',
                                        },
                                    },
                                    required: ['memberIds', 'timeSlot', 'matchRationale', 'commonTopics', 'suggestedIcebreakers'],
                                },
                            },
                            unmatchedRegistrationIds: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'IDs of registrations that could not be matched',
                            },
                            matchingNotes: {
                                type: 'string',
                                description: 'Optional notes about the matching process',
                            },
                        },
                        required: ['groups', 'unmatchedRegistrationIds'],
                    },
                },
            ],
            messages: [
                { role: 'user', content: userMessage },
            ],
        });

        // Extract tool use from response
        const toolUse = response.content.find(
            (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
        );

        if (!toolUse || toolUse.name !== 'match_power_lunch_group') {
            console.error('[PowerLunch] Claude did not use the matching tool');
            return null;
        }

        return toolUse.input as ClaudeMatchingOutput;
    } catch (error) {
        console.error('[PowerLunch] Claude API call failed:', error);
        throw error;
    }
}

/**
 * Execute atomic batch update to Firestore
 * Creates groups and updates all matched registrations in a single transaction
 */
async function executeBatchUpdate(
    conferenceId: string,
    lunchDate: string,
    registrations: PowerLunchRegistration[],
    claudeOutput: ClaudeMatchingOutput
): Promise<PowerLunchGroup[]> {
    if (!adminDb) {
        throw new Error('Firebase Admin SDK not initialized');
    }

    const batch = adminDb.batch();
    const groupsRef = getAdminConferenceCollection(conferenceId, 'power-lunch-groups');
    const registrationsRef = getAdminConferenceCollection(conferenceId, 'power-lunch-registrations');

    const now = new Date().toISOString();
    const createdGroups: PowerLunchGroup[] = [];

    // Create a map of registration IDs to registrations for quick lookup
    const registrationMap = new Map(registrations.map(r => [r.id, r]));

    // Process each group from Claude's output
    for (const group of claudeOutput.groups) {
        // Generate a new group document ID
        const groupDocRef = groupsRef.doc();
        const groupId = groupDocRef.id;

        // Build the group document
        const groupData: PowerLunchGroup = {
            id: groupId,
            conferenceId,
            lunchDate,
            timeSlot: group.timeSlot,
            memberIds: group.memberIds,
            memberCount: group.memberIds.length,
            matchRationale: group.matchRationale,
            commonTopics: group.commonTopics,
            suggestedIcebreakers: group.suggestedIcebreakers,
            status: 'scheduled',
            createdAt: now,
            updatedAt: now,
        };

        // Add group creation to batch
        batch.set(groupDocRef, groupData);
        createdGroups.push(groupData);

        // Update each matched registration
        for (const memberId of group.memberIds) {
            const registration = registrationMap.get(memberId);
            if (registration) {
                const regDocRef = registrationsRef.doc(memberId);
                batch.update(regDocRef, {
                    status: 'matched',
                    groupId: groupId,
                    updatedAt: now,
                });
            }
        }
    }

    // Commit all changes atomically
    await batch.commit();
    console.log(`[PowerLunch] Batch committed: ${createdGroups.length} groups, ${claudeOutput.groups.reduce((sum, g) => sum + g.memberIds.length, 0)} registrations updated`);

    return createdGroups;
}

/**
 * Get group details with member information
 */
export async function getGroupWithMembers(
    conferenceId: string,
    groupId: string
): Promise<{ group: PowerLunchGroup; members: PowerLunchRegistration[] } | null> {
    if (!adminDb) {
        throw new Error('Firebase Admin SDK not initialized');
    }

    const groupRef = getAdminConferenceCollection(conferenceId, 'power-lunch-groups').doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
        return null;
    }

    const group = { id: groupDoc.id, ...groupDoc.data() } as PowerLunchGroup;

    // Fetch member registrations
    const registrationsRef = getAdminConferenceCollection(conferenceId, 'power-lunch-registrations');
    const memberDocs = await Promise.all(
        group.memberIds.map(id => registrationsRef.doc(id).get())
    );

    const members = memberDocs
        .filter(doc => doc.exists)
        .map(doc => ({ id: doc.id, ...doc.data() } as PowerLunchRegistration));

    return { group, members };
}
