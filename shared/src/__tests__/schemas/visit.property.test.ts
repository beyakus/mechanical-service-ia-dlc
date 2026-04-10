import { describe, it } from 'vitest';
import fc from 'fast-check';
import { VisitSchema, CreateVisitInputSchema } from '../../schemas/visit.js';
import { visitArb, createVisitInputArb } from '../generators/visit.generator.js';

describe('VisitSchema - Property-Based Tests', () => {
  it('round-trip: parse → JSON → parse yields identical result (PBT-02)', () => {
    fc.assert(
      fc.property(visitArb, (visit) => {
        const parsed = VisitSchema.parse(visit);
        const serialized = JSON.stringify(parsed);
        const reparsed = VisitSchema.parse(JSON.parse(serialized));
        expect(reparsed).toEqual(parsed);
      }),
      { numRuns: 100 },
    );
  });

  it('idempotency: parse(parse(x)) === parse(x) (PBT-04)', () => {
    fc.assert(
      fc.property(visitArb, (visit) => {
        const first = VisitSchema.parse(visit);
        const second = VisitSchema.parse(first);
        expect(second).toEqual(first);
      }),
      { numRuns: 100 },
    );
  });

  it('invariant: parsed visit always has non-empty id (PBT-03)', () => {
    fc.assert(
      fc.property(visitArb, (visit) => {
        const parsed = VisitSchema.parse(visit);
        expect(parsed.id).toBeTruthy();
        expect(parsed.id.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it('invariant: history array length is preserved after parse (PBT-03)', () => {
    fc.assert(
      fc.property(visitArb, (visit) => {
        const parsed = VisitSchema.parse(visit);
        expect(parsed.history.length).toBe(visit.history.length);
      }),
      { numRuns: 100 },
    );
  });
});

describe('CreateVisitInputSchema - Property-Based Tests', () => {
  it('round-trip: parse → JSON → parse yields identical result (PBT-02)', () => {
    fc.assert(
      fc.property(createVisitInputArb, (input) => {
        const parsed = CreateVisitInputSchema.parse(input);
        const serialized = JSON.stringify(parsed);
        const reparsed = CreateVisitInputSchema.parse(JSON.parse(serialized));
        expect(reparsed).toEqual(parsed);
      }),
      { numRuns: 100 },
    );
  });

  it('invariant: at least one of technicianId or teamId is present (PBT-03)', () => {
    fc.assert(
      fc.property(createVisitInputArb, (input) => {
        const parsed = CreateVisitInputSchema.parse(input);
        expect(
          parsed.technicianId !== undefined || parsed.teamId !== undefined,
        ).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
