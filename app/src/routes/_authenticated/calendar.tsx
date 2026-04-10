import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { View } from 'react-big-calendar';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { useCalendarVisits } from '@/hooks/useVisits';
import { CalendarView } from '@/components/calendar/CalendarView';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const Route = createFileRoute('/_authenticated/calendar')({
  component: CalendarPage,
});

function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('week');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const { data: visits, isLoading } = useCalendarVisits({
    startDate: format(weekStart, 'yyyy-MM-dd'),
    endDate: format(weekEnd, 'yyyy-MM-dd'),
  });

  return (
    <div data-testid="calendar-page">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Calendario</h2>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CalendarView
          visits={visits ?? []}
          currentDate={currentDate}
          view={view}
          onNavigate={setCurrentDate}
          onViewChange={setView}
          onSelectEvent={(visit) => navigate({ to: '/visits/$visitId', params: { visitId: visit.id } })}
        />
      )}
    </div>
  );
}
