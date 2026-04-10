# Plan de Diseño Funcional - Unit 1: shared

## Contexto
Unit shared contiene Zod schemas, TypeScript types y enums compartidos entre frontend y backend. Define el modelo de dominio y las reglas de validación.

---

## Preguntas de Diseño Funcional

### Question 1
¿Qué formato de ID prefieres para las entidades (visitas, catálogos, etc.)?

A) UUID v4 (ej: "550e8400-e29b-41d4-a716-446655440000")
B) ULID (ordenable por tiempo, ej: "01ARZ3NDEKTSV4RRFFQ69G5FAV")
C) Prefixed IDs (ej: "visit_abc123", "stype_xyz789") — más legibles en logs
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Para el historial de cambios de una visita, ¿qué nivel de detalle quieres registrar?

A) Básico: solo tipo de cambio, fecha, usuario (ej: "reagendada por Carlos el 2026-04-09")
B) Detallado: tipo de cambio + valores anteriores y nuevos (ej: "fecha cambiada de 2026-04-09 a 2026-04-15 por Carlos")
C) Completo: lo anterior + snapshot del estado completo de la visita en cada cambio
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
¿Cómo quieres manejar la paginación en las respuestas de API?

A) Offset-based (page + pageSize, ej: ?page=2&pageSize=20)
B) Cursor-based (cursor + limit, ej: ?cursor=abc123&limit=20)
C) Ambos disponibles según el endpoint
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Plan de Ejecución

### Fase 1: Domain Entities
- [x] Definir entidad Visit con todos sus campos y tipos
- [x] Definir entidades de catálogos: ServiceType, Reason, Zone
- [x] Definir entidad User/UserContext (datos del usuario autenticado)
- [x] Definir entidad HistoryEntry (historial de cambios)
- [x] Definir enums: VisitStatus, Role, ReasonType
- [x] Documentar relaciones entre entidades
- [x] Guardar en `aidlc-docs/construction/shared/functional-design/domain-entities.md`

### Fase 2: Business Rules
- [x] Definir reglas de transición de estados de visita
- [x] Definir reglas de permisos por rol (quién puede hacer qué)
- [x] Definir reglas de validación de datos (campos obligatorios, formatos, rangos)
- [x] Definir reglas de catálogos (no eliminar con visitas asociadas, toggle activo/inactivo)
- [x] Definir reglas de filtrado por rol (técnico ve las suyas, supervisor su zona, admin todo)
- [x] Guardar en `aidlc-docs/construction/shared/functional-design/business-rules.md`

### Fase 3: Business Logic Model
- [x] Definir Zod schemas de input (Create, Reschedule, Cancel, Complete, Finalize, Reassign)
- [x] Definir Zod schemas de output (Visit, PaginatedResult, ApiError)
- [x] Definir Zod schemas de filtros (VisitFilters, CalendarFilters, AnalyticsFilters)
- [x] Definir Zod schemas de catálogos (CRUD inputs/outputs)
- [x] Identificar propiedades testables para PBT (PBT-01)
- [x] Guardar en `aidlc-docs/construction/shared/functional-design/business-logic-model.md`
