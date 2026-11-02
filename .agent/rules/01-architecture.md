# Rule 01: System & Monorepo Architecture

1. **Turborepo Workspace Topology:**
   - `apps/web`: Next.js 16 App Router application.
   - `apps/api`: NestJS 12 backend REST and OpenAPI service.
   - `packages/types`: Pure TypeScript interfaces, enums, and entity contracts. Zero runtime dependencies.
   - `packages/schemas`: Universal Zod schemas for input validation and schema contracts.
   - `packages/api-client`: Universal HTTP client with auth refresh interceptor.
   - `packages/utils`: Pure helper functions for formatting, currencies, dates, calculations.
   - `packages/config` & `packages/eslint-config`: Shared configurations.

2. **Strict Workspace Boundaries:**
   - `apps/web` must NEVER import anything directly from `apps/api`.
   - `packages/*` must NEVER import from `apps/*`.
   - Backend-only libraries (e.g., Mongoose, bcrypt, Redis, NestJS internals) must never be imported into shared packages consumed by the browser.

3. **NestJS Modular Architecture:**
   - Organize backend functionality into cohesive NestJS modules (`AuthModule`, `ProductsModule`, `OrdersModule`, `InventoryModule`, `CustomersModule`, `CouriersModule`, `AnalyticsModule`).
   - Controllers must remain thin: they handle HTTP routing, invoke validation pipes, and delegate execution to Services.
   - All business logic lives in injectable `@Injectable()` Services.
   - Database operations are encapsulated in service methods using Mongoose Models.

4. **Frontend Architecture:**
   - Feature-driven organization inside `apps/web/src/features/*` and shared components in `apps/web/src/components/*`.
   - Server Components by default; designate Client Components with `'use client'` only when utilizing state, hooks, or browser event listeners.
