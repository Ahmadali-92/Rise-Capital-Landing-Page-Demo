# Rise Capital — Equipment Rental (Frontend Demo)

A **frontend-only** demo of the Rise Capital equipment-rental experience — the
public **landing page** and the **equipment detail page**. No backend, no API,
no database. All catalog data is **hardcoded** in `src/shared/data/catalog.ts`.

## Pages

| Route              | Description                                        |
| ------------------ | -------------------------------------------------- |
| `/`                | Landing — hero + live fleet grid (9 units)         |
| `/equipment/[id]`  | Equipment detail — gallery, specs, booking modal   |

Use a real catalog `id` from `src/shared/data/catalog.ts`, e.g.
`/equipment/3411532d-d457-4736-92d5-b70ee16cfa78` (Big Rig – Rig 16).

## Run locally

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Notes

- **Dark / light mode** toggle (top-right) works — persisted in the browser.
- The booking **"Check availability"** modal is fully interactive client-side
  (date range, price calculation, animated gold border). Because there is no
  backend, **"Sign in"** and **"Continue to checkout"** are intentionally
  no-ops.
- Catalog data (names, rates, statuses, images) was captured to match the
  production experience — edit `src/shared/data/catalog.ts` to change it.

## Tech

Next.js 16 (App Router) · React 19 · MUI v9 · Emotion · TypeScript.
