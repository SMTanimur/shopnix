# Rule 05: UI/UX & Design System Principles

1. **Brand Identity & Aesthetic:**
   - **Product Name:** Shopnix.
   - **Visual Language:** Minimalist, high-density, enterprise-grade SaaS inspired by Linear, Stripe, and Vercel.
   - **Color Palette:** Deep Indigo / Modern Violet primary with OKLCH tokens defined in `@theme` in `globals.css`.
   - Never use arbitrary raw colors (e.g., `#6366f1` or `bg-purple-500`) scattered in components. Always use semantic design tokens (`bg-primary`, `text-muted-foreground`, `border-border`).

2. **Typography System:**
   - Display: Font-sans (Geist Sans), semibold.
   - Headers: Strict typographic scale (`text-2xl font-semibold`, `text-lg font-medium`, `text-sm font-medium`).
   - Body: `text-sm text-foreground` (14px base for data density).
   - Captions: `text-xs text-muted-foreground`.
   - Numbers & Currency: Font-mono (Geist Mono) or tabular figures (`tabular-nums font-medium`) for accurate numeric vertical alignment.

3. **Mandatory UI States:**
   Every data-driven view and table must handle all 4 fundamental UI states:
   1. **Loading State:** Skeleton loaders matching the actual content shape (`<Skeleton />`). Never display a blank white page or raw spinner.
   2. **Empty State:** Informative empty state component (`<EmptyState />`) featuring an icon, clear title, explanatory copy, and a primary CTA button.
   3. **Error State:** Resilient error card (`<ErrorState />`) explaining what failed with a "Retry" button.
   4. **Success / Data State:** Pixel-perfect data display with subtle entrance transitions.

4. **Micro-Interactions & Animation:**
   - Use Motion (Framer Motion) exclusively for functional micro-interactions (sidebar collapse, dialog fade/scale, dropdown popovers, badge transitions).
   - Transition duration: 150ms–250ms with ease-out springs. Avoid slow, distracting, or excessive animations.
