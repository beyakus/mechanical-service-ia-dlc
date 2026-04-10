# Plan de Generación de User Stories

## Metodología y Enfoque

Este plan define cómo se generarán las user stories para el Portal de Gestión de Visitas Mecánicas.

---

## Preguntas de Clarificación

Por favor responde cada pregunta llenando la letra después del tag [Answer]:

### Question 1
¿Cómo prefieres que se organicen las user stories?

A) Por persona/rol — agrupadas por empleado, supervisor, admin
B) Por feature — agrupadas por calendario, dashboard, analytics, gestión de visitas
C) Por flujo de usuario — agrupadas por journeys completos (ej: "agendar y completar una visita")
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2
¿Qué nivel de granularidad prefieres para las stories?

A) Épicas grandes — pocas stories amplias que cubran funcionalidades completas (ej: "Como empleado, quiero gestionar mis visitas")
B) Stories medianas — funcionalidades desglosadas en acciones concretas (ej: "Como empleado, quiero reagendar una visita")
C) Stories finas — cada interacción como story individual (ej: "Como empleado, quiero seleccionar una nueva fecha al reagendar")
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3
¿El supervisor tiene capacidad de modificar visitas de otros técnicos (reagendar, cancelar) o solo puede visualizar?

A) Solo visualización — el supervisor ve todo pero no modifica
B) Visualización + modificación — el supervisor puede reagendar/cancelar visitas de su equipo
C) Visualización + modificación + asignación — además puede reasignar visitas entre técnicos
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 4
¿El admin gestiona la configuración del sistema (tipos de servicio, motivos de cancelación, zonas)?

A) Sí — el admin configura catálogos del sistema (tipos de servicio, motivos, zonas)
B) No — los catálogos son fijos por ahora, se configuran en código
C) Parcial — solo algunos catálogos son configurables por admin
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
¿Cómo se notifica a un técnico cuando le asignan, reagendan o cancelan una visita?

A) No hay notificaciones por ahora — el técnico revisa el portal manualmente
B) Notificaciones in-app — badges o alertas dentro del portal
C) Notificaciones externas — email o push notifications
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
Para las fotos/evidencia y firma del cliente, ¿esto es funcionalidad del MVP o es para una fase futura?

A) MVP — debe estar desde el inicio
B) Fase futura — por ahora solo datos de texto, fotos y firma se agregan después
C) Parcial — fotos sí, firma no (o viceversa)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Plan de Ejecución (se ejecutará tras aprobación)

### Fase 1: Generación de Personas
- [x] Definir persona: Técnico Mecánico (empleado)
- [x] Definir persona: Supervisor de Zona
- [x] Definir persona: Administrador del Sistema
- [x] Documentar características, motivaciones y pain points de cada persona
- [x] Guardar en `aidlc-docs/inception/user-stories/personas.md`

### Fase 2: Generación de User Stories
- [x] Generar stories de autenticación y acceso (login, logout, rutas protegidas por rol)
- [x] Generar stories de calendario (vista día/semana, navegación, filtros)
- [x] Generar stories de gestión de visitas (crear, reagendar, cancelar, cambiar estado)
- [x] Generar stories de dashboard y tablas (resumen, listados, filtros)
- [x] Generar stories de analytics (motivos de cancelación, tendencias, métricas)
- [x] Generar stories de administración (según respuesta Q4)
- [x] Aplicar criterios INVEST a cada story
- [x] Incluir acceptance criteria por story
- [x] Mapear stories a personas
- [x] Guardar en `aidlc-docs/inception/user-stories/stories.md`

### Fase 3: Validación
- [x] Verificar cobertura de todos los requisitos funcionales (RF-01 a RF-07)
- [x] Verificar que cada persona tiene stories asignadas
- [x] Verificar criterios de aceptación son testables
