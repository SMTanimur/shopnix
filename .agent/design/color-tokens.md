# Design Specification: Color Tokens

Defined using Tailwind CSS 4 `@theme` in OKLCH color space for maximum perceptual consistency across displays.

```css
@theme {
  /* Brand / Primary */
  --color-primary: oklch(0.45 0.15 280);
  --color-primary-foreground: oklch(0.98 0 0);

  /* Background & Foregrounds */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);

  /* Card & Surface */
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);

  /* Popover & Flyouts */
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.145 0 0);

  /* Secondary & Muted */
  --color-secondary: oklch(0.965 0.005 280);
  --color-secondary-foreground: oklch(0.2 0.02 280);
  --color-muted: oklch(0.965 0 0);
  --color-muted-foreground: oklch(0.45 0 0);

  /* Accent */
  --color-accent: oklch(0.95 0.03 280);
  --color-accent-foreground: oklch(0.25 0.08 280);

  /* Semantic Alerts */
  --color-success: oklch(0.55 0.15 145);
  --color-success-foreground: oklch(0.98 0 0);
  --color-warning: oklch(0.7 0.15 75);
  --color-warning-foreground: oklch(0.18 0.05 75);
  --color-destructive: oklch(0.55 0.2 25);
  --color-destructive-foreground: oklch(0.98 0 0);

  /* Borders & Controls */
  --color-border: oklch(0.92 0 0);
  --color-input: oklch(0.92 0 0);
  --color-ring: oklch(0.45 0.15 280);
}
```
