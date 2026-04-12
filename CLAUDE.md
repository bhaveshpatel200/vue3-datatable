# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@bhplugin/vue3-datatable` — a zero-dependency Vue 3 datatable component library with client/server-side pagination, sorting, filtering, row selection, and custom cell rendering. Published to npm as ESM + UMD with TypeScript declarations and a separate CSS file. Tree-shakable (`sideEffects: ["**/*.css"]` in package.json).

## Commands

- `npm run cb` — **Primary workflow command.** Runs prettier → eslint → build (use this before committing)
- `npm run dev` — Start Vite dev server (serves demo app at `src/App.vue`)
- `npm run build` — Production build: Vite library → TypeScript declarations → minified Tailwind CSS
- `npm run prettier` — Format all source files
- `npm run lint` — ESLint with auto-fix
- `npm run tailwind` — Watch mode for Tailwind CSS during development

No test runner is configured.

## Architecture

All source lives in `src/components/`. The library exports a single component `Vue3Datatable` plus typed interfaces.

- **`types.ts`** — All public type definitions (`IColumnDefinition`, `IDataTableProps`, `IServerChangePayload`, etc.). All interfaces use `I` prefix convention with JSDoc descriptions.
- **`custom-table.vue`** — The main datatable component containing core logic: pagination, sorting, filtering, row selection, skeleton loading, sticky columns
- **`column-header.vue`** — Table header row with sort indicators, filter inputs (debounced for text/number), and filter condition dropdowns
- **`column-filter.vue`** — Per-column filter popup with type-aware operators (string/number/date/bool)
- **`icon-*.vue`** — Small SVG icon components (check, dash, filter, loader)
- **`index.ts`** — Entry point, exports `Vue3Datatable` (default + named) and all `I`-prefixed types from `types.ts`

`src/App.vue` and `src/main.ts` exist solely for the dev server demo and are not part of the library output.

## Type System

All types are defined in `src/components/types.ts` and use the `I` prefix convention:
- `IColumnDefinition` — column config (field, type, filter, sort, cellRenderer, etc.)
- `IColumnType` — `'string' | 'date' | 'number' | 'bool'`
- `IFilterCondition` — union of all filter operator strings
- `IServerChangePayload` — `@change` event payload in server mode
- `ISortChangePayload` — `@sortChange` event payload
- `IDataTableProps` — full props interface with JSDoc on every property

Internal components import types from `./types`, not from `./custom-table.vue`.

## Build Output

Configured in `vite.config.ts` as a library build with `output.exports: 'named'`:
- `dist/vue3-datatable.js` (ESM) and `dist/vue3-datatable.umd.cjs` (UMD)
- `dist/components/index.d.ts` (TypeScript declarations via `vue-tsc --emitDeclarationOnly`)
- `dist/style.css` (Tailwind CSS, built separately via `tailwindcss` CLI)

Vue is externalized — not bundled into the output.

## Styling

Tailwind CSS with a **`bh-` prefix** on all utility classes (configured in `tailwind.config.cjs`) to avoid polluting consumers' global styles. Tailwind preflight is disabled. Custom theme colors: primary (`#4361ee`), black (`#0e1726`), blue-light (`#f6f7fa`).

**Important:** When adding new Tailwind classes in templates, run `npm run tailwind:build` (or the full `npm run cb`) to regenerate `dist/style.css`. Classes not in the CSS output won't render.

## Code Style

- Prettier: single quotes, semicolons, 200 char print width, 4-space tabs, `prettier-plugin-tailwindcss` (`.prettierrc`)
- ESLint: flat config with `typescript-eslint` + `eslint-plugin-vue` (`eslint.config.js`)
- TypeScript strict mode with `moduleResolution: "Bundler"` and `jsx: "preserve"`
- Vue 3 Composition API with `<script setup lang="ts">`
- `vue/no-mutating-props` is set to `warn` (not error) — the column filter pattern mutates props by design

## Event System

The datatable emits both an aggregate `@change` event (server mode) AND individual events (`@sortChange`, `@pageChange`, `@filterChange`, `@searchChange`, `@pageSizeChange`). Individual events fire in both client and server mode. Key rules:
- Sort does NOT reset pagination to page 1
- Filter/search/pagesize resets to page 1 but only emits the specific event (not `@pageChange`)
- `@rowSelect` only fires from user interactions, not from internal state resets (controlled via `suppressRowSelectEmit` flag)

## Selection Checkbox States

The header select-all checkbox uses three states: `true` (all page rows), `null` (some — shows indeterminate dash), `false` (none). Never use boolean-only for this.
