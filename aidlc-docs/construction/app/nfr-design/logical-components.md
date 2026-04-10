# Logical Components - Unit: app

---

## Módulos

### routes/
TanStack Router file-based routes:
- `__root.tsx` — ClerkProvider + QueryClientProvider + ErrorBoundary
- `login.tsx` — Clerk SignIn page
- `index.tsx` — Redirect to /dashboard
- `_authenticated.tsx` — Protected layout (auth check + Layout shell)
- `_authenticated/dashboard.tsx` — Dashboard page
- `_authenticated/calendar.tsx` — Calendar page
- `_authenticated/visits/index.tsx` — Visits list
- `_authenticated/visits/$visitId.tsx` — Visit detail
- `_authenticated/analytics.tsx` — Analytics page
- `_authenticated/admin/catalogs.tsx` — Catalog management

### components/layout/
- `Layout.tsx` — Main layout (sidebar + header + content)
- `Sidebar.tsx` — Navigation menu (role-filtered)
- `Header.tsx` — User info, role badge, logout button

### components/ui/
shadcn/ui components (copied):
- Button, Input, Label, Textarea, Select
- Dialog, Sheet, Tabs, Card, Badge
- Table (DataTable wrapper), DropdownMenu
- Skeleton, Toast (Sonner)

### components/visits/
- `VisitForm.tsx` — Create visit form
- `VisitDetail.tsx` — Visit info + history + actions
- `RescheduleDialog.tsx` — Reschedule form dialog
- `CancelDialog.tsx` — Cancel form dialog
- `ReassignDialog.tsx` — Reassign form dialog

### components/calendar/
- `CalendarView.tsx` — react-big-calendar wrapper (day/week)
- `CalendarToolbar.tsx` — View toggle + navigation + filters

### components/analytics/
- `ReasonBarChart.tsx` — Recharts bar chart for reasons
- `TrendLineChart.tsx` — Recharts line chart for trends
- `MetricsCards.tsx` — Rate cards (cancellation, reschedule, success)

### hooks/
TanStack Query hooks:
- `useVisits.ts` — Visit queries + mutations
- `useCatalogs.ts` — Catalog queries + mutations
- `useAnalytics.ts` — Analytics queries
- `useAuth.ts` — useUserRole() helper

### lib/
- `api-client.ts` — Fetch wrapper with Clerk token injection
- `query-client.ts` — TanStack Query client config

### styles/
- `globals.css` — Tailwind imports + custom styles

---

## Security Compliance

| SECURITY Rule | Status | Implementation |
|--------------|--------|----------------|
| SECURITY-04 | Compliant | CSP + security headers via TanStack Start middleware |
| SECURITY-08 | Compliant | Clerk auth, role guards, token in API calls |
| SECURITY-09 | Compliant | Error boundary with generic messages |
| SECURITY-10 | Compliant | Lock file, pinned versions |
| SECURITY-11 | Compliant | Auth isolated in Clerk + hooks/useAuth.ts |
| SECURITY-12 | Compliant | Clerk manages sessions, no hardcoded keys |
| SECURITY-13 | N/A | No external CDN scripts |
| SECURITY-15 | Compliant | Error boundary catches unhandled errors |
| Others | N/A | Backend/infra responsibility |

## PBT Compliance

| PBT Rule | Status | Notes |
|----------|--------|-------|
| PBT-01 | Compliant | Properties identified in business-rules.md |
| PBT-09 | Compliant | fast-check selected |
| Others | Deferred | Enforced during Code Generation |
