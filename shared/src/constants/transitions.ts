import { VisitStatus } from '../enums/index.js';

/**
 * Map of valid state transitions for visits.
 * Key: current status, Value: array of valid target statuses.
 */
export const VALID_TRANSITIONS: Record<VisitStatus, readonly VisitStatus[]> = {
  [VisitStatus.SCHEDULED]: [
    VisitStatus.RESCHEDULED,
    VisitStatus.CANCELLED,
    VisitStatus.COMPLETED,
  ],
  [VisitStatus.COMPLETED]: [VisitStatus.FINALIZED],
  [VisitStatus.CANCELLED]: [],
  [VisitStatus.RESCHEDULED]: [],
  [VisitStatus.FINALIZED]: [],
} as const;

/**
 * Check if a state transition is valid.
 */
export function isValidTransition(
  from: VisitStatus,
  to: VisitStatus,
): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}
