# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── automake-ysws/      # Automake YSWS frontend (React + Vite, frontend-only)
│   ├── api-server/         # Express API server
│   └── mockup-sandbox/     # Design mockup sandbox
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Automake YSWS (`artifacts/automake-ysws`)

A frontend-only React + Vite website for the Automake YSWS program (Youth Startup Weekend - You Ship We Ship).

- **Preview path**: `/` (root)
- **Stack**: React 18, Vite, Tailwind CSS v4, Wouter routing, DM Serif Display + DM Sans fonts
- **Brand colors**: Eucalyptus (`#D1DCCF`), Midnight Plum (`#3B2F3E`), Pencil Lead (`#424242`)
- **No backend** — purely static, all data hardcoded in `src/data/`
- **Pages**: Landing, Showcase, Project Detail, Guides, Guide Detail, Shop, 404
- **Components**: Navbar, Footer, ProjectCard, GuideCard, ShopItemCard, MarqueeStrip
- **Data files**: `projects.ts` (8 projects), `guides.ts` (6 guides), `shopItems.ts` (26 items)

### Features
- Sticky navbar with mobile hamburger menu
- Hero section with SVG illustration, CTA buttons
- "How It Works" step cards
- Scrolling CSS marquee of participant cards
- Featured projects grid
- Community section (image + text side-by-side)
- FAQ accordion (pure React state)
- Multi-column footer in Midnight Plum
- Category/difficulty filter pills on Showcase, Guides, Shop
- Project detail pages with screenshot/video placeholders
- Guide detail pages with step-by-step instructions + remix ideas
- Shop page with locked items (visual only)
- 404 page

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
