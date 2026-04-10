import { useState } from 'react';
import { useRescheduleVisit } from '@/hooks/useVisits';
import { useReasons } from '@/hooks/useCatalogs';

interface RescheduleDialogProps {
  visitId: string;
  open: boolean;
  onClose: () => void;
}

export function RescheduleDialog({ visitId, open, onClose }: RescheduleDialogProps) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reasonId, setReasonId] = useState('');
  const { data: reasons } = useReasons('reschedule');
  const reschedule = useRescheduleVisit();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await reschedule.mutateAsync({ id: visitId, data: { newDate, newTime, reasonId } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="reschedule-dialog">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Reagendar Visita</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reschedule-date" className="block text-sm font-medium text-gray-700">Nueva fecha</label>
            <input id="reschedule-date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required data-testid="reschedule-date-input" />
          </div>
          <div>
            <label htmlFor="reschedule-time" className="block text-sm font-medium text-gray-700">Nueva hora</label>
            <input id="reschedule-time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required data-testid="reschedule-time-input" />
          </div>
          <div>
            <label htmlFor="reschedule-reason" className="block text-sm font-medium text-gray-700">Motivo</label>
            <select id="reschedule-reason" value={reasonId} onChange={(e) => setReasonId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" required data-testid="reschedule-reason-select">
              <option value="">Seleccionar motivo</option>
              {reasons?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" data-testid="reschedule-cancel-button">Cancelar</button>
            <button type="submit" disabled={reschedule.isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" data-testid="reschedule-submit-button">
              {reschedule.isPending ? 'Reagendando...' : 'Reagendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
