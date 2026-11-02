# Design Specification: Component Guidelines

## Standard Reusable Components

### 1. `PageHeader` (`components/shared/page-header/index.tsx`)
- Standardized layout at the top of every dashboard view.
- Contains:
  - Title (`text-2xl font-semibold`)
  - Optional subtitle / descriptive text (`text-sm text-muted-foreground`)
  - Action slot on the right for primary CTA buttons (e.g., "+ Add Product", "Export CSV").

### 2. `StatCard` (`components/shared/stat-card/index.tsx`)
- Metric summary card for executive overview.
- Contains:
  - Metric title and icon.
  - Formatted value (e.g., `৳482,900`, `1,280`).
  - Comparative trend badge (e.g., `↑ 14.2% vs last month` in green/red).
  - Optional footer description.

### 3. `StatusBadge` (`components/shared/status-badge/index.tsx`)
- Pill-shaped status indicator with semantic colors:
  - `pending`: Amber / Warning (`bg-amber-50 text-amber-700 border-amber-200`)
  - `confirmed` / `processing`: Blue / Indigo (`bg-indigo-50 text-indigo-700 border-indigo-200`)
  - `shipped`: Purple / Slate (`bg-purple-50 text-purple-700 border-purple-200`)
  - `delivered`: Emerald / Success (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - `cancelled` / `returned`: Rose / Destructive (`bg-rose-50 text-rose-700 border-rose-200`)

### 4. `DataTable` (`components/data-display/data-table/index.tsx`)
- TanStack Table implementation with:
  - Interactive toolbar with search, faceted status filter dropdowns, and column visibility.
  - Sorting indicators in column headers.
  - Row selection with floating bulk action bar.
  - Pagination with page size selector.

### 5. `EmptyState` (`components/shared/empty-state/index.tsx`)
- Displayed when a query returns zero results.
- Features centered icon, title, short description, and optional primary button.

### 6. `ConfirmDialog` (`components/shared/confirm-dialog/index.tsx`)
- Accessible modal for destructive or critical actions (e.g., delete product, cancel order).
- Clear warning copy with explicit "Cancel" and "Confirm" buttons.
