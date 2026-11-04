# Component Guidelines — Shopnix Rose Glassmorphism UI

## 1. Executive Glass Sidebar (`Sidebar`)
- **Structure:** Fixed/collapsible left panel (`w-64` expanded, `w-[72px]` collapsed) with `glass-sidebar` styling.
- **Categorized Groups:**
  - `COMMAND & ANALYTICS` (Dashboard, Analytics)
  - `COMMERCE & CATALOG` (Orders, Products, Inventory, Customers)
  - `OMNICHANNEL & LOGISTICS` (Stores, Unified Inbox, Couriers)
  - `AI & AUTOMATION` (AI Assistant, Automations, AI Agents)
  - `SYSTEM` (Settings)
- **Active State:** Uses Framer Motion `layoutId="sidebar-active-pill"` with a rich Rose-to-Crimson gradient (`bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/25`) and glowing icon badge.

## 2. Frosted Glass TopNav (`TopNav`)
- **Height:** `h-16` sticky `z-30` with `glass-header`.
- **Elements:**
  - Active Store pill with pulsing emerald status dot and store link.
  - Glass `⌘K` Command Palette search trigger with rose hover ring.
  - Interactive **Notifications Center Bell** (`NotificationsPopover`) with unread count badge, category filters, and mark-as-read actions.
  - User Profile glass capsule with role badge and sign-out action.

## 3. Glass KPI Card (`StatCard`) & `DashboardCard`
- **Surface:** `glass-card` with a 2px top gradient accent bar (`from-rose-500 via-pink-500 to-crimson-600`), subtle inner top highlight, and smooth hover lift (`hover:-translate-y-0.5 transition-all duration-300`).
- **Icon Container:** Frosted rose icon badge (`bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl`).

## 4. Store Command Drawer & Email Composer Modal
- **Store Command Drawer:** Slide-over glass panel showing connected store metadata, synced products table, and imported store orders with direct order status selector and courier dispatch trigger.
- **Email Connect & Send Hub:** Tabbed provider selector (`SMTP`, `Resend`, `SendGrid`) with encrypted credential inputs, connection status indicator, and a live transactional email composer.
