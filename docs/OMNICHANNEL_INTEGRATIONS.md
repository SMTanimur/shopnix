# Shopnix Omnichannel Integrations & Multi-Store Architecture

## 1. Executive Overview

Shopnix bridges fragmented ecommerce touchpoints into a unified operating system. Merchants can operate across multiple external online storefronts (Shopify, WooCommerce, Custom Websites) while engaging customers through conversational commerce channels (WhatsApp, Facebook Messenger), all governed from a single dashboard.

```
┌─────────────────────────┐          ┌─────────────────────────┐
│     Shopify Store       │          │    WooCommerce Store    │
└────────────┬────────────┘          └────────────┬────────────┘
             │ Webhooks & Polling                 │ Webhooks & Polling
             ▼                                    ▼
┌──────────────────────────────────────────────────────────────┐
│             Shopnix Store Integration Connectors             │
│   - Unified Catalog Normalizer  - Bi-directional Stock Sync  │
│   - Order Intake Engine         - Multi-Tenant Isolation     │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │  Shopnix Core Engine  │
                   └───────────┬───────────┘
                               ▲
┌──────────────────────────────┴───────────────────────────────┐
│             Omnichannel Customer Messaging Engine            │
│   - WhatsApp Cloud API          - Facebook Messenger Graph   │
│   - 1-Click Order From Chat     - AI Copilot Approval Mode   │
└────────────▲────────────────────────────────────▲────────────┘
             │                                    │
┌────────────┴────────────┐          ┌────────────┴────────────┐
│   WhatsApp Customers    │          │    Facebook Customers   │
└─────────────────────────┘          └─────────────────────────┘
```

---

## 2. Multi-Store Integration Engine

### A. Supported Store Connectors
1. **Shopify Connector** (`ShopifyConnector`):
   - Authenticates via Admin API Access Tokens (`X-Shopify-Access-Token`).
   - Syncs products via `/admin/api/2024-01/products.json`.
   - Ingests orders via `/admin/api/2024-01/orders.json`.
   - Maps variant SKUs, inventory item IDs, and fulfillment statuses.

2. **WooCommerce Connector** (`WooCommerceConnector`):
   - Authenticates via Consumer Key & Consumer Secret.
   - Queries WooCommerce REST API v3 (`/wp-json/wc/v3/products`, `/wp-json/wc/v3/orders`).
   - Normalizes variable products and line items.

3. **Custom API Connector** (`CustomApiConnector`):
   - Provides standardized webhook and REST endpoints for proprietary ecommerce platforms.
   - Supports bearer token authentication and standard JSON payloads.

### B. Bi-Directional Synchronization Workflow
- **Catalog Synchronization**: Fetches foreign catalog, matches existing items by `sku` within the tenant's `organization_id`. Updates price, stock levels, titles, and media without duplicating records.
- **Order Synchronization**: Ingests new orders, maps foreign status (`unfulfilled`, `processing`) to Shopnix lifecycle states (`pending`, `confirmed`, `processing`), and attributes orders to the respective store connection.
- **Telemetry & Error Logging**: Each sync execution creates a `StoreSyncLog` documenting items processed, items updated, items failed, and error stack traces.

---

## 3. Omnichannel Customer Messaging & Unified Inbox

### A. Communication Channels
- **WhatsApp Cloud API**: Integrates with Meta's official WhatsApp Business Platform (`/messages` endpoint). Supports text, templates, and media attachments.
- **Facebook Messenger**: Uses Meta Graph API (`/me/messages`) with Page Access Tokens.
- **Development Sandbox Fallback**: If live Meta credentials are not configured, the gateways automatically operate in sandbox mode, echoing mock customer inquiries to permit full UI testing offline.

### B. Conversation Management
- Threads are aggregated under `InboxConversation` keyed by customer channel identifier (`phone_number` or Facebook `psid`).
- Real-time messages are stored in `InboxMessage` with direction (`inbound` or `outbound`), delivery status (`sent`, `delivered`, `read`), and sender identity.

### C. Unified Inbox Interface (`/inbox`)
- **Omnichannel Feed**: Single split-view inbox with quick filters for All Channels, WhatsApp, and Messenger.
- **Status Categorization**: Filters by Open, Waiting on Customer, and Resolved.
- **AI Copilot with Human Approval**:
  - The AI suggests context-aware replies based on store catalog and recent customer questions.
  - Operates in **Approval Mode** where drafts require one-click human verification before sending.
- **1-Click Order Creation from Chat**:
  - Automatically parses customer chat strings into customer name, delivery address, phone number, and requested items.
  - Opens a pre-filled Shopnix order modal, allowing agents to confirm and dispatch cash-on-delivery (COD) orders without leaving the conversation.
