import { z } from 'zod';
import { VisitStatus, HistoryChangeType } from '../enums/index.js';

const uuidSchema = z.string().uuid();
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:mm');

export const HistoryEntrySchema = z.object({
  id: uuidSchema,
  changeType: z.nativeEnum(HistoryChangeType),
  changedAt: z.string().datetime(),
  changedBy: uuidSchema,
  changedByName: z.string().min(1).max(200),
});

export const VisitSchema = z.object({
  id: uuidSchema,
  date: dateSchema,
  time: timeSchema,
  clientName: z.string().min(1).max(200),
  location: z.string().min(1).max(500),
  status: z.nativeEnum(VisitStatus),
  technicianId: uuidSchema.nullable(),
  technicianName: z.string().max(200).nullable(),
  teamId: uuidSchema.nullable(),
  teamName: z.string().max(200).nullable(),
  serviceTypeId: uuidSchema,
  serviceTypeName: z.string().min(1).max(100),
  description: z.string().max(2000).nullable(),
  notes: z.string().max(2000).nullable(),
  reasonId: uuidSchema.nullable(),
  reasonText: z.string().max(100).nullable(),
  zoneId: uuidSchema,
  zoneName: z.string().min(1).max(100),
  history: z.array(HistoryEntrySchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: uuidSchema,
});

export const CreateVisitInputSchema = z
  .object({
    date: dateSchema,
    time: timeSchema,
    clientName: z.string().min(1).max(200),
    location: z.string().min(1).max(500),
    technicianId: uuidSchema.optional(),
    teamId: uuidSchema.optional(),
    serviceTypeId: uuidSchema,
    zoneId: uuidSchema,
    description: z.string().max(2000).optional(),
  })
  .refine((data) => data.technicianId || data.teamId, {
    message: 'Either technicianId or teamId must be provided',
  });

export const RescheduleInputSchema = z.object({
  newDate: dateSchema,
  newTime: timeSchema,
  reasonId: uuidSchema,
});

export const CancelInputSchema = z.object({
  reasonId: uuidSchema,
});

export const CompleteInputSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export const FinalizeInputSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export const ReassignInputSchema = z.object({
  newTechnicianId: uuidSchema,
});

export const CalendarVisitSchema = z.object({
  id: uuidSchema,
  date: dateSchema,
  time: timeSchema,
  clientName: z.string().min(1).max(200),
  location: z.string().min(1).max(500),
  status: z.nativeEnum(VisitStatus),
  technicianName: z.string().max(200).nullable(),
  teamName: z.string().max(200).nullable(),
  serviceTypeName: z.string().min(1).max(100),
});
