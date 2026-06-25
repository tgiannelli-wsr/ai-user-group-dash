# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR on `0.0.0.0:5173` (frontend only)
- `npm run dev:server` / `npm start` — run the Express API + static server (`server.js`) on `:8080`
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built `dist/` locally
- `npm run lint` — ESLint over all `.js`/`.jsx` (flat config in `eslint.config.js`). **CI relies on this; keep it clean.**

There is **no test suite**. The IDE/react-compiler surfaces some advisory diagnostics (e.g. `Date.now()` in handlers) that `npm run lint` does **not** treat as errors — `npm run lint` is the source of truth.

For full-stack local dev: run `npm run dev:server` (API on 8080) and `npm run dev` (Vite on 5173) together — Vite proxies `/api` → 8080 ([vite.config.js](vite.config.js)). If the API isn't running, the app falls back to localStorage **offline mode**, so `npm run dev` alone still works.

### Docker
- Dev (frontend hot reload, 5173): `docker compose --profile dev up`
- Prod (full app: Express + API + SQLite, 8080): `docker compose --profile prod up --build`

[Dockerfile](Dockerfile) is a two-stage build (`node:20-bookworm-slim`): build the frontend, then a runtime image where Express serves `dist/` + the API. SQLite persists on the `dashboard-data` volume. See [DEPLOY.md](DEPLOY.md) for the fpt-dev-01 deployment (self-hosted GitHub Actions runner, [.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

## Architecture

A single React 19 + Vite SPA ([src/App.jsx](src/App.jsx), one large file) **plus** a tiny Node/Express + SQLite backend ([server.js](server.js)) that holds the **shared** dashboard state. One container serves both (same origin, no CORS).

- Entry: [index.html](index.html) → [src/main.jsx](src/main.jsx) → [src/App.jsx](src/App.jsx).
- Tabler icon font loads via **CDN** in [index.html](index.html) (`<i className="ti ti-...">`) — no npm icon dep, needs network at runtime.
- Styling is **all inline style objects** — no CSS framework; the `.css` files are near-empty. Match this when editing UI.
- Brand palette lives in the `BRAND` constant + the `DEFAULT_MC/EC/HC`, `MODE/EFF/HITL_COLORS` maps (White Spot colors). Logo: `public/whitespot-logo.png`; favicon: `public/favicon.svg`.

### The data model — one editable document
The entire dashboard is **one JSON object** (`data` state), seeded from module-level `DEFAULT_*` constants and `DEFAULT_STATE` at the top of [src/App.jsx](src/App.jsx):
- `title`, `depts` (`{id,icon,name,sponsor}`), `ucs` (flat use cases: `uid,deptId,r,n,m,p,e,h,nn,champ,custom`), `waves`, `kpis`, and the legend maps `mc`/`ec`/`hc`.
- Category **keys are load-bearing**: mode `chat|tool|agent`, effort `low|med|high`, HITL `yes|partial|no`. These drive filters and charts. The legend editor changes labels/colors only, never keys.
- Everything is editable in the UI — the **Manage** tab edits departments, waves, KPIs, legends, the title, and JSON import/export/reset; use cases are edited inline on the **Use cases** tab.

### State & persistence (server-backed, offline-tolerant)
`data` is the single source of truth. The persistence layer in `App` is the part to understand before touching:
- **Load:** on mount, `GET /api/state`. If the server has data, use it. If empty (first run), **seed** it by PUTting this browser's `loadInitial()` (localStorage cache or `DEFAULT_STATE`) — this migrates curated data to the shared store. If the API is unreachable → offline mode from localStorage.
- **Save:** every edit goes through `persist(next)` → optimistic `setData` + localStorage cache + debounced `PUT /api/state` with `baseVersion` (refs: `dataRef`, `verRef`, `inFlight`, `dirty`).
- **Concurrency:** optimistic versioning. The server (`server.js`) increments `version` on each write and returns **409** if `baseVersion` is stale; the client then reloads the latest (last-writer-wins, no silent clobber). A 15s poll keeps co-editors converged.
- `SaveStatus` in the header shows loading/saving/saved/offline/conflict.

Helpers worth reusing: `update(patch)`, `updateArr/moveArr/removeArr(key,...)`, `persist(next)`, `cacheLocal`, `loadInitial`, and the `Pill/FPill/TBtn/MiniBtn/Donut/SaveStatus` components.

`server.js` keeps the whole doc in a single SQLite row (`state(id=1, doc, version, updated_at)`), `DB_PATH` env (default `/data/dashboard.db`).

### Important: detached duplicate file
[ai_adoption_dashboard_v2.jsx](ai_adoption_dashboard_v2.jsx) at the repo root is an **unused** standalone copy (the live app is `src/App.jsx`) and is in `eslint`'s ignore list. Edit `src/App.jsx`; leave the root file alone unless intentionally syncing.

## Context
An AI adoption roadmap for White Spot / Triple O's — AI use cases by department, mode, effort, and rollout wave, with exec sponsors per department and champions per use case. Hosted for internal shared use (no auth) on fpt-dev-01.
