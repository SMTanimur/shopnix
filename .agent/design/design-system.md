# Shopnix Design System — Rose Glassmorphism & Cinematic Motion

## 1. Core Design Principles
1. **Rose Glass Depth:** Every primary container (Sidebar, TopNav, StatCard, DashboardCard, Modal, Drawer) uses translucent frosted glass with `backdrop-blur-xl`, subtle rose-tinted borders (`border-rose-500/15`), and top specular edge highlights.
2. **Cinematic Motion Graphics:** Transitions are powered by spring physics (`framer-motion`)—including animated active sidebar indicators (`layoutId`), subtle floating ambient light orbs, and smooth drawer/popover transitions.
3. **Operational Clarity at Scale:** High-density ecommerce telemetry (GMV, COD lifecycle funnel, multi-store sync, courier SLA, fraud risk) remains scannable at a glance using crisp hierarchy and `tabular-nums`.

## 2. Typography & Hierarchy
- **Display / Headings:** `Plus Jakarta Sans` / `Inter` (`font-bold tracking-tight text-foreground`)
- **Body & Controls:** `Inter` (`text-sm font-medium`)
- **Telemetry / IDs / Currency (`৳`):** `JetBrains Mono` / `tabular-nums`

## 3. Glass Surface Tiers
| Tier | Usage | Utility / Styling |
|------|-------|-------------------|
| **Tier 0: Ambient Canvas** | Dashboard & App Root | Soft neutral base + radial Rose/Pink/Crimson ambient glow mesh |
| **Tier 1: Structural Glass** | Sidebar & Sticky TopNav | `glass-sidebar` / `glass-header` (`backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 border-rose-500/15`) |
| **Tier 2: Interactive Glass Card** | KPI Cards, Charts, Store Cards, Tables | `glass-card` (`backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 border-rose-500/12 shadow-glass hover:border-rose-500/30`) |
| **Tier 3: Floating Glass Overlay** | Modals, Store Command Drawer, Notification Popover | `glass-modal` (`backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90 border-rose-500/25 shadow-2xl`) |
