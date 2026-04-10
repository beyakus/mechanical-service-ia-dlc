import { useState } from 'react';
import { useCancelVisit } from '@/hooks/useVisits';
import { useReasons } from '@/hooks/useCatalogs';

interface CancelDialogProps {
  visitId: string;
  open: boolean;
  onClose: () => void;
}

export function CancelDialog({ visitId, open, onClose }: CancelDialogProps) {
  const [reasonId, setReasonId] = useState('');
  const { data: reasons } = useReasons('cancellation');
  const cancel = useCancelVisit();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await cancel.mutateAsync({ id: visitId, data: { reasonId } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="cancel-dialog">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Cancelar Visita</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700">Motivo de cancelación</label>
            <select id="cancel-reason" value={reasonId} onChange={(e) => setReasonId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required data-testid="cancel-reason-select">
              <option value="">Seleccionar motivo</option>
              {reasons?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" data-testid="cancel-back-button">Volver</button>
            <button type="submit" disabled={cancel.isPending} className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50" data-testid="cancel-submit-button">
              {cancel.isPending ? 'Cancelando...' : 'Cancelar visita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
