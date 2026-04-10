# Tech Stack Decisions - Unit: api

## Runtime & Language

| Tecnología | Versión | Rationale |
|-----------|---------|-----------|
| Node.js | >= 22 LTS | Consistente con shared, Lambda runtime nodejs22.x |
| TypeScript | >= 5.4 | Strict mode, consistente con shared |

## Core Dependencies

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| @clerk/backend | ^1.0 | JWT verification, user metadata extraction |
| zod | ^3.23 | Input validation (via shared schemas) |
| @visits/shared | workspace | Schemas, types, enums, constants |

## Dev Dependencies

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| esbuild | ^0.21 | Lambda bundling (single-file output, tree-shaking) |
| vitest | ^2.0 | Test runner |
| fast-check | ^3.0 | Property-based testing |
| typescript | ^5.4 | Compilador |
| @types/aws-lambda | ^8.10 | Types para API Gateway events |
| eslint | ^9.0 | Linting |
| prettier | ^3.0 | Formatting |

## Build Configuration

### esbuild config (per Lambda)
```javascript
{
  entryPoints: ['src/handlers/visits.ts'],  // or catalogs.ts, analytics.ts
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: 'dist/visits/index.mjs',
  external: ['@clerk/backend'],  // Clerk SDK loaded at runtime
  minify: true,
  sourcemap: true,
  treeShaking: true,
}
```

### package.json scripts
```json
{
  "build": "node build.mjs",
  "build:visits": "esbuild src/handlers/visits.ts --bundle --platform=node --target=node22 --format=esm --outfile=dist/visits/index.mjs",
  "build:catalogs": "esbuild src/handlers/catalogs.ts --bundle --platform=node --target=node22 --format=esm --outfile=dist/catalogs/index.mjs",
  "build:analytics": "esbuild src/handlers/analytics.ts --bundle --platform=node --target=node22 --format=esm --outfile=dist/analytics/index.mjs",
  "test": "vitest run",
  "lint": "eslint src/",
  "typecheck": "tsc --noEmit"
}
```

## CORS Configuration (API Gateway)
- Configured at API Gateway level (not in Lambda code)
- Allowed origins: environment-specific (dev: localhost:3000, staging: staging.domain.com, prod: domain.com)
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization
- Max age: 86400 (24h)

## Security Compliance

| SECURITY Rule | Status | Notes |
|--------------|--------|-------|
| SECURITY-01 | N/A | No data stores (mock data in memory) |
| SECURITY-02 | Compliant | API Gateway access logging enabled |
| SECURITY-03 | Compliant | Structured logging with correlation ID |
| SECURITY-04 | Compliant | Security headers in all responses |
| SECURITY-05 | Compliant | Zod validation on all endpoints |
| SECURITY-06 | Deferred | IAM policies defined in infra unit |
| SECURITY-07 | Deferred | Network config defined in infra unit |
| SECURITY-08 | Compliant | Auth middleware deny-by-default, object-level auth, CORS restricted |
| SECURITY-09 | Compliant | Generic error responses, no stack traces |
| SECURITY-10 | Compliant | Lock file, pinned versions, npm audit |
| SECURITY-11 | Compliant | Rate limiting via API Gateway, auth isolated in middleware |
| SECURITY-12 | Compliant | Clerk handles auth, no hardcoded credentials |
| SECURITY-13 | Compliant | Zod safe deserialization, CI access control deferred |
| SECURITY-14 | Compliant | CloudWatch alarms, 90-day retention |
| SECURITY-15 | Compliant | Global error handler, fail closed |

## PBT Compliance

| PBT Rule | Status | Notes |
|----------|--------|-------|
| PBT-01 | Compliant | Properties identified in domain-entities.md |
| PBT-09 | Compliant | fast-check selected, consistent with shared |
| Others | Deferred | Enforced during Code Generation |
