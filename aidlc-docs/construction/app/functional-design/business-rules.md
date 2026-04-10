# Business Rules - Unit: app (Frontend)

## BR-APP-01: Visibility by Role

### Sidebar Menu
| Menu Item | Técnico | Supervisor | Admin |
|-----------|---------|-----------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| Calendario | ✅ | ✅ | ✅ |
| Visitas | ✅ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Catálogos | ❌ | ❌ | ✅ |

### Dashboard
- Técnico: summary de sus visitas
- Supervisor: summary de visitas de su zona
- Admin: summary global

### Calendar
- Técnico: ve solo sus visitas
- Supervisor: ve visitas de su zona, puede filtrar por técnico
- Admin: ve todas, puede filtrar por zona y técnico

### Visits Table
- Técnico: ve solo sus visitas, no puede crear ni cancelar
- Supervisor: ve visitas de su zona, puede crear/cancelar/reagendar/reasignar
- Admin: ve todas, puede hacer todo

## BR-APP-02: Actions by Visit Status

| Acción | SCHEDULED | COMPLETED | CANCELLED | RESCHEDULED | FINALIZED |
|--------|-----------|-----------|-----------|-------------|-----------|
| Reagendar | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cancelar | ✅ | ❌ | ❌ | ❌ | ❌ |
| Completar | ✅ (técnico) | ❌ | ❌ | ❌ | ❌ |
| Finalizar | ❌ | ✅ (sup/admin) | ❌ | ❌ | ❌ |
| Reasignar | ✅ (sup/admin) | ❌ | ❌ | ❌ | ❌ |
| Ver detalle | ✅ | ✅ | ✅ | ✅ | ✅ |

### Button Rendering Logic
```
showReschedule = status === 'scheduled' && (role !== 'technician' || isOwnVisit)
showCancel = status === 'scheduled' && role !== 'technician'
showComplete = status === 'scheduled' && role === 'technician' && isOwnVisit
showFinalize = status === 'completed' && role !== 'technician'
showReassign = status === 'scheduled' && role !== 'technician'
```

## BR-APP-03: Navigation & Redirects

| Condición | Redirect |
|-----------|---------|
| No autenticado + ruta protegida | → /login |
| Autenticado + /login | → /dashboard |
| Autenticado + / | → /dashboard |
| Técnico + /analytics | → /dashboard (403 page) |
| Técnico + /admin/* | → /dashboard (403 page) |
| Supervisor + /admin/* | → /dashboard (403 page) |

## BR-APP-04: Status Badge Colors

| Status | Color | Badge Text |
|--------|-------|-----------|
| scheduled | blue | Programada |
| completed | green | Realizada |
| cancelled | red | Cancelada |
| rescheduled | yellow | Reagendada |
| finalized | purple | Finalizada |

## Testable Properties (PBT-01)

### Invariant Properties (PBT-03)
| Property | Description |
|----------|-------------|
| Role visibility consistency | Menu items shown match role permissions — never show items user can't access |
| Action-status consistency | Buttons shown match VALID_TRANSITIONS — never show action for invalid transition |
| Status badge mapping | Every VisitStatus value has a corresponding color and label |

### Components with No PBT Properties
| Component | Rationale |
|-----------|-----------|
| Layout/Sidebar | Pure UI rendering, no business logic |
| Charts (Recharts) | Third-party rendering, tested by library |
| Calendar (react-big-calendar) | Third-party rendering, tested by library |
