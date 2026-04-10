# Plan de Code Generation - Unit 1: shared

## Contexto
- Unit: shared (librería de Zod schemas, types, enums, constants)
- Ubicación: `shared/` en workspace root
- Dependencias: ninguna (es la base del monorepo)
- Tech stack: TypeScript 5.4+, Zod 3.23+, Vitest 2.0+, fast-check 3.0+, Node 22 LTS

## Stories soportadas
shared no implementa stories directamente pero provee schemas y types para todas (US-1.1 a US-6.3).

---

## Steps

### Step 1: Project Structure Setup
- [x] Crear `shared/package.json` con dependencias y scripts
- [x] Crear `shared/tsconfig.json` con strict mode
- [x] Crear estructura de directorios: src/schemas/, src/types/, src/enums/, src/constants/, src/__tests__/generators/

### Step 2: Enums
- [x] Crear `shared/src/enums/index.ts` con VisitStatus, Role, ReasonType, HistoryChangeType

### Step 3: Zod Schemas - Visit
- [x] Crear `shared/src/schemas/visit.ts` con:
  - VisitSchema, CreateVisitInputSchema, RescheduleInputSchema, CancelInputSchema
  - CompleteInputSchema, FinalizeInputSchema, ReassignInputSchema
  - CalendarVisitSchema, HistoryEntrySchema

### Step 4: Zod Schemas - Catalog
- [x] Crear `shared/src/schemas/catalog.ts` con:
  - ServiceTypeSchema, ReasonSchema, ZoneSchema
  - CreateServiceTypeInputSchema, UpdateServiceTypeInputSchema
  - CreateReasonInputSchema, UpdateReasonInputSchema
  - CreateZoneInputSchema, UpdateZoneInputSchema

### Step 5: Zod Schemas - Analytics
- [x] Crear `shared/src/schemas/analytics.ts` con:
  - AnalyticsFiltersSchema, VisitSummarySchema, ReasonCountSchema, TrendDataSchema

### Step 6: Zod Schemas - API
- [x] Crear `shared/src/schemas/api.ts` con:
  - PaginatedResultSchema, ApiErrorSchema, VisitFiltersSchema, CalendarFiltersSchema
  - UserContextSchema

### Step 7: Schemas Barrel Export
- [x] Crear `shared/src/schemas/index.ts` barrel export

### Step 8: Types
- [x] Crear `shared/src/types/index.ts` con z.infer<> de todos los schemas

### Step 9: Constants
- [x] Crear `shared/src/constants/transitions.ts` con VALID_TRANSITIONS map
- [x] Crear `shared/src/constants/permissions.ts` con ROLE_PERMISSIONS map
- [x] Crear `shared/src/constants/index.ts` barrel export

### Step 10: Main Barrel Export
- [x] Crear `shared/src/index.ts` que re-exporta schemas, types, enums, constants

### Step 11: PBT Generators
- [x] Crear `shared/src/__tests__/generators/visit.generator.ts`
- [x] Crear `shared/src/__tests__/generators/catalog.generator.ts`
- [x] Crear `shared/src/__tests__/generators/filters.generator.ts`
- [x] Crear `shared/src/__tests__/generators/index.ts` barrel export

### Step 12: Example-Based Tests
- [x] Crear `shared/src/__tests__/schemas/visit.test.ts` — tests de validación de Visit schemas
- [x] Crear `shared/src/__tests__/schemas/catalog.test.ts` — tests de validación de Catalog schemas
- [x] Crear `shared/src/__tests__/schemas/api.test.ts` — tests de PaginatedResult, filters
- [x] Crear `shared/src/__tests__/constants/transitions.test.ts` — tests de transiciones válidas

### Step 13: Property-Based Tests
- [x] Crear `shared/src/__tests__/schemas/visit.property.test.ts` — round-trip, invariants, idempotency
- [x] Crear `shared/src/__tests__/schemas/api.property.test.ts` — PaginatedResult invariants
- [x] Crear `shared/src/__tests__/constants/transitions.property.test.ts` — state machine properties

### Step 14: Vitest Config
- [x] Crear `shared/vitest.config.ts`

### Step 15: Documentation
- [x] Crear `aidlc-docs/construction/shared/code/code-summary.md` con resumen de archivos generados
