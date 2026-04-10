import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { VisitFiltersSchema, CalendarFiltersSchema } from '../../schemas/api.js';
import {
  visitFiltersArb,
  calendarFiltersArb,
} from '../generators/filters.generator.js';

describe('VisitFiltersSchema - Property-Based Tests', () => {
  it('invariant: page defaults to 1 when not provided (PBT-03)', () => {
    fc.assert(
      fc.property(
        fc.record({
          status: fc.option(fc.constantFrom('scheduled', 'completed', 'cancelled'), { nil: undefined }),
        }),
        (partial) => {
          const parsed = VisitFiltersSchema.parse(partial);
          expect(parsed.page).toBe(1);
          expect(parsed.pageSize).toBe(20);
        },
      ),
      { numRuns: 50 },
    );
  });

  it('invariant: pageSize is always between 1 and 100 (PBT-03)', () => {
    fc.assert(
      fc.property(visitFiltersArb, (filters) => {
        const parsed = VisitFiltersSchema.parse(filters);
        expect(parsed.pageSize).toBeGreaterThanOrEqual(1);
        expect(parsed.pageSize).toBeLessThanOrEqual(100);
      }),
      { numRuns: 100 },
    );
  });

  it('round-trip: parse → JSON → parse yields identical result (PBT-02)', () => {
    fc.assert(
      fc.property(visitFiltersArb, (filters) => {
        const parsed = VisitFiltersSchema.parse(filters);
        const serialized = JSON.stringify(parsed);
        const reparsed = VisitFiltersSchema.parse(JSON.parse(serialized));
        expect(reparsed).toEqual(parsed);
      }),
      { numRuns: 100 },
    );
  });
});

describe('CalendarFiltersSchema - Property-Based Tests', () => {
  it('invariant: startDate <= endDate always holds (PBT-03)', () => {
    fc.assert(
      fc.property(calendarFiltersArb, (filters) => {
        const parsed = CalendarFiltersSchema.parse(filters);
        expect(parsed.startDate <= parsed.endDate).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('round-trip: parse → JSON → parse yields identical result (PBT-02)', () => {
    fc.assert(
      fc.property(calendarFiltersArb, (filters) => {
        const parsed = CalendarFiltersSchema.parse(filters);
        const serialized = JSON.stringify(parsed);
        const reparsed = CalendarFiltersSchema.parse(JSON.parse(serialized));
        expect(reparsed).toEqual(parsed);
      }),
      { numRuns: 100 },
    );
  });
});
