# Componentes - Portal de Gestión de Visitas Mecánicas

## Estructura del Repositorio

```
/
├── app/                    # Frontend (TanStack Start + Router + Query)
├── api/                    # Backend (Lambda functions)
├── shared/                 # Zod schemas y tipos compartidos
├── infra/                  # IaC (CDK/SAM/Terraform)
└── .github/workflows/      # GitHub Actions
```

---

## Frontend Components (/app)

### FE-01: Layout Shell
- **Responsabilidad**: Layout principal con sidebar, header, navegación y contenedor de contenido
- **Incluye**: Sidebar con menú por rol, header con info de usuario y logout, breadcrumbs
- **Dependencias**: Clerk (auth state), TanStack Router (navegación)

### FE-02: Auth Pages
- **Responsabilidad**: Páginas de login/logout y manejo de sesión con Clerk
- **Incluye**: Login page, redirect post-auth, protected route wrapper
- **Dependencias**: Clerk React SDK

### FE-03: Calendar Page
- **Responsabilidad**: Vista de calendario con visitas por día y semana
- **Incluye**: Day view, week view, navigation controls, filtros, click-to-detail
- **Dependencias**: Librería de calendario (TBD en NFR), TanStack Query (data fetching)

### FE-04: Visits Management Page
- **Responsabilidad**: Tabla de visitas con CRUD y cambios de estado
- **Incluye**: Tabla filtrable/ordenable, formularios de crear/editar, modales de reagendar/cancelar con motivo, detalle de visita
- **Dependencias**: TanStack Query, Zod (validación de formularios)

### FE-05: Dashboard Page
- **Responsabilidad**: Panel de resumen con contadores por estado y acceso rápido
- **Incluye**: Cards de contadores, links a tabla filtrada por estado
- **Dependencias**: TanStack Query

### FE-06: Analytics Page
- **Responsabilidad**: Dashboard analítico con gráficas y filtros
- **Incluye**: Gráficas de barras (motivos), gráficas de líneas (tendencias), filtros por fecha/técnico/zona
- **Dependencias**: Librería de gráficas (TBD en NFR), TanStack Query

### FE-07: Admin Catalogs Page
- **Responsabilidad**: CRUD de catálogos del sistema (tipos de servicio, motivos, zonas)
- **Incluye**: Tablas de catálogos, formularios de crear/editar, toggle activo/inactivo
- **Dependencias**: TanStack Query, Zod

### FE-08: Shared UI Components
- **Responsabilidad**: Componentes reutilizables de UI
- **Incluye**: StatusBadge, DataTable, FilterBar, Modal, FormField, LoadingSpinner, ErrorBoundary
- **Dependencias**: Tailwind CSS

---

## Backend Components (/api)

### BE-01: Visits Lambda
- **Responsabilidad**: CRUD de visitas, cambios de estado, reagendamiento, cancelación, reasignación
- **Dominio**: /api/visits/*
- **Incluye**: Handler con routing interno, validación de input, autorización por rol
- **Dependencias**: Zod (validación), Clerk SDK (auth verification), mock data repository

### BE-02: Catalogs Lambda
- **Responsabilidad**: CRUD de catálogos (tipos de servicio, motivos, zonas)
- **Dominio**: /api/catalogs/*
- **Incluye**: Handler con routing interno, validación, autorización (solo admin)
- **Dependencias**: Zod, Clerk SDK, mock data repository

### BE-03: Analytics Lambda
- **Responsabilidad**: Consultas analíticas, agregaciones, tendencias
- **Dominio**: /api/analytics/*
- **Incluye**: Handler con routing interno, cálculos de métricas, filtros
- **Dependencias**: Zod, Clerk SDK, mock data repository

### BE-04: Auth Middleware
- **Responsabilidad**: Verificación de JWT de Clerk, extracción de rol, autorización
- **Incluye**: Token validation, role extraction, permission checking
- **Dependencias**: Clerk Backend SDK

### BE-05: Mock Data Repository
- **Responsabilidad**: Capa de datos mock que simula la base de datos
- **Incluye**: In-memory data store, seed data, CRUD operations
- **Dependencias**: Zod schemas (shared)

---

## Shared Components (/shared)

### SH-01: Zod Schemas
- **Responsabilidad**: Schemas de validación compartidos entre frontend y backend
- **Incluye**: Visit schema, Catalog schemas (service types, reasons, zones), User/Role types, API request/response schemas
- **Dependencias**: Zod

### SH-02: TypeScript Types
- **Responsabilidad**: Tipos TypeScript derivados de los Zod schemas
- **Incluye**: Inferred types de todos los schemas, enums de estados y roles
- **Dependencias**: Zod (z.infer)

---

## Infrastructure Components (/infra)

### IN-01: API Stack
- **Responsabilidad**: API Gateway + Lambda functions + permisos IAM
- **Incluye**: REST API Gateway, 3 Lambda functions (visits, catalogs, analytics), IAM roles least-privilege

### IN-02: Auth Stack
- **Responsabilidad**: Configuración de Clerk integration
- **Incluye**: Environment variables para Clerk keys por ambiente

### IN-03: Frontend Stack
- **Responsabilidad**: Hosting del frontend (S3 + CloudFront o similar)
- **Incluye**: S3 bucket, CloudFront distribution, DNS configuration

### IN-04: Environment Config
- **Responsabilidad**: Configuración por ambiente (dev/staging/prod)
- **Incluye**: Environment-specific parameters, Clerk keys, API URLs
