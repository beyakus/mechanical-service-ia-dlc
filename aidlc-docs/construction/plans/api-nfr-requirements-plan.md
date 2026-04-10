# Plan de NFR Requirements - Unit 2: api

## Contexto
Unit api: 3 Lambda handlers (visits, catalogs, analytics), auth middleware con Clerk, service layer, mock repository. REST API via API Gateway. Depende de shared.

---

## Preguntas de NFR

### Question 1
¿Quieres usar un bundler para empaquetar las Lambda functions (esbuild, tsup) o compilar directamente con tsc?

A) esbuild (rápido, tree-shaking, single-file output ideal para Lambda)
B) tsup (wrapper de esbuild con config más simple)
C) tsc directo (sin bundling, más archivos pero más simple)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
¿Cómo prefieres manejar el CORS en API Gateway?

A) CORS configurado en API Gateway directamente (preflight OPTIONS automático)
B) CORS manejado en el código Lambda (headers en cada response)
C) Ambos: API Gateway para OPTIONS preflight + Lambda para headers en responses
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Plan de Ejecución

### Fase 1: NFR Assessment
- [x] Evaluar requisitos de seguridad para API (auth, CORS, headers, rate limiting)
- [x] Evaluar requisitos de performance (cold start, response time)
- [x] Evaluar requisitos de observabilidad (logging, monitoring)
- [x] Evaluar requisitos de testing
- [x] Documentar en `aidlc-docs/construction/api/nfr-requirements/nfr-requirements.md`

### Fase 2: Tech Stack Decisions
- [x] Seleccionar bundler para Lambda
- [x] Seleccionar dependencias del backend (Clerk SDK, etc.)
- [x] Definir configuración de build
- [x] Documentar en `aidlc-docs/construction/api/nfr-requirements/tech-stack-decisions.md`
