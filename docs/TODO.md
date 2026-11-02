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
- [x] Create `.agent/rules/` (14 rule files: `00-core-principles` to `13-task-completion`)
- [x] Create `.agent/workflows/` (5 workflow files: `new-feature`, `bug-fix`, `refactoring`, `ui-implementation`, `code-review`)
- [x] Create `.agent/design/` (5 design files: `design-system`, `color-tokens`, `typography`, `spacing`, `component-guidelines`)

---

## Phase 1 — Monorepo Foundation & Tooling
- [x] Initialize root Turborepo with Bun workspaces
- [x] Configure root `package.json`, `turbo.json`, `tsconfig.json`
- [x] Implement `packages/types` (User, Org, Product, Order, Inventory, Customer, Courier, Analytics)
- [x] Implement `packages/schemas` (Zod schemas for all domain entities)
- [x] Implement `packages/utils` (Currency BDT, date localization, slug generator, cn)
- [x] Implement `packages/api-client` (Typed HTTP client with 401 token refresh interceptor)
- [x] Implement `packages/config` and `packages/eslint-config`
- [x] Initialize `apps/web` (Next.js 16 App Router + React 19 + Tailwind CSS 4)
- [x] Initialize `apps/api` (NestJS 12 + Mongoose + Swagger + native Zod validation)
- [x] Configure `docker-compose.yml`, `.env.example`, Dockerfiles

---

## Phase 2 — Design System & Layout Foundation
- [x] Setup Tailwind CSS 4 OKLCH design tokens in `apps/web`
- [x] Implement folder-based component architecture with `index.tsx` entry points & barrel exports (`index.ts`)
- [x] Build shared component library (`apps/web/src/components/shared/`):
  - [x] `page-header/index.tsx`
  - [x] `stat-card/index.tsx`
  - [x] `dashboard-card/index.tsx`
  - [x] `status-badge/index.tsx`
  - [x] `empty-state/index.tsx`
  - [x] `loading-state/index.tsx`
  - [x] `error-state/index.tsx`
  - [x] `confirm-dialog/index.tsx`
  - [x] `form-section/index.tsx`
  - [x] `responsive-drawer/index.tsx`
  - [x] `shared/index.ts` (barrel export)
- [x] Build data-display components (`apps/web/src/components/data-display/`):
  - [x] `data-table/index.tsx` (TanStack Table)
  - [x] `search-input/index.tsx` (Debounced search)
  - [x] `filter-dropdown/index.tsx`
  - [x] `date-range-picker/index.tsx`
  - [x] `pagination/index.tsx`
  - [x] `data-display/index.ts` (barrel export)
- [x] Build media components (`apps/web/src/components/media/`):
  - [x] `image-uploader/index.tsx` (Drag-and-drop, multi-file preview, primary thumbnail)
  - [x] `media/index.ts` (barrel export)
- [x] Implement Dashboard Shell Layout (`DashboardLayout`, `Sidebar`, `TopNav`, `CommandPalette`)
- [x] Implement Global Command Palette (⌘K)

---

## Phase 3 — Authentication & SaaS Multi-Tenancy
- [x] Backend: MongoDB User and Organization schemas with compound indexes
- [x] Backend: AuthModule (Register atomic org+user, Login, JWT access token, Redis/memory refresh token rotation)
- [x] Backend: Tenant extraction guard (`@CurrentUser()`) and RBAC authorization guard (`@Roles()`)
- [x] Frontend: Login (`/login`) and Registration (`/register`) pages
- [x] Frontend: Zustand Auth store & TanStack Query auth provider
- [x] Frontend: Silent token refresh Axios interceptor in `@shopnix/api-client`

---

## Phase 4 — Core Ecommerce Operations Modules
- [x] **4A: Analytics Dashboard (`/dashboard`)**
  - [x] Backend: Live MongoDB aggregation pipelines for metrics, revenue trends, top products
  - [x] Frontend: StatCards, Recharts Revenue Area Chart, Recent Orders live stream
- [x] **4B: Product Management & Builder (`/products`, `/products/new`, `/products/[id]/edit`)**
  - [x] Backend: Product & ProductVariant schemas, CRUD, duplicate, image upload endpoints
  - [x] Frontend: Catalog data table with status filters, search, and duplicate action
  - [x] Frontend: Premium Two-Column Product Builder with real-time interactive preview card, variant generator, and margin calculation
- [x] **4C: Order Management (`/orders`, `/orders/[id]`)**
  - [x] Backend: Order schema, finite state machine status updates, timeline audit logs
  - [x] Frontend: Order table with status tabs, customer contact, and courier status
  - [x] Frontend: Order detail view with item breakdown, customer intelligence, timeline, and staff notes
- [x] **4D: Inventory Management (`/inventory`)**
  - [x] Backend: Stock ledger, inventory movement schema, manual adjustment endpoint
  - [x] Frontend: Stock overview table, manual adjustment dialog, and movement audit drawer
- [x] **4E: Customer Management (`/customers`)**
  - [x] Backend: Customer schema with auto-calculated LTV and return rate
  - [x] Frontend: Customer directory and high-return fraud risk alert indicators

---

## Phase 5 — Bangladesh Courier Integrations (`/couriers`)
- [x] Backend: `ICourierProvider` interface definition
- [x] Backend: `SandboxCourierAdapter` implementation
- [x] Backend: `SteadfastCourierAdapter` implementation
- [x] Backend: `PathaoCourierAdapter` implementation
- [x] Backend: `RedXCourierAdapter` implementation
- [x] Backend: `ECourierAdapter` implementation
- [x] Backend: Courier configuration and consignment dispatch endpoints
- [x] Frontend: Courier settings panel and quick consignment tracking search

---

## Phase 6 — Analytics, Settings & Operations (`/analytics`, `/settings`)
- [x] Analytics page with date-range filters, volume bar chart, and best-seller rankings
- [x] Store Settings page with store profile, pickup city, operating currency, and threshold
- [x] Landing page (`/`) with Linear-inspired design and marketing value proposition

---

## Phase 7 — Verification, Quality Assurance & Production Readiness
- [x] Automated unit test suite passing (`vitest run` — 9/9 tests pass)
- [x] TypeScript strict mode verification across all 8 workspaces (`turbo typecheck` — 6/6 tasks pass, 0 errors)
- [x] Backend production build (`apps/api` nest build — 0 errors)
- [x] Frontend production build (`apps/web` next build — all 15 static/dynamic routes compiled, 0 errors)
- [x] Monorepo build verified (`turbo build` — 2/2 tasks pass, 0 errors)
- [x] Multi-stage Dockerfiles (`apps/web/Dockerfile`, `apps/api/Dockerfile`) and `docker-compose.yml`


---

## Phase 8 — Multi-Store Ecommerce Integration (`/stores`)
- [x] Backend: StoreIntegration and StoreSyncLog schemas
- [x] Backend: Connectors for Shopify, WooCommerce, and Custom API stores
- [x] Backend: Bidirectional product and order synchronization engine with audit logging
- [x] Frontend: Store connections directory, credentials setup wizard, and manual sync triggers

---

## Phase 9 — Omnichannel Messaging & Unified Inbox (`/inbox`)
- [x] Backend: InboxConversation and InboxMessage schemas with multi-channel support
- [x] Backend: WhatsApp Cloud API gateway & Facebook Messenger gateway
- [x] Backend: Real-time message streaming, AI Copilot, Approval mode, and Autonomous modes
- [x] Backend: 1-Click convert chat message to official Cash on Delivery order
- [x] Frontend: 3-pane Unified Inbox with channel filters, AI draft approval, and quick order drawer

---

## Phase 10 — Centralized AI Provider Management & Model Router
- [x] Backend: AES-256-GCM encryption service for securing provider API keys at rest
- [x] Backend: OpenRouter dynamic model discovery checking official pricing metadata (`pricing.prompt === "0"` & `pricing.completion === "0"`)
- [x] Backend: Default out-of-the-box Free-Only mode preventing accidental billing
- [x] Backend: Google Gemini and OpenAI provider adapters
- [x] Backend: AI Model Router with Manual, Auto, Free-Only, and Failover routing modes
- [x] Backend: AI token usage and cost tracking in BDT
- [x] Frontend: Global AI Assistant (`/ai-assistant`) grounded in store operational data
- [x] Frontend: AI-Powered Product Builder with bilingual Bangla/English copy & SEO generation

---

## Phase 11 — Visual Automation Engine & AI Agent Builder
- [x] Backend: WorkflowDefinition and WorkflowExecutionLog schemas
- [x] Backend: Topological graph executor with trigger, action, and AI decision nodes
- [x] Backend: Autonomous AI Agent runtime with sandboxed business tools
- [x] Frontend: Visual Workflow Builder canvas (`/automations`) and execution test debugger
- [x] Frontend: AI Agent Builder (`/ai-agents`) with prompt editor and tool toggles

---

## Phase 12 — Super Admin Control Center (`/admin`)
- [x] Backend: Isolated Super Admin authentication realm (`AdminJwtAuthGuard` & `admin_users` collection)
- [x] Backend: Default admin seed (`admin@shopnix.io` / `ShopnixAdmin2026!`)
- [x] Backend: Multi-tenant organization suspension, reactivation, and plan adjustments
- [x] Backend: SaaS Subscription plan tier builder (limits for stores, orders, AI tokens)
- [x] Backend: Global AI Master Key Vault and immutable audit log stream
- [x] Frontend: Super Admin dashboard layout, KPI metrics, organization controls, and plan manager

---

## Phase 13 — Port Standardization & Production Hardening
- [x] Backend server standardized to port **8000** (`http://localhost:8000/api/v1` & `/api/docs`)
- [x] Frontend web application standardized to port **5000** (`http://localhost:5000`)
- [x] Environment files (`.env.example`, `docker-compose.yml`, `apps/api/src/config/configuration.ts`, `apps/web/src/lib/api.ts`) updated
- [x] 18/18 Unit tests passing (`bunx vitest run`)
- [x] TypeScript strict mode: 6/6 workspaces passing with 0 errors (`turbo typecheck`)
- [x] Full production build: 25 routes compiled and prerendered cleanly (`turbo build`)
