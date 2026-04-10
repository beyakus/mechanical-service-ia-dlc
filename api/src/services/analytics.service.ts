import type { VisitSummary, ReasonCount, TrendData, UserContext } from '../../../shared/src/index.js';
import { VisitStatus } from '../../../shared/src/index.js';
import * as visitRepo from '../repositories/mock-visit.repository.js';

function filterByRoleAndDate(
  user: UserContext,
  startDate: string,
  endDate: string,
  technicianId?: string,
  zoneId?: string,
) {
  let visits = visitRepo.getAllVisits();

  // Role-based filtering
  if (user.role === 'supervisor') {
    visits = visits.filter((v) => v.zoneId === user.zoneId);
  }
  // Admin sees all; technician shouldn't access analytics (enforced at handler level)

  // Date range
  visits = visits.filter((v) => v.date >= startDate && v.date <= endDate);

  // Optional filters
  if (technicianId) visits = visits.filter((v) => v.technicianId === technicianId);
  if (zoneId) visits = visits.filter((v) => v.zoneId === zoneId);

  return visits;
}

export function getSummary(
  user: UserContext,
  startDate: string,
  endDate: string,
  technicianId?: string,
  zoneId?: string,
): VisitSummary {
  const visits = filterByRoleAndDate(user, startDate, endDate, technicianId, zoneId);

  const summary: VisitSummary = {
    scheduled: 0, completed: 0, cancelled: 0, rescheduled: 0, finalized: 0, total: 0,
  };

  for (const v of visits) {
    summary[v.status as keyof Omit<VisitSummary, 'total'>]++;
    summary.total++;
  }

  return summary;
}

export function getCancellationReasons(
  user: UserContext,
  startDate: string,
  endDate: string,
  technicianId?: string,
  zoneId?: string,
): ReasonCount[] {
  const visits = filterByRoleAndDate(user, startDate, endDate, technicianId, zoneId);
  const cancelled = visits.filter((v) => v.status === VisitStatus.CANCELLED && v.reasonId);
  return aggregateReasons(cancelled);
}

export function getRescheduleReasons(
  user: UserContext,
  startDate: string,
  endDate: string,
  technicianId?: string,
  zoneId?: string,
): ReasonCount[] {
  const visits = filterByRoleAndDate(user, startDate, endDate, technicianId, zoneId);
  const rescheduled = visits.filter((v) => v.status === VisitStatus.RESCHEDULED && v.reasonId);
  return aggregateReasons(rescheduled);
}

export function getTrends(
  user: UserContext,
  startDate: string,
  endDate: string,
  technicianId?: string,
  zoneId?: string,
): TrendData[] {
  const visits = filterByRoleAndDate(user, startDate, endDate, technicianId, zoneId);
  const byDate = new Map<string, TrendData>();

  for (const v of visits) {
    if (!byDate.has(v.date)) {
      byDate.set(v.date, { period: v.date, scheduled: 0, completed: 0, cancelled: 0, rescheduled: 0, finalized: 0 });
    }
    const entry = byDate.get(v.date)!;
    entry[v.status as keyof Omit<TrendData, 'period'>]++;
  }

  return Array.from(byDate.values()).sort((a, b) => a.period.localeCompare(b.period));
}

function aggregateReasons(visits: { reasonId: string | null; reasonText: string | null }[]): ReasonCount[] {
  const counts = new Map<string, { reasonId: string; reasonName: string; count: number }>();

  for (const v of visits) {
    if (!v.reasonId) continue;
    const existing = counts.get(v.reasonId);
    if (existing) {
      existing.count++;
    } else {
      counts.set(v.reasonId, { reasonId: v.reasonId, reasonName: v.reasonText ?? 'Unknown', count: 1 });
    }
  }

  const total = visits.length || 1;
  return Array.from(counts.values())
    .map((r) => ({ ...r, percentage: Math.round((r.count / total) * 100 * 100) / 100 }))
    .sort((a, b) => b.count - a.count);
}
