# Requisitos - Portal de Gestión de Visitas Mecánicas

## Intent Analysis

- **Solicitud del usuario**: Construir un portal web para gestión de visitas mecánicas con calendario, paneles de control, analytics y autenticación
- **Tipo de solicitud**: Nuevo Proyecto (Greenfield)
- **Estimación de alcance**: Múltiples componentes (frontend, backend API, infraestructura, CI/CD)
- **Estimación de complejidad**: Moderada-Alta (múltiples roles, estados de visita, analytics, IaC, auth)

---

## Stack Tecnológico (Obligatorio)

| Capa | Tecnología |
|------|-----------|
| Framework Frontend | TanStack Start + TanStack Router |
| Data Fetching | TanStack Query |
| UI | React + Tailwind CSS |
| Autenticación | Clerk |
| API Backend | API Gateway + AWS Lambda |
| Lenguaje | TypeScript estricto en todo (frontend y backend) |
| Base de datos | Datos mock inicialmente (decisión de DB diferida) |
| IaC | CDK/SAM/Terraform (a definir en diseño de infraestructura) |
| CI/CD | GitHub Actions |
| PBT Framework | fast-check (TypeScript, integra con Vitest) |

---

## Requisitos Funcionales

### RF-01: Gestión de Roles y Permisos
- Tres o más roles diferenciados: empleado, supervisor, admin (mínimo)
- Empleado: ve sus visitas asignadas (individuales y de equipo)
- Supervisor: ve todas las visitas de su equipo/zona
- Admin: acceso completo al sistema, gestión de usuarios y configuración
- Autenticación y autorización vía Clerk con rutas protegidas por rol

### RF-02: Calendario de Visitas
- Vista de día y vista de semana
- Muestra visitas programadas por día con indicadores visuales de estado
- Navegación entre días/semanas
- Filtrado por técnico, equipo o estado

### RF-03: Modelo de Datos de Visita
Cada visita mecánica contiene:
- **Datos básicos**: fecha, hora, cliente/ubicación, estado, técnico asignado
- **Datos intermedios**: tipo de servicio, descripción del problema, notas
- **Datos completos**: historial de cambios, fotos/evidencia, firma del cliente
- **Asignación**: puede ser individual (a un técnico) o por equipo (cualquier miembro puede atenderla)

### RF-04: Estados de Visita
Estados posibles:
- **Programada**: visita agendada pendiente de realizarse
- **Realizada exitosamente**: visita completada con éxito
- **Cancelada**: visita cancelada (requiere motivo)
- **Reagendada**: visita movida a otra fecha (requiere motivo)
- **Finalizada exitosamente**: visita cerrada formalmente tras revisión

### RF-05: Acciones sobre Visitas
- **Reagendar**: cambiar fecha/hora de una visita programada (requiere motivo)
- **Cancelar**: cancelar una visita programada (requiere motivo)
- **Agregar nueva**: crear nueva visita con fecha, técnico, cliente, tipo de servicio
- **Cambiar estado**: transicionar entre estados válidos

### RF-06: Paneles de Control y Tablas
- Dashboard con resumen de visitas por estado (conteos)
- Tablas con listado de visitas filtrable y ordenable
- Indicadores visuales de estado (colores, badges)
- Vista rápida de visitas pendientes, realizadas y canceladas

### RF-07: Capacidad Analítica
- Dashboard con filtros por rango de fechas, técnico, zona
- Tendencias en el tiempo (gráficas de línea/barras)
- Top motivos de cancelación y reagendamiento
- Métricas: tasa de cancelación, tasa de reagendamiento, tasa de éxito
- No requiere exportación de reportes ni predicciones en esta fase

---

## Requisitos No Funcionales

### RNF-01: Seguridad
- Autenticación con Clerk: login, logout, sesiones seguras
- Rutas protegidas por autenticación y rol
- HTTPS obligatorio en todos los ambientes
- Cumplimiento con Security Baseline Extension (SECURITY-01 a SECURITY-15)
- HTTP security headers en todas las respuestas HTML
- Input validation en todos los endpoints de API
- Least-privilege en políticas IAM de Lambda

### RNF-02: Ambientes
- Tres ambientes configurados: dev, staging, prod
- Frontend + infraestructura AWS desplegada con IaC
- Variables de entorno diferenciadas por ambiente
- Clerk configurado por ambiente (dev/prod keys)

### RNF-03: CI/CD
- Pipeline básico en GitHub Actions: lint + type-check + build en cada PR
- TypeScript strict mode enforced en CI

### RNF-04: Idioma
- Portal solo en español (sin i18n)

### RNF-05: Testing
- Property-Based Testing con fast-check (PBT-01 a PBT-10)
- Tests complementarios: example-based + property-based
- Seed logging y reproducibilidad en CI

### RNF-06: Rendimiento
- Tiempo de carga inicial < 3s
- Respuesta de API < 500ms (con datos mock)
- Lazy loading de rutas

### RNF-07: Accesibilidad
- Navegación por teclado
- Contraste adecuado
- Labels en formularios
- ARIA attributes donde corresponda

---

## Entregables Esperados

1. Repositorio corriendo con routing base y layout shell
2. Auth funcional con Clerk: login, logout, rutas protegidas
3. Una pantalla real conectada a una Lambda (con datos mock)
4. Environments configurados: dev / staging / prod (frontend + IaC)
5. Pipeline básico en GitHub Actions (lint + type-check + build)

---

## Decisiones Diferidas

| Decisión | Estado | Notas |
|----------|--------|-------|
| Base de datos | Diferida | Datos mock por ahora; se decidirá DB real en fase posterior |
| IaC tool específico | Por definir | CDK, SAM o Terraform se decidirá en diseño de infraestructura |
| Librería de calendario | Por definir | Se evaluará en diseño de aplicación |
| Librería de gráficas | Por definir | Se evaluará en diseño de aplicación |
