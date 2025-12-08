// app/api/admin/match-lunches/route.ts
// Admin API Endpoint for Power Lunch Matching

import { NextRequest, NextResponse } from 'next/server';
import { runPowerLunchMatching } from '@/lib/power-lunches/matcher';
import { notifyPowerLunchMatches } from '@/lib/power-lunches/notifications';

/**
 * Validate admin API key from request headers
 */
function validateAdminApiKey(request: NextRequest): boolean {
    const apiKey = request.headers.get('x-admin-api-key');
    const expectedKey = process.env.ADMIN_API_KEY;

    if (!expectedKey) {
        console.error('[Admin API] ADMIN_API_KEY not configured');
        return false;
    }

    return apiKey === expectedKey;
}

/**
 * POST /api/admin/match-lunches
 * 
 * Triggers Power Lunch matching for a specific conference and date.
 * 
 * Headers:
 *   x-admin-api-key: Required admin API key
 * 
 * Body:
 *   {
 *     conferenceId: string;      // Required: Conference identifier
 *     lunchDate: string;         // Required: Date in YYYY-MM-DD format
 *     sendNotifications?: boolean; // Optional: Whether to send FCM notifications (default: true)
 *   }
 * 
 * Response:
 *   200: { success: true, groups: [...], stats: {...}, notifications?: {...} }
 *   400: { error: 'Validation error message' }
 *   401: { error: 'Unauthorized' }
 *   500: { error: 'Internal server error', details: '...' }
 */
export async function POST(request: NextRequest) {
    // Validate admin API key
    if (!validateAdminApiKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        // Parse request body
        const body = await request.json();
        const { conferenceId, lunchDate, sendNotifications = true } = body;

        // Validate required fields
        if (!conferenceId || typeof conferenceId !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid conferenceId' },
                { status: 400 }
            );
        }

        if (!lunchDate || typeof lunchDate !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid lunchDate' },
                { status: 400 }
            );
        }

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(lunchDate)) {
            return NextResponse.json(
                { error: 'lunchDate must be in YYYY-MM-DD format' },
                { status: 400 }
            );
        }

        console.log(`[Admin API] Starting Power Lunch matching for ${conferenceId} on ${lunchDate}`);

        // Run the matching orchestration
        const matchingResult = await runPowerLunchMatching(conferenceId, lunchDate);

        if (!matchingResult.success) {
            return NextResponse.json(
                {
                    error: 'Matching failed',
                    details: matchingResult.error
                },
                { status: 500 }
            );
        }

        // Send notifications if requested and groups were created
        let notificationResult = null;
        if (sendNotifications && matchingResult.groups.length > 0) {
            console.log(`[Admin API] Sending notifications for ${matchingResult.groups.length} groups`);
            notificationResult = await notifyPowerLunchMatches(conferenceId, matchingResult.groups);
        }

        // Return success response
        return NextResponse.json({
            success: true,
            conferenceId,
            lunchDate,
            groups: matchingResult.groups.map(g => ({
                id: g.id,
                memberCount: g.memberCount,
                timeSlot: g.timeSlot,
                commonTopics: g.commonTopics,
                matchRationale: g.matchRationale,
            })),
            stats: matchingResult.stats,
            unmatchedRegistrationIds: matchingResult.unmatchedRegistrationIds,
            ...(notificationResult && {
                notifications: {
                    sent: notificationResult.successCount,
                    failed: notificationResult.failureCount,
                    total: notificationResult.totalNotifications,
                },
            }),
        });
    } catch (error) {
        console.error('[Admin API] Unexpected error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/admin/match-lunches
 * Returns API documentation
 */
export async function GET(request: NextRequest) {
    // Validate admin API key even for documentation
    if (!validateAdminApiKey(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    return NextResponse.json({
        endpoint: '/api/admin/match-lunches',
        method: 'POST',
        description: 'Trigger Power Lunch matching for a conference',
        headers: {
            'x-admin-api-key': 'Required. Admin API key for authentication.',
            'Content-Type': 'application/json',
        },
        body: {
            conferenceId: {
                type: 'string',
                required: true,
                description: 'The conference identifier',
            },
            lunchDate: {
                type: 'string',
                required: true,
                format: 'YYYY-MM-DD',
                description: 'The date for Power Lunch matching',
            },
            sendNotifications: {
                type: 'boolean',
                required: false,
                default: true,
                description: 'Whether to send FCM push notifications to matched users',
            },
        },
        responses: {
            200: 'Matching completed successfully',
            400: 'Invalid request body',
            401: 'Unauthorized - invalid or missing API key',
            500: 'Internal server error',
        },
    });
}
