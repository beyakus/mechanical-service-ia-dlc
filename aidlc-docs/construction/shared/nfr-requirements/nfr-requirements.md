# NFR Requirements - Unit: shared

## Alcance
Unit shared es una librería de schemas, types y enums. No tiene infraestructura, endpoints ni UI. Los NFR aplican a calidad de código, testing y compatibilidad.

---

## NFR-SH-01: Calidad de Código
- TypeScript strict mode habilitado (`strict: true` en tsconfig.json)
- ESLint con reglas estrictas para TypeScript
- Prettier para formateo consistente
- Zero warnings policy en CI

## NFR-SH-02: Testing
- Vitest como test runner
- fast-check como PBT framework (PBT-09 compliance)
- Cobertura mínima: 90% de líneas y branches para schemas y business rules
- Tests separados: example-based (`*.test.ts`) y property-based (`*.property.test.ts`) (PBT-10 compliance)
- Seed logging habilitado en fast-check para reproducibilidad (PBT-08 compliance)

## NFR-SH-03: Compatibilidad
- Node.js >= 22 LTS
- TypeScript >= 5.4
- Zod >= 3.23
- Exportaciones ESM y CJS (dual package)

## NFR-SH-04: Mantenibilidad
- Cada schema en su propio archivo (visit.ts, catalog.ts, analytics.ts, api.ts)
- Barrel exports via index.ts
- JSDoc comments en schemas y types exportados
- Generadores de PBT centralizados y reutilizables (PBT-07 compliance)

## NFR-SH-05: Seguridad (SECURITY-05 compliance)
- Todos los schemas incluyen validación de longitud máxima en strings
- Todos los schemas incluyen validación de formato en campos estructurados (UUID, fechas, emails)
- No se permite input sin validar — Zod es la primera línea de defensa

## NFR-SH-06: Integridad de Datos (SECURITY-13 compliance)
- Zod schemas como safe deserialization — no se acepta data sin parsear
- Schemas son la single source of truth para validación en frontend y backend
