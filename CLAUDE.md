# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run dev:local` — Vite + local Express API (port 3100) via concurrently
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint across entire repo
- `npm test` — Vitest watch mode
- `npm run test:run` — Vitest single run
- `npm run test:coverage` — Vitest with coverage (thresholds: lines 55%, functions 42%, branches 42%)
- `npm run db:seed` — Prisma seed (`prisma/seed.ts`)
- `npx eslint <file>` — single-file ESLint check
- Pre-commit: `lint-staged` (ESLint + Prettier on staged files) then `tsc --noEmit`
- Prettier: `--single-quote`, `--no-semi`, `--print-width 100`, `--arrow-parens avoid`

## Architecture

### Hash routing (no React Router)

All pages are hash-based, managed centrally in `src/config/routes.ts`:

- `src/config/routes.ts` — `readRouteFromHash()` parses `window.location.hash` into a discriminated `AppRoute` union type; `pageComponentRegistry` maps page names to lazy-loaded components
- `src/config/feature-registry.ts` — typed `FeatureConfig[]` declaring all pages with category tags (`simple`/`param`/`callback`/`data`)
- `src/config/navigation.ts` — `goTo*()` helper functions (the only place `window.location.hash` is written)
- `src/components/router/AppRouter.tsx` — renders the active page component based on route

To add a new page: register it in `routes.ts` (FEATURE_REGISTRY + pageComponentRegistry), add navigation helpers in `navigation.ts`, create the component in `src/components/<domain>/`.

### Layer structure

| Layer        | Location                   | Purpose                                                    |
| ------------ | -------------------------- | ---------------------------------------------------------- |
| Pages        | `src/components/<domain>/` | Page-level components, each a self-contained domain module |
| Domain logic | `src/domain/`              | Pure state machines, status views, work item types         |
| Data         | `src/data/`                | Static/mock data and in-memory stores                      |
| Services     | `src/services/`            | API client, repositories (Prisma CRUD), error handling     |
| Store        | `src/store/`               | Zustand store (project state)                              |
| Config       | `src/config/`              | Routes, navigation, feature registry                       |

### State management

- **Zustand** (`src/store/projectStore.ts`) for cross-component project state
- Domain state machines in `src/domain/` (e.g., `projectStatusMachine.ts` with `canTransition/allowedTransitions`)
- Repository pattern in `src/services/repositories/` abstracts data access (falls back to mock data when DB is empty)
- Local API (`local-api/`) provides Express-based REST endpoints backed by Prisma/SQLite

### Design conventions

- All Tailwind color tokens are defined as CSS variables in `src/index.css` under `:root` (prefix `--pm-*`)
- Component CSS co-located as `*.css` files alongside components (not CSS modules)
- MUI 9 + Emotion for component library
- Domain types co-located with components in `*.types.ts` files
- Selector functions in `*.selectors.ts` files for data filtering/sorting

### Docs

- `docs/README.md` is the single entry point index (84+ markdown files)
- Architecture decisions: `docs/02-architecture/`
- Coding standards: `docs/00-governance/coding-standards.md`
- Comments follow engineering pattern: only for key logic, boundary conditions, complex state flows (Chinese comments for maintainability)
