# NFR Requirements - Unit: app

---

## NFR-APP-01: Seguridad (SECURITY-04, SECURITY-08, SECURITY-12)
- Clerk handles authentication (login, logout, session management)
- Session cookies: Secure, HttpOnly, SameSite (managed by Clerk)
- Route protection: all routes require auth except /login
- Role-based route guards: analytics (supervisor+), admin (admin only)
- CSP headers configured via TanStack Start middleware
- No hardcoded API keys — env vars for Clerk publishable key and API URL

## NFR-APP-02: Performance
- TanStack Start with SSR for initial load
- Lazy loading of routes (code splitting per page)
- TanStack Query cache: stale times optimized per data type
- Target: initial load < 3s, route transitions < 500ms
- react-big-calendar: virtualized rendering for large datasets
- Recharts: lazy loaded only on analytics page

## NFR-APP-03: Accesibilidad (RNF-07)
- shadcn/ui provides accessible components (keyboard nav, ARIA)
- All form inputs have labels
- Color contrast meets WCAG AA
- Focus management on dialog open/close
- data-testid attributes on interactive elements

## NFR-APP-04: Testing
- Vitest as test runner (consistent with shared/api)
- fast-check for PBT on utility functions
- Component tests with Vitest + React Testing Library
- PBT for: role visibility logic, action-status mapping, status badge mapping

## NFR-APP-05: Build & Bundle
- TanStack Start build (Vite-based)
- Tailwind CSS purging for production
- Environment variables: VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY
- Source maps in dev, disabled in prod

## NFR-APP-06: Supply Chain (SECURITY-10)
- Lock file committed
- Exact versions pinned
- No unused dependencies
- npm audit in CI
