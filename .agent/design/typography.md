# Design Specification: Typography System

## Font Families
- **Sans-Serif:** Geist Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
- **Monospace:** Geist Mono, 'SF Mono', Consolas, monospace.

## Hierarchy & Scale
| Level | Font Size | Line Height | Weight | Tailwind Classes | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | 30px (1.875rem) | 36px | 600 (Semibold) | `text-3xl font-semibold tracking-tight` | Landing heroes, primary marketing |
| **Page Title (H1)** | 24px (1.5rem) | 32px | 600 (Semibold) | `text-2xl font-semibold tracking-tight` | Main page title in `PageHeader` |
| **Section Title (H2)** | 18px (1.125rem) | 28px | 600 (Semibold) | `text-lg font-semibold` | Card headers, form section titles |
| **Subheading (H3)** | 15px (0.9375rem) | 24px | 500 (Medium) | `text-base font-medium` | Widget titles, drawer headers |
| **Body (Default)** | 14px (0.875rem) | 20px | 400 (Regular) | `text-sm text-foreground` | Data table cells, form labels, general UI |
| **Small / Helper** | 12px (0.75rem) | 16px | 400 (Regular) | `text-xs text-muted-foreground` | Help text, timestamps, captions |
| **Numeric Figures** | 14px / 20px | — | 500 (Medium) | `font-mono tabular-nums font-medium` | Prices (`৳1,250`), SKUs, Order IDs |
