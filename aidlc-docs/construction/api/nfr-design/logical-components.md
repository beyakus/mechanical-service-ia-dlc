# Logical Components - Unit: api

---

## Módulos

### handlers/
Lambda entry points con route map:
- `visits.ts` — Visits Lambda handler (9 endpoints)
- `catalogs.ts` — Catalogs Lambda handler (12 endpoints)
- `analytics.ts` — Analytics Lambda handler (4 endpoints)

### middleware/
Cross-cutting concerns:
- `auth.ts` — JWT verification, UserContext extraction, role checking
- `error-handler.ts` — Global error handler, error type mapping

### services/
Business logic layer:
- `visit.service.ts` — VisitService (list, getById, create, reschedule, cancel, complete, finalize, reassign, getCalendarData)
- `catalog.service.ts` — CatalogService (CRUD for service types, reasons, zones)
- `analytics.service.ts` — AnalyticsService (summary, cancellation reasons, reschedule reasons, trends)

### repositories/
Data access layer:
- `mock-visit.repository.ts` — Read-only access to visit seed data with filtering
- `mock-catalog.repository.ts` — Read-only access to catalog seed data
- `seed-data.json` — Static JSON with all mock data

### utils/
Shared utilities:
- `logger.ts` — Structured logger (JSON to stdout)
- `response.ts` — Response builder with security headers
- `validation.ts` — Zod parse wrapper with error formatting
- `router.ts` — Declarative route map matcher with path params

---

## Diagrama de Componentes

```
+------------------+     +------------------+     +------------------+
| visits handler   |     | catalogs handler |     | analytics handler|
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         +----------+-------------+-------------+----------+
                    |                           |
              +-----v------+             +------v-----+
              |  router.ts |             |  auth.ts   |
              +-----+------+             +------+-----+
                    |                           |
              +-----v--------------------------v-----+
              |           Service Layer              |
              |  visit.service  catalog.service      |
              |  analytics.service                   |
              +-----+------+------+-----------------+
                    |      |      |
              +-----v------v------v-----+
              |    Repository Layer     |
              |  mock-visit.repository  |
              |  mock-catalog.repository|
              |  seed-data.json         |
              +-------------------------+
                         |
              +----------v----------+
              |    @visits/shared   |
              |  schemas, types,    |
              |  enums, constants   |
              +---------------------+
```

---

## Security Compliance

| SECURITY Rule | Status | Implementation |
|--------------|--------|----------------|
| SECURITY-02 | Compliant | API Gateway access logging (configured in infra) |
| SECURITY-03 | Compliant | Structured logger in utils/logger.ts |
| SECURITY-04 | Compliant | Security headers in utils/response.ts |
| SECURITY-05 | Compliant | Zod validation in utils/validation.ts |
| SECURITY-08 | Compliant | Auth middleware + role-based filtering in services |
| SECURITY-09 | Compliant | Generic error responses in middleware/error-handler.ts |
| SECURITY-10 | Compliant | Lock file, pinned versions |
| SECURITY-11 | Compliant | Auth isolated in middleware/auth.ts, rate limiting in API Gateway |
| SECURITY-12 | Compliant | Clerk handles auth, env vars for keys |
| SECURITY-13 | Compliant | Zod safe deserialization |
| SECURITY-15 | Compliant | Global error handler, fail closed |
| SECURITY-01, 06, 07, 14 | Deferred | Infrastructure unit responsibility |

## PBT Compliance

| PBT Rule | Status | Notes |
|----------|--------|-------|
| PBT-01 | Compliant | Properties identified in domain-entities.md |
| PBT-09 | Compliant | fast-check selected |
| PBT-02 to PBT-08, PBT-10 | Deferred | Enforced during Code Generation |
