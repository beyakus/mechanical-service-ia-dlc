# Business Logic Model - Unit: shared

## Zod Schemas Overview

### Input Schemas (Request Bodies)

#### CreateVisitInput
```
{
  date: string (YYYY-MM-DD, futuro)
  time: string (HH:mm)
  clientName: string (1-200)
  location: string (1-500)
  technicianId?: UUID v4
  teamId?: UUID v4
  serviceTypeId: UUID v4
  zoneId: UUID v4
  description?: string (max 2000)
}
Refinement: al menos uno de technicianId o teamId debe estar presente
```

#### RescheduleInput
```
{
  newDate: string (YYYY-MM-DD, futuro)
  newTime: string (HH:mm)
  reasonId: UUID v4
}
```

#### CancelInput
```
{
  reasonId: UUID v4
}
```

#### CompleteInput
```
{
  notes?: string (max 2000)
}
```

#### FinalizeInput
```
{
  notes?: string (max 2000)
}
```

#### ReassignInput
```
{
  newTechnicianId: UUID v4
}
```

### Catalog Input Schemas

#### CreateServiceTypeInput
```
{
  name: string (1-100)
  description?: string (max 500)
}
```

#### UpdateServiceTypeInput
```
{
  name?: string (1-100)
  description?: string (max 500)
}
```

#### CreateReasonInput
```
{
  name: string (1-100)
  type: ReasonType ("cancellation" | "reschedule")
}
```

#### UpdateReasonInput
```
{
  name?: string (1-100)
}
```

#### CreateZoneInput
```
{
  name: string (1-100)
  description?: string (max 500)
}
```

#### UpdateZoneInput
```
{
  name?: string (1-100)
  description?: string (max 500)
}
```

### Filter Schemas

#### VisitFilters
```
{
  status?: VisitStatus
  technicianId?: UUID v4
  zoneId?: UUID v4
  serviceTypeId?: UUID v4
  startDate?: string (YYYY-MM-DD)
  endDate?: string (YYYY-MM-DD)
  page?: number (>= 1, default 1)
  pageSize?: number (1-100, default 20)
}
Refinement: si startDate y endDate presentes, startDate <= endDate
```

#### CalendarFilters
```
{
  startDate: string (YYYY-MM-DD)
  endDate: string (YYYY-MM-DD)
  technicianId?: UUID v4
  teamId?: UUID v4
  status?: VisitStatus
}
Refinement: startDate <= endDate
```

#### AnalyticsFilters
```
{
  startDate: string (YYYY-MM-DD)
  endDate: string (YYYY-MM-DD)
  technicianId?: UUID v4
  zoneId?: UUID v4
}
Refinement: startDate <= endDate
```

### Output Schemas

#### PaginatedResult<T>
```
{
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

#### ApiError
```
{
  error: string
  message: string
  statusCode: number
  details?: Record<string, string[]>  // field-level validation errors
}
```

#### VisitSummary (Analytics)
```
{
  scheduled: number
  completed: number
  cancelled: number
  rescheduled: number
  finalized: number
  total: number
}
```

#### ReasonCount (Analytics)
```
{
  reasonId: UUID v4
  reasonName: string
  count: number
  percentage: number
}
```

#### TrendData (Analytics)
```
{
  period: string (YYYY-MM-DD)
  scheduled: number
  completed: number
  cancelled: number
  rescheduled: number
  finalized: number
}
```

#### CalendarVisit (subset for calendar rendering)
```
{
  id: UUID v4
  date: string
  time: string
  clientName: string
  location: string
  status: VisitStatus
  technicianName?: string
  teamName?: string
  serviceTypeName: string
}
```

---

## Testable Properties (PBT-01)

### Round-Trip Properties (PBT-02)
| Property | Description |
|----------|-------------|
| Schema parse → serialize → parse | Zod schema parse of valid data, serialize to JSON, re-parse should yield identical result |
| Enum serialize → deserialize | VisitStatus, Role, ReasonType enum values round-trip through JSON |
| Date format parse → format | ISO date strings parsed and re-formatted should be identical |

### Invariant Properties (PBT-03)
| Property | Description |
|----------|-------------|
| PaginatedResult consistency | `totalPages === Math.ceil(total / pageSize)` for all valid total/pageSize |
| PaginatedResult data bounds | `data.length <= pageSize` always |
| VisitFilters date ordering | If both startDate and endDate present, startDate <= endDate (enforced by refinement) |
| ReasonCount percentages | Sum of all percentages in a ReasonCount[] should equal ~100% (within floating point tolerance) |
| VisitSummary total | `total === scheduled + completed + cancelled + rescheduled + finalized` |

### Idempotency Properties (PBT-04)
| Property | Description |
|----------|-------------|
| Schema validation idempotency | `schema.parse(schema.parse(data))` should equal `schema.parse(data)` for all valid inputs |

### Components with No PBT Properties
| Component | Rationale |
|-----------|-----------|
| Enums | Simple string unions, no transformation logic |
| ApiError schema | Simple structure, no business logic |
