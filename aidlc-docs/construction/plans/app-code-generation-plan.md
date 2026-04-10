# Plan de Code Generation - Unit 3: app

## Contexto
- Unit: app (TanStack Start + Router + Query, React, Tailwind, shadcn/ui, Clerk, react-big-calendar, Recharts)
- Ubicación: `app/` en workspace root
- Dependencias: shared (schemas/types), api (REST endpoints)
- Stories: US-1.1-1.3 (auth), US-2.1-2.3 (calendar), US-3.1-3.7 (visits), US-4.1-4.2 (dashboard), US-5.1-5.2 (analytics), US-6.1-6.3 (catalogs)

---

## Steps

### Step 1: Project Structure Setup
- [ ] Crear `app/package.json`
- [ ] Crear `app/tsconfig.json`
- [ ] Crear `app/app.config.ts` (TanStack Start config)
- [ ] Crear `app/tailwind.config.ts`
- [ ] Crear `app/src/styles/globals.css`

### Step 2: Lib - API Client & Query Client
- [ ] Crear `app/src/lib/api-client.ts` (fetch wrapper con Clerk token)
- [ ] Crear `app/src/lib/query-client.ts` (TanStack Query config)

### Step 3: Hooks - Auth
- [ ] Crear `app/src/hooks/useAuth.ts` (useUserRole helper)

### Step 4: Hooks - Visits
- [ ] Crear `app/src/hooks/useVisits.ts` (queries + mutations)

### Step 5: Hooks - Catalogs
- [ ] Crear `app/src/hooks/useCatalogs.ts` (queries + mutations)

### Step 6: Hooks - Analytics
- [ ] Crear `app/src/hooks/useAnalytics.ts` (queries)

### Step 7: Layout Components
- [ ] Crear `app/src/components/layout/Layout.tsx`
- [ ] Crear `app/src/components/layout/Sidebar.tsx`
- [ ] Crear `app/src/components/layout/Header.tsx`

### Step 8: UI Components (shadcn/ui style)
- [ ] Crear `app/src/components/ui/StatusBadge.tsx`
- [ ] Crear `app/src/components/ui/DataTable.tsx`
- [ ] Crear `app/src/components/ui/FilterBar.tsx`
- [ ] Crear `app/src/components/ui/LoadingSpinner.tsx`

### Step 9: Routes - Root & Auth
- [ ] Crear `app/src/routes/__root.tsx` (providers)
- [ ] Crear `app/src/routes/login.tsx` (Clerk SignIn)
- [ ] Crear `app/src/routes/index.tsx` (redirect)
- [ ] Crear `app/src/routes/_authenticated.tsx` (protected layout)

### Step 10: Routes - Dashboard (US-4.1)
- [ ] Crear `app/src/routes/_authenticated/dashboard.tsx`

### Step 11: Routes - Calendar (US-2.1, US-2.2, US-2.3)
- [ ] Crear `app/src/components/calendar/CalendarView.tsx`
- [ ] Crear `app/src/routes/_authenticated/calendar.tsx`

### Step 12: Routes - Visits List (US-3.1-3.7, US-4.2)
- [ ] Crear `app/src/components/visits/VisitForm.tsx`
- [ ] Crear `app/src/components/visits/RescheduleDialog.tsx`
- [ ] Crear `app/src/components/visits/CancelDialog.tsx`
- [ ] Crear `app/src/routes/_authenticated/visits/index.tsx`

### Step 13: Routes - Visit Detail (US-3.4, US-3.5, US-3.7)
- [ ] Crear `app/src/components/visits/VisitDetail.tsx`
- [ ] Crear `app/src/routes/_authenticated/visits/$visitId.tsx`

### Step 14: Routes - Analytics (US-5.1, US-5.2)
- [ ] Crear `app/src/components/analytics/ReasonBarChart.tsx`
- [ ] Crear `app/src/components/analytics/TrendLineChart.tsx`
- [ ] Crear `app/src/routes/_authenticated/analytics.tsx`

### Step 15: Routes - Admin Catalogs (US-6.1, US-6.2, US-6.3)
- [ ] Crear `app/src/routes/_authenticated/admin/catalogs.tsx`

### Step 16: Tests
- [ ] Crear `app/src/__tests__/hooks/useAuth.test.ts`
- [ ] Crear `app/src/__tests__/hooks/useAuth.property.test.ts` (role visibility PBT)
- [ ] Crear `app/src/__tests__/components/StatusBadge.test.tsx`

### Step 17: Vitest Config
- [ ] Crear `app/vitest.config.ts`

### Step 18: Documentation
- [ ] Crear `aidlc-docs/construction/app/code/code-summary.md`
