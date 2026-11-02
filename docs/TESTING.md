# Shopnix — Quality Assurance & Testing Strategy

This document specifies the testing methodology, test suites, coverage standards, and verification commands for Shopnix.

---

## 1. Testing Pyramid & Tooling

```
                     ▲
                    / \
                   /   \
                  / E2E \       Playwright
                 / Tests \      Critical User Journeys
                /─────────\
               /  Boundary \    Vitest + Supertest
              / Integration \   API Endpoints, Database & Auth
             /───────────────\
            /   Unit Tests    \ Vitest + React Testing Library
           /───────────────────\ Shared Schemas, Utils, State, Pure Logic
```

- **Unit Testing Runner:** **Vitest** for both frontend and backend packages due to its instant start time, native ESM/TypeScript handling, and compatibility with Vite/React ecosystem.
- **Frontend Component Testing:** **React Testing Library** paired with `@testing-library/jest-dom`.
- **Backend API Integration Testing:** **Supertest** executing against live test database instances.
- **End-to-End Testing:** **Playwright** driving browser automation.

---

## 2. Test Suites & Coverage Targets

### 2.1 Shared Schemas & Contracts (`packages/schemas`, `packages/utils`)
- **Target Coverage:** 95%+
- **Focus Areas:**
  - Zod validation success and error normalization for Auth, Product, Order, Inventory, and Courier schemas.
  - Currency formatting (BDT / ৳), date localization, slug generation, and tax/margin calculations.

### 2.2 Backend Domain & API (`apps/api`)
- **Target Coverage:** 85%+
- **Focus Areas:**
  - **Authentication & Security:** Register, login, invalid credential rejection, password hashing, JWT expiration, refresh token rotation, token replay detection.
  - **Tenant Isolation:** Enforcing that organization A cannot read, query, update, or soft-delete records belonging to organization B.
  - **RBAC Enforcements:** Role guards preventing `staff` from accessing financial reports or modifying team configurations.
  - **Order State Machine:** Preventing illegal status transitions (e.g., transition directly from `pending` to `delivered` bypassing `shipped`).
  - **Courier Adapters:** Mock verification for Steadfast, Pathao, RedX, eCourier payloads and status mapping.

### 2.3 Frontend Components & State (`apps/web`)
- **Target Coverage:** 80%+
- **Focus Areas:**
  - Reusable components (`PageHeader`, `StatCard`, `StatusBadge`, `ConfirmDialog`, `DataTable`).
  - React Hook Form validation rendering proper field error feedback from Zod schemas.
  - Zustand store state mutations and selectors.

---

## 3. Test Execution Commands

```bash
# Execute unit and contract tests across all workspaces
bun run test

# Run tests in watch mode during development
bun run test:watch

# Execute backend integration tests
bun --filter api test:integration

# Execute frontend component tests
bun --filter web test

# Execute Playwright E2E test suite
bunx playwright test
```

---

## 4. Pre-Commit & Continuous Integration Verification Gate
Before any branch or phase completion is certified:
1. `bun run typecheck` (zero TypeScript diagnostics).
2. `bun run lint` (zero ESLint errors).
3. `bun run test` (all unit and integration tests passing).
4. `bun run build` (successful compilation of all apps and packages).
