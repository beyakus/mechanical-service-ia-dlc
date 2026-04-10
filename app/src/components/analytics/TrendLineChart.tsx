import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendData } from '@visits/shared';

interface TrendLineChartProps {
  data: TrendData[];
}

const lines = [
  { key: 'scheduled', color: '#3B82F6', label: 'Programadas' },
  { key: 'completed', color: '#22C55E', label: 'Realizadas' },
  { key: 'cancelled', color: '#EF4444', label: 'Canceladas' },
  { key: 'rescheduled', color: '#EAB308', label: 'Reagendadas' },
  { key: 'finalized', color: '#A855F7', label: 'Finalizadas' },
] as const;

export function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4" data-testid="trend-line-chart">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Tendencias en el tiempo</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line) => (
            <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} name={line.label} strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
