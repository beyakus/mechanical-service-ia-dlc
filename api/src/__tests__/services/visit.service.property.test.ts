import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import * as visitService from '../../services/visit.service.js';
import type { UserContext } from '@visits/shared';

const adminUser: UserContext = {
  userId: 'd0000000-0000-4000-8000-000000000005',
  role: 'admin',
  zoneId: null,
  teamId: null,
  name: 'Miguel Ramírez',
};

describe('VisitService - Property-Based Tests', () => {
  it('invariant: pagination data.length <= pageSize (PBT-03)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 1, max: 100 }),
        (page, pageSize) => {
          const result = visitService.list({ page, pageSize }, adminUser);
          expect(result.data.length).toBeLessThanOrEqual(pageSize);
        },
      ),
      { numRuns: 50 },
    );
  });

  it('invariant: totalPages === ceil(total / pageSize) (PBT-03)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 1, max: 50 }),
        (page, pageSize) => {
          const result = visitService.list({ page, pageSize }, adminUser);
          expect(result.totalPages).toBe(Math.ceil(result.total / result.pageSize));
        },
      ),
      { numRuns: 50 },
    );
  });

  it('invariant: technician only sees own visits (PBT-03)', () => {
    const techUser: UserContext = {
      userId: 'd0000000-0000-4000-8000-000000000001',
      role: 'technician',
      zoneId: 'a0000000-0000-4000-8000-000000000001',
      teamId: 'e0000000-0000-4000-8000-000000000001',
      name: 'Carlos Méndez',
    };

    fc.assert(
      fc.property(fc.integer({ min: 1, max: 5 }), (page) => {
        const result = visitService.list({ page, pageSize: 100 }, techUser);
        for (const visit of result.data) {
          expect(
            visit.technicianId === techUser.userId || visit.teamId === techUser.teamId,
          ).toBe(true);
        }
      }),
      { numRuns: 20 },
    );
  });
});
