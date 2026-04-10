import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useVisits } from '@/hooks/useVisits';
import { useUserRole } from '@/hooks/useAuth';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RescheduleDialog } from '@/components/visits/RescheduleDialog';
import { CancelDialog } from '@/components/visits/CancelDialog';
import type { Visit, VisitStatus } from '@visits/shared';

export const Route = createFileRoute('/_authenticated/visits/')({
  component: VisitsPage,
});

function VisitsPage() {
  const navigate = useNavigate();
  const userRole = useUserRole();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dialog, setDialog] = useState<{ type: 'reschedule' | 'cancel'; visitId: string } | null>(null);

  const { data, isLoading } = useVisits({
    page,
    pageSize: 20,
    ...(statusFilter && { status: statusFilter as VisitStatus }),
  });

  const columns = [
    { key: 'date', header: 'Fecha', render: (v: Visit) => `${v.date} ${v.time}` },
    { key: 'client', header: 'Cliente', render: (v: Visit) => v.clientName },
    { key: 'location', header: 'Ubicación', render: (v: Visit) => v.location },
    { key: 'technician', header: 'Técnico', render: (v: Visit) => v.technicianName ?? v.teamName ?? '—' },
    { key: 'serviceType', header: 'Tipo', render: (v: Visit) => v.serviceTypeName },
    { key: 'status', header: 'Estado', render: (v: Visit) => <StatusBadge status={v.status} /> },
    {
      key: 'actions', header: 'Acciones', render: (v: Visit) => (
        <div className="flex gap-2">
          {v.status === 'scheduled' && userRole && !userRole.isTechnician && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setDialog({ type: 'reschedule', visitId: v.id }); }}
                className="text-xs text-blue-600 hover:underline" data-testid={`visit-reschedule-${v.id}`}>Reagendar</button>
              <button onClick={(e) => { e.stopPropagation(); setDialog({ type: 'cancel', visitId: v.id }); }}
                className="text-xs text-red-600 hover:underline" data-testid={`visit-cancel-${v.id}`}>Cancelar</button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div data-testid="visits-page">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Visitas</h2>
      </div>
      <div className="mb-4">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm" data-testid="visits-status-filter">
          <option value="">Todos los estados</option>
          <option value="scheduled">Programada</option>
          <option value="completed">Realizada</option>
          <option value="cancelled">Cancelada</option>
          <option value="rescheduled">Reagendada</option>
          <option value="finalized">Finalizada</option>
        </select>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <DataTable columns={columns} data={data?.data ?? []} onRowClick={(v) => navigate({ to: '/visits/$visitId', params: { visitId: v.id } })} />
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4" data-testid="visits-pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Anterior</button>
              <span className="px-3 py-1 text-sm">{page} / {data.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Siguiente</button>
            </div>
          )}
        </>
      )}
      {dialog?.type === 'reschedule' && <RescheduleDialog visitId={dialog.visitId} open onClose={() => setDialog(null)} />}
      {dialog?.type === 'cancel' && <CancelDialog visitId={dialog.visitId} open onClose={() => setDialog(null)} />}
    </div>
  );
}
