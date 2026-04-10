# NFR Design Patterns - Unit: api

---

## Pattern 1: Auth Middleware Chain (SECURITY-08, SECURITY-12)

**Problema**: Garantizar que toda request pase por autenticación y autorización antes de llegar al handler.

**Patrón**: Middleware chain ejecutado antes de cada route handler:
1. `extractToken()` — extrae Bearer token del header Authorization
2. `verifyToken()` — verifica JWT con Clerk Backend SDK (signature, expiration, audience)
3. `extractUserContext()` — extrae userId, role, zoneId, teamId del JWT claims
4. `checkPermission()` — verifica que el rol tiene permiso para la acción del endpoint

**Fail behavior**:
- Token missing/invalid → 401 Unauthorized (fail closed)
- Role insufficient → 403 Forbidden (fail closed)
- Clerk SDK error → 401 Unauthorized (fail closed, no fail open)

---

## Pattern 2: Global Error Handler (SECURITY-09, SECURITY-15)

**Problema**: Capturar todas las excepciones y retornar respuestas seguras.

**Patrón**: Try/catch wrapper en el entry point de cada Lambda:
```
try {
  const response = await routeRequest(event);
  return response;
} catch (error) {
  logger.error({ error: error.message, requestId });
  return buildErrorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
}
```

**Reglas**:
- Nunca exponer stack traces, paths internos o detalles de framework
- Errores conocidos (ValidationError, NotFoundError, etc.) retornan su status code específico
- Errores desconocidos siempre retornan 500 con mensaje genérico
- Todos los errores se loguean con correlation ID

---

## Pattern 3: Structured Logger (SECURITY-03)

**Problema**: Logging consistente y seguro en todas las Lambdas.

**Patrón**: Logger singleton que escribe JSON a stdout:
```typescript
interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  requestId: string;
  method: string;
  path: string;
  userId?: string;
  role?: string;
  statusCode?: number;
  duration?: number;
  message: string;
}
```

**Reglas**:
- Logger inicializado con requestId al inicio de cada invocación
- NO loguear: tokens, passwords, PII, request bodies con datos sensibles
- SÍ loguear: method, path, userId, role, statusCode, duration, error messages

---

## Pattern 4: Declarative Route Map with Path Matching

**Problema**: Routing interno en Lambda sin framework externo.

**Patrón**: Objeto de rutas con path matching que soporta parámetros:
```typescript
const routes: RouteDefinition[] = [
  { method: 'GET', path: '/api/visits', handler: listVisits, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'GET', path: '/api/visits/calendar', handler: getCalendar, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'GET', path: '/api/visits/:id', handler: getVisit, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'POST', path: '/api/visits', handler: createVisit, roles: ['supervisor', 'admin'] },
  // ...
];
```

**Path matching**: Simple regex-based matcher que convierte `:id` a capture groups.
**Role check**: Integrado en la definición de ruta, verificado por el middleware.

---

## Pattern 5: Response Builder with Security Headers (SECURITY-04)

**Problema**: Garantizar headers de seguridad en todas las responses.

**Patrón**: Función `buildResponse()` que siempre incluye security headers:
```typescript
function buildResponse(statusCode: number, body: unknown): ApiResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
  };
}
```

Nunca construir responses manualmente — siempre usar `buildResponse()`.

---

## Pattern 6: Service Layer with Role-Based Filtering (SECURITY-08)

**Problema**: Garantizar que cada usuario solo vea datos que le corresponden.

**Patrón**: Cada método del service recibe `UserContext` y filtra datos según rol:
```typescript
async list(filters: VisitFilters, user: UserContext): Promise<PaginatedResult<Visit>> {
  let visits = repository.getAll();
  
  // Role-based filtering (SECURITY-08: object-level authorization)
  if (user.role === 'technician') {
    visits = visits.filter(v => v.technicianId === user.userId || v.teamId === user.teamId);
  } else if (user.role === 'supervisor') {
    visits = visits.filter(v => v.zoneId === user.zoneId);
  }
  // admin: no filter
  
  // Apply user filters...
  // Paginate...
}
```

---

## Pattern 7: Input Validation Gateway (SECURITY-05)

**Problema**: Validar todo input antes de que llegue a la lógica de negocio.

**Patrón**: Validación como primer paso en cada route handler:
```typescript
async function createVisit(event: ParsedEvent, user: UserContext): Promise<ApiResponse> {
  const input = CreateVisitInputSchema.parse(event.body); // throws ZodError on invalid
  const visit = await visitService.create(input, user);
  return buildResponse(201, visit);
}
```

ZodError capturado por el global error handler → 400 con field-level details.

---

## Pattern 8: Seed Data Module Loading

**Problema**: Datos mock disponibles sin latencia adicional en warm invocations.

**Patrón**: Seed data cargado a nivel de módulo (top-level):
```typescript
// Loaded once at cold start, reused in warm invocations
import seedData from './seed-data.json' assert { type: 'json' };
const store: MockDataStore = Object.freeze(seedData);
```

- `Object.freeze()` previene mutaciones accidentales
- Stateless: cada invocación lee los mismos datos
- Consistente: no hay side effects entre invocaciones
