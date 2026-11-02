# Shopnix — Technology Stack Specification

This document codifies the vetted, mutually compatible technology versions and rationale selected for the Shopnix platform.

---

## 1. Core Tooling & Monorepo

| Layer | Technology | Version | Rationale & Capabilities |
| :--- | :--- | :--- | :--- |
| **Package Manager / Runtime** | Bun | 1.2+ | Native high-speed package management, fast execution, workspace resolution, and zero-overhead script execution. |
| **Build Orchestration** | Turborepo | 2.x | High-performance build caching, topological task scheduling, and isolated workspace execution. |
| **Language** | TypeScript | 5.8+ | Strict mode configuration (`exactOptionalPropertyTypes`, `noImplicitReturns`, `noUncheckedIndexedAccess`) across the entire repository. |

---

## 2. Frontend Application (`apps/web`)

| Component | Library / Framework | Version | Details & Architectural Fit |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 16.x | App Router architecture, Server Components for high-performance rendering, optimized client bundling. |
| **UI Library** | React | 19.x | Concurrent features, Actions support, modernized ref handling without `forwardRef`. |
| **Styling** | Tailwind CSS | 4.x | CSS-first configuration via `@theme`, OKLCH high-gamut color definitions, zero-JS configuration overhead. |
| **Component Primitives** | shadcn/ui & Radix UI | Latest | Accessible, unstyled primitives styled with Tailwind 4 `data-slot` selectors and OKLCH color variables. |
| **Server State Management** | TanStack React Query | 5.x | Declarative data fetching, intelligent cache management, automatic background refetching, and mutation hooks. |
| **Client UI State** | Zustand | 5.x | Minimalist, unopinionated client state store for sidebar states, dialog visibility, and ephemeral UI selections. |
| **Form Handling** | React Hook Form | 7.x | Controlled and uncontrolled form performance, paired with `@hookform/resolvers/zod`. |
| **Schema Validation** | Zod | 3.24+ | Single source of truth for runtime validation, contract verification, and TypeScript type inference. |
| **Icons** | Lucide React | Latest | Clean, consistent, tree-shakeable SVG icon collection matching the minimal design aesthetic. |
| **Animation & Micro-interactions** | Motion (Framer Motion) | 12.x | Fluid spring animations for drawer transitions, modals, and metric shifts. |
| **Data Visualization** | Recharts | 2.x | Composable SVG-based chart system for area charts, bar charts, and operational trend telemetry. |
| **Data Tables** | TanStack Table | 8.x | Headless table engine managing column sorting, filtering, row selection, pagination, and data export. |

---

## 3. Backend Application (`apps/api`)

| Component | Library / Framework | Version | Details & Architectural Fit |
| :--- | :--- | :--- | :--- |
| **Framework** | NestJS | 12.x | Enterprise TypeScript architecture, modular dependency injection, and native Standard Schema validation support. |
| **Runtime** | Node.js | 22.x LTS | Robust, long-term supported enterprise runtime. |
| **Database & ODM** | MongoDB & Mongoose | Mongo 8.0 / Mongoose 9.x | Document database supporting flexible schemas, high write velocity, aggregation pipelines, and ACID transactions. |
| **Validation Pipe** | Standard Schema Zod | Native NestJS 12 | Standard Schema compliant validation pipe enforcing Zod schemas directly on route decorators. |
| **Authentication** | JWT (`@nestjs/jwt`) & bcrypt | 10.x / 5.x | Stateless access tokens, cryptographically secure password salting and hashing. |
| **Cache & Session** | Redis (`ioredis`) | 7.x / 5.x | High-speed in-memory store for refresh token rotation, rate limiting counters, and query caching. |
| **API Documentation** | NestJS Swagger | 11.x | Automatic OpenAPI 3.0 specification generation with interactive Swagger UI explorer. |
| **Security Headers** | Helmet | 8.x | Automated configuration of secure HTTP headers against common web vulnerabilities. |

---

## 4. Shared Packages (`packages/*`)

| Package | Purpose | Dependencies |
| :--- | :--- | :--- |
| `@shopnix/types` | Centralized TypeScript entity types, enums, DTOs, and API response contracts. | None (pure TS) |
| `@shopnix/schemas` | Shared Zod schemas for user authentication, product catalog, orders, and couriers. | `zod` |
| `@shopnix/api-client` | Typed Axios HTTP client with request interceptors, refresh token loop, and endpoint services. | `axios`, `@shopnix/types` |
| `@shopnix/utils` | Pure utility functions (formatting currency, dates, slugs, numbers, error handlers). | `date-fns`, `clsx`, `tailwind-merge` |
| `@shopnix/config` | Base TypeScript and build configurations. | None |
| `@shopnix/eslint-config` | Standardized ESLint and code quality configurations. | ESLint, TypeScript-ESLint |

---

## 5. Development & DevOps Infrastructure

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Containers** | Docker & Docker Compose | Multi-stage Dockerfiles utilizing `turbo prune` for minimal production images. |
| **Databases** | MongoDB 8.0 & Redis 7.0 | Containerized local instances with persistent Docker volume mappings and automated health checks. |
| **Testing** | Vitest | Lightning-fast test runner for unit, integration, and contract tests across both frontend and backend. |
| **End-to-End Testing** | Playwright | Headless browser automation testing critical operational flows. |
