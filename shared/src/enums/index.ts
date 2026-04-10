export const VisitStatus = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
  FINALIZED: 'finalized',
} as const;

export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus];

export const Role = {
  TECHNICIAN: 'technician',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ReasonType = {
  CANCELLATION: 'cancellation',
  RESCHEDULE: 'reschedule',
} as const;

export type ReasonType = (typeof ReasonType)[keyof typeof ReasonType];

export const HistoryChangeType = {
  CREATED: 'created',
  RESCHEDULED: 'rescheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  FINALIZED: 'finalized',
  REASSIGNED: 'reassigned',
} as const;

export type HistoryChangeType =
  (typeof HistoryChangeType)[keyof typeof HistoryChangeType];
