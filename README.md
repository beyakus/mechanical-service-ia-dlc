# Portal de Gestión de Visitas Mecánicas

Portal web que permite a empleados revisar qué visitas mecánicas tienen programadas, cuáles quedaron pendientes y cuáles se cerraron exitosamente. Soporta 3 roles (técnico, supervisor, admin) con calendario, dashboard, gestión de visitas con estados, analytics de motivos de cancelación/reagendamiento y administración de catálogos.

## Arquitectura

Monorepo con 4 unidades separadas por capa, comunicación REST entre frontend y backend:

```
Browser → TanStack Start (SSR) → API Gateway → Lambda (por dominio) → Mock Data
```

- **Frontend (app/)**: TanStack Start con SSR, file-based routing, TanStack Query para data fetching
- **Backend (api/)**: 3 Lambda functions por dominio (visits, catalogs, analytics) con routing declarativo interno
- **Shared (shared/)**: Zod schemas y TypeScript types compartidos entre frontend y backend
- **Infra (infra/)**: AWS CDK con stacks para API Gateway + Lambda y S3 + CloudFront

## Tecnologías

| Capa | Stack |
|------|-------|
| Frontend | TanStack Start + Router + Query, React 19, Tailwind CSS 4, shadcn/ui |
| Auth | Clerk |
| Backend | AWS Lambda (Node 22), TypeScript estricto |
| API | REST via API Gateway, Zod validation |
| Infra | AWS CDK, S3 + CloudFront |
| Testing | Vitest, fast-check (PBT) |
| CI/CD | GitHub Actions |
| Bundling | esbuild (api), Vite 7 (app) |

## Levantar localmente

### Prerrequisitos
- Node.js >= 22 LTS
- Cuenta de Clerk con publishable key ([clerk.com](https://clerk.com))

### 1. Instalar dependencias
```bash
cd shared && npm install
cd ../api && npm install
cd ../app && npm install
```

### 2. Build shared
```bash
cd shared && npm run build
```

### 3. Configurar variables de entorno
```bash
# Crear app/.env
echo 'VITE_API_URL=http://localhost:3001' > app/.env
echo 'VITE_CLERK_PUBLISHABLE_KEY=pk_test_tu_key_aqui' >> app/.env
```

### 4. Levantar backend (Terminal 1)
```bash
cd api && npm run dev
# → API server running at http://localhost:3001
```

### 5. Levantar frontend (Terminal 2)
```bash
cd app && npm run dev
# → http://localhost:3000
```

### Probar el API sin auth (dev mode)
```bash
curl http://localhost:3001/api/catalogs/zones
curl http://localhost:3001/api/visits
curl "http://localhost:3001/api/analytics/summary?startDate=2026-01-01&endDate=2026-12-31"
```

## Tests
```bash
cd shared && npm test
cd ../api && npm test
cd ../app && npm test
```

## Lint y Type Check
```bash
cd shared && npm run lint && npm run typecheck
cd ../api && npm run lint && npm run typecheck
cd ../app && npm run lint && npm run typecheck
```

## Estructura del proyecto
```
├── shared/          # Zod schemas, types, enums, constants
├── api/             # Lambda handlers, services, mock repository
├── app/             # TanStack Start frontend
├── infra/           # AWS CDK stacks
├── .github/         # GitHub Actions CI
└── aidlc-docs/      # Documentación AI-DLC
```
