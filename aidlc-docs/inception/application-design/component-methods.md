# Métodos de Componentes - Portal de Gestión de Visitas Mecánicas

---

## Backend API Endpoints (REST)

### Visits Lambda (BE-01)

| Method | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | /api/visits | Listar visitas (filtros: estado, técnico, fecha, zona) | Todos |
| GET | /api/visits/:id | Obtener detalle de visita con historial | Todos |
| POST | /api/visits | Crear nueva visita | Supervisor, Admin |
| PUT | /api/visits/:id/reschedule | Reagendar visita (nueva fecha + motivo) | Todos |
| PUT | /api/visits/:id/cancel | Cancelar visita (motivo) | Supervisor, Admin |
| PUT | /api/visits/:id/complete | Marcar como realizada exitosamente (notas) | Técnico |
| PUT | /api/visits/:id/finalize | Finalizar visita tras revisión (notas) | Supervisor, Admin |
| PUT | /api/visits/:id/reassign | Reasignar a otro técnico | Supervisor, Admin |
| GET | /api/visits/calendar | Visitas para calendario (rango de fechas) | Todos |

### Catalogs Lambda (BE-02)

| Method | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | /api/catalogs/service-types | Listar tipos de servicio | Todos |
| POST | /api/catalogs/service-types | Crear tipo de servicio | Admin |
| PUT | /api/catalogs/service-types/:id | Editar tipo de servicio | Admin |
| PUT | /api/catalogs/service-types/:id/toggle | Activar/desactivar | Admin |
| GET | /api/catalogs/reasons | Listar motivos (cancelación/reagendamiento) | Todos |
| POST | /api/catalogs/reasons | Crear motivo | Admin |
| PUT | /api/catalogs/reasons/:id | Editar motivo | Admin |
| PUT | /api/catalogs/reasons/:id/toggle | Activar/desactivar | Admin |
| GET | /api/catalogs/zones | Listar zonas | Todos |
| POST | /api/catalogs/zones | Crear zona | Admin |
| PUT | /api/catalogs/zones/:id | Editar zona | Admin |
| PUT | /api/catalogs/zones/:id/toggle | Activar/desactivar | Admin |

### Analytics Lambda (BE-03)

| Method | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | /api/analytics/summary | Resumen de contadores por estado | Supervisor, Admin |
| GET | /api/analytics/cancellation-reasons | Top motivos de cancelación (filtros) | Supervisor, Admin |
| GET | /api/analytics/reschedule-reasons | Top motivos de reagendamiento (filtros) | Supervisor, Admin |
| GET | /api/analytics/trends | Tendencias en el tiempo (filtros) | Supervisor, Admin |

---

## Backend Service Interfaces

### VisitService
```typescript
interface VisitService {
  list(filters: VisitFilters): Promise<PaginatedResult<Visit>>
  getById(id: string, userId: string, role: Role): Promise<Visit>
  create(data: CreateVisitInput): Promise<Visit>
  reschedule(id: string, data: RescheduleInput): Promise<Visit>
  cancel(id: string, data: CancelInput): Promise<Visit>
  complete(id: string, data: CompleteInput): Promise<Visit>
  finalize(id: string, data: FinalizeInput): Promise<Visit>
  reassign(id: string, data: ReassignInput): Promise<Visit>
  getCalendarData(range: DateRange, filters: CalendarFilters): Promise<CalendarVisit[]>
}
```

### CatalogService
```typescript
interface CatalogService {
  listServiceTypes(includeInactive?: boolean): Promise<ServiceType[]>
  createServiceType(data: CreateServiceTypeInput): Promise<ServiceType>
  updateServiceType(id: string, data: UpdateServiceTypeInput): Promise<ServiceType>
  toggleServiceType(id: string): Promise<ServiceType>
  listReasons(type?: ReasonType, includeInactive?: boolean): Promise<Reason[]>
  createReason(data: CreateReasonInput): Promise<Reason>
  updateReason(id: string, data: UpdateReasonInput): Promise<Reason>
  toggleReason(id: string): Promise<Reason>
  listZones(includeInactive?: boolean): Promise<Zone[]>
  createZone(data: CreateZoneInput): Promise<Zone>
  updateZone(id: string, data: UpdateZoneInput): Promise<Zone>
  toggleZone(id: string): Promise<Zone>
}
```

### AnalyticsService
```typescript
interface AnalyticsService {
  getSummary(filters: AnalyticsFilters): Promise<VisitSummary>
  getCancellationReasons(filters: AnalyticsFilters): Promise<ReasonCount[]>
  getRescheduleReasons(filters: AnalyticsFilters): Promise<ReasonCount[]>
  getTrends(filters: AnalyticsFilters): Promise<TrendData[]>
}
```

---

## Frontend TanStack Query Hooks

### Visit Hooks
```typescript
// Queries
useVisits(filters: VisitFilters): UseQueryResult<PaginatedResult<Visit>>
useVisit(id: string): UseQueryResult<Visit>
useCalendarVisits(range: DateRange, filters: CalendarFilters): UseQueryResult<CalendarVisit[]>

// Mutations
useCreateVisit(): UseMutationResult<Visit, Error, CreateVisitInput>
useRescheduleVisit(): UseMutationResult<Visit, Error, { id: string; data: RescheduleInput }>
useCancelVisit(): UseMutationResult<Visit, Error, { id: string; data: CancelInput }>
useCompleteVisit(): UseMutationResult<Visit, Error, { id: string; data: CompleteInput }>
useFinalizeVisit(): UseMutationResult<Visit, Error, { id: string; data: FinalizeInput }>
useReassignVisit(): UseMutationResult<Visit, Error, { id: string; data: ReassignInput }>
```

### Catalog Hooks
```typescript
useServiceTypes(includeInactive?: boolean): UseQueryResult<ServiceType[]>
useReasons(type?: ReasonType): UseQueryResult<Reason[]>
useZones(includeInactive?: boolean): UseQueryResult<Zone[]>
useCreateServiceType(): UseMutationResult<ServiceType, Error, CreateServiceTypeInput>
useUpdateServiceType(): UseMutationResult<ServiceType, Error, { id: string; data: UpdateServiceTypeInput }>
useToggleServiceType(): UseMutationResult<ServiceType, Error, string>
// ... similar para reasons y zones
```

### Analytics Hooks
```typescript
useAnalyticsSummary(filters: AnalyticsFilters): UseQueryResult<VisitSummary>
useCancellationReasons(filters: AnalyticsFilters): UseQueryResult<ReasonCount[]>
useRescheduleReasons(filters: AnalyticsFilters): UseQueryResult<ReasonCount[]>
useTrends(filters: AnalyticsFilters): UseQueryResult<TrendData[]>
```
