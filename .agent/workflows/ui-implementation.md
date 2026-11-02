# Workflow: UI Component & Page Implementation

Follow these steps when creating or modifying UI components or pages in Shopnix:

1. **Design System Alignment:**
   - Review tokens in `.agent/design/color-tokens.md` and `.agent/design/typography.md`.
   - Never use arbitrary inline colors or ad-hoc margins.

2. **Folder Structure Setup:**
   - Create component folder: `components/shared/[component-name]/index.tsx`.
   - If auxiliary sub-components or styles are needed, place them inside that folder.
   - Export the component and its props from `components/shared/index.ts`.

3. **Accessibility & States:**
   - Ensure interactive elements are keyboard focusable with visible focus rings (`focus-visible:ring-2`).
   - Implement all 4 required UI states: Loading skeleton, Empty state, Error state, and Data state.

4. **Responsive Verification:**
   - Test layout at 320px, 375px, 768px, 1024px, and 1440px widths.
   - Verify that tables scroll or wrap appropriately on mobile.

5. **Motion Micro-Interactions:**
   - Add subtle Framer Motion / Motion transitions for enters, exits, and drawer toggles.
   - Keep animations under 200ms with ease-out curves.
