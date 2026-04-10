import type { VisitStatus } from '@visits/shared';
import { clsx } from 'clsx';

const statusConfig: Record<string, { label: string; className: string }> = {
  scheduled: { label: 'Programada', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Realizada', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
  rescheduled: { label: 'Reagendada', className: 'bg-yellow-100 text-yellow-800' },
  finalized: { label: 'Finalizada', className: 'bg-purple-100 text-purple-800' },
};

interface StatusBadgeProps {
  status: VisitStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' };

  return (
    <span
      className={clsx('px-2 py-1 rounded-full text-xs font-medium', config.className)}
      data-testid={`status-badge-${status}`}
    >
      {config.label}
    </span>
  );
}
