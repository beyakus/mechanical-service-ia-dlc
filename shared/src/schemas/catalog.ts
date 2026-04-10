import { z } from 'zod';
import { ReasonType } from '../enums/index.js';

const uuidSchema = z.string().uuid();

export const ServiceTypeSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateServiceTypeInputSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const UpdateServiceTypeInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const ReasonSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  type: z.nativeEnum(ReasonType),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateReasonInputSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(ReasonType),
});

export const UpdateReasonInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

export const ZoneSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateZoneInputSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const UpdateZoneInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});
