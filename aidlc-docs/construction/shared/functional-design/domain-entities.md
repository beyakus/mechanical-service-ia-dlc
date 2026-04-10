# Domain Entities - Unit: shared

## Enums

### VisitStatus
```
SCHEDULED        = "scheduled"          // Programada
COMPLETED        = "completed"          // Realizada exitosamente
CANCELLED        = "cancelled"          // Cancelada
RESCHEDULED      = "rescheduled"        // Reagendada
FINALIZED        = "finalized"          // Finalizada exitosamente
```

### Role
```
TECHNICIAN       = "technician"         // Técnico mecánico
SUPERVISOR       = "supervisor"         // Supervisor de zona
ADMIN            = "admin"              // Administrador del sistema
```

### ReasonType
```
CANCELLATION     = "cancellation"       // Motivo de cancelación
RESCHEDULE       = "reschedule"         // Motivo de reagendamiento
```

### HistoryChangeType
```
CREATED          = "created"
RESCHEDULED      = "rescheduled"
CANCELLED        = "cancelled"
COMPLETED        = "completed"
FINALIZED        = "finalized"
REASSIGNED       = "reassigned"
```

---

## Entities

### Visit
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID v4 | Sí | Identificador único |
| date | ISO date string | Sí | Fecha de la visita (YYYY-MM-DD) |
| time | string (HH:mm) | Sí | Hora de la visita |
| clientName | string | Sí | Nombre del cliente |
| location | string | Sí | Dirección/ubicación |
| status | VisitStatus | Sí | Estado actual |
| technicianId | UUID v4 | No | Técnico asignado (null si es por equipo) |
| technicianName | string | No | Nombre del técnico |
| teamId | UUID v4 | No | Equipo asignado (null si es individual) |
| teamName | string | No | Nombre del equipo |
| serviceTypeId | UUID v4 | Sí | Tipo de servicio |
| serviceTypeName | string | Sí | Nombre del tipo de servicio |
| description | string | No | Descripción del problema |
| notes | string | No | Notas del técnico (al completar) |
| reasonId | UUID v4 | No | Motivo de cancelación/reagendamiento |
| reasonText | string | No | Texto del motivo |
| zoneId | UUID v4 | Sí | Zona geográfica |
| zoneName | string | Sí | Nombre de la zona |
| history | HistoryEntry[] | Sí | Historial de cambios |
| createdAt | ISO datetime | Sí | Fecha de creación |
| updatedAt | ISO datetime | Sí | Última actualización |
| createdBy | UUID v4 | Sí | Usuario que creó |

### HistoryEntry
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID v4 | Sí | Identificador único |
| changeType | HistoryChangeType | Sí | Tipo de cambio |
| changedAt | ISO datetime | Sí | Fecha/hora del cambio |
| changedBy | UUID v4 | Sí | Usuario que realizó el cambio |
| changedByName | string | Sí | Nombre del usuario |

### ServiceType (Catálogo)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID v4 | Sí | Identificador único |
| name | string | Sí | Nombre del tipo de servicio |
| description | string | No | Descripción |
| isActive | boolean | Sí | Activo/inactivo |
| createdAt | ISO datetime | Sí | Fecha de creación |
| updatedAt | ISO datetime | Sí | Última actualización |

### Reason (Catálogo)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID v4 | Sí | Identificador único |
| name | string | Sí | Nombre del motivo |
| type | ReasonType | Sí | Tipo: cancelación o reagendamiento |
| isActive | boolean | Sí | Activo/inactivo |
| createdAt | ISO datetime | Sí | Fecha de creación |
| updatedAt | ISO datetime | Sí | Última actualización |

### Zone (Catálogo)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | UUID v4 | Sí | Identificador único |
| name | string | Sí | Nombre de la zona |
| description | string | No | Descripción |
| isActive | boolean | Sí | Activo/inactivo |
| createdAt | ISO datetime | Sí | Fecha de creación |
| updatedAt | ISO datetime | Sí | Última actualización |

### UserContext (extraído del JWT)
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| userId | UUID v4 | Sí | ID del usuario en Clerk |
| role | Role | Sí | Rol del usuario |
| zoneId | UUID v4 | No | Zona asignada (para técnicos y supervisores) |
| teamId | UUID v4 | No | Equipo asignado (para técnicos) |
| name | string | Sí | Nombre del usuario |

---

## Relaciones

```
Visit ──────── ServiceType     (N:1, cada visita tiene un tipo de servicio)
Visit ──────── Reason          (N:1, opcional, motivo de cancelación/reagendamiento)
Visit ──────── Zone            (N:1, cada visita pertenece a una zona)
Visit ──────── HistoryEntry    (1:N, cada visita tiene múltiples entradas de historial)
Visit ──────── UserContext      (N:1, técnico asignado)
Reason ─────── ReasonType      (N:1, cada motivo es de cancelación o reagendamiento)
```
