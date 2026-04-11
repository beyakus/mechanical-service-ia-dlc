import fc from 'fast-check';
import { ReasonType } from '../../enums/index.js';

const uuidArb = fc.uuid().filter((u) => u.length > 0);
const nameArb = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0);
const descriptionArb = fc.string({ maxLength: 500 });
const datetimeArb = fc
  .date({ min: new Date('2025-01-01'), max: new Date('2030-12-31') })
  .map((d) => d.toISOString());

const reasonTypeArb = fc.constantFrom(ReasonType.CANCELLATION, ReasonType.RESCHEDULE);

export const serviceTypeArb = fc.record({
  id: uuidArb,
  name: nameArb,
  description: fc.option(descriptionArb, { nil: null }),
  isActive: fc.boolean(),
  createdAt: datetimeArb,
  updatedAt: datetimeArb,
});

export const createServiceTypeInputArb = fc.record({
  name: nameArb,
  description: fc.option(descriptionArb, { nil: undefined }),
});

export const reasonArb = fc.record({
  id: uuidArb,
  name: nameArb,
  type: reasonTypeArb,
  isActive: fc.boolean(),
  createdAt: datetimeArb,
  updatedAt: datetimeArb,
});

export const createReasonInputArb = fc.record({
  name: nameArb,
  type: reasonTypeArb,
});

export const zoneArb = fc.record({
  id: uuidArb,
  name: nameArb,
  description: fc.option(descriptionArb, { nil: null }),
  isActive: fc.boolean(),
  createdAt: datetimeArb,
  updatedAt: datetimeArb,
});

export const createZoneInputArb = fc.record({
  name: nameArb,
  description: fc.option(descriptionArb, { nil: undefined }),
});

export { reasonTypeArb };
