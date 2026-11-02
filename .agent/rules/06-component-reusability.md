# Rule 06: Component Architecture & Folder Organization

1. **Mandatory Folder-Based Structure:**
   Every reusable UI component must reside in its own dedicated folder with an `index.tsx` entry point:
   ```
   apps/web/src/components/
   ├── shared/
   │   ├── page-header/
   │   │   └── index.tsx          # Exports PageHeader component & PageHeaderProps
   │   ├── stat-card/
   │   │   └── index.tsx          # Exports StatCard component & StatCardProps
   │   ├── dashboard-card/
   │   │   └── index.tsx
   │   ├── status-badge/
   │   │   └── index.tsx
   │   ├── empty-state/
   │   │   └── index.tsx
   │   ├── loading-state/
   │   │   └── index.tsx
   │   ├── error-state/
   │   │   └── index.tsx
   │   ├── confirm-dialog/
   │   │   └── index.tsx
   │   ├── form-section/
   │   │   └── index.tsx
   │   ├── responsive-drawer/
   │   │   └── index.tsx
   │   └── index.ts               # Barrel export for all shared components
   │
   ├── data-display/
   │   ├── data-table/
   │   │   ├── index.tsx          # Main DataTable component
   │   │   ├── data-table-toolbar.tsx
   │   │   ├── data-table-pagination.tsx
   │   │   └── data-table-column-header.tsx
   │   ├── search-input/
   │   │   └── index.tsx
   │   ├── filter-dropdown/
   │   │   └── index.tsx
   │   ├── date-range-picker/
   │   │   └── index.tsx
   │   ├── pagination/
   │   │   └── index.tsx
   │   └── index.ts               # Barrel export for all data-display components
   │
   ├── media/
   │   ├── image-uploader/
   │   │   └── index.tsx
   │   └── index.ts               # Barrel export for all media components
   │
   └── index.ts                   # Root barrel export re-exporting shared, data-display, media
   ```

2. **Clean Barrel Imports:**
   Consumers must import via the barrel files, never reaching into internal sub-files:
   ```typescript
   // Recommended:
   import { PageHeader, StatCard, StatusBadge } from '@/components/shared';
   import { DataTable, SearchInput } from '@/components/data-display';
   import { ImageUploader } from '@/components/media';
   ```

3. **Reusability Checklist Before Creating Components:**
   - Check if a component already exists in `components/shared`, `components/data-display`, or `components/ui`.
   - Never duplicate table, card, badge, or modal implementations across features.
   - Design components to be polymorphic where appropriate (supporting `asChild` via Radix Slot).

4. **File Size Constraints:**
   - Keep component files under 250 lines.
   - If a component exceeds 300 lines, extract sub-components into helper files within the same component folder (e.g., `data-table/data-table-toolbar.tsx`).
