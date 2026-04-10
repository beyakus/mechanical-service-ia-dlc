import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useCancellationReasons, useRescheduleReasons, useTrends } from '@/hooks/useAnalytics';
import { ReasonBarChart } from '@/components/analytics/ReasonBarChart';
import { TrendLineChart } from '@/components/analytics/TrendLineChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2026-04-30');

  const filters = { startDate, endDate };
  const { data: cancellations, isLoading: loadingCancel } = useCancellationReasons(filters);
  const { data: reschedules, isLoading: loadingReschedule } = useRescheduleReasons(filters);
  const { data: trends, isLoading: loadingTrends } = useTrends(filters);

  const isLoading = loadingCancel || loadingReschedule || loadingTrends;

  return (
    <div data-testid="analytics-page">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>

      <div className="flex gap-4 mb-6">
        <div>
          <label htmlFor="analytics-start" className="block text-sm text-gray-600">Desde</label>
          <input id="analytics-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm" data-testid="analytics-start-date" />
        </div>
        <div>
          <label htmlFor="analytics-end" className="block text-sm text-gray-600">Hasta</label>
          <input id="analytics-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm" data-testid="analytics-end-date" />
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReasonBarChart data={cancellations ?? []} title="Motivos de Cancelación" color="#EF4444" />
            <ReasonBarChart data={reschedules ?? []} title="Motivos de Reagendamiento" color="#EAB308" />
          </div>
          <TrendLineChart data={trends ?? []} />
        </div>
      )}
    </div>
  );
}
