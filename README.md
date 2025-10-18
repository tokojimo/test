# Redesign Overview

This update introduces a cohesive, organic design system for the mushroom‑finding app.  The theme is inspired by a humid forest palette.

## Design Tokens
Tokens live in [`src/styles/design-tokens.json`](src/styles/design-tokens.json) and are re‑exported from [`src/styles/tokens.ts`](src/styles/tokens.ts).  They provide a single source of truth for:
- Color palette
- Typography scale and font families
- Spacing, radii and elevation
- Motion durations and easing curves

CSS variables are defined in [`src/index.css`](src/index.css) so Tailwind utilities can reference them.  Overrides can be applied by adjusting these variables at the `:root` level.

## Components
New primitive components live in [`src/components/ui`](src/components/ui): buttons, inputs, selects, tabs, chips, cards, modals and toasts.  Buttons support `primary`, `secondary`, `ghost` and `destructive` variants with accessible focus styles.  Cards and chips include subtle hover lift and rounded organic forms.  A lightweight `Skeleton` component provides loading placeholders.

## Global Styles & Layout
`src/index.css` applies a reset, theming variables, a lightweight grain texture and container/grid utilities.  All colors meet WCAG AA contrast.

## Grid Responsiveness Regression
The redesign initially dropped the `grid-responsive` rules, so responsive grid utilities were purged and layouts collapsed. The fix adds explicit `grid-cols-*` classes in templates and safelists them in `tailwind.config.cjs`.

### Verification
1. Inspect the computed `grid-template-columns` at each breakpoint to confirm the expected column counts.
2. Ensure no other CSS rules override those grid declarations.

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

## Settings Module

The `/settings` route exposes account, subscription, offline maps, alerts,
preferences and legal sections. Each section lives in
`src/routes/settings/*.tsx` and shares state through `src/stores/settings.ts`
persisted to `localStorage` with Zustand.

Forms rely on `react-hook-form` and Zod schemas under `src/validation`. Mocked
API helpers are in `src/api`. To extend, add new slice in the store and a
corresponding component under `src/routes/settings`.

Environment variables can be defined in `.env` (see `.env.sample`).
Required keys:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
```

In the Supabase dashboard, add `https://localhost:5173/auth/callback` (or your deployed origin) to the list of OAuth redirect URLs.

Limitations: offline map downloads and background sync are simplified mocks and
should be replaced by real implementations when integrating a backend.

## Raster tiles
- XYZ rasters must be hosted under `<cdn-root>/tiles/{z}/{x}/{y}.png` (PNG or WEBP).
- Set `VITE_TILE_CDN_BASE_URL` (see `.env.sample`) to switch between preview and production tile CDNs.
- Optional: override the Grenoble fallback fit bounds via `VITE_TILE_DEFAULT_BBOX=minLon,minLat,maxLon,maxLat`.
- Layers live in `src/config/rasterLayers.ts` with `id`, `title`, `url`, `minzoom`, `maxzoom`, `opacity`, `isVisible` and `bounds` fields.
- Duplicate the Grenoble layer block to add new datasets/regions; the map fits their combined bounds and ignores missing (404) tiles.
