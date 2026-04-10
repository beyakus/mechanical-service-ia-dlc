# Tech Stack Decisions - Unit: shared

## Runtime & Language

| Tecnología | Versión | Rationale |
|-----------|---------|-----------|
| Node.js | >= 22 LTS | Soporte hasta abril 2027, features modernos |
| TypeScript | >= 5.4 | Strict mode, últimas features de tipos |

## Core Dependencies

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| zod | ^3.23 | Schema validation, type inference |

## Dev Dependencies

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| vitest | ^2.0 | Test runner (PBT-09: integra con fast-check) |
| fast-check | ^3.0 | Property-based testing framework (PBT-09) |
| typescript | ^5.4 | Compilador TypeScript |
| eslint | ^9.0 | Linting |
| @typescript-eslint/eslint-plugin | ^8.0 | Reglas ESLint para TypeScript |
| @typescript-eslint/parser | ^8.0 | Parser ESLint para TypeScript |
| prettier | ^3.0 | Code formatting |

## PBT Framework Selection (PBT-09 Compliance)

| Criterio | fast-check |
|----------|-----------|
| Custom generators | ✅ Arbitraries API |
| Automatic shrinking | ✅ Built-in |
| Seed-based reproducibility | ✅ `seed` parameter |
| Vitest integration | ✅ Native via `@fast-check/vitest` o directo |
| TypeScript support | ✅ First-class |

## Build Configuration

### tsconfig.json (shared)
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

### package.json (shared) — key fields
```json
{
  "name": "@visits/shared",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  }
}
```

## Security Compliance Notes

| SECURITY Rule | Status | Notes |
|--------------|--------|-------|
| SECURITY-05 | Compliant | Zod schemas enforce input validation with max lengths and format checks |
| SECURITY-13 | Compliant | Zod provides safe deserialization — no raw JSON.parse without validation |
| SECURITY-10 | Compliant | Exact versions pinned via lock file, no unused deps |
| Others | N/A | shared has no infrastructure, endpoints, auth, or network config |

## PBT Compliance Notes

| PBT Rule | Status | Notes |
|----------|--------|-------|
| PBT-01 | Compliant | Testable properties identified in business-logic-model.md |
| PBT-09 | Compliant | fast-check selected, documented, included as dependency |
| Others | Deferred | PBT-02 through PBT-08, PBT-10 enforced during Code Generation |
