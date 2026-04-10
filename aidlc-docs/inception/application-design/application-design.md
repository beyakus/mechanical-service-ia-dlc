# Diseño de Aplicación Consolidado - Portal de Gestión de Visitas Mecánicas

## Decisiones de Arquitectura

| Decisión | Elección | Rationale |
|----------|----------|-----------|
| Estructura de repo | Monorepo con carpetas: /app, /api, /shared, /infra | Simplicidad, sin overhead de workspaces |
| Lambda organization | Una Lambda por dominio: visits, catalogs, analytics | Balance entre granularidad y simplicidad |
| Comunicación FE-BE | REST API convencional | Estándar, bien soportado por TanStack Query |
| Validación compartida | Zod schemas en /shared | Type-safety end-to-end, single source of truth |
| Auth | Clerk (frontend SDK + backend JWT verification) | Managed auth, multi-role support |
| Data layer | Mock repository (in-memory) | DB real diferida a fase posterior |

---

## Resumen de Componentes

### Frontend (8 componentes)
- FE-01: Layout Shell (sidebar, header, navegación por rol)
- FE-02: Auth Pages (login/logout con Clerk)
- FE-03: Calendar Page (vista día/semana)
- FE-04: Visits Management Page (tabla + CRUD + estados)
- FE-05: Dashboard Page (contadores por estado)
- FE-06: Analytics Page (motivos, tendencias)
- FE-07: Admin Catalogs Page (CRUD catálogos)
- FE-08: Shared UI Components (StatusBadge, DataTable, etc.)

### Backend (5 componentes)
- BE-01: Visits Lambda (/api/visits/*)
- BE-02: Catalogs Lambda (/api/catalogs/*)
- BE-03: Analytics Lambda (/api/analytics/*)
- BE-04: Auth Middleware (Clerk JWT verification)
- BE-05: Mock Data Repository (in-memory store)

### Shared (2 componentes)
- SH-01: Zod Schemas (validación compartida)
- SH-02: TypeScript Types (derivados de Zod)

### Infrastructure (4 componentes)
- IN-01: API Stack (API Gateway + Lambdas + IAM)
- IN-02: Auth Stack (Clerk config)
- IN-03: Frontend Stack (S3 + CloudFront)
- IN-04: Environment Config (dev/staging/prod)

---

## API Contract Summary

- 9 endpoints de Visits (CRUD + estados + calendario)
- 12 endpoints de Catalogs (CRUD x 3 catálogos + toggles)
- 4 endpoints de Analytics (summary, cancellation reasons, reschedule reasons, trends)
- Total: 25 endpoints REST

---

## Patrón de Arquitectura

```
Browser → Clerk Auth → TanStack Start (SSR/CSR)
                            ↓
                    TanStack Query → fetch + Bearer token
                            ↓
                    API Gateway (REST)
                            ↓
                    Lambda Handler → Auth MW → Zod Validation → Service → Mock Repository
```

---

## Documentos Detallados
- [components.md](components.md) — Definición completa de componentes
- [component-methods.md](component-methods.md) — Endpoints, interfaces de servicio, hooks
- [services.md](services.md) — Servicios, orquestación, integración con Clerk
- [component-dependency.md](component-dependency.md) — Dependencias y flujos de datos
