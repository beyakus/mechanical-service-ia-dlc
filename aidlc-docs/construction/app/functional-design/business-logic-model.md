# Business Logic Model - Unit: app

## TanStack Router Structure

```
routes/
├── __root.tsx          → Root layout (ClerkProvider, QueryClientProvider)
├── login.tsx           → Public login page (Clerk SignIn)
├── index.tsx           → Redirect to /dashboard
└── _authenticated.tsx  → Protected layout (requireAuth + Layout shell)
    ├── dashboard.tsx   → Dashboard page
    ├── calendar.tsx    → Calendar page
    ├── visits/
    │   ├── index.tsx   → Visits list page
    │   └── $visitId.tsx → Visit detail page
    ├── analytics.tsx   → Analytics page (supervisor, admin)
    └── admin/
        └── catalogs.tsx → Catalog management (admin only)
```

### Route Protection
- `_authenticated.tsx` uses Clerk's `useAuth()` to check authentication
- Redirects to `/login` if not authenticated
- Role-based route guards:
  - `/analytics` → supervisor, admin only
  - `/admin/*` → admin only
  - All other authenticated routes → all roles

## TanStack Query - Cache Strategy

### Query Keys
```typescript
['visits', filters]           → Visit list
['visits', id]                → Single visit
['calendar', dateRange, filters] → Calendar data
['analytics', 'summary', filters] → Summary
['analytics', 'cancellation-reasons', filters] → Cancellation reasons
['analytics', 'reschedule-reasons', filters] → Reschedule reasons
['analytics', 'trends', filters] → Trends
['catalogs', 'service-types'] → Service types
['catalogs', 'reasons']       → Reasons
['catalogs', 'zones']         → Zones
```

### Cache Invalidation on Mutations
| Mutation | Invalidates |
|----------|------------|
| createVisit | `['visits']`, `['calendar']`, `['analytics']` |
| rescheduleVisit | `['visits']`, `['calendar']`, `['analytics']` |
| cancelVisit | `['visits']`, `['calendar']`, `['analytics']` |
| completeVisit | `['visits', id]`, `['analytics']` |
| finalizeVisit | `['visits', id]`, `['analytics']` |
| reassignVisit | `['visits']`, `['calendar']` |
| createCatalog | `['catalogs', type]` |
| toggleCatalog | `['catalogs', type]` |

### Stale Time
- Visits/Calendar: 30 seconds (frequently changing)
- Analytics: 60 seconds (less frequent)
- Catalogs: 5 minutes (rarely changing)

## API Client

```typescript
// lib/api-client.ts
async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken(); // Clerk getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new ApiClientError(error);
  }
  return response.json();
}
```

## Auth Flow with Clerk

1. User navigates to any authenticated route
2. `_authenticated.tsx` checks `useAuth().isSignedIn`
3. If not signed in → redirect to `/login`
4. `/login` renders `<SignIn />` from Clerk
5. After successful sign-in → Clerk redirects to `/dashboard`
6. `useUser()` provides user metadata (role, zoneId, teamId)
7. Role stored in Clerk user metadata (publicMetadata)
8. Logout: `useClerk().signOut()` → redirect to `/login`

## Form Validation with Zod

All forms use shared Zod schemas for validation:
- `CreateVisitInputSchema` → Create visit form
- `RescheduleInputSchema` → Reschedule dialog
- `CancelInputSchema` → Cancel dialog
- `CompleteInputSchema` → Complete dialog
- `FinalizeInputSchema` → Finalize dialog
- `ReassignInputSchema` → Reassign dialog
- Catalog CRUD schemas → Catalog forms

Validation runs client-side before API call. Server validates again with same schemas.
