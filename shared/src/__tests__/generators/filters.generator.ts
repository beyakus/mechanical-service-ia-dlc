import fc from 'fast-check';
import { VisitStatus } from '../../enums/index.js';

const uuidArb = fc.uuid().filter((u) => u.length > 0);

/** Generates an ordered date pair (startDate <= endDate). */
export const orderedDatePairArb = fc
  .tuple(
    fc.date({ min: new Date('2025-01-01'), max: new Date('2029-12-31') }),
    fc.date({ min: new Date('2025-01-01'), max: new Date('2030-12-31') }),
  )
  .map(([a, b]) => {
    const sorted = a <= b ? [a, b] : [b, a];
    return {
      startDate: sorted[0].toISOString().slice(0, 10),
      endDate: sorted[1].toISOString().slice(0, 10),
    };
  });

const visitStatusArb = fc.constantFrom(
  VisitStatus.SCHEDULED,
  VisitStatus.COMPLETED,
  VisitStatus.CANCELLED,
  VisitStatus.RESCHEDULED,
  VisitStatus.FINALIZED,
);

export const visitFiltersArb = fc.record({
  status: fc.option(visitStatusArb, { nil: undefined }),
  technicianId: fc.option(uuidArb, { nil: undefined }),
  zoneId: fc.option(uuidArb, { nil: undefined }),
  serviceTypeId: fc.option(uuidArb, { nil: undefined }),
  page: fc.integer({ min: 1, max: 100 }),
  pageSize: fc.integer({ min: 1, max: 100 }),
});

export const analyticsFiltersArb = orderedDatePairArb.chain((dates) =>
  fc.record({
    startDate: fc.constant(dates.startDate),
    endDate: fc.constant(dates.endDate),
    technicianId: fc.option(uuidArb, { nil: undefined }),
    zoneId: fc.option(uuidArb, { nil: undefined }),
  }),
);

export const calendarFiltersArb = orderedDatePairArb.chain((dates) =>
  fc.record({
    startDate: fc.constant(dates.startDate),
    endDate: fc.constant(dates.endDate),
    technicianId: fc.option(uuidArb, { nil: undefined }),
    teamId: fc.option(uuidArb, { nil: undefined }),
    status: fc.option(visitStatusArb, { nil: undefined }),
  }),
);
