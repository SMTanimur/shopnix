# Shopnix — Engineering Implementation Plan

This roadmap outlines the sequential execution phases for engineering the Shopnix platform from initial scaffolding to production readiness.

---

## Phase 0: Research, Architecture & Engineering Rules
- [x] Analyze reference repository (`morluto/rea`) and document findings.
- [x] Analyze EcomDrive BD and document feature set, workflows, and courier ecosystem.
- [x] Deliver research deliverables: `REVERSE_ENGINEERING.md`, `FEATURE_MATRIX.md`, `PRODUCT_REQUIREMENTS.md`, `ARCHITECTURE.md`, `TECH_STACK.md`, `DECISIONS.md`, `DATABASE.md`, `TESTING.md`, `TODO.md`.
- [x] Establish `.agent/` directory with 14 engineering rules, 5 workflows, and 5 design specifications.

---

## Phase 1: Monorepo Foundation & Tooling Setup
- [ ] Initialize root monorepo with Bun workspaces and Turborepo configuration (`turbo.json`, `package.json`, `tsconfig.json`).
- [ ] Initialize shared packages:
  - `packages/types`: Core domain entities (User, Org, Product, Order, Customer, Courier).
  - `packages/schemas`: Shared Zod validation schemas.
  - `packages/utils`: Utility functions, date/currency formatting, error envelopes.
  - `packages/api-client`: Universal HTTP client with token refresh loop.
  - `packages/config` & `packages/eslint-config`: Shared configs.
- [ ] Initialize `apps/web`: Next.js 16 App Router application with Tailwind CSS 4 and TypeScript.
- [ ] Initialize `apps/api`: NestJS 12 application with Mongoose, Swagger, and native Zod validation pipe.
- [ ] Configure Docker & Docker Compose (`docker-compose.yml`, Dockerfiles for web & api, MongoDB 8, Redis 7).
- [ ] Verify root lint, typecheck, and build commands succeed.

---

## Phase 2: Design System & Layout Foundation
- [ ] Configure Tailwind CSS 4 `@theme` with OKLCH tokens (Deep Indigo palette, neutrals, semantics).
- [ ] Setup shadcn/ui primitives adapted for React 19 and Tailwind 4.
- [ ] Implement reusable component library with folder structure (`page-header/index.tsx`, etc.) and barrel exports (`index.ts`):
  - Shared: `PageHeader`, `StatCard`, `DashboardCard`, `StatusBadge`, `EmptyState`, `LoadingState`, `ErrorState`, `ConfirmDialog`, `FormSection`, `ResponsiveDrawer`.
  - Data Display: `DataTable`, `SearchInput`, `FilterDropdown`, `DateRangePicker`, `Pagination`.
  - Media: `ImageUploader`.
- [ ] Implement Dashboard Shell Layout:
  - Collapsible desktop sidebar with smooth Motion transitions.
  - Top navigation bar with logo, global search trigger, notifications trigger, and user profile menu.
  - Global Command Palette (⌘K / Ctrl+K).
  - Mobile slide-out drawer navigation.
  - Dynamic breadcrumb generation.

---

## Phase 3: Multi-Tenant Authentication & SaaS Architecture
- [ ] Backend: MongoDB User and Organization schemas with snake_case field definitions and compound indexes.
- [ ] Backend: AuthModule featuring:
  - Registration (atomic user + organization creation).
  - Login with bcrypt password verification.
  - JWT issuing (access token: 15m).
  - Refresh token rotation (7d) backed by Redis.
  - Tenant extraction guard & RBAC roles guard (`owner`, `admin`, `manager`, `staff`).
- [ ] Frontend:
  - Login page and Registration page.
  - Auth context and Zustand auth store.
  - Next.js middleware for route protection.
  - API client interceptors with seamless silent token refresh.

---

## Phase 4: Core Ecommerce Operations Modules
- [ ] **4A: Analytics Dashboard:**
  - Backend: Metrics aggregation pipelines (Revenue, Order volume, Status counts, Low stock count).
  - Frontend: StatCards, Recharts Revenue Area Chart, Order Trend Bar Chart, Recent Orders stream.
- [ ] **4B: Product Catalog & Two-Column Product Builder:**
  - Backend: Product and ProductVariant schemas, CRUD endpoints, duplicate endpoint, image upload endpoint.
  - Frontend: Product catalog table with status filters, search, and bulk actions.
  - Frontend: Premium Two-Column Product Builder with real-time interactive preview card, variant generator, and unsaved changes guard.
- [ ] **4C: Order Management & Processing:**
  - Backend: Order schema, finite state machine status updates, timeline audit logs, customer binding.
  - Frontend: Order data table with status tabs (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`, `Returned`).
  - Frontend: Order detail view with item breakdown, customer details, timeline logs, and status mutation modal.
- [ ] **4D: Inventory & Warehouse Management:**
  - Backend: Inventory movement audit ledger, manual stock adjustment endpoint, low-stock threshold triggers.
  - Frontend: Stock overview table, manual adjustment modal with reason tracking, stock history drawer.
- [ ] **4E: Customer Relationship Management (CRM):**
  - Backend: Customer schema, auto-aggregation of lifetime value (LTV) and order history, return rate calculation.
  - Frontend: Customer directory table, customer 360° detail profile with fraud risk flags.

---

## Phase 5: Bangladesh Courier Integration Engine
- [ ] Define extensible `CourierProvider` TypeScript interface.
- [ ] Implement provider adapters:
  - `SandboxAdapter`: Simulated responses for offline development and testing.
  - `SteadfastAdapter`: Consignment creation, tracking query, balance inquiry.
  - `PathaoAdapter`: OAuth2 token issuance, city/zone/area lookup, parcel booking.
  - `RedXAdapter`: API token parcel creation and tracking.
  - `ECourierAdapter`: Multi-header consignment booking and status query.
- [ ] Build Courier management UI:
  - Courier credential configuration panel.
  - One-click consignment booking from order detail view.
  - Manual tracking sync trigger and webhook endpoint.

---

## Phase 6: Analytics, Settings & Operational Tools
- [ ] Comprehensive Analytics page: Date-range filtered revenue analytics, order status distribution, best-seller rankings.
- [ ] Store Settings page: Profile management, organization settings, team member management, and role assignment.
- [ ] Data Export: CSV generation for orders, products, and inventory.

---

## Phase 7: Verification, Testing & Production Readiness
- [ ] Complete unit test suite for shared utilities, schemas, and API client.
- [ ] Backend integration tests for authentication, tenant isolation, and product/order CRUD.
- [ ] Strict type checking (`turbo typecheck`) verifying zero TypeScript errors.
- [ ] Linting verification (`turbo lint`) with zero unresolved warnings.
- [ ] Full monorepo production build (`turbo build`).
- [ ] Docker Compose verification: all containers spin up, pass health checks, and communicate properly.
