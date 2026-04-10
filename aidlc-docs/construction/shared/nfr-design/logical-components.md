# Logical Components - Unit: shared

## Alcance
Unit shared no tiene componentes de infraestructura. Los "logical components" son módulos de código organizados por responsabilidad.

---

## Módulos

### schemas/
Zod schemas organizados por dominio:
- `visit.ts` — Visit, CreateVisitInput, RescheduleInput, CancelInput, CompleteInput, FinalizeInput, ReassignInput, CalendarVisit
- `catalog.ts` — ServiceType, Reason, Zone + CRUD inputs
- `analytics.ts` — AnalyticsFilters, VisitSummary, ReasonCount, TrendData
- `api.ts` — PaginatedResult, ApiError, VisitFilters, CalendarFilters
- `index.ts` — barrel export

### types/
TypeScript types derivados de schemas:
- `index.ts` — `z.infer<>` de todos los schemas, re-exportados con nombres limpios

### enums/
Enumeraciones del dominio:
- `index.ts` — VisitStatus, Role, ReasonType, HistoryChangeType

### constants/
Constantes de negocio:
- `transitions.ts` — VALID_TRANSITIONS map (estado → estados destino válidos)
- `permissions.ts` — ROLE_PERMISSIONS map (rol → acciones permitidas)

### __tests__/
Testing infrastructure:
- `generators/` — Generadores de fast-check centralizados (PBT-07)
  - `visit.generator.ts`
  - `catalog.generator.ts`
  - `filters.generator.ts`
- `schemas/*.test.ts` — Example-based tests
- `schemas/*.property.test.ts` — Property-based tests

---

## Diagrama de Módulos

```
shared/src/
+------------------+
|    index.ts      |  <-- barrel export principal
+--------+---------+
         |
    +----+----+----+----+
    |         |         |
+---v---+ +---v---+ +---v---+
|schemas| | types | | enums |
+---+---+ +---+---+ +---+---+
    |         |         |
    |    (z.infer)      |
    +------>--+---------+
              |
         +---v------+
         |constants  |
         +-----------+
```

## Security Compliance

| SECURITY Rule | Status | Notes |
|--------------|--------|-------|
| SECURITY-01 | N/A | No data stores |
| SECURITY-02 | N/A | No network intermediaries |
| SECURITY-03 | N/A | No runtime logging (library) |
| SECURITY-04 | N/A | No HTTP endpoints |
| SECURITY-05 | Compliant | Zod schemas enforce input validation |
| SECURITY-06 | N/A | No IAM policies |
| SECURITY-07 | N/A | No network config |
| SECURITY-08 | N/A | No endpoints |
| SECURITY-09 | N/A | No deployed components |
| SECURITY-10 | Compliant | Lock file, pinned versions |
| SECURITY-11 | Compliant | Validation logic isolated in dedicated module |
| SECURITY-12 | N/A | No authentication |
| SECURITY-13 | Compliant | Zod provides safe deserialization |
| SECURITY-14 | N/A | No runtime monitoring |
| SECURITY-15 | N/A | No runtime error handling (library) |

## PBT Compliance

| PBT Rule | Status | Notes |
|----------|--------|-------|
| PBT-01 | Compliant | Properties identified in business-logic-model.md |
| PBT-07 | Compliant | Centralized generators in __tests__/generators/ |
| PBT-08 | Compliant | Seed logging, shrinking enabled |
| PBT-09 | Compliant | fast-check selected and documented |
| PBT-10 | Compliant | Separate test files for example-based and PBT |
| PBT-02 to PBT-06 | Deferred | Enforced during Code Generation |
