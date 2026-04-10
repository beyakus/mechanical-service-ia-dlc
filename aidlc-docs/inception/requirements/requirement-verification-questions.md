# Preguntas de Verificación de Requisitos

Por favor responde cada pregunta llenando la letra de tu elección después del tag [Answer]:. Si ninguna opción aplica, elige la última opción (Other) y describe tu preferencia.

---

## Question 1
¿Cuántos roles de usuario tendrá el portal inicialmente?

A) Un solo rol (todos los empleados ven lo mismo)
B) Dos roles: empleado (ve sus visitas) y supervisor/admin (ve todas las visitas)
C) Tres o más roles con permisos diferenciados (empleado, supervisor, admin, etc.)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
¿Las visitas mecánicas están asociadas a un técnico/empleado específico o son compartidas por equipo?

A) Cada visita está asignada a un técnico individual
B) Las visitas se asignan a equipos y cualquier miembro puede atenderlas
C) Ambos: algunas son individuales y otras por equipo
X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 3
¿Qué información debe contener cada visita mecánica?

A) Básica: fecha, hora, cliente/ubicación, estado, técnico asignado
B) Intermedia: lo anterior + tipo de servicio, descripción del problema, notas
C) Completa: lo anterior + historial de cambios, fotos/evidencia, firma del cliente
X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 4
Para la capacidad analítica de motivos de cancelación/reagendamiento, ¿qué nivel de detalle esperas?

A) Dashboard simple con conteos y gráficas de barras de los motivos principales
B) Dashboard con filtros por rango de fechas, técnico, zona y tendencias en el tiempo
C) Analytics avanzado con exportación de reportes, comparativas y predicciones
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
¿Cómo se gestionará la base de datos para las visitas?

A) DynamoDB (serverless, consistente con el stack Lambda)
B) RDS PostgreSQL/MySQL (relacional tradicional)
C) Aurora Serverless (relacional pero serverless)
X) Other (please describe after [Answer]: tag below)

[Answer]: Datos mock)

## Question 6
¿El calendario debe soportar vistas múltiples?

A) Solo vista de día
B) Vista de día y semana
C) Vista de día, semana y mes
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 7
Cuando mencionas "environments configurados: dev / staging / prod", ¿te refieres a la infraestructura AWS desplegada o solo a la configuración del frontend (variables de entorno, builds diferenciados)?

A) Solo configuración del frontend (env vars, builds por ambiente)
B) Frontend + infraestructura AWS desplegada con IaC (CDK/SAM/Terraform)
C) Solo quiero los archivos de configuración listos, el despliegue real lo hago yo después
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 8
Para el pipeline de GitHub Actions, ¿qué alcance esperas?

A) Básico: lint + type-check + build en cada PR
B) Intermedio: lo anterior + tests + deploy automático a dev
C) Completo: lo anterior + deploy a staging con aprobación manual + deploy a prod
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 9
¿Necesitas internacionalización (i18n) o el portal será solo en español?

A) Solo español
B) Español e inglés
C) Multiidioma con soporte para agregar más idiomas después
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10: Security Extensions
¿Deben aplicarse las reglas de seguridad de la extensión Security Baseline como restricciones obligatorias para este proyecto?

A) Sí — aplicar todas las reglas de SEGURIDAD como restricciones obligatorias (recomendado para aplicaciones de producción)
B) No — omitir todas las reglas de SEGURIDAD (adecuado para PoCs, prototipos y proyectos experimentales)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 11: Property-Based Testing Extension
¿Deben aplicarse las reglas de Property-Based Testing (PBT) para este proyecto?

A) Sí — aplicar todas las reglas de PBT como restricciones obligatorias (recomendado para proyectos con lógica de negocio, transformaciones de datos, serialización o componentes con estado)
B) Parcial — aplicar reglas de PBT solo para funciones puras y round-trips de serialización
C) No — omitir todas las reglas de PBT (adecuado para aplicaciones CRUD simples, proyectos solo de UI o capas de integración delgadas)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
