# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@bhplugin/vue3-datatable` — a zero-dependency Vue 3 datatable component library with client/server-side pagination, sorting, filtering, row selection, and custom cell rendering. Published to npm as ESM + UMD with TypeScript declarations and a separate CSS file.

## Commands

- `npm run dev` — Start Vite dev server (serves demo app at `src/App.vue`)
- `npm run build` — Full production build: Vite library build → TypeScript declarations → minified Tailwind CSS
- `npm run tailwind` — Watch mode for Tailwind CSS during development
- `npm run preview` — Preview production build

No test runner is configured.

## Architecture

All source lives in `src/components/`. The library exports a single component: `Vue3Datatable`.

- **`custom-table.vue`** (~900 lines) — The main datatable component containing all core logic: pagination, sorting, filtering, row selection, skeleton loading, sticky columns
- **`column-header.vue`** — Table header row with sort indicators and filter toggle buttons
- **`column-filter.vue`** — Per-column filter popup with type-aware operators (string/number/date/bool)
- **`icon-*.vue`** — Small SVG icon components (check, dash, filter, loader)
- **`index.ts`** — Entry point, exports only `Vue3Datatable`

`src/App.vue` and `src/main.ts` exist solely for the dev server demo and are not part of the library output.

## Build Output

Configured in `vite.config.ts` as a library build:
- `dist/vue3-datatable.js` (ESM) and `dist/vue3-datatable.umd.js` (UMD)
- `dist/main.d.ts` (TypeScript declarations via `vue-tsc --emitDeclarationOnly`)
- `dist/style.css` (Tailwind CSS, built separately via `tailwindcss` CLI)

Vue is externalized — not bundled into the output.

## Styling

Tailwind CSS with a **`bh-` prefix** on all utility classes (configured in `tailwind.config.cjs`) to avoid polluting consumers' global styles. Tailwind preflight is disabled. Custom theme colors: primary (`#4361ee`), black (`#0e1726`), blue-light (`#f6f7fa`).

## Code Style

- Prettier: single quotes, semicolons, 180 char print width (`.prettierrc`)
- TypeScript strict mode
- Vue 3 Composition API with `<script setup lang="ts">`
