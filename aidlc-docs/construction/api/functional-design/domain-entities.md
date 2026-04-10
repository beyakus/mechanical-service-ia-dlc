# Domain Entities - Unit: api

## API-Specific Structures

### ParsedEvent (normalized from API Gateway event)
```typescript
interface ParsedEvent {
  method: string;              // GET, POST, PUT, DELETE
  path: string;                // /api/visits, /api/visits/:id
  pathParameters: Record<string, string>;  // { id: "uuid" }
  queryStringParameters: Record<string, string>;
  body: unknown;               // Parsed JSON body
  headers: Record<string, string>;
  requestId: string;           // API Gateway request ID
}
```

### ApiResponse
```typescript
interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;  // JSON stringified
}
```

### Standard Response Headers
```typescript
{
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Access-Control-Allow-Origin': '<configured-origin>',  // NOT wildcard
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}
```

### Mock Data Store Structure
```typescript
interface MockDataStore {
  visits: Visit[];
  serviceTypes: ServiceType[];
  reasons: Reason[];
  zones: Zone[];
  technicians: UserContext[];  // For lookup during reassignment
}
```

Loaded from `api/src/repositories/seed-data.json` at module level.

---

## Testable Properties (PBT-01)

### Round-Trip Properties (PBT-02)
| Property | Description |
|----------|-------------|
| Request parse → response serialize | Valid API Gateway event parsed and response serialized should produce valid JSON |
| Seed data load → schema validate | All seed data entries should pass Zod schema validation |

### Invariant Properties (PBT-03)
| Property | Description |
|----------|-------------|
| Auth middleware always runs | Every non-OPTIONS request goes through auth (no bypass) |
| Role filtering consistency | Technician never sees visits outside their assignment |
| State transition validity | Service layer only allows transitions defined in VALID_TRANSITIONS |
| Pagination bounds | Response data.length <= pageSize always |
| Analytics totals | VisitSummary.total === sum of all status counts |

### Stateful Properties (PBT-06)
| Property | Description |
|----------|-------------|
| Visit state machine | Random sequence of valid operations on a visit maintains consistent state |

### Components with No PBT Properties
| Component | Rationale |
|-----------|-----------|
| Auth middleware (Clerk integration) | External service, tested via integration/mocking |
| Logger | Side-effect only, no transformations |
