# User Stories - Portal de Gestión de Visitas Mecánicas

Organizadas por feature (Q1=B), granularidad media (Q2=B).
Mapeo de personas: Carlos (Técnico), Laura (Supervisora), Miguel (Admin).

---

## Feature 1: Autenticación y Acceso

### US-1.1: Inicio de sesión
**Como** cualquier usuario del portal
**Quiero** iniciar sesión con mis credenciales vía Clerk
**Para** acceder al portal de forma segura

**Personas**: Carlos, Laura, Miguel

**Criterios de aceptación**:
- El usuario puede iniciar sesión con email/contraseña vía Clerk
- Tras login exitoso, se redirige al dashboard correspondiente a su rol
- Credenciales inválidas muestran mensaje de error genérico
- La sesión se mantiene activa según configuración de Clerk

### US-1.2: Cierre de sesión
**Como** cualquier usuario autenticado
**Quiero** cerrar mi sesión de forma segura
**Para** proteger mi cuenta cuando termino de usar el portal

**Personas**: Carlos, Laura, Miguel

**Criterios de aceptación**:
- Botón de logout visible en el layout principal
- Al cerrar sesión, se invalida la sesión y redirige a la página de login
- No se puede acceder a rutas protegidas después del logout

### US-1.3: Rutas protegidas por rol
**Como** administrador del sistema
**Quiero** que las rutas estén protegidas según el rol del usuario
**Para** que cada usuario solo acceda a las funcionalidades permitidas

**Personas**: Miguel (configura), Carlos/Laura (afectados)

**Criterios de aceptación**:
- Técnico: accede a calendario, sus visitas, dashboard personal
- Supervisor: accede a todo lo del técnico + visitas de equipo + reasignación + analytics de zona
- Admin: acceso completo incluyendo configuración de catálogos y analytics global
- Acceso a ruta no autorizada redirige a página de acceso denegado

---

## Feature 2: Calendario de Visitas

### US-2.1: Vista de día en calendario
**Como** técnico mecánico
**Quiero** ver mis visitas programadas para un día específico en formato calendario
**Para** planificar mi jornada de trabajo

**Personas**: Carlos, Laura

**Criterios de aceptación**:
- El calendario muestra las visitas del día seleccionado
- Cada visita muestra: hora, cliente/ubicación, tipo de servicio, estado (con color)
- Se puede navegar al día anterior/siguiente
- El técnico ve solo sus visitas; el supervisor ve las de todo su equipo

### US-2.2: Vista de semana en calendario
**Como** técnico mecánico
**Quiero** ver mis visitas programadas para la semana completa
**Para** tener visibilidad de mi carga de trabajo semanal

**Personas**: Carlos, Laura

**Criterios de aceptación**:
- El calendario muestra los 7 días de la semana con visitas distribuidas
- Se puede navegar a la semana anterior/siguiente
- Indicadores visuales de estado por visita (colores/badges)
- Click en una visita abre el detalle

### US-2.3: Filtrado de calendario
**Como** supervisora de zona
**Quiero** filtrar las visitas del calendario por técnico, equipo o estado
**Para** enfocarme en la información relevante

**Personas**: Laura, Miguel

**Criterios de aceptación**:
- Filtros disponibles: técnico, equipo, estado de visita
- Los filtros se aplican en tiempo real sobre la vista actual
- Se pueden combinar múltiples filtros
- Opción de limpiar todos los filtros

---

## Feature 3: Gestión de Visitas

### US-3.1: Crear nueva visita
**Como** supervisora de zona
**Quiero** crear una nueva visita mecánica asignándola a un técnico o equipo
**Para** programar el servicio al cliente

**Personas**: Laura, Miguel

**Criterios de aceptación**:
- Formulario con campos: fecha, hora, cliente/ubicación, técnico o equipo asignado, tipo de servicio, descripción del problema
- Validación de campos obligatorios
- La visita se crea con estado "Programada"
- Confirmación visual tras creación exitosa

### US-3.2: Reagendar visita
**Como** técnico mecánico
**Quiero** solicitar el reagendamiento de una visita programada indicando el motivo
**Para** mover la visita a una fecha en la que pueda asistir

**Personas**: Carlos, Laura, Miguel

**Criterios de aceptación**:
- Se puede reagendar solo visitas en estado "Programada"
- Se debe seleccionar nueva fecha/hora
- Se debe indicar motivo de reagendamiento (selección de catálogo)
- El estado cambia a "Reagendada" y se crea nueva visita con la nueva fecha en estado "Programada"
- Se registra en el historial de cambios

### US-3.3: Cancelar visita
**Como** supervisora de zona
**Quiero** cancelar una visita programada indicando el motivo
**Para** liberar al técnico cuando el servicio ya no es necesario

**Personas**: Laura, Miguel

**Criterios de aceptación**:
- Se puede cancelar solo visitas en estado "Programada" o "Reagendada"
- Se debe indicar motivo de cancelación (selección de catálogo)
- El estado cambia a "Cancelada"
- Se registra en el historial de cambios

### US-3.4: Completar visita
**Como** técnico mecánico
**Quiero** marcar una visita como realizada exitosamente y agregar notas
**Para** registrar que el servicio fue completado

**Personas**: Carlos

**Criterios de aceptación**:
- Se puede completar solo visitas en estado "Programada"
- Se pueden agregar notas del servicio realizado
- El estado cambia a "Realizada exitosamente"
- Se registra fecha/hora de completado

### US-3.5: Finalizar visita
**Como** supervisora de zona
**Quiero** finalizar formalmente una visita realizada tras revisión
**Para** cerrar el ciclo de la visita

**Personas**: Laura, Miguel

**Criterios de aceptación**:
- Se puede finalizar solo visitas en estado "Realizada exitosamente"
- El supervisor puede agregar notas de revisión
- El estado cambia a "Finalizada exitosamente"
- Se registra en el historial de cambios

### US-3.6: Reasignar visita a otro técnico
**Como** supervisora de zona
**Quiero** reasignar una visita de un técnico a otro
**Para** balancear la carga de trabajo o cubrir ausencias

**Personas**: Laura, Miguel

**Criterios de aceptación**:
- Se puede reasignar visitas en estado "Programada"
- Se selecciona el nuevo técnico del equipo
- Se registra el cambio en el historial
- La visita aparece en el calendario del nuevo técnico

### US-3.7: Ver detalle de visita
**Como** técnico mecánico
**Quiero** ver toda la información de una visita específica
**Para** prepararme para el servicio o revisar el historial

**Personas**: Carlos, Laura, Miguel

**Criterios de aceptación**:
- Muestra todos los datos: fecha, hora, cliente, ubicación, técnico, tipo de servicio, descripción, notas, estado
- Muestra historial de cambios (reagendamientos, cancelaciones, reasignaciones)
- Acciones disponibles según estado y rol del usuario

---

## Feature 4: Dashboard y Tablas

### US-4.1: Dashboard de resumen
**Como** supervisora de zona
**Quiero** ver un panel con resumen de visitas por estado
**Para** tener una visión rápida de la operación

**Personas**: Laura, Miguel

**Criterios de aceptación**:
- Cards/contadores con: programadas, realizadas, canceladas, reagendadas, finalizadas
- Los contadores reflejan el período actual (hoy/semana)
- Click en un contador filtra la tabla correspondiente

### US-4.2: Tabla de visitas
**Como** supervisora de zona
**Quiero** ver un listado tabular de visitas con filtros y ordenamiento
**Para** gestionar las visitas de forma eficiente

**Personas**: Laura, Miguel (ven todas), Carlos (ve las suyas)

**Criterios de aceptación**:
- Columnas: fecha, hora, cliente, técnico, tipo de servicio, estado
- Filtros por: estado, técnico, rango de fechas, tipo de servicio
- Ordenamiento por cualquier columna
- Paginación
- Indicadores visuales de estado (colores/badges)

---

## Feature 5: Analytics

### US-5.1: Dashboard de motivos de cancelación y reagendamiento
**Como** supervisora de zona
**Quiero** ver los principales motivos por los que se cancelan o reagendan visitas
**Para** identificar problemas recurrentes y tomar acciones correctivas

**Personas**: Laura, Miguel

**Criterios de aceptación**:
- Gráfica de barras con top motivos de cancelación
- Gráfica de barras con top motivos de reagendamiento
- Filtros por rango de fechas, técnico, zona
- Los datos se actualizan al cambiar filtros

### US-5.2: Tendencias en el tiempo
**Como** administrador del sistema
**Quiero** ver tendencias de visitas (realizadas, canceladas, reagendadas) a lo largo del tiempo
**Para** reportar a gerencia y detectar patrones

**Personas**: Miguel, Laura

**Criterios de aceptación**:
- Gráfica de líneas con tendencia por estado en el tiempo
- Selector de rango de fechas
- Métricas: tasa de cancelación, tasa de reagendamiento, tasa de éxito
- Filtro por zona y técnico

---

## Feature 6: Administración de Catálogos

### US-6.1: Gestionar tipos de servicio
**Como** administrador del sistema
**Quiero** crear, editar y desactivar tipos de servicio
**Para** mantener actualizado el catálogo que usan los técnicos

**Personas**: Miguel

**Criterios de aceptación**:
- CRUD de tipos de servicio (nombre, descripción, activo/inactivo)
- No se pueden eliminar tipos con visitas asociadas, solo desactivar
- Los tipos inactivos no aparecen en formularios de creación de visitas

### US-6.2: Gestionar motivos de cancelación/reagendamiento
**Como** administrador del sistema
**Quiero** crear, editar y desactivar motivos de cancelación y reagendamiento
**Para** mantener actualizado el catálogo de motivos

**Personas**: Miguel

**Criterios de aceptación**:
- CRUD de motivos (nombre, tipo: cancelación/reagendamiento, activo/inactivo)
- Los motivos inactivos no aparecen en formularios
- Los motivos existentes en visitas históricas se mantienen visibles

### US-6.3: Gestionar zonas
**Como** administrador del sistema
**Quiero** crear, editar y desactivar zonas geográficas
**Para** organizar la asignación de técnicos y visitas por zona

**Personas**: Miguel

**Criterios de aceptación**:
- CRUD de zonas (nombre, descripción, activo/inactivo)
- Asignación de técnicos a zonas
- Las zonas se usan como filtro en calendario, tablas y analytics

---

## Matriz de Cobertura de Requisitos

| Requisito | Stories que lo cubren |
|-----------|---------------------|
| RF-01: Roles y Permisos | US-1.1, US-1.2, US-1.3 |
| RF-02: Calendario | US-2.1, US-2.2, US-2.3 |
| RF-03: Modelo de Datos | US-3.1, US-3.7 (fotos/firma diferidos a fase futura) |
| RF-04: Estados de Visita | US-3.2, US-3.3, US-3.4, US-3.5 |
| RF-05: Acciones sobre Visitas | US-3.1, US-3.2, US-3.3, US-3.6 |
| RF-06: Paneles y Tablas | US-4.1, US-4.2 |
| RF-07: Analytics | US-5.1, US-5.2 |
