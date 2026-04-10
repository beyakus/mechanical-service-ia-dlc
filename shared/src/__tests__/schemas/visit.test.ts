import { describe, it, expect } from 'vitest';
import {
  VisitSchema,
  CreateVisitInputSchema,
  RescheduleInputSchema,
  CancelInputSchema,
} from '../../schemas/visit.js';

describe('VisitSchema', () => {
  const validVisit = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    date: '2026-05-15',
    time: '09:30',
    clientName: 'Acme Corp',
    location: 'Av. Principal 123',
    status: 'scheduled',
    technicianId: '550e8400-e29b-41d4-a716-446655440001',
    technicianName: 'Carlos',
    teamId: null,
    teamName: null,
    serviceTypeId: '550e8400-e29b-41d4-a716-446655440002',
    serviceTypeName: 'Mantenimiento preventivo',
    description: 'Revisión general',
    notes: null,
    reasonId: null,
    reasonText: null,
    zoneId: '550e8400-e29b-41d4-a716-446655440003',
    zoneName: 'Zona Norte',
    history: [],
    createdAt: '2026-04-09T10:00:00.000Z',
    updatedAt: '2026-04-09T10:00:00.000Z',
    createdBy: '550e8400-e29b-41d4-a716-446655440004',
  };

  it('should accept a valid visit', () => {
    expect(VisitSchema.parse(validVisit)).toEqual(validVisit);
  });

  it('should reject invalid date format', () => {
    expect(() =>
      VisitSchema.parse({ ...validVisit, date: '15-05-2026' }),
    ).toThrow();
  });

  it('should reject clientName exceeding max length', () => {
    expect(() =>
      VisitSchema.parse({ ...validVisit, clientName: 'x'.repeat(201) }),
    ).toThrow();
  });

  it('should reject invalid UUID', () => {
    expect(() =>
      VisitSchema.parse({ ...validVisit, id: 'not-a-uuid' }),
    ).toThrow();
  });
});

describe('CreateVisitInputSchema', () => {
  const validInput = {
    date: '2026-06-01',
    time: '10:00',
    clientName: 'Test Client',
    location: 'Test Location',
    technicianId: '550e8400-e29b-41d4-a716-446655440001',
    serviceTypeId: '550e8400-e29b-41d4-a716-446655440002',
    zoneId: '550e8400-e29b-41d4-a716-446655440003',
  };

  it('should accept valid input with technicianId', () => {
    expect(() => CreateVisitInputSchema.parse(validInput)).not.toThrow();
  });

  it('should accept valid input with teamId instead', () => {
    const { technicianId: _, ...rest } = validInput;
    expect(() =>
      CreateVisitInputSchema.parse({
        ...rest,
        teamId: '550e8400-e29b-41d4-a716-446655440005',
      }),
    ).not.toThrow();
  });

  it('should reject when neither technicianId nor teamId provided', () => {
    const { technicianId: _, ...rest } = validInput;
    expect(() => CreateVisitInputSchema.parse(rest)).toThrow();
  });
});

describe('RescheduleInputSchema', () => {
  it('should accept valid reschedule input', () => {
    expect(() =>
      RescheduleInputSchema.parse({
        newDate: '2026-06-15',
        newTime: '14:00',
        reasonId: '550e8400-e29b-41d4-a716-446655440006',
      }),
    ).not.toThrow();
  });
});

describe('CancelInputSchema', () => {
  it('should accept valid cancel input', () => {
    expect(() =>
      CancelInputSchema.parse({
        reasonId: '550e8400-e29b-41d4-a716-446655440006',
      }),
    ).not.toThrow();
  });

  it('should reject missing reasonId', () => {
    expect(() => CancelInputSchema.parse({})).toThrow();
  });
});
