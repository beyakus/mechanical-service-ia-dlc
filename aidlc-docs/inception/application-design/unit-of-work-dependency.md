# Dependencias entre Unidades de Trabajo

## Orden de Ejecución

```
Unit 1: shared  ──────────────────────────────┐
    (Zod schemas, types, enums)               │
         │                                     │
         v                                     │
Unit 2: api  ─────────────────────────────────┤
    (Lambda handlers, services, mock repo)     │
         │                                     │
         v                                     │
Unit 3: app  ─────────────────────────────────┤
    (TanStack Start, pages, components)        │
         │                                     │
         v                                     │
Unit 4: infra                                  │
    (CDK stacks, CI/CD, environments)  ────────┘
```

## Matriz de Dependencias

| Unidad | Depende de | Tipo de Dependencia | Punto de Integración |
|--------|-----------|---------------------|---------------------|
| shared | (ninguna) | — | — |
| api | shared | Build-time (import schemas/types) | `import { ... } from '../../shared/src'` |
| app | shared | Build-time (import schemas/types) | `import { ... } from '../../shared/src'` |
| app | api | Runtime (HTTP calls) | REST API via API Gateway URL |
| infra | api | Deploy-time (Lambda code bundles) | Lambda handler paths |
| infra | app | Deploy-time (build output) | S3 upload of build artifacts |

## Puntos de Integración Críticos

### shared → api
- Zod schemas usados para validación de input en Lambda handlers
- TypeScript types usados en interfaces de servicios y repositorios
- Enums compartidos (VisitStatus, Role, ReasonType)

### shared → app
- Zod schemas usados para validación de formularios
- TypeScript types usados en hooks de TanStack Query y componentes
- Enums compartidos para renderizado de UI

### app → api (Runtime)
- REST API calls via fetch con Bearer token de Clerk
- API base URL configurada por ambiente (env var)
- Contrato definido por endpoints en component-methods.md

### infra → api + app (Deploy)
- Lambda code bundles empaquetados desde api/
- Frontend build output subido a S3 desde app/
- Environment variables inyectadas en Lambda y frontend build

## Riesgos de Integración

| Riesgo | Mitigación |
|--------|-----------|
| Schemas desincronizados entre FE y BE | Shared package como single source of truth |
| API contract mismatch | TypeScript strict + Zod validation en ambos lados |
| Clerk token format changes | Clerk SDK versiones pinned en ambos lados |
| Environment config inconsistency | Configuración centralizada en infra/environments/ |
