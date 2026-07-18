// Leitner-style ladder: index = srsLevel, value = days until next review.
// Level 0 is "just saved / just missed" — due again immediately.
export const SRS_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];
export const SRS_MAX_LEVEL = SRS_INTERVAL_DAYS.length - 1;
