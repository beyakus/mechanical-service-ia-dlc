# NFR Design Patterns - Unit: shared

## Alcance
Unit shared es una librería sin infraestructura propia. Los patrones NFR aplican a validación, testing y estructura de código.

---

## Pattern 1: Schema-First Validation (SECURITY-05)

**Problema**: Garantizar que todo input sea validado antes de procesarse en frontend y backend.

**Patrón**: Zod schemas como single source of truth. Cada schema define:
- Tipos estrictos con `z.string()`, `z.number()`, etc.
- Longitudes máximas con `.max()`
- Formatos con `.regex()` o `.uuid()`
- Refinements para reglas cross-field (ej: startDate <= endDate)

**Aplicación**:
- Frontend: validación de formularios con `schema.safeParse()`
- Backend: validación de request body con `schema.parse()` (throws on invalid)
- Ambos importan el mismo schema desde shared

---

## Pattern 2: Type Inference from Schemas

**Problema**: Mantener tipos TypeScript sincronizados con schemas de validación.

**Patrón**: Derivar tipos con `z.infer<typeof schema>` en lugar de definir interfaces manualmente.

**Beneficio**: Cambios en el schema se propagan automáticamente a los tipos. Zero drift entre validación y tipado.

---

## Pattern 3: Layered Test Strategy (PBT-10)

**Problema**: Garantizar cobertura completa con tests que sirvan diferentes propósitos.

**Patrón**: Dos capas de testing separadas:
- `*.test.ts` — Example-based tests: casos específicos, edge cases conocidos, regression tests
- `*.property.test.ts` — Property-based tests: invariantes generales, round-trips, idempotencia

**Regla**: Business-critical paths tienen AMBOS tipos de test. PBT nunca es el único test para un path crítico.

---

## Pattern 4: Centralized Domain Generators (PBT-07)

**Problema**: Evitar generadores duplicados y asegurar inputs realistas en PBT.

**Patrón**: Generadores centralizados en `shared/src/__tests__/generators/`:
- `visitArbitrary()` — genera Visit válidos con constraints de negocio
- `serviceTypeArbitrary()` — genera ServiceType válidos
- `reasonArbitrary()` — genera Reason válidos
- `filtersArbitrary()` — genera filtros válidos (fechas ordenadas, UUIDs válidos)

**Regla**: Generadores respetan constraints de negocio (fechas futuras, strings con longitud válida, UUIDs v4).

---

## Pattern 5: Deterministic PBT Execution (PBT-08)

**Problema**: PBT failures deben ser reproducibles en CI y localmente.

**Patrón**:
- fast-check configurado con `seed` logging en cada run
- CI usa seed fijo para determinismo O log del seed random en cada run
- Vitest reporter configurado para mostrar seed en failures
- Shrinking habilitado (default de fast-check, no se desactiva)

---

## Pattern 6: Enum-Driven State Machine Validation

**Problema**: Garantizar que las transiciones de estado de visita sean válidas.

**Patrón**: Mapa de transiciones válidas como constante exportada:
```
VALID_TRANSITIONS: Record<VisitStatus, VisitStatus[]>
```
- Usado por el backend para validar transiciones
- Usado por el frontend para mostrar/ocultar acciones según estado
- Testable con PBT: para cualquier estado, solo las transiciones del mapa son válidas

---

## Patrones N/A para shared

| Patrón | Razón N/A |
|--------|-----------|
| Resilience (retry, circuit breaker) | shared no hace I/O |
| Scalability (auto-scaling, sharding) | shared es una librería, no un servicio |
| Performance (caching, connection pooling) | shared no tiene runtime propio |
| Security (auth, encryption, rate limiting) | shared no tiene endpoints ni datos persistidos |
| Monitoring (logging, alerting) | shared no tiene runtime propio |
