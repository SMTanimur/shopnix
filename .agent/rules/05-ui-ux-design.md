# 05 - UI/UX Design Rules (Rose Glassmorphism & Cinematic Motion System)

## 1. Visual Aesthetic Philosophy
- **Theme Direction:** Shopnix Rose/Crimson Glassmorphism & Cinematic Motion SaaS OS (inspired by Linear, Raycast, and Apple VisionOS glass depth paired with Shopnix Crimson/Rose brand identity).
- **Surface Language:** Multi-layered translucent frosted glass (`backdrop-blur-xl` / `backdrop-blur-2xl`), delicate rose/crimson specular top-border highlights, soft ambient radial rose/pink background mesh lighting, and high-contrast slate typography.
- **No Generic Flat Templates:** Every surface (Sidebar, TopNav, KPI StatCards, DashboardCards, Modals, Popovers, Tables) must feel cohesive within the Rose Glassmorphism system with subtle depth, light refraction, and purposeful micro-interactions.

## 2. Color System & Brand Tokens
- **Primary Brand (Shopnix Rose / Crimson):** `oklch(0.55 0.22 18)` (`#e11d48`) — used for primary CTAs, active navigation pills, focus rings, and specular glow accents.
- **Secondary Accent (Electric Pink / Rose):** `oklch(0.62 0.24 350)` (`#ec4899`) — paired with Primary Rose for gradient buttons, active indicators, and ambient background orbs.
- **Light Mode Glass Surfaces:**
  - Base Canvas: `#fcfcfd` with ambient radial rose/pink/crimson mesh (`rgba(225, 29, 72, 0.05)`)
  - Glass Card / Panel: `bg-white/75 backdrop-blur-xl border border-rose-500/12 shadow-[0_8px_30px_rgb(15,23,42,0.04)]`
  - Glass Sidebar / Header: `bg-white/80 backdrop-blur-2xl border-rose-500/15`
- **Dark Mode Glass Surfaces:**
  - Base Canvas: `oklch(0.13 0.015 260)` with deep crimson/pink ambient glow (`rgba(225, 29, 72, 0.09)`)
  - Glass Card / Panel: `bg-slate-900/70 backdrop-blur-xl border border-rose-500/20`
- **Semantic Status Colors (Translucent Glass Pills):**
  - **Success / Delivered / Settled:** Emerald (`bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25`)
  - **Warning / Pending / Low Stock:** Amber (`bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25`)
  - **Danger / Cancelled / High Risk / RTO:** Rose/Crimson (`bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25`)
  - **Info / In Transit / Processing:** Sky/Blue (`bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/25`)

## 3. Cinematic Motion & Micro-Interactions
- **Spring Physics:** Use `framer-motion` spring transitions (`type: "spring", stiffness: 380, damping: 30`) for active sidebar pills (`layoutId`), tab switches, modal/drawer reveals, and notification popovers.
- **Card Hover Choreography:** Interactive glass cards must elevate subtly on hover (`-translate-y-0.5`), brighten their rose border (`hover:border-rose-500/35`), and reveal a soft top specular highlight.
- **Staggered Entrance:** Dashboard sections and KPI grids should animate in smoothly (`opacity: 0 -> 1, y: 10 -> 0`) without blocking interaction.

## 4. Layout & Navigation Architecture
- **Categorized Executive Sidebar:**
  - Group navigation into clear operational domains: *Command & Analytics*, *Commerce & Catalog*, *Omnichannel & Logistics*, *AI & Automation*, and *System*.
  - Active route uses a glowing Rose/Crimson gradient pill with crisp icon + label contrast.
- **Frosted Glass TopNav:**
  - Sticky `h-16` glass header with Store Switcher badge, `⌘K` Command Search trigger, Quick Action button, live **Notification Center Bell** with unread counter badge, and User Profile pill.
- **Data Formatting:**
  - Always apply `tabular-nums` to currency (`৳`), order counts, conversion rates, and timestamps.
