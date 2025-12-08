// lib/power-lunches/notifications.ts
// FCM Push Notifications for Power Lunch Matches

import { sendMulticastNotification, getAdminConferenceCollection } from '../firebase-admin';
import { PowerLunchGroup, PowerLunchRegistration, PowerLunchNotification } from './types';

/**
 * Send push notifications to all members of matched Power Lunch groups
 */
export async function notifyPowerLunchMatches(
    conferenceId: string,
    groups: PowerLunchGroup[]
): Promise<{
    totalNotifications: number;
    successCount: number;
    failureCount: number;
    groupResults: {
        groupId: string;
        memberCount: number;
        notificationsSent: number;
        failedTokens: string[];
    }[];
}> {
    const groupResults: {
        groupId: string;
        memberCount: number;
        notificationsSent: number;
        failedTokens: string[];
    }[] = [];

    let totalSuccess = 0;
    let totalFailure = 0;

    for (const group of groups) {
        try {
            // Fetch member details for this group
            const members = await fetchGroupMembers(conferenceId, group.memberIds);

            // Get FCM tokens for members
            const tokensWithNames = members
                .filter(m => m.fcmToken)
                .map(m => ({ token: m.fcmToken!, name: m.userName }));

            if (tokensWithNames.length === 0) {
                console.log(`[PowerLunch] No FCM tokens for group ${group.id}`);
                groupResults.push({
                    groupId: group.id,
                    memberCount: group.memberCount,
                    notificationsSent: 0,
                    failedTokens: [],
                });
                continue;
            }

            // Build notification payload
            const notification = buildNotificationPayload(group, members);

            // Send multicast notification
            const result = await sendMulticastNotification(
                tokensWithNames.map(t => t.token),
                {
                    title: '🍽️ Power Lunch Match!',
                    body: `You've been matched with ${group.memberCount - 1} other attendees for ${group.lunchDate}. Tap to see your group!`,
                },
                {
                    type: 'power_lunch_match',
                    groupId: group.id,
                    conferenceId: conferenceId,
                    lunchDate: group.lunchDate,
                    timeSlot: group.timeSlot,
                    notificationData: JSON.stringify(notification),
                }
            );

            totalSuccess += result.successCount;
            totalFailure += result.failureCount;

            groupResults.push({
                groupId: group.id,
                memberCount: group.memberCount,
                notificationsSent: result.successCount,
                failedTokens: result.failedTokens,
            });

            console.log(`[PowerLunch] Notifications sent for group ${group.id}: ${result.successCount} success, ${result.failureCount} failed`);
        } catch (error) {
            console.error(`[PowerLunch] Failed to notify group ${group.id}:`, error);
            groupResults.push({
                groupId: group.id,
                memberCount: group.memberCount,
                notificationsSent: 0,
                failedTokens: [],
            });
        }
    }

    return {
        totalNotifications: totalSuccess + totalFailure,
        successCount: totalSuccess,
        failureCount: totalFailure,
        groupResults,
    };
}

/**
 * Fetch member registrations for a group
 */
async function fetchGroupMembers(
    conferenceId: string,
    memberIds: string[]
): Promise<PowerLunchRegistration[]> {
    const registrationsRef = getAdminConferenceCollection(conferenceId, 'power-lunch-registrations');

    const memberDocs = await Promise.all(
        memberIds.map(id => registrationsRef.doc(id).get())
    );

    return memberDocs
        .filter(doc => doc.exists)
        .map(doc => ({ id: doc.id, ...doc.data() } as PowerLunchRegistration));
}

/**
 * Build notification payload with group details
 */
function buildNotificationPayload(
    group: PowerLunchGroup,
    members: PowerLunchRegistration[]
): PowerLunchNotification {
    return {
        groupId: group.id,
        lunchDate: group.lunchDate,
        timeSlot: group.timeSlot,
        venue: group.venue,
        memberNames: members.map(m => m.userName),
        commonTopics: group.commonTopics,
        suggestedIcebreakers: group.suggestedIcebreakers,
    };
}

/**
 * Send a reminder notification for an upcoming Power Lunch
 */
export async function sendPowerLunchReminder(
    conferenceId: string,
    groupId: string,
    minutesBefore: number = 30
): Promise<{
    success: boolean;
    notificationsSent: number;
    error?: string;
}> {
    try {
        // Fetch the group
        const groupRef = getAdminConferenceCollection(conferenceId, 'power-lunch-groups').doc(groupId);
        const groupDoc = await groupRef.get();

        if (!groupDoc.exists) {
            return { success: false, notificationsSent: 0, error: 'Group not found' };
        }

        const group = { id: groupDoc.id, ...groupDoc.data() } as PowerLunchGroup;

        // Fetch members
        const members = await fetchGroupMembers(conferenceId, group.memberIds);
        const tokens = members.filter(m => m.fcmToken).map(m => m.fcmToken!);

        if (tokens.length === 0) {
            return { success: true, notificationsSent: 0 };
        }

        // Send reminder
        const result = await sendMulticastNotification(
            tokens,
            {
                title: '⏰ Power Lunch Starting Soon!',
                body: `Your Power Lunch at ${group.venue || 'the designated venue'} starts in ${minutesBefore} minutes. Time slot: ${group.timeSlot}`,
            },
            {
                type: 'power_lunch_reminder',
                groupId: group.id,
                conferenceId: conferenceId,
                timeSlot: group.timeSlot,
            }
        );

        return {
            success: true,
            notificationsSent: result.successCount,
        };
    } catch (error) {
        console.error('[PowerLunch] Failed to send reminder:', error);
        return {
            success: false,
            notificationsSent: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
