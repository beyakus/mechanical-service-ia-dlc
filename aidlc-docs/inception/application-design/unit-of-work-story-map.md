# Mapeo de User Stories a Unidades de Trabajo

## Resumen

| Unidad | Stories Asignadas | Cantidad |
|--------|------------------|----------|
| shared | (soporte transversal, no tiene stories propias) | 0 |
| api | US-1.3, US-2.1*, US-2.2*, US-2.3*, US-3.1 a US-3.7, US-4.1*, US-4.2*, US-5.1, US-5.2, US-6.1 a US-6.3 | 17 (backend de todas) |
| app | US-1.1, US-1.2, US-1.3, US-2.1 a US-2.3, US-3.1 a US-3.7, US-4.1, US-4.2, US-5.1, US-5.2, US-6.1 a US-6.3 | 17 (frontend de todas) |
| infra | (soporte de deploy, no tiene stories propias) | 0 |

*Nota: Todas las stories tienen componente frontend (app) y backend (api). shared e infra son unidades de soporte.*

---

## Detalle por Unidad

### Unit 1: shared
No tiene stories asignadas directamente. Provee schemas y types que soportan todas las stories.

**Schemas requeridos por stories**:
- US-3.1 a US-3.7: Visit, CreateVisitInput, RescheduleInput, CancelInput, CompleteInput, FinalizeInput, ReassignInput
- US-6.1 a US-6.3: ServiceType, Reason, Zone, CreateServiceTypeInput, etc.
- US-5.1, US-5.2: AnalyticsFilters, ReasonCount, TrendData
- US-2.1 a US-2.3: CalendarFilters, CalendarVisit
- US-4.1, US-4.2: VisitFilters, PaginatedResult

### Unit 2: api (Backend)

| Story | Endpoints Involucrados |
|-------|----------------------|
| US-1.3 | Auth middleware (todas las rutas) |
| US-2.1, US-2.2 | GET /api/visits/calendar |
| US-2.3 | GET /api/visits/calendar (con filtros) |
| US-3.1 | POST /api/visits |
| US-3.2 | PUT /api/visits/:id/reschedule |
| US-3.3 | PUT /api/visits/:id/cancel |
| US-3.4 | PUT /api/visits/:id/complete |
| US-3.5 | PUT /api/visits/:id/finalize |
| US-3.6 | PUT /api/visits/:id/reassign |
| US-3.7 | GET /api/visits/:id |
| US-4.1 | GET /api/analytics/summary |
| US-4.2 | GET /api/visits (con filtros y paginación) |
| US-5.1 | GET /api/analytics/cancellation-reasons, GET /api/analytics/reschedule-reasons |
| US-5.2 | GET /api/analytics/trends |
| US-6.1 | CRUD /api/catalogs/service-types |
| US-6.2 | CRUD /api/catalogs/reasons |
| US-6.3 | CRUD /api/catalogs/zones |

### Unit 3: app (Frontend)

| Story | Páginas/Componentes Involucrados |
|-------|--------------------------------|
| US-1.1 | Login page, Clerk SignIn |
| US-1.2 | Header logout button, Clerk SignOut |
| US-1.3 | _authenticated layout, role-based route guards |
| US-2.1 | Calendar page - DayView |
| US-2.2 | Calendar page - WeekView |
| US-2.3 | Calendar page - FilterBar |
| US-3.1 | Visits page - VisitForm (crear) |
| US-3.2 | Visits page - RescheduleModal |
| US-3.3 | Visits page - CancelModal |
| US-3.4 | Visits page - VisitDetail (completar) |
| US-3.5 | Visits page - VisitDetail (finalizar) |
| US-3.6 | Visits page - ReassignModal |
| US-3.7 | Visits page - VisitDetail |
| US-4.1 | Dashboard page - summary cards |
| US-4.2 | Visits page - DataTable |
| US-5.1 | Analytics page - ReasonChart |
| US-5.2 | Analytics page - TrendChart |
| US-6.1 | Admin catalogs - service types tab |
| US-6.2 | Admin catalogs - reasons tab |
| US-6.3 | Admin catalogs - zones tab |

### Unit 4: infra
No tiene stories asignadas directamente. Provee la infraestructura para deploy de api y app.

**Soporte a stories**:
- Todas: API Gateway routing, Lambda deployment, S3/CloudFront hosting
- US-1.1, US-1.2, US-1.3: Clerk environment variables
- RNF-02: 3 ambientes (dev/staging/prod)
- RNF-03: GitHub Actions pipeline

---

## Verificación de Cobertura

| Story | shared | api | app | infra |
|-------|--------|-----|-----|-------|
| US-1.1 | — | — | ✅ | ✅ |
| US-1.2 | — | — | ✅ | — |
| US-1.3 | ✅ | ✅ | ✅ | ✅ |
| US-2.1 | ✅ | ✅ | ✅ | — |
| US-2.2 | ✅ | ✅ | ✅ | — |
| US-2.3 | ✅ | ✅ | ✅ | — |
| US-3.1 | ✅ | ✅ | ✅ | — |
| US-3.2 | ✅ | ✅ | ✅ | — |
| US-3.3 | ✅ | ✅ | ✅ | — |
| US-3.4 | ✅ | ✅ | ✅ | — |
| US-3.5 | ✅ | ✅ | ✅ | — |
| US-3.6 | ✅ | ✅ | ✅ | — |
| US-3.7 | ✅ | ✅ | ✅ | — |
| US-4.1 | ✅ | ✅ | ✅ | — |
| US-4.2 | ✅ | ✅ | ✅ | — |
| US-5.1 | ✅ | ✅ | ✅ | — |
| US-5.2 | ✅ | ✅ | ✅ | — |
| US-6.1 | ✅ | ✅ | ✅ | — |
| US-6.2 | ✅ | ✅ | ✅ | — |
| US-6.3 | ✅ | ✅ | ✅ | — |

**Resultado**: 17/17 stories cubiertas. Todas las stories tienen representación en al menos api + app.
