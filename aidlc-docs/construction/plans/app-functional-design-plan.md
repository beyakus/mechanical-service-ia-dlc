# Plan de Diseño Funcional - Unit 3: app

## Contexto
Unit app: TanStack Start + Router + Query, React + Tailwind, Clerk auth. 6 páginas principales + login. Depende de shared (schemas/types) y api (REST endpoints).

---

## Preguntas de Diseño Funcional

### Question 1
¿Qué librería de calendario prefieres para las vistas de día y semana?

A) FullCalendar (feature-rich, soporte de día/semana/mes, drag-and-drop)
B) react-big-calendar (más ligero, vistas de día/semana/mes)
C) Componente custom con Tailwind (máximo control, sin dependencia externa)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2
¿Qué librería de gráficas prefieres para el dashboard de analytics?

A) Recharts (declarativo, basado en React, buena integración con Tailwind)
B) Chart.js con react-chartjs-2 (popular, amplio ecosistema)
C) Nivo (basado en D3, componentes React, muy visual)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
¿Prefieres usar una librería de componentes UI base o construir todo con Tailwind puro?

A) shadcn/ui (componentes copiables, Tailwind-native, muy popular)
B) Headless UI + Tailwind (componentes accesibles sin estilos, tú controlas el look)
C) Tailwind puro (sin librería de componentes, todo custom)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Plan de Ejecución

### Fase 1: Frontend Components Design
- [x] Definir jerarquía de componentes y layout structure
- [x] Definir props y state para cada componente principal
- [x] Definir flujos de interacción del usuario por página
- [x] Guardar en `aidlc-docs/construction/app/functional-design/frontend-components.md`

### Fase 2: Business Logic Model (Frontend)
- [x] Definir TanStack Query hooks y cache strategy
- [x] Definir form validation flows con Zod
- [x] Definir routing structure con TanStack Router
- [x] Definir auth flow con Clerk
- [x] Guardar en `aidlc-docs/construction/app/functional-design/business-logic-model.md`

### Fase 3: Business Rules (Frontend)
- [x] Definir reglas de visibilidad por rol (qué ve cada rol en cada página)
- [x] Definir reglas de acciones habilitadas por estado de visita
- [x] Definir reglas de navegación y redirects
- [x] Identificar propiedades testables para PBT (PBT-01)
- [x] Guardar en `aidlc-docs/construction/app/functional-design/business-rules.md`
