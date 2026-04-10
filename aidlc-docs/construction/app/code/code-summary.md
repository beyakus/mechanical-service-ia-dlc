# Code Summary - Unit: app

## Files Generated (~35 files)

### Configuration (5)
- `app/package.json`, `app/tsconfig.json`, `app/app.config.ts`, `app/tailwind.config.ts`, `app/vitest.config.ts`

### Styles (1)
- `app/src/styles/globals.css`

### Lib (2)
- `app/src/lib/api-client.ts` — Fetch wrapper with Clerk token
- `app/src/lib/query-client.ts` — TanStack Query config

### Hooks (4)
- `app/src/hooks/useAuth.ts` — useUserRole, useAuthToken
- `app/src/hooks/useVisits.ts` — 8 hooks (queries + mutations)
- `app/src/hooks/useCatalogs.ts` — 6 hooks (queries + mutations)
- `app/src/hooks/useAnalytics.ts` — 4 hooks (queries)

### Layout Components (3)
- `app/src/components/layout/Layout.tsx`, `Sidebar.tsx`, `Header.tsx`

### UI Components (4)
- `app/src/components/ui/StatusBadge.tsx`, `DataTable.tsx`, `FilterBar.tsx`, `LoadingSpinner.tsx`

### Visit Components (3)
- `app/src/components/visits/VisitDetail.tsx`, `RescheduleDialog.tsx`, `CancelDialog.tsx`

### Calendar Components (1)
- `app/src/components/calendar/CalendarView.tsx`

### Analytics Components (2)
- `app/src/components/analytics/ReasonBarChart.tsx`, `TrendLineChart.tsx`

### Routes (8)
- `app/src/routes/__root.tsx`, `login.tsx`, `index.tsx`, `_authenticated.tsx`
- `app/src/routes/_authenticated/dashboard.tsx`, `calendar.tsx`, `analytics.tsx`
- `app/src/routes/_authenticated/visits/index.tsx`, `$visitId.tsx`
- `app/src/routes/_authenticated/admin/catalogs.tsx`

### Tests (3)
- `app/src/__tests__/hooks/useAuth.test.ts`
- `app/src/__tests__/hooks/useAuth.property.test.ts`
- `app/src/__tests__/components/StatusBadge.test.tsx`
