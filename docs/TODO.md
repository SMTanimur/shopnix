# Shopnix — Development Task Tracker

This checklist tracks real-time progress across all phases of the project.

---

## Phase 0 — Research, Architecture & Agent Engineering Rules
- [x] Analyze reference repository (`morluto/rea`)
- [x] Analyze EcomDrive BD and reverse engineer features
- [x] Research Bangladesh courier APIs (Steadfast, Pathao, RedX, eCourier)
- [x] Deliver research documentation (`docs/REVERSE_ENGINEERING.md`)
- [x] Deliver feature matrix (`docs/FEATURE_MATRIX.md`)
- [x] Deliver PRD (`docs/PRODUCT_REQUIREMENTS.md`)
- [x] Deliver system architecture (`docs/ARCHITECTURE.md`)
- [x] Deliver technology stack specification (`docs/TECH_STACK.md`)
- [x] Deliver implementation plan (`docs/IMPLEMENTATION_PLAN.md`)
- [x] Deliver database architecture (`docs/DATABASE.md`)
- [x] Deliver testing strategy (`docs/TESTING.md`)
- [x] Deliver architectural decisions (`docs/DECISIONS.md`)
- [x] Create `.agent/rules/` (14 rule files)
- [x] Create `.agent/workflows/` (5 workflow files)
- [x] Create `.agent/design/` (5 design files)

---

## Phase 1 — Monorepo Foundation & Tooling
- [ ] Initialize root Turborepo with Bun workspaces
- [ ] Configure root `package.json`, `turbo.json`, `tsconfig.json`
- [ ] Implement `packages/types`
- [ ] Implement `packages/schemas` (Zod schemas)
- [ ] Implement `packages/utils`
- [ ] Implement `packages/api-client`
- [ ] Implement `packages/config` and `packages/eslint-config`
- [ ] Initialize `apps/web` (Next.js 16 + React 19 + Tailwind CSS 4)
- [ ] Initialize `apps/api` (NestJS 12 + Mongoose + Swagger)
- [ ] Configure `docker-compose.yml`, `.env.example`, Dockerfiles

---

## Phase 2 — Design System & Layout Foundation
- [ ] Setup Tailwind CSS 4 OKLCH design tokens in `apps/web`
- [ ] Install and configure shadcn/ui primitives
- [ ] Build shared component library (`apps/web/src/components/shared/`):
  - [ ] `page-header/index.tsx`
  - [ ] `stat-card/index.tsx`
  - [ ] `dashboard-card/index.tsx`
  - [ ] `status-badge/index.tsx`
  - [ ] `empty-state/index.tsx`
  - [ ] `loading-state/index.tsx`
  - [ ] `error-state/index.tsx`
  - [ ] `confirm-dialog/index.tsx`
  - [ ] `form-section/index.tsx`
  - [ ] `responsive-drawer/index.tsx`
  - [ ] `shared/index.ts` (barrel export)
- [ ] Build data-display components (`apps/web/src/components/data-display/`):
  - [ ] `data-table/index.tsx`
  - [ ] `search-input/index.tsx`
  - [ ] `filter-dropdown/index.tsx`
  - [ ] `date-range-picker/index.tsx`
  - [ ] `pagination/index.tsx`
  - [ ] `data-display/index.ts` (barrel export)
- [ ] Build media components (`apps/web/src/components/media/`):
  - [ ] `image-uploader/index.tsx`
  - [ ] `media/index.ts` (barrel export)
- [ ] Implement Dashboard Layout (Collapsible sidebar, TopNav, Breadcrumbs, Mobile drawer)
- [ ] Implement Global Command Palette (⌘K)

---

## Phase 3 — Authentication & SaaS Multi-Tenancy
- [ ] Backend: MongoDB User and Organization schemas
- [ ] Backend: AuthModule (Register, Login, JWT, Refresh Token Rotation with Redis)
- [ ] Backend: Tenant extraction guard and RBAC authorization guard
- [ ] Frontend: Login and Registration pages
- [ ] Frontend: Zustand Auth store & TanStack Query auth hooks
- [ ] Frontend: Next.js auth route protection middleware
- [ ] Frontend: Silent token refresh Axios interceptor

---

## Phase 4 — Core Ecommerce Operations Modules
- [ ] **4A: Analytics Dashboard**
  - [ ] Backend: Aggregation endpoints for KPIs, revenue trend, and recent orders
  - [ ] Frontend: Dashboard view with StatCards, Recharts Area/Bar charts, and Recent Orders
- [ ] **4B: Product Management & Builder**
  - [ ] Backend: Product schema, CRUD, category, and duplicate endpoints
  - [ ] Frontend: Product catalog table with status filters and search
  - [ ] Frontend: Premium Two-Column Product Builder with live storefront preview
- [ ] **4C: Order Management**
  - [ ] Backend: Order schema, status transition state machine, timeline audit logs
  - [ ] Frontend: Order data table with status tabs and batch actions
  - [ ] Frontend: Order detail view with item breakdown, customer summary, and timeline
- [ ] **4D: Inventory Management**
  - [ ] Backend: Stock ledger, inventory movement schema, manual adjustment endpoint
  - [ ] Frontend: Stock overview table and manual adjustment dialog
- [ ] **4E: Customer Management**
  - [ ] Backend: Customer schema with auto-calculated LTV and return rate
  - [ ] Frontend: Customer directory and 360° customer profile view

---

## Phase 5 — Bangladesh Courier Integrations
- [ ] Backend: `CourierProvider` interface definition
- [ ] Backend: `SandboxAdapter` implementation
- [ ] Backend: `SteadfastAdapter` implementation
- [ ] Backend: `PathaoAdapter` implementation
- [ ] Backend: `RedXAdapter` implementation
- [ ] Backend: `ECourierAdapter` implementation
- [ ] Backend: Courier configuration and consignment dispatch endpoints
- [ ] Frontend: Courier settings panel and order consignment booking modal

---

## Phase 6 — Analytics, Settings & Operations
- [ ] Analytics page with date-range filters and breakdown metrics
- [ ] Store Settings, team members, and role assignment UI
- [ ] CSV export functionality for orders, products, and inventory

---

## Phase 7 — Verification, Quality Assurance & Production Readiness
- [ ] Automated tests: Unit, schema validation, and integration tests
- [ ] TypeScript strict mode verification (`turbo typecheck` - 0 errors)
- [ ] Linting verification (`turbo lint` - 0 errors)
- [ ] Production build verification (`turbo build`)
- [ ] Docker Compose verification and documentation
