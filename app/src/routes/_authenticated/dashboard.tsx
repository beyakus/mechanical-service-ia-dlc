import { createFileRoute } from '@tanstack/react-router';
import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

const today = new Date().toISOString().slice(0, 10);

const statusCards = [
  { key: 'scheduled', label: 'Programadas', color: 'bg-blue-500' },
  { key: 'completed', label: 'Realizadas', color: 'bg-green-500' },
  { key: 'cancelled', label: 'Canceladas', color: 'bg-red-500' },
  { key: 'rescheduled', label: 'Reagendadas', color: 'bg-yellow-500' },
  { key: 'finalized', label: 'Finalizadas', color: 'bg-purple-500' },
] as const;

function DashboardPage() {
  const { data: summary, isLoading } = useAnalyticsSummary({
    startDate: today,
    endDate: today,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div data-testid="dashboard-page">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-lg border border-gray-200 p-6"
            data-testid={`dashboard-card-${card.key}`}
          >
            <div className={`w-3 h-3 rounded-full ${card.color} mb-3`} />
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">
              {summary?.[card.key as keyof typeof summary] ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
