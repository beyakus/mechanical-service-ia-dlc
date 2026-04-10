import { z } from 'zod';
import {
  VisitSchema,
  CreateVisitInputSchema,
  RescheduleInputSchema,
  CancelInputSchema,
  CompleteInputSchema,
  FinalizeInputSchema,
  ReassignInputSchema,
  CalendarVisitSchema,
  HistoryEntrySchema,
  ServiceTypeSchema,
  CreateServiceTypeInputSchema,
  UpdateServiceTypeInputSchema,
  ReasonSchema,
  CreateReasonInputSchema,
  UpdateReasonInputSchema,
  ZoneSchema,
  CreateZoneInputSchema,
  UpdateZoneInputSchema,
  AnalyticsFiltersSchema,
  VisitSummarySchema,
  ReasonCountSchema,
  TrendDataSchema,
  VisitFiltersSchema,
  CalendarFiltersSchema,
  ApiErrorSchema,
  UserContextSchema,
} from '../schemas/index.js';

// Visit types
export type Visit = z.infer<typeof VisitSchema>;
export type CreateVisitInput = z.infer<typeof CreateVisitInputSchema>;
export type RescheduleInput = z.infer<typeof RescheduleInputSchema>;
export type CancelInput = z.infer<typeof CancelInputSchema>;
export type CompleteInput = z.infer<typeof CompleteInputSchema>;
export type FinalizeInput = z.infer<typeof FinalizeInputSchema>;
export type ReassignInput = z.infer<typeof ReassignInputSchema>;
export type CalendarVisit = z.infer<typeof CalendarVisitSchema>;
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;

// Catalog types
export type ServiceType = z.infer<typeof ServiceTypeSchema>;
export type CreateServiceTypeInput = z.infer<typeof CreateServiceTypeInputSchema>;
export type UpdateServiceTypeInput = z.infer<typeof UpdateServiceTypeInputSchema>;
export type Reason = z.infer<typeof ReasonSchema>;
export type CreateReasonInput = z.infer<typeof CreateReasonInputSchema>;
export type UpdateReasonInput = z.infer<typeof UpdateReasonInputSchema>;
export type Zone = z.infer<typeof ZoneSchema>;
export type CreateZoneInput = z.infer<typeof CreateZoneInputSchema>;
export type UpdateZoneInput = z.infer<typeof UpdateZoneInputSchema>;

// Analytics types
export type AnalyticsFilters = z.infer<typeof AnalyticsFiltersSchema>;
export type VisitSummary = z.infer<typeof VisitSummarySchema>;
export type ReasonCount = z.infer<typeof ReasonCountSchema>;
export type TrendData = z.infer<typeof TrendDataSchema>;

// API types
export type VisitFilters = z.infer<typeof VisitFiltersSchema>;
export type CalendarFilters = z.infer<typeof CalendarFiltersSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type UserContext = z.infer<typeof UserContextSchema>;

// Generic paginated result type
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
