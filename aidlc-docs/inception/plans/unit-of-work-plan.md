# Plan de Unidades de Trabajo

## Contexto
Monorepo con /app, /api, /shared, /infra. REST API con 3 Lambdas por dominio. Zod schemas compartidos. 17 user stories, 3 personas.

---

## Preguntas de Descomposición

### Question 1
¿En qué orden prefieres que se desarrollen las unidades?

A) Shared → Backend → Frontend → Infra (bottom-up: primero la base, luego lo que depende de ella)
B) Shared → Frontend → Backend → Infra (frontend-first: UI temprana para feedback visual)
C) Shared + Infra en paralelo → Backend → Frontend (infra-first: ambientes listos desde el inicio)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
¿Prefieres que el frontend y backend se desarrollen como unidades separadas o como una sola unidad fullstack?

A) Unidades separadas: una unidad por capa (shared, app, api, infra) — más modular, permite trabajo paralelo
B) Una sola unidad fullstack que incluya todo — más simple, menos overhead de coordinación
C) Dos unidades: una "core" (shared + api + infra) y una "ui" (app) — balance entre modularidad y simplicidad
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Plan de Ejecución (se ejecutará tras aprobación)

### Fase 1: Definición de Unidades
- [x] Definir unidades de trabajo según respuestas
- [x] Asignar componentes del Application Design a cada unidad
- [x] Documentar responsabilidades y alcance de cada unidad
- [x] Guardar en `aidlc-docs/inception/application-design/unit-of-work.md`

### Fase 2: Dependencias entre Unidades
- [x] Mapear dependencias entre unidades
- [x] Definir orden de ejecución
- [x] Identificar puntos de integración
- [x] Guardar en `aidlc-docs/inception/application-design/unit-of-work-dependency.md`

### Fase 3: Mapeo de Stories a Unidades
- [x] Asignar cada user story (US-1.1 a US-6.3) a su unidad correspondiente
- [x] Verificar cobertura completa (todas las stories asignadas)
- [x] Guardar en `aidlc-docs/inception/application-design/unit-of-work-story-map.md`

### Fase 4: Validación
- [x] Verificar que todas las stories están asignadas
- [x] Verificar que las dependencias son coherentes con el orden de ejecución
- [x] Verificar que cada unidad tiene un alcance manejable
