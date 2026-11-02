# Rule 03: Frontend Architecture & React Standards

1. **Next.js 16 App Router Conventions:**
   - Organize routes using route groups:
     - `(marketing)`: Public landing page, features, pricing.
     - `(auth)`: Login, registration, password recovery.
     - `(dashboard)`: Multi-tenant application shell protected by middleware.
   - Use layout nesting effectively. The dashboard shell (`app/(dashboard)/layout.tsx`) handles sidebar persistence, top navigation, breadcrumbs, and command palette.

2. **Server vs. Client Components:**
   - Default to React Server Components (RSC) for data fetching, static layout rendering, and security.
   - Restrict `'use client'` to the leaves of the component tree: interactive forms, dropdowns, modal dialogs, and components binding browser event listeners.

3. **Data Fetching & Server State:**
   - Use **TanStack React Query v5** for all client-side server state management.
   - Encapsulate query keys in factory objects:
     ```typescript
     export const productKeys = {
       all: ['products'] as const,
       lists: () => [...productKeys.all, 'list'] as const,
       list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
       details: () => [...productKeys.all, 'detail'] as const,
       detail: (id: string) => [...productKeys.details(), id] as const,
     };
     ```
   - Invalidate queries intentionally upon successful mutations.

4. **Client-Side Global State:**
   - Use **Zustand** exclusively for client UI state (sidebar collapsed state, active filters, command palette toggle, notifications modal).
   - Never put server data into Zustand when TanStack Query already caches it.

5. **Form Management:**
   - All interactive forms must utilize **React Hook Form** paired with `@hookform/resolvers/zod`.
   - Provide field-level feedback with accessible error messages immediately upon validation failure.
