# Shopnix — System Architecture Specification

## 1. Architectural Overview

Shopnix is designed as a modular, full-stack multi-tenant SaaS application orchestrated in a Turborepo monorepo powered by Bun. It strictly enforces separation of concerns between presentation, orchestration, domain logic, and persistent storage.

```
                              ┌──────────────────────────────────────────────┐
                              │               CLIENT BROWSER                 │
                              │ (Desktop, Tablet, Mobile / Responsive PWA)   │
                              └──────────────────────┬───────────────────────┘
                                                     │ HTTPS (REST / SSE)
                                                     ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          TURBOREPO MONOREPO                                            │
│                                                                                                        │
│  ┌──────────────────────────────────────────────────┐  ┌────────────────────────────────────────────┐  │
│  │                    apps/web                      │  │                  apps/api                  │  │
│  │               (Next.js 16 App Router)            │  │                (NestJS 12)                 │  │
│  │                                                  │  │                                            │  │
│  │  - App Router: (marketing), (auth), (dashboard)  │  │  - AppModule, AuthModule, UserModule       │  │
│  │  - Components: shared/, data-display/, media/    │  │  - OrgModule, ProductModule, OrderModule   │  │
│  │  - State: Zustand (client), React Query (server) │  │  - InventoryModule, CustomerModule         │  │
│  │  - Tailwind CSS 4 + shadcn/ui + Motion           │  │  - CourierModule (Adapters + Sandbox)      │  │
│  │  - Recharts for visual analytics                 │  │  - AnalyticsModule, UploadModule           │  │
│  └────────────────────────┬─────────────────────────┘  └─────────────────────┬──────────────────────┘  │
│                           │                                                  │                         │
│                           ▼                                                  ▼                         │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                          packages/*                                              │  │
│  │                                                                                                  │  │
│  │  - @shopnix/types: TypeScript entities, enums, DTO interfaces, query contracts                   │  │
│  │  - @shopnix/schemas: Universal Zod validation schemas (Auth, Product, Order, Inventory, Courier) │  │
│  │  - @shopnix/api-client: Strongly typed HTTP client with auth token interceptor & refresh loop    │  │
│  │  - @shopnix/utils: Date formatters, currency helpers (BDT/৳), slugifiers, string utils           │  │
│  │  - @shopnix/config: Shared TypeScript configs                                                    │  │
│  │  - @shopnix/eslint-config: Shared linting standards                                              │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                        │
└────────────────────────────────────────────────────┬───────────────────────────────────────────────────┘
                                                     │
                                                     ▼
                                 ┌───────────────────────────────────────┐
                                 │            INFRASTRUCTURE             │
                                 │                                       │
                                 │   ┌───────────────────────────────┐   │
                                 │   │          MongoDB 8.0          │   │
                                 │   │  - Multi-tenant Collections   │   │
                                 │   │  - Compound Indexes           │   │
                                 │   │  - Transactions               │   │
                                 │   └───────────────────────────────┘   │
                                 │   ┌───────────────────────────────┐   │
                                 │   │          Redis 7.0            │   │
                                 │   │  - Refresh Token Registry     │   │
                                 │   │  - Distributed Cache          │   │
                                 │   │  - Rate Limiting              │   │
                                 │   └───────────────────────────────┘   │
                                 └───────────────────────────────────────┘
```

---

## 2. Monorepo Organization & Boundary Rules

### 2.1 Workspace Structure
- `apps/web`: Next.js 16 frontend application consuming shared packages.
- `apps/api`: NestJS 12 backend application exposing REST API and OpenAPI specifications.
- `packages/types`: Pure TypeScript interfaces, types, and enums. Zero runtime dependencies.
- `packages/schemas`: Zod schemas defining data shape and validation rules. Reused identically between client forms and backend validation pipes.
- `packages/api-client`: Universal Axios/Fetch client configured with bearer token injection, 401 interceptor with automatic token renewal, and typed endpoint methods.
- `packages/utils`: Formatting helpers, currency display, calculation helpers, and error normalization.
- `packages/config`: Centralized `tsconfig.json` base configurations.
- `packages/eslint-config`: Shared ESLint configurations.

### 2.2 Boundary Enforcements
1. **Frontend-to-Backend Direct Imports Forbidden:** `apps/web` never imports from `apps/api`. All communication flows via HTTP through `@shopnix/api-client`.
2. **Shared Package Independence:** Packages inside `packages/*` cannot import from `apps/*`.
3. **Validation Single Source of Truth:** Form validation on the client must use the exact same Zod schema evaluated by NestJS route decorators on the server.

---

## 3. Backend Architecture (NestJS 12)

### 3.1 Modular Decomposition
- **Core Modules:**
  - `ConfigModule`: Validates and parses environment configuration.
  - `DatabaseModule`: Configures Mongoose connection to MongoDB 8.0 with connection pooling and event listeners.
  - `AuthModule`: Manages registration, authentication, JWT issuing, bcrypt hashing, and Redis-backed refresh token rotation.
  - `OrganizationsModule`: Handles tenant profile, settings, currency configuration, and store metadata.
  - `UsersModule`: Manages user profiles, role assignments, and team member invitations.
- **Domain Modules:**
  - `ProductsModule`: Product catalog, variant matrix generation, pricing, categories, and inventory sync.
  - `OrdersModule`: Order ingestion, state transition machine, customer assignment, invoice generation, and timeline logging.
  - `InventoryModule`: Stock ledger, manual adjustments, threshold checks, and inventory movement history.
  - `CustomersModule`: Customer profiles, lifetime value aggregation, and fraud risk tagging.
  - `CouriersModule`: Provider factory, courier adapters (Steadfast, Pathao, RedX, eCourier), consignment generation, tracking synchronization, and webhook handlers.
  - `AnalyticsModule`: High-performance aggregation pipelines for dashboard metrics, revenue trends, and operational KPIs.

### 3.2 Tenant Isolation Mechanism
Every database document belonging to a tenant contains an `organization_id: ObjectId`.
1. **JWT Payload:** Includes `userId`, `email`, `role`, and `organizationId`.
2. **Tenant Extraction Guard:** Extracts `organizationId` and binds it to the incoming request context.
3. **Service Layer Enforcement:** Every service method strictly scopes repository queries using `{ organization_id: req.user.organizationId }`.
4. **Mongoose Middleware:** Base schema hooks ensure queries prevent accidental cross-tenant queries.

### 3.3 Validation Strategy (Zod Standard Schema in NestJS 12)
NestJS 12 introduces native Standard Schema validation. A global `ZodValidationPipe` intercepts incoming request payloads, evaluates them against the designated Zod schema from `@shopnix/schemas`, and returns structured validation errors matching our standard error envelope format:

```json
{
  "status_code": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "regular_price",
      "message": "Regular price must be greater than 0"
    }
  ]
}
```

---

## 4. Frontend Architecture (Next.js 16 + React 19)

### 4.1 Route Architecture
Using the Next.js App Router:
- `app/(marketing)/`: Public landing page, product features, pricing, and contact.
- `app/(auth)/`: Authentication routes (`/login`, `/register`, `/forgot-password`).
- `app/(dashboard)/`: Authenticated multi-tenant application shell.
  - `/dashboard`: Main operational analytics dashboard.
  - `/products`: Catalog table with status filters and search.
  - `/products/new`: Premium two-column product builder.
  - `/products/[id]/edit`: Product editor with live preview.
  - `/orders`: Order management table with status tabs and batch actions.
  - `/orders/[id]`: Detailed order view with timeline, line items, and courier booking.
  - `/inventory`: Warehouse stock overview and adjustment modals.
  - `/customers`: Customer directory with fraud risk badges and order history.
  - `/couriers`: Courier configuration and shipment tracking.
  - `/analytics`: Deep business intelligence and revenue charts.
  - `/settings`: Store settings, team members, roles, and API integrations.

### 4.2 State Management Strategy
- **Server State:** Handled by **TanStack React Query v5**. Manages server caching, background refetching, optimistic updates, and query invalidation.
- **Client UI State:** Handled by **Zustand**. Lightweight stores for sidebar collapse state, command palette visibility, temporary filter selections, and active modals.
- **Form State:** Handled by **React Hook Form** paired with `@hookform/resolvers/zod` consuming schemas directly from `@shopnix/schemas`.

### 4.3 Component File Structure
Following the user-specified architectural requirement, reusable components are organized into dedicated folders with `index.tsx` entry points and aggregated barrel exports:

```
apps/web/src/components/
├── shared/
│   ├── page-header/index.tsx
│   ├── stat-card/index.tsx
│   ├── dashboard-card/index.tsx
│   ├── status-badge/index.tsx
│   ├── empty-state/index.tsx
│   ├── loading-state/index.tsx
│   ├── error-state/index.tsx
│   ├── confirm-dialog/index.tsx
│   ├── form-section/index.tsx
│   ├── responsive-drawer/index.tsx
│   └── index.ts               # Barrel export
├── data-display/
│   ├── data-table/index.tsx
│   ├── search-input/index.tsx
│   ├── filter-dropdown/index.tsx
│   ├── date-range-picker/index.tsx
│   ├── pagination/index.tsx
│   └── index.ts               # Barrel export
├── media/
│   ├── image-uploader/index.tsx
│   └── index.ts               # Barrel export
└── ui/                        # shadcn/ui primitives
    └── index.ts               # Barrel export
```

---

## 5. Courier Integration Adapter Pattern

To isolate the platform from courier API changes, Shopnix utilizes an extensible **Provider Adapter Pattern**:

```
                  ┌───────────────────────────────┐
                  │       ICourierProvider        │
                  │ (TypeScript Interface Contract)│
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ SteadfastAdapter │    │  PathaoAdapter   │    │   RedXAdapter    │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   eCourierAdapter│    │  SandboxAdapter  │    │  (Future 3PLs)   │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

The adapter interface guarantees standard methods across all logistics providers:
- `createConsignment(order: Order, options: ConsignmentOptions): Promise<ConsignmentResult>`
- `trackShipment(consignmentId: string): Promise<TrackingResult>`
- `cancelConsignment(consignmentId: string): Promise<CancelResult>`
- `getDeliveryCharges(params: ChargeEstimationParams): Promise<number>`
- `syncDeliveryStatus(consignmentId: string): Promise<CourierStatusUpdate>`

---

## 6. Security Architecture
1. **Password Storage:** Salted and hashed using `bcrypt` (12 rounds).
2. **Token Security:** Access tokens carry limited lifetimes (15 minutes). Refresh tokens are cryptographically random strings stored with TTL in Redis.
3. **CORS & Headers:** NestJS utilizes `helmet` to establish secure HTTP response headers and limits cross-origin access to authorized domains.
4. **Input Sanitization:** Parameterized MongoDB queries via Mongoose prevent NoSQL injection. Zod schemas strip unlisted fields (`strip` mode).
5. **Rate Limiting:** Guarded by `@nestjs/throttler` backed by Redis to prevent brute force attacks on authentication and order endpoints.
