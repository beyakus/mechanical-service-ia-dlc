import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { VALID_TRANSITIONS, isValidTransition } from '../../constants/transitions.js';
import { VisitStatus } from '../../enums/index.js';

const allStatuses = Object.values(VisitStatus);
const statusArb = fc.constantFrom(...allStatuses);

describe('State Machine - Property-Based Tests', () => {
  it('invariant: terminal states have no outgoing transitions (PBT-03)', () => {
    const terminalStates = [
      VisitStatus.CANCELLED,
      VisitStatus.RESCHEDULED,
      VisitStatus.FINALIZED,
    ];

    fc.assert(
      fc.property(fc.constantFrom(...terminalStates), statusArb, (terminal, target) => {
        expect(isValidTransition(terminal, target)).toBe(false);
      }),
      { numRuns: 50 },
    );
  });

  it('invariant: every status has an entry in VALID_TRANSITIONS (PBT-03)', () => {
    fc.assert(
      fc.property(statusArb, (status) => {
        expect(VALID_TRANSITIONS[status]).toBeDefined();
        expect(Array.isArray(VALID_TRANSITIONS[status])).toBe(true);
      }),
      { numRuns: 20 },
    );
  });

  it('invariant: no self-transitions allowed (PBT-03)', () => {
    fc.assert(
      fc.property(statusArb, (status) => {
        expect(isValidTransition(status, status)).toBe(false);
      }),
      { numRuns: 20 },
    );
  });

  it('invariant: valid transitions only target known statuses (PBT-03)', () => {
    fc.assert(
      fc.property(statusArb, (status) => {
        const targets = VALID_TRANSITIONS[status];
        for (const target of targets) {
          expect(allStatuses).toContain(target);
        }
      }),
      { numRuns: 20 },
    );
  });
});
