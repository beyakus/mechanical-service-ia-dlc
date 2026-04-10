# Servicios y Orquestación - Portal de Gestión de Visitas Mecánicas

---

## Patrón de Arquitectura Backend

```
API Gateway → Lambda Handler → Auth Middleware → Service → Repository (Mock)
                                     ↓
                              Zod Validation
```

Cada Lambda sigue el patrón:
1. API Gateway recibe request HTTP
2. Lambda handler parsea el evento
3. Auth middleware verifica JWT de Clerk y extrae rol
4. Zod valida el input
5. Service ejecuta la lógica de negocio
6. Repository accede a los datos (mock)
7. Handler retorna respuesta HTTP

---

## Servicios del Backend

### AuthService
- **Responsabilidad**: Verificar tokens JWT de Clerk, extraer usuario y rol
- **Patrón**: Middleware que se ejecuta antes de cada handler
- **Operaciones**:
  - `verifyToken(token: string)`: Valida JWT con Clerk Backend SDK
  - `extractUserContext(token: string)`: Retorna userId, role, zoneId
  - `checkPermission(role: Role, requiredRoles: Role[])`: Verifica autorización
- **Integración**: Clerk Backend SDK para verificación de tokens
- **Fail behavior**: Retorna 401 si token inválido, 403 si rol insuficiente

### VisitService
- **Responsabilidad**: Lógica de negocio de visitas
- **Orquestación**:
  - `list()`: Filtra visitas según rol (técnico ve las suyas, supervisor ve su zona, admin ve todo)
  - `create()`: Valida datos, crea visita con estado "Programada", registra en historial
  - `reschedule()`: Valida estado actual (debe ser "Programada"), cambia estado a "Reagendada", crea nueva visita "Programada", registra motivo en historial
  - `cancel()`: Valida estado (debe ser "Programada" o "Reagendada"), cambia a "Cancelada", registra motivo
  - `complete()`: Valida estado ("Programada"), cambia a "Realizada exitosamente", registra notas
  - `finalize()`: Valida estado ("Realizada exitosamente"), cambia a "Finalizada exitosamente"
  - `reassign()`: Valida estado ("Programada"), cambia técnico asignado, registra en historial
- **Dependencias**: MockVisitRepository, Zod schemas

### CatalogService
- **Responsabilidad**: CRUD de catálogos del sistema
- **Orquestación**:
  - CRUD operations con validación de Zod
  - Toggle activo/inactivo (no eliminar si hay visitas asociadas)
  - Filtrado de activos/inactivos según contexto (formularios solo activos, admin ve todos)
- **Dependencias**: MockCatalogRepository, Zod schemas

### AnalyticsService
- **Responsabilidad**: Cálculos analíticos y agregaciones
- **Orquestación**:
  - `getSummary()`: Cuenta visitas por estado en el rango de fechas
  - `getCancellationReasons()`: Agrupa cancelaciones por motivo, ordena por frecuencia
  - `getRescheduleReasons()`: Agrupa reagendamientos por motivo, ordena por frecuencia
  - `getTrends()`: Agrupa visitas por período (día/semana/mes) y estado
- **Dependencias**: MockVisitRepository (lectura), Zod schemas

---

## Integración con Clerk

### Frontend (app/)
- **ClerkProvider**: Wraps la app completa, provee contexto de auth
- **useAuth()**: Hook para obtener estado de autenticación
- **useUser()**: Hook para obtener datos del usuario y rol
- **SignIn/SignOut**: Componentes de Clerk para login/logout
- **Protect**: Componente para proteger rutas por rol

### Backend (api/)
- **verifyToken()**: Usa `@clerk/backend` para verificar JWT en cada request
- **Token source**: Header `Authorization: Bearer <token>`
- **Role extraction**: Del JWT claims o metadata de Clerk
- **Caching**: No cache de tokens (verificación en cada request por seguridad)

---

## Flujo de Datos Frontend

```
User Action → TanStack Router (navigation)
           → React Component (UI)
           → TanStack Query Hook (data fetching/mutation)
           → fetch() con Clerk token en header
           → API Gateway
           → Lambda
           → Response
           → TanStack Query cache update
           → React re-render
```

### Invalidación de Cache
- Tras mutación exitosa (crear, reagendar, cancelar, etc.), se invalidan las queries relacionadas
- `useCreateVisit` invalida: `['visits']`, `['calendar']`, `['analytics-summary']`
- `useRescheduleVisit` invalida: `['visits']`, `['calendar']`, `['analytics-summary']`, `['reschedule-reasons']`
- `useCancelVisit` invalida: `['visits']`, `['calendar']`, `['analytics-summary']`, `['cancellation-reasons']`
