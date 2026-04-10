import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ReasonCount } from '@visits/shared';

interface ReasonBarChartProps {
  data: ReasonCount[];
  title: string;
  color: string;
}

export function ReasonBarChart({ data, title, color }: ReasonBarChartProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4" data-testid="reason-bar-chart">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="reasonName" width={110} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => [`${value}`, 'Cantidad']} />
          <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
