# Plan de Code Generation - Unit 2: api

## Contexto
- Unit: api (3 Lambda handlers, auth middleware, services, mock repository)
- Ubicación: `api/` en workspace root
- Dependencias: shared (schemas, types, enums, constants)
- Tech stack: Node 22, TypeScript 5.4+, esbuild, Clerk Backend SDK, Vitest, fast-check

## Stories implementadas
Backend de todas las stories: US-1.3 (auth), US-2.1-2.3 (calendar), US-3.1-3.7 (visits CRUD), US-4.1-4.2 (dashboard), US-5.1-5.2 (analytics), US-6.1-6.3 (catalogs)

---

## Steps

### Step 1: Project Structure Setup
- [ ] Crear `api/package.json`
- [ ] Crear `api/tsconfig.json`
- [ ] Crear `api/build.mjs` (esbuild script para 3 Lambdas)

### Step 2: Utils - Logger
- [ ] Crear `api/src/utils/logger.ts` (structured JSON logger)

### Step 3: Utils - Response Builder
- [ ] Crear `api/src/utils/response.ts` (buildResponse + buildErrorResponse con security headers)

### Step 4: Utils - Router
- [ ] Crear `api/src/utils/router.ts` (declarative route map matcher con path params)

### Step 5: Utils - Validation
- [ ] Crear `api/src/utils/validation.ts` (Zod parse wrapper con error formatting)

### Step 6: Utils - Errors
- [ ] Crear `api/src/utils/errors.ts` (custom error classes: ValidationError, NotFoundError, ForbiddenError, ConflictError)

### Step 7: Auth Middleware
- [ ] Crear `api/src/middleware/auth.ts` (Clerk JWT verification, UserContext extraction, role check)

### Step 8: Error Handler Middleware
- [ ] Crear `api/src/middleware/error-handler.ts` (global error handler wrapper)

### Step 9: Seed Data
- [ ] Crear `api/src/repositories/seed-data.json` (mock data: visits, service types, reasons, zones, technicians)

### Step 10: Mock Visit Repository
- [ ] Crear `api/src/repositories/mock-visit.repository.ts` (read-only access, filtering, pagination)

### Step 11: Mock Catalog Repository
- [ ] Crear `api/src/repositories/mock-catalog.repository.ts` (read-only access for catalogs)

### Step 12: Visit Service
- [ ] Crear `api/src/services/visit.service.ts` (list, getById, create, reschedule, cancel, complete, finalize, reassign, getCalendarData)

### Step 13: Catalog Service
- [ ] Crear `api/src/services/catalog.service.ts` (CRUD for service types, reasons, zones)

### Step 14: Analytics Service
- [ ] Crear `api/src/services/analytics.service.ts` (summary, cancellation reasons, reschedule reasons, trends)

### Step 15: Visits Lambda Handler
- [ ] Crear `api/src/handlers/visits.ts` (route map + 9 endpoint handlers)

### Step 16: Catalogs Lambda Handler
- [ ] Crear `api/src/handlers/catalogs.ts` (route map + 12 endpoint handlers)

### Step 17: Analytics Lambda Handler
- [ ] Crear `api/src/handlers/analytics.ts` (route map + 4 endpoint handlers)

### Step 18: Example-Based Tests - Services
- [ ] Crear `api/src/__tests__/services/visit.service.test.ts`
- [ ] Crear `api/src/__tests__/services/catalog.service.test.ts`
- [ ] Crear `api/src/__tests__/services/analytics.service.test.ts`

### Step 19: Example-Based Tests - Middleware & Utils
- [ ] Crear `api/src/__tests__/middleware/auth.test.ts`
- [ ] Crear `api/src/__tests__/utils/router.test.ts`
- [ ] Crear `api/src/__tests__/utils/response.test.ts`

### Step 20: Property-Based Tests
- [ ] Crear `api/src/__tests__/services/visit.service.property.test.ts` (state transitions, role filtering)
- [ ] Crear `api/src/__tests__/utils/router.property.test.ts` (route matching invariants)

### Step 21: Vitest Config
- [ ] Crear `api/vitest.config.ts`

### Step 22: Documentation
- [ ] Crear `aidlc-docs/construction/api/code/code-summary.md`
