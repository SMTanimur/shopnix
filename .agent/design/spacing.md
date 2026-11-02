# Design Specification: Spacing & Layout Metrics

## 8-Point Spatial Grid
All margins, paddings, gaps, and component heights adhere to an 8px modular scale (with 4px half-steps for micro-components):

- `0.5`: 2px — Sub-pixel borders and hairline dividers.
- `1`: 4px — Tight badge padding, micro gaps.
- `2`: 8px — Button inner horizontal padding, inline icon spacing.
- `3`: 12px — Standard input and button vertical padding.
- `4`: 16px — Default card inner padding, compact section margins.
- `6`: 24px — Standard dashboard card padding, grid gap between widgets.
- `8`: 32px — Major section divider, page content top/bottom margins.
- `12`: 48px — Hero section spacing, spacious layout dividers.

## Layout Containers & Dimensions
- **Dashboard Sidebar Width:**
  - Expanded: `260px` (`w-65`)
  - Collapsed: `68px` (`w-17`)
- **Top Navigation Bar Height:** `56px` (`h-14`)
- **Main Viewport Maximum Width:** `1600px` (`max-w-7xl` or fluid `w-full px-6 lg:px-8`)
- **Standard Button Heights:**
  - `sm`: 32px (`h-8 text-xs`)
  - `default`: 36px (`h-9 text-sm`)
  - `lg`: 40px (`h-10 text-base`)
