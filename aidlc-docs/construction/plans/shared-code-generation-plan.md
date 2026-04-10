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
- [ ] Crear `shared/package.json` con dependencias y scripts
- [ ] Crear `shared/tsconfig.json` con strict mode
- [ ] Crear estructura de directorios: src/schemas/, src/types/, src/enums/, src/constants/, src/__tests__/generators/

### Step 2: Enums
- [ ] Crear `shared/src/enums/index.ts` con VisitStatus, Role, ReasonType, HistoryChangeType

### Step 3: Zod Schemas - Visit
- [ ] Crear `shared/src/schemas/visit.ts` con:
  - VisitSchema, CreateVisitInputSchema, RescheduleInputSchema, CancelInputSchema
  - CompleteInputSchema, FinalizeInputSchema, ReassignInputSchema
  - CalendarVisitSchema, HistoryEntrySchema

### Step 4: Zod Schemas - Catalog
- [ ] Crear `shared/src/schemas/catalog.ts` con:
  - ServiceTypeSchema, ReasonSchema, ZoneSchema
  - CreateServiceTypeInputSchema, UpdateServiceTypeInputSchema
  - CreateReasonInputSchema, UpdateReasonInputSchema
  - CreateZoneInputSchema, UpdateZoneInputSchema

### Step 5: Zod Schemas - Analytics
- [ ] Crear `shared/src/schemas/analytics.ts` con:
  - AnalyticsFiltersSchema, VisitSummarySchema, ReasonCountSchema, TrendDataSchema

### Step 6: Zod Schemas - API
- [ ] Crear `shared/src/schemas/api.ts` con:
  - PaginatedResultSchema, ApiErrorSchema, VisitFiltersSchema, CalendarFiltersSchema
  - UserContextSchema

### Step 7: Schemas Barrel Export
- [ ] Crear `shared/src/schemas/index.ts` barrel export

### Step 8: Types
- [ ] Crear `shared/src/types/index.ts` con z.infer<> de todos los schemas

### Step 9: Constants
- [ ] Crear `shared/src/constants/transitions.ts` con VALID_TRANSITIONS map
- [ ] Crear `shared/src/constants/permissions.ts` con ROLE_PERMISSIONS map
- [ ] Crear `shared/src/constants/index.ts` barrel export

### Step 10: Main Barrel Export
- [ ] Crear `shared/src/index.ts` que re-exporta schemas, types, enums, constants

### Step 11: PBT Generators
- [ ] Crear `shared/src/__tests__/generators/visit.generator.ts`
- [ ] Crear `shared/src/__tests__/generators/catalog.generator.ts`
- [ ] Crear `shared/src/__tests__/generators/filters.generator.ts`
- [ ] Crear `shared/src/__tests__/generators/index.ts` barrel export

### Step 12: Example-Based Tests
- [ ] Crear `shared/src/__tests__/schemas/visit.test.ts` — tests de validación de Visit schemas
- [ ] Crear `shared/src/__tests__/schemas/catalog.test.ts` — tests de validación de Catalog schemas
- [ ] Crear `shared/src/__tests__/schemas/api.test.ts` — tests de PaginatedResult, filters
- [ ] Crear `shared/src/__tests__/constants/transitions.test.ts` — tests de transiciones válidas

### Step 13: Property-Based Tests
- [ ] Crear `shared/src/__tests__/schemas/visit.property.test.ts` — round-trip, invariants, idempotency
- [ ] Crear `shared/src/__tests__/schemas/api.property.test.ts` — PaginatedResult invariants
- [ ] Crear `shared/src/__tests__/constants/transitions.property.test.ts` — state machine properties

### Step 14: Vitest Config
- [ ] Crear `shared/vitest.config.ts`

### Step 15: Documentation
- [ ] Crear `aidlc-docs/construction/shared/code/code-summary.md` con resumen de archivos generados
