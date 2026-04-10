# Plan de Diseño de Aplicación

## Contexto
Portal de Gestión de Visitas Mecánicas con TanStack Start + Router + Query, React + Tailwind, Clerk, API Gateway + Lambda, TypeScript estricto. 3 roles (técnico, supervisor, admin), 17 user stories, datos mock.

---

## Preguntas de Diseño

### Question 1
¿Cómo prefieres organizar las Lambda functions del backend?

A) Una sola Lambda monolítica con routing interno (más simple, cold start único)
B) Una Lambda por recurso/dominio: visits, catalogs, analytics (balance entre granularidad y simplicidad)
C) Una Lambda por endpoint individual (máxima granularidad, más Lambdas que gestionar)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2
¿Cómo prefieres estructurar el proyecto en el repositorio?

A) Monorepo con carpetas separadas: /app (frontend TanStack), /api (Lambda functions), /infra (IaC)
B) Monorepo con workspaces (pnpm/npm workspaces): packages/app, packages/api, packages/infra
C) Repos separados para frontend, backend e infraestructura
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
¿Qué patrón de comunicación prefieres entre frontend y backend?

A) REST API con endpoints convencionales (GET /visits, POST /visits, etc.)
B) tRPC para type-safety end-to-end entre TanStack y Lambda
C) GraphQL con AppSync o Apollo
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
¿Cómo prefieres manejar la validación de datos compartida entre frontend y backend?

A) Zod schemas compartidos (un paquete shared con los schemas que usan ambos lados)
B) Validación independiente en cada lado (frontend con form validation, backend con su propia validación)
C) OpenAPI spec como fuente de verdad con generación de tipos
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Plan de Ejecución (se ejecutará tras aprobación)

### Fase 1: Definición de Componentes
- [x] Identificar componentes frontend (pages, layouts, shared components)
- [x] Identificar componentes backend (Lambda handlers, servicios, repositorios)
- [x] Identificar componentes de infraestructura (IaC stacks)
- [x] Documentar responsabilidades de cada componente
- [x] Guardar en `aidlc-docs/inception/application-design/components.md`

### Fase 2: Métodos de Componentes
- [x] Definir métodos/endpoints del backend (API contract)
- [x] Definir interfaces de servicios internos
- [x] Definir hooks y queries del frontend (TanStack Query)
- [x] Guardar en `aidlc-docs/inception/application-design/component-methods.md`

### Fase 3: Servicios y Orquestación
- [x] Definir capa de servicios del backend
- [x] Definir patrones de orquestación (cómo los handlers llaman a servicios)
- [x] Definir integración con Clerk (middleware de auth)
- [x] Guardar en `aidlc-docs/inception/application-design/services.md`

### Fase 4: Dependencias entre Componentes
- [x] Mapear dependencias frontend → backend (API calls)
- [x] Mapear dependencias backend internas (handler → service → repository)
- [x] Mapear dependencias de infraestructura
- [x] Guardar en `aidlc-docs/inception/application-design/component-dependency.md`

### Fase 5: Consolidación
- [x] Crear documento consolidado de diseño
- [x] Guardar en `aidlc-docs/inception/application-design/application-design.md`
