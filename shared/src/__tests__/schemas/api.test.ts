import { describe, it, expect } from 'vitest';
import {
  VisitFiltersSchema,
  CalendarFiltersSchema,
  ApiErrorSchema,
  UserContextSchema,
} from '../../schemas/api.js';

describe('VisitFiltersSchema', () => {
  it('should accept empty filters with defaults', () => {
    const result = VisitFiltersSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it('should accept valid filters', () => {
    expect(() =>
      VisitFiltersSchema.parse({
        status: 'scheduled',
        page: 2,
        pageSize: 50,
      }),
    ).not.toThrow();
  });

  it('should reject startDate > endDate', () => {
    expect(() =>
      VisitFiltersSchema.parse({
        startDate: '2026-06-15',
        endDate: '2026-06-01',
      }),
    ).toThrow();
  });

  it('should reject pageSize > 100', () => {
    expect(() =>
      VisitFiltersSchema.parse({ pageSize: 101 }),
    ).toThrow();
  });

  it('should reject page < 1', () => {
    expect(() =>
      VisitFiltersSchema.parse({ page: 0 }),
    ).toThrow();
  });
});

describe('CalendarFiltersSchema', () => {
  it('should accept valid calendar filters', () => {
    expect(() =>
      CalendarFiltersSchema.parse({
        startDate: '2026-06-01',
        endDate: '2026-06-07',
      }),
    ).not.toThrow();
  });

  it('should reject startDate > endDate', () => {
    expect(() =>
      CalendarFiltersSchema.parse({
        startDate: '2026-06-07',
        endDate: '2026-06-01',
      }),
    ).toThrow();
  });
});

describe('ApiErrorSchema', () => {
  it('should accept valid error', () => {
    expect(() =>
      ApiErrorSchema.parse({
        error: 'NOT_FOUND',
        message: 'Visit not found',
        statusCode: 404,
      }),
    ).not.toThrow();
  });

  it('should accept error with details', () => {
    expect(() =>
      ApiErrorSchema.parse({
        error: 'VALIDATION_ERROR',
        message: 'Invalid input',
        statusCode: 400,
        details: { date: ['Must be YYYY-MM-DD'] },
      }),
    ).not.toThrow();
  });
});

describe('UserContextSchema', () => {
  it('should accept valid user context', () => {
    expect(() =>
      UserContextSchema.parse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        role: 'technician',
        zoneId: '550e8400-e29b-41d4-a716-446655440001',
        teamId: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Carlos',
      }),
    ).not.toThrow();
  });
});
