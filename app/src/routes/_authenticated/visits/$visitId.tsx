import { createFileRoute, Link } from '@tanstack/react-router';
import { useVisit, useCompleteVisit, useFinalizeVisit } from '@/hooks/useVisits';
import { useUserRole } from '@/hooks/useAuth';
import { VisitDetail } from '@/components/visits/VisitDetail';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const Route = createFileRoute('/_authenticated/visits/$visitId')({
  component: VisitDetailPage,
});

function VisitDetailPage() {
  const { visitId } = Route.useParams();
  const { data: visit, isLoading } = useVisit(visitId);
  const userRole = useUserRole();
  const completeVisit = useCompleteVisit();
  const finalizeVisit = useFinalizeVisit();

  if (isLoading || !visit) return <LoadingSpinner />;

  const canComplete = visit.status === 'scheduled' && userRole?.isTechnician && visit.technicianId === userRole.userId;
  const canFinalize = visit.status === 'completed' && userRole && !userRole.isTechnician;

  return (
    <div data-testid="visit-detail-page">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/visits" className="text-sm text-blue-600 hover:underline" data-testid="visit-back-link">← Volver a visitas</Link>
        <h2 className="text-2xl font-bold text-gray-900">Detalle de Visita</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <VisitDetail visit={visit} />

        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          {canComplete && (
            <button
              onClick={() => completeVisit.mutate({ id: visitId, data: {} })}
              disabled={completeVisit.isPending}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              data-testid="visit-complete-button"
            >
              {completeVisit.isPending ? 'Completando...' : 'Marcar como completada'}
            </button>
          )}
          {canFinalize && (
            <button
              onClick={() => finalizeVisit.mutate({ id: visitId, data: {} })}
              disabled={finalizeVisit.isPending}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              data-testid="visit-finalize-button"
            >
              {finalizeVisit.isPending ? 'Finalizando...' : 'Finalizar visita'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
