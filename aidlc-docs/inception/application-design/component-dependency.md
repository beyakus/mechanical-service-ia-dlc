# Dependencias entre Componentes

---

## Diagrama de Dependencias

```
+------------------+     +------------------+     +------------------+
|   app/ (FE)      |---->|   shared/        |<----|   api/ (BE)      |
|                  |     |   Zod Schemas    |     |                  |
|  FE-01: Layout   |     |   TS Types       |     |  BE-01: Visits   |
|  FE-02: Auth     |     +------------------+     |  BE-02: Catalogs |
|  FE-03: Calendar |                              |  BE-03: Analytics|
|  FE-04: Visits   |------- REST API ------------>|  BE-04: Auth MW  |
|  FE-05: Dashboard|     (API Gateway)            |  BE-05: Mock Repo|
|  FE-06: Analytics|                              +------------------+
|  FE-07: Admin    |                                       |
|  FE-08: Shared UI|                                       v
+------------------+                              +------------------+
        |                                         |   infra/         |
        v                                         |                  |
+------------------+                              |  IN-01: API Stack|
|   Clerk          |                              |  IN-02: Auth     |
|   (Auth SaaS)    |<----------------------------|  IN-03: FE Stack |
+------------------+                              |  IN-04: Env Cfg  |
                                                  +------------------+
```

---

## Matriz de Dependencias

| Componente | Depende de | Tipo |
|------------|-----------|------|
| FE-01 Layout | Clerk SDK, TanStack Router | Runtime |
| FE-02 Auth | Clerk React SDK | Runtime |
| FE-03 Calendar | TanStack Query, BE-01 (API), SH-01 (types) | Runtime |
| FE-04 Visits | TanStack Query, BE-01 (API), BE-02 (API), SH-01 | Runtime |
| FE-05 Dashboard | TanStack Query, BE-03 (API), SH-01 | Runtime |
| FE-06 Analytics | TanStack Query, BE-03 (API), SH-01 | Runtime |
| FE-07 Admin | TanStack Query, BE-02 (API), SH-01 | Runtime |
| FE-08 Shared UI | Tailwind CSS | Build |
| BE-01 Visits | BE-04 (Auth MW), BE-05 (Mock Repo), SH-01 | Runtime |
| BE-02 Catalogs | BE-04 (Auth MW), BE-05 (Mock Repo), SH-01 | Runtime |
| BE-03 Analytics | BE-04 (Auth MW), BE-05 (Mock Repo), SH-01 | Runtime |
| BE-04 Auth MW | Clerk Backend SDK | Runtime |
| BE-05 Mock Repo | SH-01 (Zod schemas) | Runtime |
| SH-01 Schemas | Zod | Build |
| IN-01 API Stack | BE-01, BE-02, BE-03 (Lambda code) | Deploy |
| IN-02 Auth Stack | Clerk (external config) | Deploy |
| IN-03 FE Stack | app/ (build output) | Deploy |

---

## Flujo de Datos por Feature

### Calendario (FE-03 → BE-01)
```
FE-03 Calendar Page
  → useCalendarVisits(dateRange, filters)
    → GET /api/visits/calendar?start=...&end=...&technician=...
      → BE-01 Visits Lambda
        → BE-04 Auth MW (verify token, extract role)
        → VisitService.getCalendarData()
          → BE-05 MockVisitRepository.findByDateRange()
        → Response: CalendarVisit[]
```

### Gestión de Visitas (FE-04 → BE-01, BE-02)
```
FE-04 Visits Page
  → useVisits(filters) → GET /api/visits → BE-01
  → useReasons() → GET /api/catalogs/reasons → BE-02
  → useRescheduleVisit() → PUT /api/visits/:id/reschedule → BE-01
  → useCancelVisit() → PUT /api/visits/:id/cancel → BE-01
```

### Analytics (FE-06 → BE-03)
```
FE-06 Analytics Page
  → useCancellationReasons(filters) → GET /api/analytics/cancellation-reasons → BE-03
  → useRescheduleReasons(filters) → GET /api/analytics/reschedule-reasons → BE-03
  → useTrends(filters) → GET /api/analytics/trends → BE-03
```
