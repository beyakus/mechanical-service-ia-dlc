import { describe, it, expect } from 'vitest';
import {
  ServiceTypeSchema,
  CreateServiceTypeInputSchema,
  ReasonSchema,
  CreateReasonInputSchema,
  ZoneSchema,
} from '../../schemas/catalog.js';

describe('ServiceTypeSchema', () => {
  const valid = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Mantenimiento preventivo',
    description: 'Revisión periódica',
    isActive: true,
    createdAt: '2026-04-09T10:00:00.000Z',
    updatedAt: '2026-04-09T10:00:00.000Z',
  };

  it('should accept valid service type', () => {
    expect(ServiceTypeSchema.parse(valid)).toEqual(valid);
  });

  it('should reject empty name', () => {
    expect(() => ServiceTypeSchema.parse({ ...valid, name: '' })).toThrow();
  });

  it('should reject name exceeding 100 chars', () => {
    expect(() =>
      ServiceTypeSchema.parse({ ...valid, name: 'x'.repeat(101) }),
    ).toThrow();
  });
});

describe('CreateServiceTypeInputSchema', () => {
  it('should accept valid input', () => {
    expect(() =>
      CreateServiceTypeInputSchema.parse({ name: 'Reparación' }),
    ).not.toThrow();
  });

  it('should accept input with description', () => {
    expect(() =>
      CreateServiceTypeInputSchema.parse({
        name: 'Reparación',
        description: 'Reparación de equipos',
      }),
    ).not.toThrow();
  });
});

describe('ReasonSchema', () => {
  it('should accept valid cancellation reason', () => {
    expect(() =>
      ReasonSchema.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Cliente no disponible',
        type: 'cancellation',
        isActive: true,
        createdAt: '2026-04-09T10:00:00.000Z',
        updatedAt: '2026-04-09T10:00:00.000Z',
      }),
    ).not.toThrow();
  });

  it('should reject invalid reason type', () => {
    expect(() =>
      ReasonSchema.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test',
        type: 'invalid',
        isActive: true,
        createdAt: '2026-04-09T10:00:00.000Z',
        updatedAt: '2026-04-09T10:00:00.000Z',
      }),
    ).toThrow();
  });
});

describe('CreateReasonInputSchema', () => {
  it('should accept valid input', () => {
    expect(() =>
      CreateReasonInputSchema.parse({
        name: 'Equipo no disponible',
        type: 'reschedule',
      }),
    ).not.toThrow();
  });
});

describe('ZoneSchema', () => {
  it('should accept valid zone', () => {
    expect(() =>
      ZoneSchema.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Zona Norte',
        description: 'Zona norte de la ciudad',
        isActive: true,
        createdAt: '2026-04-09T10:00:00.000Z',
        updatedAt: '2026-04-09T10:00:00.000Z',
      }),
    ).not.toThrow();
  });
});
