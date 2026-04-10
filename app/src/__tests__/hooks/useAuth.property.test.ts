import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { Role, ROLE_PERMISSIONS, hasPermission, VALID_TRANSITIONS, VisitStatus } from '@visits/shared';

const roleArb = fc.constantFrom(Role.TECHNICIAN, Role.SUPERVISOR, Role.ADMIN);
const statusArb = fc.constantFrom(
  VisitStatus.SCHEDULED, VisitStatus.COMPLETED, VisitStatus.CANCELLED,
  VisitStatus.RESCHEDULED, VisitStatus.FINALIZED,
);

describe('Role Permissions - Property-Based Tests', () => {
  it('invariant: admin has all permissions that supervisor has (PBT-03)', () => {
    fc.assert(
      fc.property(roleArb, (role) => {
        if (role === 'admin') {
          const supervisorPerms = ROLE_PERMISSIONS['supervisor'];
          for (const perm of supervisorPerms) {
            expect(hasPermission('admin', perm)).toBe(true);
          }
        }
      }),
      { numRuns: 10 },
    );
  });

  it('invariant: every role has at least view_own_visits (PBT-03)', () => {
    fc.assert(
      fc.property(roleArb, (role) => {
        expect(hasPermission(role, 'view_own_visits')).toBe(true);
      }),
      { numRuns: 10 },
    );
  });

  it('invariant: manage_catalogs is admin-only (PBT-03)', () => {
    fc.assert(
      fc.property(roleArb, (role) => {
        if (role !== 'admin') {
          expect(hasPermission(role, 'manage_catalogs')).toBe(false);
        }
      }),
      { numRuns: 10 },
    );
  });
});

describe('Status-Action Mapping - Property-Based Tests', () => {
  it('invariant: terminal states have no valid transitions (PBT-03)', () => {
    const terminalStates = [VisitStatus.CANCELLED, VisitStatus.RESCHEDULED, VisitStatus.FINALIZED];
    fc.assert(
      fc.property(fc.constantFrom(...terminalStates), statusArb, (from, to) => {
        expect(VALID_TRANSITIONS[from].includes(to)).toBe(false);
      }),
      { numRuns: 30 },
    );
  });
});
