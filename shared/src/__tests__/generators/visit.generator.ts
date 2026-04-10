import fc from 'fast-check';
import { VisitStatus, HistoryChangeType } from '../../enums/index.js';

const uuidArb = fc.uuid().filter((u) => u.length > 0);

const futureDateArb = fc
  .date({ min: new Date('2026-01-01'), max: new Date('2030-12-31') })
  .map((d) => d.toISOString().slice(0, 10));

const timeArb = fc
  .tuple(fc.integer({ min: 0, max: 23 }), fc.integer({ min: 0, max: 59 }))
  .map(([h, m]) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);

const nameArb = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0);
const locationArb = fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0);
const descriptionArb = fc.string({ maxLength: 500 });
const datetimeArb = fc
  .date({ min: new Date('2025-01-01'), max: new Date('2030-12-31') })
  .map((d) => d.toISOString());

const visitStatusArb = fc.constantFrom(
  VisitStatus.SCHEDULED,
  VisitStatus.COMPLETED,
  VisitStatus.CANCELLED,
  VisitStatus.RESCHEDULED,
  VisitStatus.FINALIZED,
);

const historyChangeTypeArb = fc.constantFrom(
  HistoryChangeType.CREATED,
  HistoryChangeType.RESCHEDULED,
  HistoryChangeType.CANCELLED,
  HistoryChangeType.COMPLETED,
  HistoryChangeType.FINALIZED,
  HistoryChangeType.REASSIGNED,
);

export const historyEntryArb = fc.record({
  id: uuidArb,
  changeType: historyChangeTypeArb,
  changedAt: datetimeArb,
  changedBy: uuidArb,
  changedByName: nameArb,
});

export const visitArb = fc.record({
  id: uuidArb,
  date: futureDateArb,
  time: timeArb,
  clientName: nameArb,
  location: locationArb,
  status: visitStatusArb,
  technicianId: fc.option(uuidArb, { nil: null }),
  technicianName: fc.option(nameArb, { nil: null }),
  teamId: fc.option(uuidArb, { nil: null }),
  teamName: fc.option(nameArb, { nil: null }),
  serviceTypeId: uuidArb,
  serviceTypeName: nameArb,
  description: fc.option(descriptionArb, { nil: null }),
  notes: fc.option(descriptionArb, { nil: null }),
  reasonId: fc.option(uuidArb, { nil: null }),
  reasonText: fc.option(nameArb, { nil: null }),
  zoneId: uuidArb,
  zoneName: nameArb,
  history: fc.array(historyEntryArb, { maxLength: 10 }),
  createdAt: datetimeArb,
  updatedAt: datetimeArb,
  createdBy: uuidArb,
});

export const createVisitInputArb = fc
  .record({
    date: futureDateArb,
    time: timeArb,
    clientName: nameArb,
    location: locationArb,
    technicianId: fc.option(uuidArb, { nil: undefined }),
    teamId: fc.option(uuidArb, { nil: undefined }),
    serviceTypeId: uuidArb,
    zoneId: uuidArb,
    description: fc.option(descriptionArb, { nil: undefined }),
  })
  .filter((d) => d.technicianId !== undefined || d.teamId !== undefined);

export const rescheduleInputArb = fc.record({
  newDate: futureDateArb,
  newTime: timeArb,
  reasonId: uuidArb,
});

export const cancelInputArb = fc.record({
  reasonId: uuidArb,
});

export { uuidArb, futureDateArb, timeArb, nameArb, visitStatusArb };
