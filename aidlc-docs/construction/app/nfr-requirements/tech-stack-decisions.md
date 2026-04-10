# Tech Stack Decisions - Unit: app

## Core Dependencies

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| @tanstack/start | ^1.0 | Full-stack React framework (SSR) |
| @tanstack/react-router | ^1.0 | File-based routing |
| @tanstack/react-query | ^5.0 | Data fetching, caching, mutations |
| react | ^19.0 | UI library |
| react-dom | ^19.0 | DOM rendering |
| @clerk/tanstack-start | ^0.5 | Clerk auth integration for TanStack Start |
| tailwindcss | ^4.0 | Utility-first CSS |
| react-big-calendar | ^1.0 | Calendar views (day/week) |
| recharts | ^2.0 | Charts (bar, line) |
| zod | ^3.23 | Form validation (shared schemas) |
| date-fns | ^3.0 | Date utilities (required by react-big-calendar) |

## shadcn/ui Components (copied, not installed as dependency)

Components to include:
- Button, Input, Label, Textarea
- Dialog, Sheet
- Table
- Tabs
- Select
- Badge
- Card
- DropdownMenu
- Toast/Sonner
- Skeleton (loading states)

## Dev Dependencies

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| typescript | ^5.4 | Compilador |
| vitest | ^2.0 | Test runner |
| fast-check | ^3.0 | PBT framework |
| @testing-library/react | ^16.0 | Component testing |
| @testing-library/jest-dom | ^6.0 | DOM matchers |
| eslint | ^9.0 | Linting |
| prettier | ^3.0 | Formatting |
| @vitejs/plugin-react | ^4.0 | Vite React plugin |

## Environment Variables

| Variable | Dev | Staging | Prod |
|----------|-----|---------|------|
| VITE_API_URL | http://localhost:3001 | https://api-staging.domain.com | https://api.domain.com |
| VITE_CLERK_PUBLISHABLE_KEY | pk_test_... | pk_test_... | pk_live_... |

## Security Compliance

| SECURITY Rule | Status | Notes |
|--------------|--------|-------|
| SECURITY-04 | Compliant | CSP, HSTS, X-Content-Type-Options via TanStack Start middleware |
| SECURITY-08 | Compliant | Clerk auth, role-based route guards, token in API calls |
| SECURITY-09 | Compliant | Generic error pages, no internal details exposed |
| SECURITY-10 | Compliant | Lock file, pinned versions |
| SECURITY-11 | Compliant | Auth logic isolated in Clerk integration |
| SECURITY-12 | Compliant | Clerk manages auth, session cookies secure |
| SECURITY-13 | N/A | No CDN external scripts (all bundled) |
| Others | N/A or Deferred | Backend/infra responsibility |

## PBT Compliance

| PBT Rule | Status | Notes |
|----------|--------|-------|
| PBT-01 | Compliant | Properties identified in business-rules.md |
| PBT-09 | Compliant | fast-check selected |
| Others | Deferred | Enforced during Code Generation |
