import { z } from 'zod';
import { VisitStatus, Role } from '../enums/index.js';

const uuidSchema = z.string().uuid();
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');

export const VisitFiltersSchema = z
  .object({
    status: z.nativeEnum(VisitStatus).optional(),
    technicianId: uuidSchema.optional(),
    zoneId: uuidSchema.optional(),
    serviceTypeId: uuidSchema.optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: 'startDate must be <= endDate' },
  );

export const CalendarFiltersSchema = z
  .object({
    startDate: dateSchema,
    endDate: dateSchema,
    technicianId: uuidSchema.optional(),
    teamId: uuidSchema.optional(),
    status: z.nativeEnum(VisitStatus).optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'startDate must be <= endDate',
  });

export const PaginatedResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(100),
    totalPages: z.number().int().min(0),
  });

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number().int(),
  details: z.record(z.array(z.string())).optional(),
});

export const UserContextSchema = z.object({
  userId: uuidSchema,
  role: z.nativeEnum(Role),
  zoneId: uuidSchema.nullable(),
  teamId: uuidSchema.nullable(),
  name: z.string().min(1).max(200),
});
