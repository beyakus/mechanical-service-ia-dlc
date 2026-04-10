# NFR Requirements - Unit: api

---

## NFR-API-01: Seguridad (SECURITY-04, SECURITY-05, SECURITY-08, SECURITY-11, SECURITY-12, SECURITY-15)
- JWT verification con Clerk Backend SDK en cada request
- Authorization middleware deny-by-default: todas las rutas requieren auth
- Object-level authorization: verificar ownership/zone antes de retornar datos (IDOR prevention)
- CORS configurado en API Gateway con origins explícitos (no wildcard)
- Security headers en todas las responses (X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy)
- Input validation con Zod en todos los endpoints (SECURITY-05)
- Rate limiting configurado en API Gateway (SECURITY-11)
- Global error handler que captura excepciones y retorna respuestas genéricas (SECURITY-15)
- No hardcoded credentials — Clerk keys via environment variables (SECURITY-12)

## NFR-API-02: Performance
- esbuild para bundling: single-file output, tree-shaking, cold start optimizado
- Lambda memory: 256MB (ajustable)
- Lambda timeout: 30s
- Target response time: < 500ms (con datos mock)
- Seed data cargado en module scope (reutilizado en warm invocations)

## NFR-API-03: Observabilidad (SECURITY-02, SECURITY-03, SECURITY-14)
- Structured logging a stdout (CloudWatch)
- Correlation ID (API Gateway requestId) en todos los logs
- Log fields: timestamp, level, requestId, method, path, userId, role, statusCode, duration
- No PII/tokens en logs
- API Gateway access logging habilitado (SECURITY-02)
- CloudWatch alarms para: 5xx errors, high latency, auth failures (SECURITY-14)
- Log retention: 90 días mínimo (SECURITY-14)

## NFR-API-04: Testing
- Vitest como test runner (consistente con shared)
- fast-check para PBT (consistente con shared)
- Tests unitarios para: services, middleware, route handlers
- Tests PBT para: state transitions, role filtering, pagination invariants
- Cobertura mínima: 80% de líneas para services y middleware

## NFR-API-05: Resiliencia (SECURITY-15)
- Global error handler en cada Lambda
- Fail closed: errores no atrapados retornan 500 genérico
- No unhandled promise rejections
- Graceful handling de Clerk SDK failures (401 si no se puede verificar token)

## NFR-API-06: Supply Chain (SECURITY-10)
- Lock file committed
- Exact versions en dependencies
- esbuild pinned version en devDependencies
- npm audit en CI pipeline
