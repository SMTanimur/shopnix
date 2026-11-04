# Color Tokens — Shopnix Rose Glassmorphism System

## 1. Core Brand & Surface Tokens (OKLCH + Glass Alpha)

### Light Mode (`:root`)
```css
:root {
  --background: oklch(0.985 0.003 18);           /* Soft Warm Rose-Tinted White */
  --foreground: oklch(0.14 0.02 260);            /* Deep Executive Slate */

  --card: oklch(1 0 0 / 0.78);                   /* Frosted White Glass */
  --card-foreground: oklch(0.14 0.02 260);

  --popover: oklch(1 0 0 / 0.88);                /* High-Clarity Frosted Popover */
  --popover-foreground: oklch(0.14 0.02 260);

  --primary: oklch(0.55 0.22 18);                /* Shopnix Rose / Crimson (#e11d48) */
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.96 0.015 18);             /* Soft Rose Tint Surface */
  --secondary-foreground: oklch(0.25 0.04 18);

  --muted: oklch(0.955 0.008 260);               /* Subtle Neutral Slate */
  --muted-foreground: oklch(0.46 0.02 260);

  --accent: oklch(0.95 0.025 18);                /* Hover Rose Glass Tint */
  --accent-foreground: oklch(0.45 0.19 18);

  --destructive: oklch(0.55 0.22 25);            /* Alert Crimson */
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.88 0.02 18 / 0.65);          /* Translucent Rose-Slate Hairline */
  --input: oklch(0.88 0.02 18 / 0.75);
  --ring: oklch(0.55 0.22 18);                   /* Rose Focus Ring */
}
```

### Dark Mode (`.dark`)
```css
.dark {
  --background: oklch(0.12 0.015 260);           /* Deep Obsidian Canvas */
  --foreground: oklch(0.96 0.005 260);

  --card: oklch(0.16 0.02 260 / 0.72);           /* Dark Frosted Glass */
  --card-foreground: oklch(0.96 0.005 260);

  --popover: oklch(0.17 0.02 260 / 0.90);
  --popover-foreground: oklch(0.96 0.005 260);

  --primary: oklch(0.60 0.23 18);                /* Luminous Rose / Crimson */
  --primary-foreground: oklch(0.99 0 0);

  --border: oklch(0.28 0.03 18 / 0.55);          /* Dark Specular Rose Border */
  --ring: oklch(0.60 0.23 18);
}
```

## 2. Glassmorphism Utility Tokens
- `--glass-bg`: `rgba(255, 255, 255, 0.75)` (Light) / `rgba(15, 23, 42, 0.72)` (Dark)
- `--glass-border`: `rgba(225, 29, 72, 0.14)` (Light) / `rgba(244, 63, 94, 0.22)` (Dark)
- `--glass-highlight`: `inset 0 1px 0 0 rgba(255, 255, 255, 0.85)`
- `--glass-shadow`: `0 10px 35px -5px rgba(15, 23, 42, 0.05), 0 4px 15px -2px rgba(225, 29, 72, 0.04)`
