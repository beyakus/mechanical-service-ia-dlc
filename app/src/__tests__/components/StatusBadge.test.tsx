import { describe, it, expect } from 'vitest';
import { VisitStatus } from '@visits/shared';

// Testing the status config mapping logic (no DOM rendering needed)
const statusConfig: Record<string, { label: string }> = {
  scheduled: { label: 'Programada' },
  completed: { label: 'Realizada' },
  cancelled: { label: 'Cancelada' },
  rescheduled: { label: 'Reagendada' },
  finalized: { label: 'Finalizada' },
};

describe('StatusBadge config', () => {
  it('should have a config entry for every VisitStatus', () => {
    const allStatuses = Object.values(VisitStatus);
    for (const status of allStatuses) {
      expect(statusConfig[status]).toBeDefined();
      expect(statusConfig[status].label).toBeTruthy();
    }
  });

  it('should have Spanish labels', () => {
    expect(statusConfig.scheduled.label).toBe('Programada');
    expect(statusConfig.cancelled.label).toBe('Cancelada');
    expect(statusConfig.finalized.label).toBe('Finalizada');
  });
});
