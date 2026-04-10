# Plan de Diseño Funcional - Unit 2: api

## Contexto
Unit api contiene 3 Lambda handlers (visits, catalogs, analytics), auth middleware, service layer y mock data repository. 25 endpoints REST. Depende de shared para schemas y types.

---

## Preguntas de Diseño Funcional

### Question 1
¿Cómo prefieres manejar el routing interno dentro de cada Lambda?

A) Switch/case manual sobre el path y method del evento de API Gateway
B) Un micro-framework ligero como hono o itty-router para routing dentro de Lambda
C) Mapeo declarativo con un objeto de rutas (path → handler function)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 2
¿Cómo quieres estructurar los datos mock? 

A) Archivo JSON estático con datos seed que se carga al iniciar la Lambda (stateless entre invocaciones)
B) In-memory store mutable que persiste durante el ciclo de vida de la Lambda (warm invocations mantienen estado)
C) Datos generados dinámicamente en cada request (sin persistencia)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Plan de Ejecución

### Fase 1: Business Logic Model
- [x] Definir flujo de request handling: API Gateway event → handler → auth → validation → service → repository → response
- [x] Definir error handling strategy (error types, HTTP status codes, error response format)
- [x] Definir logging strategy (structured logs, correlation IDs)
- [x] Guardar en `aidlc-docs/construction/api/functional-design/business-logic-model.md`

### Fase 2: Business Rules (API-specific)
- [x] Definir reglas de autorización por endpoint (qué rol puede acceder a qué)
- [x] Definir reglas de filtrado de datos por rol (técnico ve sus visitas, supervisor su zona, admin todo)
- [x] Definir reglas de reagendamiento (crear nueva visita + marcar original como rescheduled)
- [x] Definir reglas de mock data (seed data structure, reset behavior)
- [x] Guardar en `aidlc-docs/construction/api/functional-design/business-rules.md`

### Fase 3: Domain Entities (API-specific)
- [x] Definir estructura del API Gateway event (request parsing)
- [x] Definir estructura de response (success y error)
- [x] Definir estructura del mock data store
- [x] Identificar propiedades testables para PBT (PBT-01)
- [x] Guardar en `aidlc-docs/construction/api/functional-design/domain-entities.md`
