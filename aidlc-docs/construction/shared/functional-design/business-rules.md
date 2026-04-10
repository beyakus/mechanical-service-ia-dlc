# Business Rules - Unit: shared

## BR-01: Transiciones de Estado de Visita

### Diagrama de Estados
```
                    +-------------+
                    |  SCHEDULED  |
                    +------+------+
                     / | \    \
                    /  |  \    \
                   v   v   v    v
          RESCHEDULED  |  CANCELLED  COMPLETED
               |       |              |
               v       |              v
          SCHEDULED    |          FINALIZED
          (nueva)      |
                       v
                   COMPLETED
```

### Transiciones Válidas
| Estado Actual | Estado Destino | Acción | Requiere |
|--------------|---------------|--------|----------|
| SCHEDULED | RESCHEDULED | Reagendar | Motivo (reasonId) + nueva fecha |
| SCHEDULED | CANCELLED | Cancelar | Motivo (reasonId) |
| SCHEDULED | COMPLETED | Completar | Notas (opcional) |
| COMPLETED | FINALIZED | Finalizar | Notas de revisión (opcional) |

### Reglas Especiales
- Al reagendar: la visita original cambia a RESCHEDULED y se crea una NUEVA visita con estado SCHEDULED en la nueva fecha
- No se puede reagendar una visita CANCELLED, COMPLETED o FINALIZED
- No se puede cancelar una visita COMPLETED o FINALIZED
- No se puede completar una visita que no esté SCHEDULED
- No se puede finalizar una visita que no esté COMPLETED

---

## BR-02: Permisos por Rol

### Matriz de Permisos
| Acción | Técnico | Supervisor | Admin |
|--------|---------|-----------|-------|
| Ver sus visitas | ✅ | ✅ | ✅ |
| Ver visitas de su zona | ❌ | ✅ | ✅ |
| Ver todas las visitas | ❌ | ❌ | ✅ |
| Crear visita | ❌ | ✅ | ✅ |
| Reagendar visita propia | ✅ | ✅ | ✅ |
| Reagendar visita de otro | ❌ | ✅ (su zona) | ✅ |
| Cancelar visita | ❌ | ✅ (su zona) | ✅ |
| Completar visita propia | ✅ | ❌ | ❌ |
| Finalizar visita | ❌ | ✅ (su zona) | ✅ |
| Reasignar visita | ❌ | ✅ (su zona) | ✅ |
| Ver analytics | ❌ | ✅ (su zona) | ✅ |
| Gestionar catálogos | ❌ | ❌ | ✅ |

### Reglas de Filtrado por Rol
- **Técnico**: ve solo visitas donde `technicianId === userId` O `teamId === userTeamId`
- **Supervisor**: ve visitas donde `zoneId === userZoneId`
- **Admin**: ve todas las visitas sin filtro

---

## BR-03: Validación de Datos

### Visit - Campos Obligatorios
- `date`: formato YYYY-MM-DD, no puede ser fecha pasada (al crear)
- `time`: formato HH:mm (24h)
- `clientName`: string, 1-200 caracteres
- `location`: string, 1-500 caracteres
- `serviceTypeId`: UUID v4 válido, debe existir y estar activo
- `zoneId`: UUID v4 válido, debe existir y estar activo
- Al menos uno de: `technicianId` o `teamId` (no ambos vacíos)

### Visit - Campos Opcionales
- `description`: string, máximo 2000 caracteres
- `notes`: string, máximo 2000 caracteres
- `reasonId`: UUID v4 válido (obligatorio al reagendar/cancelar)

### Catálogos - Validación
- `name`: string, 1-100 caracteres, único dentro de su tipo
- `description`: string, máximo 500 caracteres
- `type` (Reason): debe ser "cancellation" o "reschedule"

### Paginación
- `page`: entero >= 1, default 1
- `pageSize`: entero 1-100, default 20

### Filtros
- `startDate`, `endDate`: formato YYYY-MM-DD, startDate <= endDate
- `status`: valor válido de VisitStatus
- `technicianId`, `zoneId`, `serviceTypeId`: UUID v4 válido

---

## BR-04: Reglas de Catálogos

- No se puede eliminar un catálogo (ServiceType, Reason, Zone) que tenga visitas asociadas
- Solo se puede desactivar (toggle `isActive = false`)
- Los catálogos inactivos NO aparecen en formularios de creación/edición de visitas
- Los catálogos inactivos SÍ aparecen en la vista de admin (para poder reactivarlos)
- Los catálogos inactivos SÍ se muestran en visitas históricas que los referencian
- El nombre del catálogo debe ser único dentro de su tipo (no puede haber dos ServiceTypes con el mismo nombre)

---

## BR-05: Reglas de Historial

- Cada cambio de estado genera una entrada en el historial
- El historial es append-only (no se puede editar ni eliminar)
- Cada entrada registra: tipo de cambio, fecha/hora, usuario que realizó el cambio
- El historial se ordena cronológicamente (más reciente primero al mostrar)
