import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CalendarVisit } from '@visits/shared';

const locales = { es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface CalendarViewProps {
  visits: CalendarVisit[];
  currentDate: Date;
  view: View;
  onNavigate: (date: Date) => void;
  onViewChange: (view: View) => void;
  onSelectEvent: (visit: CalendarVisit) => void;
}

const statusColors: Record<string, string> = {
  scheduled: '#3B82F6',
  completed: '#22C55E',
  cancelled: '#EF4444',
  rescheduled: '#EAB308',
  finalized: '#A855F7',
};

export function CalendarView({
  visits, currentDate, view, onNavigate, onViewChange, onSelectEvent,
}: CalendarViewProps) {
  const events = visits.map((v) => ({
    id: v.id,
    title: `${v.time} - ${v.clientName}`,
    start: new Date(`${v.date}T${v.time}:00`),
    end: new Date(`${v.date}T${v.time}:00`),
    resource: v,
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4" data-testid="calendar-view">
      <Calendar
        localizer={localizer}
        events={events}
        date={currentDate}
        view={view}
        views={['day', 'week']}
        onNavigate={onNavigate}
        onView={onViewChange}
        onSelectEvent={(event) => onSelectEvent(event.resource)}
        eventPropGetter={(event) => ({
          style: { backgroundColor: statusColors[event.resource.status] ?? '#6B7280' },
        })}
        style={{ height: 600 }}
        messages={{
          today: 'Hoy', previous: 'Anterior', next: 'Siguiente',
          day: 'Día', week: 'Semana', noEventsInRange: 'Sin visitas en este rango',
        }}
      />
    </div>
  );
}
