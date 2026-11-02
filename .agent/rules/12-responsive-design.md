# Rule 12: Responsive Design & Breakpoint Standards

1. **Standard Breakpoints:**
   - `sm`: 640px (large phones, small tablets).
   - `md`: 768px (tablets).
   - `lg`: 1024px (laptops, small desktops).
   - `xl`: 1280px (standard desktops).
   - `2xl`: 1536px (wide monitors).

2. **Mobile-First Principles:**
   - Write Tailwind classes starting from mobile upwards (e.g., `flex-col lg:flex-row`).
   - The desktop sidebar must collapse into a smooth slide-out drawer on tablet and mobile viewports (`< lg`).
   - Tables on mobile viewports must support horizontal scrolling with sticky primary action/ID columns, or transform into card stacks for touch ergonomics.

3. **Touch Targets & Ergonomics:**
   - Interactive buttons, inputs, and clickable icons must have a minimum touch target size of 44x44px on mobile devices.
   - Modals on mobile should render as bottom sheets / responsive drawers (`<ResponsiveDrawer />`) rather than center dialogs.
