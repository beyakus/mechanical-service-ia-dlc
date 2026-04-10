import { describe, it, expect } from 'vitest';
import { VALID_TRANSITIONS, isValidTransition } from '../../constants/transitions.js';
import { VisitStatus } from '../../enums/index.js';

describe('VALID_TRANSITIONS', () => {
  it('should allow SCHEDULED → RESCHEDULED', () => {
    expect(isValidTransition(VisitStatus.SCHEDULED, VisitStatus.RESCHEDULED)).toBe(true);
  });

  it('should allow SCHEDULED → CANCELLED', () => {
    expect(isValidTransition(VisitStatus.SCHEDULED, VisitStatus.CANCELLED)).toBe(true);
  });

  it('should allow SCHEDULED → COMPLETED', () => {
    expect(isValidTransition(VisitStatus.SCHEDULED, VisitStatus.COMPLETED)).toBe(true);
  });

  it('should allow COMPLETED → FINALIZED', () => {
    expect(isValidTransition(VisitStatus.COMPLETED, VisitStatus.FINALIZED)).toBe(true);
  });

  it('should NOT allow CANCELLED → any', () => {
    expect(VALID_TRANSITIONS[VisitStatus.CANCELLED]).toHaveLength(0);
  });

  it('should NOT allow FINALIZED → any', () => {
    expect(VALID_TRANSITIONS[VisitStatus.FINALIZED]).toHaveLength(0);
  });

  it('should NOT allow RESCHEDULED → any', () => {
    expect(VALID_TRANSITIONS[VisitStatus.RESCHEDULED]).toHaveLength(0);
  });

  it('should NOT allow SCHEDULED → FINALIZED directly', () => {
    expect(isValidTransition(VisitStatus.SCHEDULED, VisitStatus.FINALIZED)).toBe(false);
  });

  it('should NOT allow COMPLETED → CANCELLED', () => {
    expect(isValidTransition(VisitStatus.COMPLETED, VisitStatus.CANCELLED)).toBe(false);
  });

  it('should cover all VisitStatus values as keys', () => {
    const allStatuses = Object.values(VisitStatus);
    const transitionKeys = Object.keys(VALID_TRANSITIONS);
    expect(transitionKeys).toHaveLength(allStatuses.length);
  });
});
