# Shopnix — Feature Comparison Matrix

This matrix compares the observable capabilities of **EcomDrive BD** against the targeted engineering specifications of **Shopnix**.

| Feature Category | Capability / Workflow | EcomDrive BD Status | Shopnix Specification | Strategic Improvement in Shopnix |
| :--- | :--- | :--- | :--- | :--- |
| **System Architecture** | Multi-Tenancy | Supported (Organization based) | Native Multi-Tenant SaaS with strict Org Isolation | Every query scopes by `organization_id`; strict RBAC |
| | Monorepo Structure | Unknown / Monolithic | Turborepo + Bun workspace | Shared `@shopnix/types`, `@shopnix/schemas`, `@shopnix/api-client` |
| | Type Safety | Partially typed | Strict TypeScript across full stack | Zero `any`, complete end-to-end Zod & TypeScript type inference |
| | Validation | Server-side / Framework | Universal Zod Schemas | Shared schema validation across frontend forms & backend NestJS pipes |
| | Port Standardization | Port conflicts | API 8000 & Web 5000 | Clean predictable local orchestration without port collisions |
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
| **Multi-Store Ecommerce** | Shopify Integration | Limited / Manual | Bi-directional Product & Order Sync via Admin API | Automatic SKU matching, webhook sync, conflict avoidance |
| | WooCommerce Integration | Manual / Basic | Automated REST API Connector with polling & webhooks | Synchronizes variable products, order intake, inventory syncing |
| | Custom API Connector | Not available | Standardized JSON Webhook and REST API endpoint | Allows custom e-commerce engines to plug into Shopnix ecosystem |
| **Omnichannel Messaging** | WhatsApp Cloud API | None / External | Native Unified Inbox with WhatsApp Business Cloud integration | Real-time message streaming, template messages, media support |
| | Facebook Messenger | None / External | Integrated Meta Graph API Page messaging | Ingests Facebook DM queries directly alongside WhatsApp |
| | AI Copilot in Chat | Not available | Context-aware AI suggested responses with Approval Mode | Agents review AI draft replies before sending to prevent errors |
| | 1-Click Order from Chat | Not available | Natural language order parsing directly into Shopnix Order Engine | Converts conversational customer texts into confirmed COD orders |
| **AI Intelligence Layer** | AI Provider Abstraction | None | Centralized Provider Router (Gemini, OpenRouter, OpenAI) | Unified completion & streaming abstraction, AES-256 encrypted keys |
| | Dynamic Model Discovery | None | Live OpenRouter models query with strict Zero-Cost validation | Filters `pricing.prompt === 0 && pricing.completion === 0` |
| | Default Free-Only Safety | Not applicable | Built-in `free_only: true` interceptor | Prevents unintended commercial API billing on merchant tenants |
| | Cost Telemetry in BDT | None | Real-time token usage logging with normalized BDT (৳) pricing | Complete visibility into token consumption across features |
| | Bilingual Copywriter | None | Bangla + English Product Title, Bullets & SEO Generator | Culturally tuned copy optimized for Bangladeshi online shoppers |
| | Contextual Store AI | None | Merchant Operations Assistant grounded in live store data | Queries stockouts, unfulfilled orders, and daily GMV |
| **Visual Automation** | Workflow Engine | Basic triggers | Topological Graph Workflow Executor | Multi-step triggers, actions, and AI decision/analysis nodes |
| | AI Autonomous Agents | None | Specialized Agent Builder (`/ai-agents`) | Custom agent system prompts, tool permissions (`inventory`, `orders`) |
| **Super Admin Control** | Multi-Tenant Governance | Basic tenant view | Complete Control Center (`/admin`) | Dedicated auth realm, tenant quarantine/suspension, plan overrides |
| | Subscription Plans Engine| Fixed hardcoded | Dynamic SaaS Tier Editor in BDT (৳) | Configures limits (orders, stores, seats, AI tokens) per plan |
| | Master AI Key Vault | None | Platform-wide master key vault & OpenRouter free explorer | Operator-level AI infrastructure control and global telemetry |
| | Security Audit Logging | Basic logging | Immutable Audit Log Ledger (`admin_audit_logs`) | Records all admin mutations with diffs, admin ID, IP, user-agent |
| **Security & Compliance** | Authentication | Password / Social | Dual Realm JWT (Merchant JWT & Admin JWT) | Complete isolation between merchant tenants and super admins |
| | Authorization | Basic roles | Fine-grained Role-Based Access Control (RBAC) | `super_admin`, `owner`, `admin`, `manager`, `staff` guards |
| | Data Isolation | Multi-tenant | Row-level tenant isolation via Mongoose middleware | Zero possibility of cross-organization data leakage |
| **Developer & DevOps** | API Documentation | None public | Automated OpenAPI / Swagger Documentation | Accessible at `http://localhost:8000/api/docs` |
| | Containerization | Unknown | Production-grade multi-stage Docker & Compose | Monorepo pruning (`turbo prune`) for lean container images |
| | Automated Testing | Unknown | Comprehensive Vitest & Supertest suites | Unit, integration, schema, and tenant isolation validation |
