# Frontend Components Design - Unit: app

## Component Hierarchy

```
__root.tsx
├── login.tsx (public)
└── _authenticated.tsx (Clerk protected layout)
    ├── Layout (Sidebar + Header + Content)
    │   ├── Sidebar (nav menu by role)
    │   └── Header (user info, logout)
    ├── dashboard.tsx
    │   └── DashboardPage
    │       ├── SummaryCards (scheduled, completed, cancelled, rescheduled, finalized)
    │       └── RecentVisitsTable
    ├── calendar.tsx
    │   └── CalendarPage
    │       ├── CalendarToolbar (view toggle, navigation, filters)
    │       └── BigCalendar (react-big-calendar: day/week views)
    ├── visits/index.tsx
    │   └── VisitsPage
    │       ├── FilterBar (status, technician, zone, date range)
    │       ├── DataTable (sortable, paginated)
    │       ├── CreateVisitDialog
    │       ├── RescheduleDialog
    │       ├── CancelDialog
    │       └── ReassignDialog
    ├── visits/$visitId.tsx
    │   └── VisitDetailPage
    │       ├── VisitInfo (all fields)
    │       ├── VisitHistory (timeline)
    │       └── VisitActions (buttons by status + role)
    ├── analytics.tsx
    │   └── AnalyticsPage
    │       ├── AnalyticsFilterBar (date range, technician, zone)
    │       ├── ReasonBarChart (Recharts - cancellation reasons)
    │       ├── ReasonBarChart (Recharts - reschedule reasons)
    │       ├── TrendLineChart (Recharts - trends over time)
    │       └── MetricsCards (rates: cancellation, reschedule, success)
    └── admin/catalogs.tsx
        └── CatalogsPage
            ├── Tabs (service types, reasons, zones)
            ├── CatalogTable (per tab)
            ├── CreateCatalogDialog
            └── EditCatalogDialog
```

## Key Components - Props & State

### Layout
- Props: `children: ReactNode`
- State: `sidebarOpen: boolean` (mobile toggle)
- Uses: `useUser()` from Clerk for role-based menu

### SummaryCards
- Props: none (fetches own data)
- Query: `useAnalyticsSummary({ startDate: today, endDate: today })`
- Renders: 5 cards with count + color by status

### CalendarPage
- State: `currentDate: Date`, `view: 'day' | 'week'`, `filters: CalendarFilters`
- Query: `useCalendarVisits(dateRange, filters)`
- Events: click on visit → navigate to detail

### VisitsPage
- State: `filters: VisitFilters`, `page: number`
- Query: `useVisits(filters)`
- Mutations: `useRescheduleVisit()`, `useCancelVisit()`, `useReassignVisit()`
- Dialogs: controlled by `openDialog: 'create' | 'reschedule' | 'cancel' | 'reassign' | null`

### VisitDetailPage
- Params: `visitId` from route
- Query: `useVisit(visitId)`
- Mutations: `useCompleteVisit()`, `useFinalizeVisit()`
- Shows actions based on visit.status + user.role

### AnalyticsPage
- State: `filters: AnalyticsFilters`
- Queries: `useCancellationReasons(filters)`, `useRescheduleReasons(filters)`, `useTrends(filters)`

### CatalogsPage
- State: `activeTab: 'serviceTypes' | 'reasons' | 'zones'`
- Queries: `useServiceTypes(true)`, `useReasons(undefined, true)`, `useZones(true)`
- Mutations: create/toggle per catalog type

## User Interaction Flows

### Flow 1: Reagendar visita
1. User clicks "Reagendar" on visit row/detail
2. RescheduleDialog opens with date picker + reason selector
3. User selects new date, time, reason
4. Form validates with Zod (RescheduleInputSchema)
5. Submit → `useRescheduleVisit.mutate()`
6. On success: dialog closes, visits query invalidated, toast notification
7. On error: show error message in dialog

### Flow 2: Cancelar visita
1. User clicks "Cancelar" on visit row/detail
2. CancelDialog opens with reason selector
3. User selects reason
4. Submit → `useCancelVisit.mutate()`
5. On success: dialog closes, queries invalidated

### Flow 3: Completar visita (técnico)
1. Technician opens visit detail
2. Clicks "Marcar como completada"
3. Optional notes input
4. Submit → `useCompleteVisit.mutate()`
5. On success: status updates, actions change
