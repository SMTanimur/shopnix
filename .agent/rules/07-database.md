# Rule 07: Database & Data Modeling Standards

1. **MongoDB Field Naming Conventions:**
   - Field names must strictly use lowercase `snake_case` (e.g., `first_name`, `organization_id`, `regular_price`, `stock_quantity`, `created_at`).
   - Do NOT mix `camelCase` with `snake_case` in MongoDB documents.

2. **Tenant Isolation Enforcement:**
   - Every multi-tenant collection (`products`, `orders`, `inventory_movements`, `customers`, `courier_configurations`) must include `organization_id: { type: Schema.Types.ObjectId, ref: 'organizations', required: true }`.
   - All queries and updates must include `{ organization_id }`.
   - Create compound indexes prefixing `organization_id`:
     ```typescript
     ProductSchema.index({ organization_id: 1, status: 1 });
     ProductSchema.index({ organization_id: 1, sku: 1 }, { unique: true });
     ```

3. **Soft Deletion Pattern:**
   - Entities subject to user deletion must use soft deletion via `deleted_at: { type: Date, default: null }`.
   - Never permanently `deleteOne()` or `deleteMany()` order, customer, or product records.
   - All standard queries must include `{ deleted_at: null }`.

4. **Transactions for Financial & Inventory Consistency:**
   - Multi-document operations (e.g., confirming an order and deducting stock movements) must be wrapped in a MongoDB transaction session (`session = await connection.startSession()`).
   - Ensure rollback on any step failure.

5. **Projections & Pagination:**
   - Large list queries must project only necessary fields (`.select('name sku regular_price stock_quantity status')`).
   - Never run unbounded `.find()` queries without `.skip()` and `.limit()` parameters.
