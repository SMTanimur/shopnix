# Shopnix — Reverse Engineering & Reference Analysis

This document details the reverse engineering findings from the reference project and primary inspiration, analyzing architectural patterns, operational paradigms, and opportunities for creating an original, production-ready product: **Shopnix**.

---

## 1. Primary Inspiration: EcomDrive BD (https://www.ecomdrivebd.com/)

### 1.1 Overview & Market Context
- **Product Classification:** 360° E-Commerce Operating System (OMS + CRM + Logistics + Analytics).
- **Core Market:** Bangladeshi online merchants, specifically Facebook Commerce (F-commerce), Instagram sellers, and multi-channel merchants relying heavily on **Cash on Delivery (COD)**.
- **Primary Value Proposition:** Consolidates disconnected business workflows (spreadsheets, fragmented courier portals, Meta/WhatsApp chat inboxes, ad managers) into a single unified control panel.

### 1.2 Key Architectural & Operational Pillars
1. **COD-Centric Lifecycle Management:**
   - In Bangladesh ecommerce, >85% of transactions are COD. This introduces critical operational risks: fake orders, parcel refusals at doorstep, Return-to-Origin (RTO) freight charges, and reconciliation discrepancies between courier payouts and collected cash.
   - EcomDrive prioritizes anti-fraud measures (phone duplicate checks, IP fraud flagging, customer return history) and telephone call center confirmation workflows before dispatch.
2. **Bangladesh Courier Ecosystem Aggregation:**
   - Integrates with local logistics partners: **Steadfast Courier, Pathao Courier, RedX, eCourier, and Paperfly**.
   - Solves the manual burden of copy-pasting order details into separate courier portals. Provides automated consignment creation, airway bill (AWB) generation, tracking synchronization, and remittance reconciliation.
3. **Omnichannel Ingestion:**
   - Ingestion of orders from WooCommerce, Shopify, custom Laravel stores, landing page checkouts, and social messaging channels (Facebook Messenger, WhatsApp).
4. **Unit Economics & P&L Attribution:**
   - Real-time attribution linking Meta/Google ad spend directly to delivered orders (not just generated leads), calculating true net margin after packaging, shipping fees, and return penalties.

### 1.3 Identified Limitations & Shopnix Opportunities
- **UI/UX Friction:** Heavy data tables without responsive refinement, cluttered navigation, and lack of modern micro-interactions (e.g., keyboard shortcuts, command palettes).
- **Architecture Rigidity:** Often built on monolithic stacks with tightly coupled courier logic rather than modular adapter patterns.
- **Tenant Isolation:** Needs strict multi-tenant SaaS enforcement at the database and application levels.
- **Modern Developer Experience:** Needs typed contracts, shared validation, and headless design principles.

---

## 2. Reference Repository: `morluto/rea` (Reverse Engineer Anything)

### 2.1 Overview & Role
- While originally reviewed as a potential UI reference, `morluto/rea` is in reality a high-performance, viral (240k+ stars) TypeScript engine and Model Context Protocol (MCP) server for deep static/dynamic program analysis and binary inspection.
- Rather than a frontend ecommerce clone, `morluto/rea` provides exemplary **architectural engineering standards** for TypeScript applications.

### 2.2 Engineering Patterns Adopted for Shopnix
1. **Clean Architecture / Layered Domain Separation:**
   - Strict separation between core Domain logic, Application workflows, and external Providers/Adapters.
   - In Shopnix, this directly governs how Courier Providers (Steadfast, Pathao, RedX) and Payment Adapters are isolated behind uniform interfaces.
2. **Provider Adapter Pattern:**
   - External providers declare strict capabilities, normalize external payloads into unified internal domain structures, and isolate third-party breaking API changes.
3. **Strict Boundary Validation with Zod:**
   - Comprehensive validation at all entry points (API requests, worker jobs, external webhooks) using Zod schemas with TypeScript type inference.
4. **Turborepo Monorepo Organization:**
   - Monorepo orchestration enforcing explicit package boundaries and dependency inversion.
5. **Multi-Tiered Testing Strategy:**
   - Fast isolated unit tests, domain boundary tests, and integration test suites.

---

## 3. Bangladesh Courier APIs — Deep Technical Breakdown

### 3.1 Steadfast Courier
- **API Model:** REST over HTTPS.
- **Authentication:** Custom headers (`Api-Key`, `Secret-Key`).
- **Base Endpoint:** `https://portal.steadfast.com.bd/api/v1`
- **Core Endpoints:**
  - `POST /create_order`: Consignment generation with `invoice`, `recipient_name`, `recipient_phone`, `recipient_address`, `cod_amount`, `note`.
  - `GET /status_by_cid/{consignment_id}`: Status inspection.
  - `GET /status_by_trackingcode/{tracking_code}`: Customer tracking.
  - `GET /get_balance`: Merchant settlement balance.
- **Status Lifecycle:** `pending` → `in_review` → `delivered` / `partial_delivered` / `cancelled` / `hold`.

### 3.2 Pathao Courier
- **API Model:** REST with OAuth2 Bearer Tokens.
- **Base Endpoint:** `https://api-hermes.pathao.com`
- **Authentication Flow:**
  - `POST /aladdin/api/v1/issue-token` with `client_id`, `client_secret`, `username`, `password`, `grant_type: 'password'`.
- **Core Endpoints:**
  - `GET /aladdin/api/v1/city-list`, `GET /aladdin/api/v1/cities/{id}/zone-list`, `GET /aladdin/api/v1/zones/{id}/area-list`: Geographic hierarchy.
  - `POST /aladdin/api/v1/stores`: Pickup store provisioning.
  - `POST /aladdin/api/v1/orders`: Shipment booking.
  - `GET /aladdin/api/v1/shipments/{consignment_id}`: Real-time tracking.

### 3.3 RedX Courier
- **API Model:** REST with Bearer API tokens.
- **Base Endpoint:** `https://openapi.redx.com.bd/v1.0.0-beta`
- **Authentication:** `API-ACCESS-TOKEN: Bearer {token}` header.
- **Core Endpoints:**
  - `POST /parcel`: Booking with mandatory `pickup_store_id`, `delivery_area_id`, `cash_collection_amount`.
  - `GET /parcel/track/{tracking_id}`: Event timeline tracking.

### 3.4 eCourier
- **API Model:** REST with multi-header authentication.
- **Base Endpoint:** `https://backoffice.ecourier.com.bd/api`
- **Authentication Headers:** `API-KEY`, `API-SECRET`, `USER-ID`.
- **Core Endpoints:**
  - `POST /order-place`: Order placement with 11-digit mobile validation and division/thana mapping.
  - `POST /area-by-district`: Area resolution.
  - `POST /payment-status`: COD remittance reconciliation.

---

## 4. Synthesis for Shopnix Architecture

Shopnix bridges the functional breadth of EcomDrive BD with the rigorous software craftsmanship observed in modern TypeScript ecosystems:
1. **Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui** for an ultra-responsive, accessible, Linear/Stripe-tier interface.
2. **NestJS 12 + MongoDB 8 + Mongoose 9** for scalable, multi-tenant enterprise backend operations.
3. **Pluggable Courier Provider Pattern** supporting sandbox simulation and real credentials for Steadfast, Pathao, RedX, and eCourier.
4. **End-to-End Shared Schemas & Types** eliminating runtime mismatches across the monorepo boundary.
