import type {
  Visit, RescheduleInput, CancelInput,
  CompleteInput, FinalizeInput, ReassignInput,
  VisitFilters, CalendarVisit, PaginatedResult, UserContext,
} from '@visits/shared';
import { VisitStatus, isValidTransition } from '@visits/shared';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';
import * as visitRepo from '../repositories/mock-visit.repository.js';
import * as catalogRepo from '../repositories/mock-catalog.repository.js';

function filterByRole(visits: Visit[], user: UserContext): Visit[] {
  if (user.role === 'technician') {
    return visits.filter(
      (v) => v.technicianId === user.userId || v.teamId === user.teamId,
    );
  }
  if (user.role === 'supervisor') {
    return visits.filter((v) => v.zoneId === user.zoneId);
  }
  return visits; // admin sees all
}

function checkVisitAccess(visit: Visit, user: UserContext): void {
  if (user.role === 'admin') return;
  if (user.role === 'supervisor' && visit.zoneId === user.zoneId) return;
  if (
    user.role === 'technician' &&
    (visit.technicianId === user.userId || visit.teamId === user.teamId)
  ) return;
  throw new ForbiddenError('You do not have access to this visit');
}

export function list(filters: Partial<VisitFilters>, user: UserContext): PaginatedResult<Visit> {
  let visits = visitRepo.getAllVisits();
  visits = filterByRole(visits, user);
  visits = visitRepo.filterVisits(visits, filters);
  return visitRepo.paginateVisits(visits, filters.page ?? 1, filters.pageSize ?? 20);
}

export function getById(id: string, user: UserContext): Visit {
  const visit = visitRepo.getVisitById(id);
  if (!visit) throw new NotFoundError(`Visit ${id} not found`);
  checkVisitAccess(visit, user);
  return visit;
}

export function getCalendarData(
  startDate: string,
  endDate: string,
  user: UserContext,
  filters?: { technicianId?: string; teamId?: string; status?: string },
): CalendarVisit[] {
  let visits = visitRepo.getAllVisits();
  visits = filterByRole(visits, user);
  visits = visits.filter((v) => v.date >= startDate && v.date <= endDate);
  if (filters?.technicianId) visits = visits.filter((v) => v.technicianId === filters.technicianId);
  if (filters?.teamId) visits = visits.filter((v) => v.teamId === filters.teamId);
  if (filters?.status) visits = visits.filter((v) => v.status === filters.status);
  return visits.map(visitRepo.toCalendarVisit);
}

export function reschedule(id: string, input: RescheduleInput, user: UserContext): Visit {
  const visit = getById(id, user);
  if (!isValidTransition(visit.status, VisitStatus.RESCHEDULED)) {
    throw new ConflictError(`Cannot reschedule visit in status '${visit.status}'`);
  }
  const reason = catalogRepo.getReasonById(input.reasonId);
  if (!reason) throw new NotFoundError(`Reason ${input.reasonId} not found`);
  // In a real implementation, this would update the DB
  // For mock, return the visit as-is with updated status
  return { ...visit, status: VisitStatus.RESCHEDULED, reasonId: input.reasonId, reasonText: reason.name };
}

export function cancel(id: string, input: CancelInput, user: UserContext): Visit {
  const visit = getById(id, user);
  if (!isValidTransition(visit.status, VisitStatus.CANCELLED)) {
    throw new ConflictError(`Cannot cancel visit in status '${visit.status}'`);
  }
  const reason = catalogRepo.getReasonById(input.reasonId);
  if (!reason) throw new NotFoundError(`Reason ${input.reasonId} not found`);
  return { ...visit, status: VisitStatus.CANCELLED, reasonId: input.reasonId, reasonText: reason.name };
}

export function complete(id: string, input: CompleteInput, user: UserContext): Visit {
  const visit = getById(id, user);
  if (user.role === 'technician' && visit.technicianId !== user.userId) {
    throw new ForbiddenError('Only the assigned technician can complete this visit');
  }
  if (!isValidTransition(visit.status, VisitStatus.COMPLETED)) {
    throw new ConflictError(`Cannot complete visit in status '${visit.status}'`);
  }
  return { ...visit, status: VisitStatus.COMPLETED, notes: input.notes ?? visit.notes };
}

export function finalize(id: string, input: FinalizeInput, user: UserContext): Visit {
  const visit = getById(id, user);
  if (!isValidTransition(visit.status, VisitStatus.FINALIZED)) {
    throw new ConflictError(`Cannot finalize visit in status '${visit.status}'`);
  }
  return { ...visit, status: VisitStatus.FINALIZED, notes: input.notes ?? visit.notes };
}

export function reassign(id: string, input: ReassignInput, user: UserContext): Visit {
  const visit = getById(id, user);
  if (visit.status !== VisitStatus.SCHEDULED) {
    throw new ConflictError(`Cannot reassign visit in status '${visit.status}'`);
  }
  const tech = catalogRepo.getTechnicianById(input.newTechnicianId);
  if (!tech) throw new NotFoundError(`Technician ${input.newTechnicianId} not found`);
  return { ...visit, technicianId: tech.userId, technicianName: tech.name };
}
