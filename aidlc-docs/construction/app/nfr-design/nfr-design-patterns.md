# NFR Design Patterns - Unit: app

---

## Pattern 1: Protected Route Layout (SECURITY-08)

**Patrón**: `_authenticated.tsx` como layout wrapper que verifica auth antes de renderizar children.

```
_authenticated.tsx:
  if (!isSignedIn) → redirect to /login
  if (route requires role && user.role not in allowedRoles) → redirect to /dashboard
  else → render <Layout>{children}</Layout>
```

- Clerk `useAuth()` para verificar sesión
- Role check contra metadata del usuario en Clerk
- Todas las rutas hijas heredan la protección automáticamente

---

## Pattern 2: API Client with Token Injection (SECURITY-08)

**Patrón**: Función `apiClient()` centralizada que inyecta Bearer token de Clerk en cada request.

- `getToken()` de Clerk obtiene JWT fresco
- Token incluido en header Authorization
- Error handling: 401 → redirect a login, 403 → toast de error
- Base URL desde env var `VITE_API_URL`

---

## Pattern 3: Optimistic Updates with Query Invalidation

**Patrón**: Mutations con TanStack Query que invalidan queries relacionadas on success.

- `useMutation` con `onSuccess` que llama `queryClient.invalidateQueries()`
- Invalidation keys definidos por mutation type (ver cache invalidation matrix)
- Toast notifications on success/error via Sonner
- Dialog auto-close on mutation success

---

## Pattern 4: Role-Aware Component Rendering

**Patrón**: Hook `useUserRole()` que expone role y helper functions.

```typescript
function useUserRole() {
  const { user } = useUser(); // Clerk
  const role = user?.publicMetadata?.role as Role;
  return {
    role,
    isTechnician: role === 'technician',
    isSupervisor: role === 'supervisor',
    isAdmin: role === 'admin',
    canAccess: (requiredRoles: Role[]) => requiredRoles.includes(role),
  };
}
```

- Sidebar menu items filtered by role
- Action buttons conditionally rendered by role + visit status
- Uses shared `ROLE_PERMISSIONS` and `VALID_TRANSITIONS` constants

---

## Pattern 5: CSP and Security Headers Middleware (SECURITY-04)

**Patrón**: TanStack Start server middleware que agrega security headers a todas las responses HTML.

```typescript
// app.config.ts middleware
{
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}
```

Note: `unsafe-inline` for styles needed by Tailwind. No `unsafe-eval`.

---

## Pattern 6: Lazy Route Loading (Performance)

**Patrón**: TanStack Router lazy routes para code splitting automático.

- Cada página se carga solo cuando se navega a ella
- react-big-calendar y Recharts lazy loaded en sus respectivas páginas
- Skeleton components (shadcn/ui) como loading states

---

## Pattern 7: Form Validation with Shared Schemas

**Patrón**: Zod schemas de shared usados directamente en formularios.

```typescript
// In dialog component
const form = useForm({
  resolver: zodResolver(RescheduleInputSchema),
  defaultValues: { newDate: '', newTime: '', reasonId: '' },
});
```

- Validación client-side con mismos schemas que el backend
- Error messages de Zod mostrados inline en campos
- Submit disabled hasta que form sea válido

---

## Pattern 8: Error Boundary with Generic Messages (SECURITY-09)

**Patrón**: React Error Boundary en el layout que captura errores no manejados.

- Muestra página de error genérica (no stack traces, no detalles internos)
- Log del error a console (dev only)
- Botón de "Volver al inicio" para recovery
- API errors mostrados como toast notifications (mensaje genérico del backend)
