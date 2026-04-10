# Business Logic Model - Unit: api

## Request Handling Flow

```
API Gateway Event
    |
    v
Lambda Handler
    |
    +--> Parse event (path, method, body, headers, pathParameters, queryStringParameters)
    |
    +--> Route Map lookup (method + path → handler function)
    |        |
    |        +--> 404 if no match
    |
    +--> Auth Middleware
    |        |
    |        +--> Extract Bearer token from Authorization header
    |        +--> Verify JWT with Clerk Backend SDK
    |        +--> Extract UserContext (userId, role, zoneId, teamId, name)
    |        +--> 401 if token invalid/missing
    |        +--> 403 if role insufficient for endpoint
    |
    +--> Input Validation (Zod schema.parse)
    |        |
    |        +--> 400 with field-level errors if invalid
    |
    +--> Service Layer
    |        |
    |        +--> Business logic execution
    |        +--> Role-based data filtering
    |        +--> State transition validation
    |
    +--> Repository Layer (Mock)
    |        |
    |        +--> Read from static JSON seed data
    |        +--> Filter/transform in memory
    |
    +--> Response Builder
             |
             +--> 200/201 with JSON body on success
             +--> Structured ApiError on failure
```

## Declarative Route Map Pattern

Each Lambda defines a route map object:

```typescript
type RouteHandler = (event: ParsedEvent, ctx: UserContext) => Promise<ApiResponse>;

type RouteMap = Record<string, Record<string, RouteHandler>>;
// Example: { 'GET': { '/api/visits': listVisits, '/api/visits/:id': getVisit } }
```

The handler function:
1. Parses the API Gateway event into a normalized `ParsedEvent`
2. Looks up `routeMap[method][matchedPath]`
3. If found, runs auth middleware then calls the handler
4. If not found, returns 404

## Error Handling Strategy

### Error Types
| Error | HTTP Status | When |
|-------|------------|------|
| ValidationError | 400 | Zod parse fails |
| UnauthorizedError | 401 | Missing/invalid JWT |
| ForbiddenError | 403 | Role insufficient |
| NotFoundError | 404 | Resource not found / route not found |
| ConflictError | 409 | Invalid state transition |
| InternalError | 500 | Unexpected error |

### Error Response Format (SECURITY-09, SECURITY-15)
```typescript
{
  error: string;       // Error code (e.g., "VALIDATION_ERROR")
  message: string;     // Generic user-safe message
  statusCode: number;
  details?: Record<string, string[]>;  // Field-level errors (validation only)
}
```

- Production: NO stack traces, NO internal paths, NO framework details
- All errors caught by global error handler
- All errors logged with correlation ID (SECURITY-03)

## Logging Strategy (SECURITY-03)

### Structured Log Format
```typescript
{
  timestamp: string;       // ISO 8601
  level: 'INFO' | 'WARN' | 'ERROR';
  requestId: string;       // API Gateway requestId (correlation ID)
  method: string;          // HTTP method
  path: string;            // Request path
  userId?: string;         // Authenticated user ID
  role?: string;           // User role
  statusCode?: number;     // Response status
  duration?: number;       // Request duration ms
  message: string;
  error?: string;          // Error message (no stack trace in prod)
}
```

- Logger outputs to stdout (CloudWatch picks up automatically)
- NO PII, tokens, or passwords in logs
- Correlation ID from API Gateway requestId

## Seed Data (Stateless)

- Static JSON file loaded at module level (cold start)
- Each Lambda invocation reads from the same seed data
- No mutations persist between invocations (stateless)
- Seed data includes: visits (various statuses), service types, reasons, zones, technicians
