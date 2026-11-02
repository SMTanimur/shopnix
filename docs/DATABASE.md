# Shopnix — Database Architecture & Schema Specification

This document details the MongoDB data models, field naming conventions, indexing strategies, and tenant isolation rules for Shopnix.

---

## 1. Naming Conventions & Rules

1. **Collections:** Plural, lowercase snake_case (e.g., `users`, `organizations`, `products`, `orders`, `inventory_movements`, `customers`, `courier_shipments`).
2. **Field Names:** Strictly lowercase `snake_case` across all collections (e.g., `first_name`, `organization_id`, `regular_price`, `stock_quantity`, `created_at`).
3. **Primary Keys:** Standard MongoDB `_id` (`ObjectId`).
4. **Foreign References:** Explicit field naming ending with `_id` (e.g., `organization_id`, `customer_id`, `product_id`).
5. **Timestamps:** Mandatory `created_at` (Date) and `updated_at` (Date).
6. **Soft Deletion:** Multi-tenant entity collections include `deleted_at` (Date | null). Queries must filter `{ deleted_at: null }`.

---

## 2. Collection Schemas & Data Models

### 2.1 `users`
Represents application accounts (store owners, managers, staff members).

```typescript
{
  _id: ObjectId,
  first_name: string,
  last_name: string,
  email: string,                       // Normalized lowercase
  password_hash: string,
  phone_number: string,
  role: 'owner' | 'admin' | 'manager' | 'staff',
  organization_id: ObjectId,           // Ref: organizations
  is_active: boolean,                  // Default: true
  last_login_at: Date | null,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date | null
}
```
**Indexes:**
- `{ email: 1 }` (Unique)
- `{ organization_id: 1, role: 1 }`
- `{ organization_id: 1, deleted_at: 1 }`

---

### 2.2 `organizations`
Represents the merchant store tenant boundary.

```typescript
{
  _id: ObjectId,
  name: string,
  slug: string,                        // Unique store identifier
  owner_id: ObjectId,                  // Ref: users
  store_name: string,
  store_phone: string,
  store_email: string,
  store_address: {
    address_line: string,
    city: string,
    zone: string,
    area: string,
    postal_code: string
  },
  logo_url: string | null,
  subscription_plan: 'starter' | 'growth' | 'enterprise',
  subscription_status: 'active' | 'trial' | 'past_due' | 'cancelled',
  settings: {
    currency: string,                  // Default: 'BDT'
    currency_symbol: string,           // Default: '৳'
    timezone: string,                  // Default: 'Asia/Dhaka'
    default_courier: string | null,
    low_stock_alert_threshold: number  // Default: 5
  },
  created_at: Date,
  updated_at: Date,
  deleted_at: Date | null
}
```
**Indexes:**
- `{ slug: 1 }` (Unique)
- `{ owner_id: 1 }`

---

### 2.3 `products`
The core catalog item definition.

```typescript
{
  _id: ObjectId,
  organization_id: ObjectId,
  name: string,
  slug: string,
  description: string,
  short_description: string,
  sku: string,
  barcode: string | null,
  status: 'draft' | 'active' | 'archived',
  
  // Financials & Pricing
  regular_price: number,               // In minor currency units / decimal
  sale_price: number | null,
  cost_price: number | null,

  // Stock
  stock_quantity: number,
  low_stock_threshold: number,
  track_inventory: boolean,

  // Media
  images: [
    {
      url: string,
      alt_text: string,
      sort_order: number,
      is_primary: boolean
    }
  ],

  // Classification
  category_ids: [ObjectId],            // Ref: categories
  tags: [string],

  // Variants
  has_variants: boolean,
  variant_options: [
    {
      name: string,                    // e.g., 'Size', 'Color'
      values: [string]                 // e.g., ['S', 'M', 'L']
    }
  ],

  // Physical specs
  weight: number | null,
  weight_unit: 'kg' | 'g',
  dimensions: {
    length: number | null,
    width: number | null,
    height: number | null
  },

  // SEO
  seo_title: string | null,
  seo_description: string | null,
  seo_keywords: [string],

  created_at: Date,
  updated_at: Date,
  deleted_at: Date | null
}
```
**Indexes:**
- `{ organization_id: 1, status: 1 }`
- `{ organization_id: 1, sku: 1 }` (Unique within tenant)
- `{ organization_id: 1, slug: 1 }` (Unique within tenant)
- `{ organization_id: 1, name: 'text', description: 'text' }` (Text search)
- `{ organization_id: 1, stock_quantity: 1 }` (Low stock scans)

---

### 2.4 `product_variants`
Generated permutations of product variant options.

```typescript
{
  _id: ObjectId,
  product_id: ObjectId,                // Ref: products
  organization_id: ObjectId,
  sku: string,
  barcode: string | null,
  option_values: Record<string, string>, // e.g., { "Size": "M", "Color": "Navy" }
  regular_price: number,
  sale_price: number | null,
  cost_price: number | null,
  stock_quantity: number,
  image_url: string | null,
  is_active: boolean,
  created_at: Date,
  updated_at: Date
}
```
**Indexes:**
- `{ product_id: 1 }`
- `{ organization_id: 1, sku: 1 }` (Unique within tenant)

---

### 2.5 `orders`
The operational transactional order record.

```typescript
{
  _id: ObjectId,
  organization_id: ObjectId,
  order_number: string,                // Format: 'ORD-10001'
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned',
  payment_status: 'unpaid' | 'paid' | 'partial' | 'refunded',
  payment_method: 'cod' | 'bkash' | 'nagad' | 'bank_transfer' | 'card',

  // Customer snapshot
  customer_id: ObjectId,               // Ref: customers
  customer_name: string,
  customer_phone: string,
  customer_email: string | null,

  // Shipping destination
  shipping_address: {
    address_line: string,
    city: string,
    zone: string,
    area: string,
    postal_code: string | null
  },

  // Line items
  items: [
    {
      product_id: ObjectId,
      variant_id: ObjectId | null,
      name: string,
      sku: string,
      quantity: number,
      unit_price: number,
      total_price: number,
      image_url: string | null
    }
  ],

  // Financial calculation breakdown
  subtotal: number,
  shipping_charge: number,
  discount_amount: number,
  total_amount: number,
  cod_amount: number,                  // Amount courier must collect

  // Logistics / Courier Assignment
  courier_provider: 'steadfast' | 'pathao' | 'redx' | 'ecourier' | 'sandbox' | null,
  consignment_id: string | null,
  tracking_code: string | null,
  courier_status: string | null,

  // Internal audit timeline
  timeline: [
    {
      status: string,
      note: string,
      author_id: ObjectId | null,
      created_at: Date
    }
  ],
  notes: [
    {
      content: string,
      author_id: ObjectId,
      author_name: string,
      created_at: Date
    }
  ],

  created_at: Date,
  updated_at: Date,
  deleted_at: Date | null
}
```
**Indexes:**
- `{ organization_id: 1, order_number: 1 }` (Unique within tenant)
- `{ organization_id: 1, status: 1, created_at: -1 }`
- `{ organization_id: 1, customer_phone: 1 }`
- `{ organization_id: 1, consignment_id: 1 }`
- `{ organization_id: 1, created_at: -1 }`

---

### 2.6 `inventory_movements`
Immutable audit log tracking all inventory deltas.

```typescript
{
  _id: ObjectId,
  organization_id: ObjectId,
  product_id: ObjectId,
  variant_id: ObjectId | null,
  type: 'sale' | 'restock' | 'adjustment' | 'return' | 'initial',
  quantity_change: number,             // e.g., -2 or +10
  quantity_before: number,
  quantity_after: number,
  reference_type: 'order' | 'manual_adjustment' | 'import',
  reference_id: string | null,         // e.g., order_id
  note: string | null,
  author_id: ObjectId | null,          // Ref: users
  created_at: Date
}
```
**Indexes:**
- `{ organization_id: 1, product_id: 1, created_at: -1 }`
- `{ organization_id: 1, created_at: -1 }`

---

### 2.7 `customers`
Customer relationship directory and intelligence record.

```typescript
{
  _id: ObjectId,
  organization_id: ObjectId,
  name: string,
  phone_number: string,                // Normalized 11 digits (e.g., '01712345678')
  email: string | null,
  addresses: [
    {
      label: string,
      address_line: string,
      city: string,
      zone: string,
      area: string,
      postal_code: string | null,
      is_default: boolean
    }
  ],
  total_orders: number,
  completed_orders: number,
  cancelled_orders: number,
  returned_orders: number,
  total_spent: number,
  return_rate_percentage: number,      // (returned_orders / total_orders) * 100
  is_high_risk: boolean,               // Triggered if return_rate > 30% and total_orders > 3
  tags: [string],
  created_at: Date,
  updated_at: Date,
  deleted_at: Date | null
}
```
**Indexes:**
- `{ organization_id: 1, phone_number: 1 }` (Unique within tenant)
- `{ organization_id: 1, total_spent: -1 }`
- `{ organization_id: 1, is_high_risk: 1 }`

---

### 2.8 `courier_configurations`
Merchant-specific credentials and defaults for logistics providers.

```typescript
{
  _id: ObjectId,
  organization_id: ObjectId,
  provider: 'steadfast' | 'pathao' | 'redx' | 'ecourier' | 'sandbox',
  is_active: boolean,
  credentials: Record<string, string>, // Encrypted credentials (API key, secret, etc.)
  default_pickup_store_id: string | null,
  default_delivery_type: string | null,
  created_at: Date,
  updated_at: Date
}
```
**Indexes:**
- `{ organization_id: 1, provider: 1 }` (Unique within tenant)
