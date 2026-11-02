# Shopnix — Feature Comparison Matrix

This matrix compares the observable capabilities of **EcomDrive BD** against the targeted engineering specifications of **Shopnix**.

| Feature Category | Capability / Workflow | EcomDrive BD Status | Shopnix Specification | Strategic Improvement in Shopnix |
| :--- | :--- | :--- | :--- | :--- |
| **System Architecture** | Multi-Tenancy | Supported (Organization based) | Native Multi-Tenant SaaS with strict Org Isolation | Every query scopes by `organization_id`; strict RBAC |
| | Monorepo Structure | Unknown / Monolithic | Turborepo + Bun workspace | Shared `@shopnix/types`, `@shopnix/schemas`, `@shopnix/api-client` |
| | Type Safety | Partially typed | Strict TypeScript across full stack | Zero `any`, complete end-to-end Zod & TypeScript type inference |
| | Validation | Server-side / Framework | Universal Zod Schemas | Shared schema validation across frontend forms & backend NestJS pipes |
| **Design & UI/UX** | Visual Polish | Standard functional admin dashboard | Premium Linear/Stripe aesthetic | Deep Indigo palette, OKLCH tokens, Radix UI, Motion micro-interactions |
| | Component Architecture | Standard components | Modular folder structure with barrel exports (`page-header/index.tsx`, etc.) | High component reuse, standardized props, zero UI duplication |
| | Mobile & Responsive | Responsive web | Purpose-built responsive drawers, adaptive tables & mobile navigation | Optimized touch targets, desktop split-panes collapse gracefully |
| | Global Search / Shortcuts | Basic search | Global Command Palette (⌘K) | Instant navigation, fast record lookup, keyboard-first actions |
| **Dashboard & Analytics** | Real-Time Metrics | Present | Live KPIs (Revenue, Orders, Deliveries, Returns, Low Stock) | Dynamic date-range aggregation, Recharts graphs, zero static mocks |
| | Trend Analysis | Present | Revenue and Order volume trends with comparative metrics | Percentage shifts vs prior periods, customizable periods |
| | Quick Actions | Limited | Contextual quick actions | Create order, dispatch courier, adjust stock directly from dashboard |
| **Product Management** | Product Catalog CRUD | Present | Advanced Catalog with soft deletion & audit | Rich status lifecycle (`draft`, `active`, `archived`) |
| | Product Builder | Multi-tab form | Premium Two-Column Product Builder with Live Preview | Interactive desktop split-pane: real-time storefront preview card |
| | Variants & Matrix | Basic variants | Dynamic multi-attribute variant matrix generator | SKU generation, distinct variant pricing, per-variant stock tracking |
| | Inventory Tracking | Present | Real-time stock levels with low-stock warning thresholds | Automated alerts on dashboard when threshold is breached |
| | Media Handling | Basic upload | Multi-file drag & drop image manager with reordering | Primary thumbnail selection, preview modal, clean storage hooks |
| **Order Management** | Order Lifecycle | Present (New, Confirm, Ship, Deliver) | 7-State Finite State Machine (`pending` → `confirmed` → `processing` → `shipped` → `delivered` / `cancelled` / `returned`) | Audit log timeline, transition guards, permission checks |
| | Cash on Delivery (COD) | Core focus | Dedicated COD workflows, balance reconciliation, remittance tracking | Auto-calculates net receivable after courier freight deductions |
| | Advanced Data Table | Standard data table | TanStack Table with faceted filters, column toggling, pagination & search | Column sorting, bulk status mutation, CSV export |
| | Order Timeline & Notes | Present | Granular timeline audit log with internal staff notes | Immutable event history of status shifts and courier updates |
| **Courier Integrations** | Steadfast Integration | Present | Built-in Adapter with Sandbox & Live credentials | Consignment generation, tracking sync, balance inspection |
| | Pathao Integration | Present | OAuth2 City/Zone/Area hierarchical adapter | Automatic store mapping, parcel dispatch, tracking callbacks |
| | RedX Integration | Present | API Token based pickup store & parcel adapter | Delivery area resolution, parcel booking |
| | eCourier Integration | Present | Multi-credential adapter | Division/Thana mapping, package code handling |
| | Architecture | Vendor-specific | Extensible `CourierProvider` Interface Pattern | Standardized adapter layer allowing instant addition of new couriers |
| **Inventory & Warehouse** | Stock Movements | Present | Granular Inventory Movement Ledger | Track reason (`adjustment`, `sale`, `return`, `restock`) with before/after |
| | Low-Stock Alerts | Present | Automated threshold monitors & notification banners | Highlighting fast-moving items before stockout |
| **Customer Management** | CRM Profile | Present | 360° Customer Profile with Lifetime Value (LTV) | Purchase history, aggregate spending, return rate tracking |
| | Fraud Prevention | OTP & basic checks | Repeat customer intelligence & return history alerts | Flags serial cancellers / returners to protect merchant margins |
| **Security & Compliance** | Authentication | Password / Social | JWT with Redis-backed Refresh Token Rotation | Stateless access tokens + stateful rotated refresh tokens |
| | Authorization | Basic roles | Fine-grained Role-Based Access Control (RBAC) | `owner`, `admin`, `manager`, `staff` with method-level decorators |
| | Data Isolation | Multi-tenant | Row-level tenant isolation via Mongoose middleware | Zero possibility of cross-organization data leakage |
| **Developer & DevOps** | API Documentation | None public | Automated OpenAPI / Swagger Documentation | Interactive API exploration with request/response schemas |
| | Containerization | Unknown | Production-grade multi-stage Docker & Compose | Monorepo pruning (`turbo prune`) for lean container images |
| | Automated Testing | Unknown | Comprehensive Vitest, React Testing Library & Supertest suites | Unit, integration, and tenant isolation validation |
