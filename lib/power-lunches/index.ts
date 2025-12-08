// lib/power-lunches/index.ts
// Power Lunches Module - Public API Exports

// Types
export type {
    PowerLunchRegistration,
    PowerLunchGroup,
    ClaudeMatchingInput,
    ClaudeMatchingOutput,
    MatchingResult,
    PowerLunchNotification,
} from './types';

// Matching
export {
    runPowerLunchMatching,
    getGroupWithMembers,
} from './matcher';

// Notifications
export {
    notifyPowerLunchMatches,
    sendPowerLunchReminder,
} from './notifications';
