import type { Visit } from '@visits/shared';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface VisitDetailProps {
  visit: Visit;
}

export function VisitDetail({ visit }: VisitDetailProps) {
  return (
    <div className="space-y-6" data-testid="visit-detail">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField label="Cliente" value={visit.clientName} />
        <InfoField label="Ubicación" value={visit.location} />
        <InfoField label="Fecha" value={`${visit.date} ${visit.time}`} />
        <div>
          <span className="text-sm text-gray-500">Estado</span>
          <div className="mt-1"><StatusBadge status={visit.status} /></div>
        </div>
        <InfoField label="Técnico" value={visit.technicianName ?? '—'} />
        <InfoField label="Equipo" value={visit.teamName ?? '—'} />
        <InfoField label="Tipo de servicio" value={visit.serviceTypeName} />
        <InfoField label="Zona" value={visit.zoneName} />
      </div>
      {visit.description && <InfoField label="Descripción" value={visit.description} />}
      {visit.notes && <InfoField label="Notas" value={visit.notes} />}
      {visit.reasonText && <InfoField label="Motivo" value={visit.reasonText} />}

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Historial</h3>
        <div className="space-y-2" data-testid="visit-history">
          {visit.history.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
              <span className="font-medium">{entry.changeType}</span>
              <span>por {entry.changedByName}</span>
              <span className="text-gray-400">{new Date(entry.changedAt).toLocaleString('es')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm text-gray-500">{label}</span>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
