# Instrucciones de Unit Tests

## Ejecutar todos los tests

### Desde root (atajo)
```bash
npm test
```

### Por unidad

#### shared
```bash
cd shared
npm test
```
Tests esperados:
- `schemas/visit.test.ts` — Validación de Visit schemas (accept/reject)
- `schemas/catalog.test.ts` — Validación de Catalog schemas
- `schemas/api.test.ts` — Validación de filters, pagination, errors
- `constants/transitions.test.ts` — Transiciones de estado válidas/inválidas
- `schemas/visit.property.test.ts` — PBT: round-trip, idempotency, invariants
- `schemas/api.property.test.ts` — PBT: pagination invariants, filter date ordering
- `constants/transitions.property.test.ts` — PBT: state machine properties

#### api
```bash
cd api
npm test
```
Tests esperados:
- `services/visit.service.test.ts` — List, getById, role filtering, state transitions
- `services/catalog.service.test.ts` — CRUD, active/inactive filtering
- `services/analytics.service.test.ts` — Summary totals, reason sorting, trend ordering
- `middleware/auth.test.ts` — Token extraction, role checking
- `utils/router.test.ts` — Route matching, path params
- `utils/response.test.ts` — Security headers, error formatting
- `services/visit.service.property.test.ts` — PBT: pagination bounds, role filtering
- `utils/router.property.test.ts` — PBT: route matching invariants

#### app
```bash
cd app
npm test
```
Tests esperados:
- `hooks/useAuth.test.ts` — Role permissions (technician, supervisor, admin)
- `hooks/useAuth.property.test.ts` — PBT: admin superset, manage_catalogs admin-only
- `components/StatusBadge.test.tsx` — Status config completeness

## PBT Seed Logging (PBT-08)

Si un test PBT falla, fast-check muestra el seed en el output:
```
Property failed after X tests
Seed: 123456789
Shrunk 3 time(s)
Counterexample: [...]
```

Para reproducir:
```typescript
fc.assert(fc.property(...), { seed: 123456789 });
```

## Cobertura

```bash
cd shared && npx vitest run --coverage
cd api && npx vitest run --coverage
cd app && npx vitest run --coverage
```

Targets:
- shared: >= 90% líneas y branches
- api: >= 80% líneas para services y middleware
- app: cobertura de hooks y utility functions
