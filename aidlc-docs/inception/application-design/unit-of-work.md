# Unidades de Trabajo - Portal de Gestión de Visitas Mecánicas

## Estrategia de Descomposición
- Enfoque: Una unidad por capa (separadas)
- Orden de desarrollo: Bottom-up (Shared → Backend → Frontend → Infra)

---

## Unit 1: Shared (shared/)

**Nombre**: shared
**Orden**: 1 (se desarrolla primero)
**Componentes**: SH-01 (Zod Schemas), SH-02 (TypeScript Types)

**Responsabilidades**:
- Zod schemas de validación para Visit, Catalogs, API requests/responses
- TypeScript types derivados (z.infer)
- Enums de estados de visita y roles
- Tipos de filtros y paginación

**Alcance**:
- Schemas: Visit, CreateVisitInput, RescheduleInput, CancelInput, CompleteInput, FinalizeInput, ReassignInput
- Schemas: ServiceType, Reason, Zone (catálogos)
- Schemas: VisitFilters, CalendarFilters, AnalyticsFilters
- Schemas: API response wrappers (PaginatedResult, ApiError)
- Enums: VisitStatus, Role, ReasonType

**Estructura de código**:
```
shared/
├── src/
│   ├── schemas/
│   │   ├── visit.ts
│   │   ├── catalog.ts
│   │   ├── analytics.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── enums/
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## Unit 2: Backend API (api/)

**Nombre**: api
**Orden**: 2 (depende de shared)
**Componentes**: BE-01 (Visits Lambda), BE-02 (Catalogs Lambda), BE-03 (Analytics Lambda), BE-04 (Auth Middleware), BE-05 (Mock Data Repository)

**Responsabilidades**:
- 3 Lambda handlers con routing interno (visits, catalogs, analytics)
- Auth middleware (Clerk JWT verification + role extraction)
- Service layer (VisitService, CatalogService, AnalyticsService)
- Mock data repository (in-memory store con seed data)
- Input validation con Zod schemas de shared/
- Error handling estructurado

**Alcance**:
- 25 endpoints REST
- 3 servicios de negocio
- Auth middleware con verificación de Clerk
- Mock repository con datos de prueba
- Structured logging

**Estructura de código**:
```
api/
├── src/
│   ├── handlers/
│   │   ├── visits.ts
│   │   ├── catalogs.ts
│   │   └── analytics.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── error-handler.ts
│   ├── services/
│   │   ├── visit.service.ts
│   │   ├── catalog.service.ts
│   │   └── analytics.service.ts
│   ├── repositories/
│   │   ├── mock-visit.repository.ts
│   │   ├── mock-catalog.repository.ts
│   │   └── seed-data.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── validation.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## Unit 3: Frontend App (app/)

**Nombre**: app
**Orden**: 3 (depende de shared y api)
**Componentes**: FE-01 a FE-08 (Layout, Auth, Calendar, Visits, Dashboard, Analytics, Admin, Shared UI)

**Responsabilidades**:
- TanStack Start app con SSR
- TanStack Router con rutas protegidas por rol
- TanStack Query hooks para data fetching
- Clerk integration (login, logout, session)
- Páginas: Calendar, Visits, Dashboard, Analytics, Admin Catalogs
- Shared UI components (DataTable, StatusBadge, FilterBar, etc.)
- Tailwind CSS styling

**Alcance**:
- Layout shell con sidebar y header
- 6 páginas principales + login
- TanStack Query hooks para 25 endpoints
- Formularios con validación Zod
- Componentes de calendario (día/semana)
- Gráficas de analytics

**Estructura de código**:
```
app/
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── _authenticated.tsx
│   │   ├── _authenticated/
│   │   │   ├── dashboard.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── visits/
│   │   │   │   ├── index.tsx
│   │   │   │   └── $visitId.tsx
│   │   │   ├── analytics.tsx
│   │   │   └── admin/
│   │   │       └── catalogs.tsx
│   │   ├── login.tsx
│   │   └── index.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/
│   │   │   ├── DataTable.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── calendar/
│   │   │   ├── DayView.tsx
│   │   │   └── WeekView.tsx
│   │   ├── visits/
│   │   │   ├── VisitForm.tsx
│   │   │   ├── VisitDetail.tsx
│   │   │   ├── RescheduleModal.tsx
│   │   │   └── CancelModal.tsx
│   │   └── analytics/
│   │       ├── ReasonChart.tsx
│   │       └── TrendChart.tsx
│   ├── hooks/
│   │   ├── useVisits.ts
│   │   ├── useCatalogs.ts
│   │   ├── useAnalytics.ts
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── query-client.ts
│   └── styles/
│       └── globals.css
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── app.config.ts
```

---

## Unit 4: Infrastructure (infra/)

**Nombre**: infra
**Orden**: 4 (depende de api y app para deploy)
**Componentes**: IN-01 (API Stack), IN-02 (Auth Stack), IN-03 (Frontend Stack), IN-04 (Environment Config)

**Responsabilidades**:
- IaC para API Gateway + 3 Lambda functions
- IaC para S3 + CloudFront (frontend hosting)
- IAM roles least-privilege para Lambdas
- Configuración por ambiente (dev/staging/prod)
- GitHub Actions pipeline (lint + type-check + build)

**Alcance**:
- API Gateway REST con stages por ambiente
- 3 Lambda functions deployment
- S3 bucket + CloudFront distribution
- IAM roles y policies
- Environment variables por ambiente
- CI/CD pipeline config

**Estructura de código**:
```
infra/
├── lib/
│   ├── api-stack.ts
│   ├── frontend-stack.ts
│   └── config.ts
├── bin/
│   └── app.ts
├── environments/
│   ├── dev.ts
│   ├── staging.ts
│   └── prod.ts
├── package.json
├── tsconfig.json
└── cdk.json

.github/
└── workflows/
    └── ci.yml
```
