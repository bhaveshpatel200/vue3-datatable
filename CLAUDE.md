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

The library exports a single component `Vue3Datatable` plus typed interfaces from `src/components/index.ts`.

### Core Component

**`custom-table.vue`** (~200 lines script) — The main datatable component. Contains only template + composable wiring + `defineExpose`. All logic is in composables.

### Composables (`src/components/composables/`)

Each composable owns a single concern and returns reactive state + methods:

- **`usePagination.ts`** — `currentPage`, `currentPageSize`, `maxPage`, `offset`, `limit`, `paging`, navigation methods
- **`useSorting.ts`** — `currentSortColumn`, `currentSortDirection`, `toggleSort`, `resetSort`. Uses `'asc' | 'desc'` literal type.
- **`useFiltering.ts`** — `normalizedColumns` (computed, never mutates props), `columnFilterState` (reactive Map), `filteredRows` (computed + cached), `currentSearch`, filter value/condition setters, `getColumnsWithFilterState()` for event payloads
- **`useSelection.ts`** — `selected`, `selectedAll` (three-state: `true`/`null`/`false`), `selectAll`, `selectRow`, `unselectRow`, emit suppression via `shouldSuppressEmit()`
- **`useRowClick.ts`** — Native `@click`/`@dblclick` handler (no artificial timer delay)

### Supporting Files

- **`types.ts`** — All public types with `I` prefix and JSDoc: `IColumnDefinition`, `IColumnType`, `IFilterCondition`, `IServerChangeResponse`, `ISortChangeResponse`, `IDataTableProps`
- **`utils.ts`** — Pure helpers: `cellValue`, `dateFormat`, `stringFormat`
- **`filter-strategies.ts`** — Strategy pattern mapping column type × filter condition to predicate functions. Exports `INormalizedColumn` interface, `applyColumnFilters`, `applyGlobalSearch`, `applySorting`
- **`column-header.vue`** — Header row with flat individual props (no `:all="props"` pattern). Emits `filterValueChange`/`conditionChange` instead of mutating props. Debounced text/number filter inputs (300ms).
- **`column-filter.vue`** — Filter condition dropdown menu. Emits `conditionChange(field, condition)` — zero prop mutations.
- **`icon-*.vue`** — SVG icon components (check, dash, filter, loader)

### Key Design Decisions

- **Zero prop mutations** — `vue/no-mutating-props` is set to `error`. Column filter state lives in `columnFilterState` reactive Map inside `useFiltering`, never on the prop objects.
- **`normalizedColumns` computed** — Applies defaults (type, filter, search, sort, hide, condition) immutably. Merges current filter state. Used everywhere instead of raw `props.columns`.
- **Filter strategy pattern** — Type-safe lookup table in `filter-strategies.ts` replaces if-else chains. Each column type has a Record of condition → predicate function.
- **Pagination arrow slots** — `#firstArrow`, `#previousArrow`, `#nextArrow`, `#lastArrow` slots (not `v-html` props).
- **`#noData` slot** — Custom empty state alongside `noDataContent` text prop.

## Type System

All types in `src/components/types.ts` use `I` prefix. Internal components import from `./types`.

- `type` for unions/primitives: `IColumnType`, `IFilterCondition`
- `interface` for object shapes: `IColumnDefinition`, `IDataTableProps`, `IServerChangeResponse`, `ISortChangeResponse`
- `sortDirection` uses `'asc' | 'desc'` literal union (not `string`) across props, composables, and event payloads

## Build Output

Configured in `vite.config.ts` as a library build with `output.exports: 'named'`:
- `dist/vue3-datatable.js` (ESM) and `dist/vue3-datatable.umd.cjs` (UMD)
- `dist/components/index.d.ts` (TypeScript declarations via `vue-tsc --emitDeclarationOnly`)
- `dist/style.css` (Tailwind CSS, built separately via `tailwindcss` CLI)

Vue is externalized — not bundled into the output.

## Styling

Tailwind CSS with a **`bh-` prefix** on all utility classes (configured in `tailwind.config.cjs`). Tailwind preflight is disabled. Custom theme colors: primary (`#4361ee`), black (`#0e1726`), blue-light (`#f6f7fa`).

**Important:** When adding new Tailwind classes in templates, run `npm run cb` to regenerate `dist/style.css`. Classes not in the CSS output won't render.

## Code Style

- Prettier: single quotes, semicolons, 200 char print width, 4-space tabs, `prettier-plugin-tailwindcss`
- ESLint: flat config with `typescript-eslint` + `eslint-plugin-vue`, `vue/no-mutating-props: 'error'`
- TypeScript strict mode with `moduleResolution: "Bundler"` and `jsx: "preserve"`
- Vue 3 Composition API with `<script setup lang="ts">`

## Event System

The datatable emits both an aggregate `@change` event (server mode) AND individual events. Individual events fire in both client and server mode. Rules:
- Sort does NOT reset page
- Filter/search/pagesize resets to page 1 but only emits the specific event (not `@pageChange`)
- `@rowSelect` only fires from user interactions (controlled via `shouldSuppressEmit()` in useSelection)
- Server mode sets `currentLoader = true` immediately when emitting `@change`

## Selection Checkbox

Three states: `true` (all page rows), `null` (some — indeterminate dash), `false` (none). Never boolean-only.
