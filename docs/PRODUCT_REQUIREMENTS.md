# Shopnix — Product Requirements Document (PRD)

## 1. Executive Summary
**Shopnix** is an enterprise-grade ecommerce operations and business management Software-as-a-Service (SaaS) platform tailored for high-velocity online merchants, direct-to-consumer (D2C) brands, and Facebook-commerce (F-commerce) sellers. The platform centralizes catalog management, multi-channel order orchestration, warehouse stock balancing, customer relationship intelligence, automated courier logistics, and real-time business health telemetry into a single, cohesive, premium operational hub.

---

## 2. Target Personas
1. **The Store Owner / Founder:** Needs real-time macro visibility over gross revenue, net margins after shipping/returns, COD receivables, and inventory valuation without managing spreadsheets.
2. **The Operations / Warehouse Manager:** Requires frictionless, rapid order processing, batch courier consignment creation, packing slip generation, and stock adjustment logs.
3. **The Customer Success / Confirmation Agent:** Needs an intuitive order detail view with full customer history, previous cancellation/return flags, instant note logging, and order status updates.
4. **The Finance & Accounts Manager:** Needs accurate reconciliation of courier settlements against delivered COD shipments, identifying delivery charge discrepancies and return freight losses.

---

## 3. High-Priority Functional Requirements

### 3.1 Authentication & Multi-Tenant Organization Management
- **FR-AUTH-1:** Email and password registration that atomically provisions both the initial User record (assigned role: `owner`) and a corresponding Organization tenant.
- **FR-AUTH-2:** Secure authentication via JSON Web Tokens (JWT) containing short-lived access tokens (15 minutes) and rotating refresh tokens (7 days) persisted in Redis with invalidation on logout.
- **FR-AUTH-3:** Strict tenant isolation: Every multi-tenant entity must reference `organization_id`. System queries must automatically enforce tenancy filters.
- **FR-AUTH-4:** Role-Based Access Control (RBAC) supporting four hierarchical roles:
  - `owner`: Full control, billing, organization deletion, API credentials.
  - `admin`: Full operational control, user management, integrations.
  - `manager`: Catalog, orders, inventory, customer operations, reports.
  - `staff`: Order status progression, customer notes, read-only catalog/inventory.

### 3.2 Premium Analytics Dashboard
- **FR-DASH-1:** Aggregate Metric Cards: Total Revenue, Total Orders, Pending Orders, Completed Orders, Cancelled Orders, Low Stock Items, Active Customers.
- **FR-DASH-2:** Time-series Revenue Area Chart and Order Volume Bar Chart with dynamic date range selectors (Today, Last 7 Days, Last 30 Days, Month to Date, Custom Range).
- **FR-DASH-3:** Recent Order Stream featuring live status badges and one-click navigation to details.
- **FR-DASH-4:** Top-performing products breakdown ranked by units sold and gross volume.
- **FR-DASH-5:** Zero static mock data: all cards and charts calculate from live MongoDB aggregation pipelines.

### 3.3 Product Catalog & Two-Column Product Builder
- **FR-PROD-1:** Full CRUD operations for products with soft deletion (`deleted_at` timestamp).
- **FR-PROD-2:** Multi-section Product Builder UI:
  - *Main Column:* Basic Information (Title, Description, Short Summary), Media Gallery (Drag-and-drop uploader with sortable thumbnails and primary indicator), Pricing (Regular, Sale, Cost price with dynamic profit margin calculator), Inventory (SKU, Barcode, Stock quantity, Low-stock threshold), Variant Matrix Generator (Options: Size, Color; dynamic matrix generation), Attributes, SEO metadata.
  - *Sidebar Column:* Interactive Live Storefront Product Card Preview (updates in real time as the merchant types), Publishing Status (`draft`, `active`, `archived`), Category & Tag selector.
- **FR-PROD-3:** Unsaved changes protection via route change guards and browser beforeunload alerts.
- **FR-PROD-4:** Product duplication feature: clones product structure and creates draft copy with modified SKU.

### 3.4 Order Management & Processing Workflow
- **FR-ORD-1:** Unified Order Table displaying Order Number (`ORD-xxxxx`), Customer Name, Phone, Items Summary, Total Amount, Payment Status, Fulfillment Status, Courier Consignment, and Date.
- **FR-ORD-2:** Status Tabs for rapid filtering: `All`, `Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`, `Returned`.
- **FR-ORD-3:** Order Details View:
  - Customer contact and shipping address details.
  - Line items breakdown with thumbnail, unit pricing, quantity, and line total.
  - Cost summary: Subtotal, Shipping fee, Discounts, Grand total, COD receivable.
  - Courier assignment card with consignment ID, tracking code, and live sync trigger.
  - Chronological activity timeline with automated event logs and manual staff notes.
- **FR-ORD-4:** Batch status updates for selected orders.
- **FR-ORD-5:** CSV data export filtered by date range and fulfillment status.

### 3.5 Inventory & Warehouse Stock Control
- **FR-INV-1:** Centralized Stock Overview reporting On-Hand Stock, Reserved Stock (in confirmed orders), and Available Stock.
- **FR-INV-2:** Manual Stock Adjustments recording delta quantity, adjustment reason (`restock`, `damage`, `count_correction`, `return`), author ID, and optional note.
- **FR-INV-3:** Immutable Inventory Movement Audit Ledger tracking every stock change event linked to orders or manual adjustments.
- **FR-INV-4:** Automated low-stock trigger highlighting products falling below merchant-defined thresholds.

### 3.6 Customer Relationship Intelligence (CRM)
- **FR-CUST-1:** Searchable customer directory indexed by phone number and name.
- **FR-CUST-2:** 360° Customer Profile displaying lifetime spend (LTV), total orders completed, cancellation rate, return rate, delivery address book, and internal notes.
- **FR-CUST-3:** Serial-returner / Fraud Risk tagging alerting staff during order confirmation when a customer possesses an elevated return or cancellation ratio.

### 3.7 Bangladesh Courier Integration Layer
- **FR-COUR-1:** Extensible `CourierProvider` adapter architecture supporting:
  - Steadfast Courier (API Key + Secret Header)
  - Pathao Courier (OAuth2 client credentials + City/Zone/Area hierarchy)
  - RedX Courier (API Token + Pickup Store ID)
  - eCourier (Multi-header authentication)
- **FR-COUR-2:** Built-in Sandbox / Mock Mode allowing full testing and development without live courier merchant contracts.
- **FR-COUR-3:** One-click shipment booking pushing order details directly to the selected courier's booking endpoint and recording Consignment ID and Tracking Code.
- **FR-COUR-4:** Courier status synchronization endpoint and webhook receiver updating order fulfillment states.

---

## 4. Non-Functional Requirements
- **Performance:** Server-side pagination, indexed MongoDB queries with query execution times < 50ms for typical dashboard listings.
- **Reliability:** Graceful error handling with normalized API error envelopes and user-friendly error banners.
- **Accessibility:** Fully accessible UI components complying with WCAG 2.1 AA standards via Radix UI primitives.
- **Responsive Fidelity:** Seamless user experience across 320px (mobile), 768px (tablet), 1024px (laptop), and 1440px+ (desktop).
