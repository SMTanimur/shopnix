# Shopnix — Architectural Decision Records (ADRs)

This document records the critical architectural and engineering decisions made during the design and development of Shopnix.

---

## ADR-001: Monorepo Architecture with Turborepo & Bun Workspaces
- **Status:** Accepted
- **Context:** Shopnix requires a decoupled frontend application (`apps/web`), backend API service (`apps/api`), and shared libraries for types, validation schemas, API clients, and utilities.
- **Decision:** Use **Turborepo** with **Bun workspaces**.
- **Rationale:** Bun provides instant package installs and script execution. Turborepo provides topological build execution, task caching, and simple container pruning (`turbo prune`).
- **Consequences:** All shared code is organized in `packages/*` and consumed via standard workspace dependencies (`workspace:*`).

---

## ADR-002: Universal Zod Validation & Standard Schema
- **Status:** Accepted
- **Context:** Ecommerce platforms require strict input validation across frontend forms and backend API routes. Duplicating validation logic between frontend and backend leads to synchronization bugs.
- **Decision:** Use **Zod** as the universal validation schema engine. Adopt NestJS 12's native Standard Schema validation support for backend request decorators.
- **Rationale:** NestJS 12 supports the Standard Schema specification natively, allowing Zod schemas from `@shopnix/schemas` to be passed directly into `@Body()`, `@Query()`, and `@Param()` without `class-validator` or third-party wrappers.
- **Consequences:** No `class-validator` or `class-transformer` needed. Frontend and backend share exact schema definitions and TypeScript types.

---

## ADR-003: MongoDB with Mongoose for Data Persistence
- **Status:** Accepted
- **Context:** An ecommerce operations SaaS manages high-velocity order ingestion, diverse product variant structures, hierarchical courier configurations, and audit event streams.
- **Decision:** Use **MongoDB 8.0** with **Mongoose 9.x**.
- **Rationale:** Document database provides natural representation of embedded line items, variant matrices, and timeline events while supporting compound indexing and aggregation pipelines for real-time dashboards.
- **Consequences:** All multi-tenant queries must enforce `{ organization_id }` scoping. Multi-document operations requiring atomicity utilize MongoDB transactions.

---

## ADR-004: Multi-Tenant Architecture via Scoped Database Queries
- **Status:** Accepted
- **Context:** Shopnix is a multi-tenant SaaS serving independent merchant organizations. Data leakage between organizations is a critical failure.
- **Decision:** Enforce logical tenant isolation via mandatory `organization_id` field on all tenant-owned collections, backed by compound indexes `{ organization_id: 1, ... }` and repository query filters extracted from verified JWT claims.
- **Rationale:** Provides high database performance and simplified operational maintenance compared to separate database-per-tenant, while guaranteeing absolute data segregation when paired with NestJS guards.
- **Consequences:** Developers must never issue tenant-owned queries without `organization_id`.

---

## ADR-005: Extensible Courier Provider Adapter Pattern
- **Status:** Accepted
- **Context:** The platform must support multiple Bangladesh courier services (Steadfast, Pathao, RedX, eCourier) with distinct authentication methods, payload formats, and status lifecycles.
- **Decision:** Implement an `ICourierProvider` interface and instantiate providers through a factory based on the merchant's configured courier. Include a `SandboxAdapter` for testing without live merchant credentials.
- **Rationale:** Isolates core order workflows from third-party API changes. New couriers can be introduced by creating a single adapter class implementing the interface.
- **Consequences:** All courier responses must be normalized into internal Shopnix consignment and tracking entities.

---

## ADR-006: Folder-Based Component Architecture with Barrel Exports
- **Status:** Accepted
- **Context:** Large frontend projects suffer from clutter and inconsistent component imports when files are placed flat or arbitrarily.
- **Decision:** Organize every reusable UI component in a dedicated folder with an `index.tsx` entry point (e.g., `components/shared/page-header/index.tsx`), and re-export via domain barrel files (`components/shared/index.ts`).
- **Rationale:** Encapsulates sub-components, types, and styles within component folders while providing clean, readable import paths (`import { PageHeader } from '@/components/shared'`).
- **Consequences:** Strict compliance required for all created UI components.
