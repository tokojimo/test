# Redesign Overview

This update introduces a cohesive, organic design system for the mushroom‑finding app.  The theme is inspired by a humid forest palette and includes light and dark modes.

## Design Tokens
Tokens live in [`src/styles/design-tokens.json`](src/styles/design-tokens.json) and are re‑exported from [`src/styles/tokens.ts`](src/styles/tokens.ts).  They provide a single source of truth for:
- Color palettes for light and dark modes
- Typography scale and font families
- Spacing, radii and elevation
- Motion durations and easing curves

CSS variables are defined in [`src/index.css`](src/index.css) so Tailwind utilities can reference them.  Overrides can be applied by adjusting these variables at the `:root` or `.dark` level.

## Components
New primitive components live in [`src/components/ui`](src/components/ui): buttons, inputs, selects, tabs, chips, cards, modals and toasts.  Buttons support `primary`, `secondary`, `ghost` and `destructive` variants with accessible focus styles.  Cards and chips include subtle hover lift and rounded organic forms.  A lightweight `Skeleton` component provides loading placeholders.

## Global Styles & Layout
`src/index.css` applies a reset, theming variables, a lightweight grain texture and container/grid utilities.  Motion respects `prefers-reduced-motion` and all colors meet WCAG AA contrast in both themes.

## Map & Scenes
The map scene uses the natural palette for tinting and hides default chrome for a cleaner look.  The landing hero now relies solely on organic blobs and color, removing literal mushroom graphics.

## Extending
Add new tokens to `design-tokens.json` and extend Tailwind in `tailwind.config.cjs`.  Components consume variables so custom themes can override CSS variables without touching markup.

## Development
Run tests with:
```bash
npm test
```

Run the dev server with:
```bash
npm run dev
```
