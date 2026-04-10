import type { Visit, VisitFilters, CalendarVisit, PaginatedResult } from '../../../shared/src/index.js';
import { VisitStatus } from '../../../shared/src/index.js';

// Seed visits loaded statically
const seedVisits: Visit[] = generateSeedVisits();

export function getAllVisits(): Visit[] {
  return seedVisits;
}

export function getVisitById(id: string): Visit | undefined {
  return seedVisits.find((v) => v.id === id);
}

export function filterVisits(
  visits: Visit[],
  filters: Partial<VisitFilters>,
): Visit[] {
  let result = [...visits];

  if (filters.status) {
    result = result.filter((v) => v.status === filters.status);
  }
  if (filters.technicianId) {
    result = result.filter((v) => v.technicianId === filters.technicianId);
  }
  if (filters.zoneId) {
    result = result.filter((v) => v.zoneId === filters.zoneId);
  }
  if (filters.serviceTypeId) {
    result = result.filter((v) => v.serviceTypeId === filters.serviceTypeId);
  }
  if (filters.startDate) {
    result = result.filter((v) => v.date >= filters.startDate!);
  }
  if (filters.endDate) {
    result = result.filter((v) => v.date <= filters.endDate!);
  }

  return result;
}

export function paginateVisits(
  visits: Visit[],
  page: number,
  pageSize: number,
): PaginatedResult<Visit> {
  const total = visits.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = visits.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export function toCalendarVisit(visit: Visit): CalendarVisit {
  return {
    id: visit.id,
    date: visit.date,
    time: visit.time,
    clientName: visit.clientName,
    location: visit.location,
    status: visit.status,
    technicianName: visit.technicianName,
    teamName: visit.teamName,
    serviceTypeName: visit.serviceTypeName,
  };
}

function generateSeedVisits(): Visit[] {
  const now = '2026-04-09T10:00:00.000Z';
  const baseVisit = {
    createdAt: now,
    updatedAt: now,
    createdBy: 'd0000000-0000-4000-8000-000000000004',
    description: null,
    notes: null,
    reasonId: null,
    reasonText: null,
  };

  return [
    { ...baseVisit, id: 'f0000000-0000-4000-8000-000000000001', date: '2026-04-10', time: '09:00', clientName: 'Acme Corp', location: 'Av. Principal 100', status: VisitStatus.SCHEDULED, technicianId: 'd0000000-0000-4000-8000-000000000001', technicianName: 'Carlos Méndez', teamId: 'e0000000-0000-4000-8000-000000000001', teamName: 'Equipo Norte A', serviceTypeId: 'b0000000-0000-4000-8000-000000000001', serviceTypeName: 'Mantenimiento preventivo', zoneId: 'a0000000-0000-4000-8000-000000000001', zoneName: 'Zona Norte', history: [{ id: 'h0000001', changeType: 'created', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000004', changedByName: 'Laura Torres' }] },
    { ...baseVisit, id: 'f0000000-0000-4000-8000-000000000002', date: '2026-04-10', time: '11:00', clientName: 'Beta Industries', location: 'Calle 5 #200', status: VisitStatus.SCHEDULED, technicianId: 'd0000000-0000-4000-8000-000000000002', technicianName: 'Ana García', teamId: 'e0000000-0000-4000-8000-000000000001', teamName: 'Equipo Norte A', serviceTypeId: 'b0000000-0000-4000-8000-000000000002', serviceTypeName: 'Reparación correctiva', zoneId: 'a0000000-0000-4000-8000-000000000001', zoneName: 'Zona Norte', history: [{ id: 'h0000002', changeType: 'created', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000004', changedByName: 'Laura Torres' }] },
    { ...baseVisit, id: 'f0000000-0000-4000-8000-000000000003', date: '2026-04-11', time: '10:00', clientName: 'Gamma Solutions', location: 'Blvd. Central 50', status: VisitStatus.COMPLETED, technicianId: 'd0000000-0000-4000-8000-000000000003', technicianName: 'Roberto López', teamId: 'e0000000-0000-4000-8000-000000000002', teamName: 'Equipo Centro B', serviceTypeId: 'b0000000-0000-4000-8000-000000000001', serviceTypeName: 'Mantenimiento preventivo', zoneId: 'a0000000-0000-4000-8000-000000000002', zoneName: 'Zona Centro', notes: 'Revisión completada sin novedad', history: [{ id: 'h0000003', changeType: 'created', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000004', changedByName: 'Laura Torres' }, { id: 'h0000004', changeType: 'completed', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000003', changedByName: 'Roberto López' }] },
    { ...baseVisit, id: 'f0000000-0000-4000-8000-000000000004', date: '2026-04-09', time: '14:00', clientName: 'Delta Corp', location: 'Av. Sur 300', status: VisitStatus.CANCELLED, technicianId: 'd0000000-0000-4000-8000-000000000001', technicianName: 'Carlos Méndez', teamId: null, teamName: null, serviceTypeId: 'b0000000-0000-4000-8000-000000000003', serviceTypeName: 'Instalación', zoneId: 'a0000000-0000-4000-8000-000000000001', zoneName: 'Zona Norte', reasonId: 'c0000000-0000-4000-8000-000000000001', reasonText: 'Cliente no disponible', history: [{ id: 'h0000005', changeType: 'created', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000004', changedByName: 'Laura Torres' }, { id: 'h0000006', changeType: 'cancelled', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000004', changedByName: 'Laura Torres' }] },
    { ...baseVisit, id: 'f0000000-0000-4000-8000-000000000005', date: '2026-04-12', time: '08:30', clientName: 'Epsilon SA', location: 'Calle 10 #45', status: VisitStatus.FINALIZED, technicianId: 'd0000000-0000-4000-8000-000000000003', technicianName: 'Roberto López', teamId: 'e0000000-0000-4000-8000-000000000002', teamName: 'Equipo Centro B', serviceTypeId: 'b0000000-0000-4000-8000-000000000002', serviceTypeName: 'Reparación correctiva', zoneId: 'a0000000-0000-4000-8000-000000000002', zoneName: 'Zona Centro', notes: 'Reparación exitosa', history: [{ id: 'h0000007', changeType: 'created', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000004', changedByName: 'Laura Torres' }, { id: 'h0000008', changeType: 'completed', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000003', changedByName: 'Roberto López' }, { id: 'h0000009', changeType: 'finalized', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000004', changedByName: 'Laura Torres' }] },
    { ...baseVisit, id: 'f0000000-0000-4000-8000-000000000006', date: '2026-04-13', time: '15:00', clientName: 'Zeta LLC', location: 'Av. Norte 500', status: VisitStatus.RESCHEDULED, technicianId: 'd0000000-0000-4000-8000-000000000001', technicianName: 'Carlos Méndez', teamId: 'e0000000-0000-4000-8000-000000000001', teamName: 'Equipo Norte A', serviceTypeId: 'b0000000-0000-4000-8000-000000000001', serviceTypeName: 'Mantenimiento preventivo', zoneId: 'a0000000-0000-4000-8000-000000000001', zoneName: 'Zona Norte', reasonId: 'c0000000-0000-4000-8000-000000000004', reasonText: 'Técnico enfermo', history: [{ id: 'h0000010', changeType: 'created', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000004', changedByName: 'Laura Torres' }, { id: 'h0000011', changeType: 'rescheduled', changedAt: now, changedBy: 'd0000000-0000-4000-8000-000000000001', changedByName: 'Carlos Méndez' }] },
  ];
}
