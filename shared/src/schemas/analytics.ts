import { z } from 'zod';
import { VisitStatus } from '../enums/index.js';

const uuidSchema = z.string().uuid();
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');

export const AnalyticsFiltersSchema = z
  .object({
    startDate: dateSchema,
    endDate: dateSchema,
    technicianId: uuidSchema.optional(),
    zoneId: uuidSchema.optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'startDate must be <= endDate',
  });

export const VisitSummarySchema = z.object({
  scheduled: z.number().int().min(0),
  completed: z.number().int().min(0),
  cancelled: z.number().int().min(0),
  rescheduled: z.number().int().min(0),
  finalized: z.number().int().min(0),
  total: z.number().int().min(0),
});

export const ReasonCountSchema = z.object({
  reasonId: uuidSchema,
  reasonName: z.string().min(1).max(100),
  count: z.number().int().min(0),
  percentage: z.number().min(0).max(100),
});

export const TrendDataSchema = z.object({
  period: dateSchema,
  scheduled: z.number().int().min(0),
  completed: z.number().int().min(0),
  cancelled: z.number().int().min(0),
  rescheduled: z.number().int().min(0),
  finalized: z.number().int().min(0),
});
