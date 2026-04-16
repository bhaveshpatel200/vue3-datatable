# @bhplugin/vue3-datatable

A zero-dependency Vue 3 datatable component with client/server-side pagination, sorting, filtering, row selection, and custom cell rendering.

## Example

[Document & Demos](https://vue3-datatable-document.vercel.app)

## Install

#### NPM

```bash
npm install @bhplugin/vue3-datatable --save
```

#### Yarn

```bash
yarn add @bhplugin/vue3-datatable
```

## Usage

```html
<template>
    <vue3-datatable :rows="rows" :columns="cols" :sortable="true" :columnFilter="true"> </vue3-datatable>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import Vue3Datatable from "@bhplugin/vue3-datatable";
    import type { IColumnDefinition } from "@bhplugin/vue3-datatable";
    import "@bhplugin/vue3-datatable/dist/style.css";

    const cols = ref<IColumnDefinition[]>([
        { field: "id", title: "ID", isUnique: true, type: "number", filter: false },
        { field: "name", title: "Name" },
        { field: "email", title: "Email" },
        { field: "age", title: "Age", type: "number" },
        { field: "dob", title: "Date of Birth", type: "date" },
        { field: "isActive", title: "Active", type: "bool" },
        { field: "address.city", title: "City" },
    ]);

    const rows = ref<Array<Record<string, unknown>>>([
        { id: 1, name: "John Doe", email: "john@example.com", age: 28, dob: "1997-05-15", isActive: true, address: { city: "New York" } },
        { id: 2, name: "Jane Smith", email: "jane@example.com", age: 34, dob: "1991-11-22", isActive: false, address: { city: "London" } },
        // ...
    ]);
</script>
```

## Props

| Prop                    | Type                      | Default                             | Description                                                                                          |
| ----------------------- | :------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **columns** (required)  | `IColumnDefinition[]`     | `[]`                                | Table column definitions                                                                             |
| **rows** (required)     | `Record[]`                | `[]`                                | Table row data                                                                                       |
| **isServerMode**        | `boolean`                 | `false`                             | Enable server-side mode (disables client-side sort/filter/pagination)                                |
| **totalRows**           | `number`                  | `0`                                 | Total row count (required in server mode)                                                            |
| **skin**                | `string`                  | `"bh-table-striped bh-table-hover"` | Table skin classes: `bh-table-striped`, `bh-table-hover`, `bh-table-bordered`, `bh-table-compact`    |
| **loading**             | `boolean`                 | `false`                             | Show loading overlay/skeleton                                                                        |
| **hasCheckbox**         | `boolean`                 | `false`                             | Show checkbox column for row selection                                                               |
| **search**              | `string`                  | `""`                                | Global search string                                                                                 |
| **page**                | `number`                  | `1`                                 | Current page (1-based)                                                                               |
| **pageSize**            | `number`                  | `10`                                | Rows per page                                                                                        |
| **pageSizeOptions**     | `number[]`                | `[10, 20, 30, 50, 100]`            | Page size dropdown options                                                                           |
| **showPageSize**        | `boolean`                 | `true`                              | Show page size dropdown                                                                              |
| **rowClass**            | `string \| Function`      | `""`                                | Custom row class (string or `(row) => string`)                                                       |
| **cellClass**           | `string \| Function`      | `""`                                | Custom cell class (string or `(row) => string`)                                                      |
| **sortable**            | `boolean`                 | `false`                             | Enable column sorting                                                                                |
| **sortColumn**          | `string`                  | `""`                                | Initial sort column field                                                                            |
| **sortDirection**       | `'asc' \| 'desc'`        | `"asc"`                             | Initial sort direction                                                                               |
| **columnFilter**        | `boolean`                 | `false`                             | Enable per-column filter inputs                                                                      |
| **columnFilterLang**    | `Record<string, string>`  | `null`                              | i18n labels for filter conditions (see below)                                                        |
| **pagination**          | `boolean`                 | `true`                              | Show pagination                                                                                      |
| **showNumbers**         | `boolean`                 | `true`                              | Show page number buttons                                                                             |
| **showNumbersCount**    | `number`                  | `5`                                 | Max visible page number buttons                                                                      |
| **showFirstPage**       | `boolean`                 | `true`                              | Show first page button                                                                               |
| **showLastPage**        | `boolean`                 | `true`                              | Show last page button                                                                                |
| **paginationInfo**      | `string`                  | `"Showing {0} to {1} of {2} entries"` | Pagination info template (`{0}` = start, `{1}` = end, `{2}` = total)                              |
| **noDataContent**       | `string`                  | `"No data available"`               | Empty state text                                                                                     |
| **skeletonRowCount**    | `number`                  | `10`                                | Number of skeleton rows while loading                                                                |
| **stickyHeader**        | `boolean`                 | `false`                             | Sticky table header                                                                                  |
| **height**              | `string`                  | `"500px"`                           | Scrollable height (only with `stickyHeader`)                                                         |
| **stickyFirstColumn**   | `boolean`                 | `false`                             | Sticky first column                                                                                  |
| **cloneHeaderInFooter** | `boolean`                 | `false`                             | Clone header as footer row                                                                           |
| **selectRowOnClick**    | `boolean`                 | `false`                             | Toggle row selection on row click                                                                    |

### columnFilterLang keys

```ts
{
    no_filter: 'No filter',
    contain: 'Contain', not_contain: 'Not contain',
    equal: 'Equal', not_equal: 'Not equal',
    start_with: 'Starts with', end_with: 'Ends with',
    greater_than: 'Greater than', greater_than_equal: 'Greater than or equal',
    less_than: 'Less than', less_than_equal: 'Less than or equal',
    is_null: 'Is null', is_not_null: 'Not null',
    all: 'All', true: 'True', false: 'False'   // boolean column filter labels
}
```

## Column Definition

| Prop             | Type               | Default     | Description                                                        |
| ---------------- | :----------------- | ----------- | ------------------------------------------------------------------ |
| **isUnique**     | `boolean`          | `false`     | Mark as unique row identifier (used for selection keys)            |
| **field**        | `string`           | `""`        | Data field path (supports dot notation: `address.city`)            |
| **title**        | `string`           | `""`        | Column header text                                                 |
| **value**        | `string`           | `""`        | Initial filter value                                               |
| **condition**    | `IFilterCondition` | `""`        | Default filter condition (`contain` for string, `equal` for number/date, empty for bool) |
| **type**         | `string`           | `"string"`  | Column type: `string`, `number`, `date`, `bool`                    |
| **width**        | `string`           | `""`        | Column width (e.g., `"200px"`)                                     |
| **minWidth**     | `string`           | `""`        | Minimum column width                                               |
| **maxWidth**     | `string`           | `""`        | Maximum column width                                               |
| **hide**         | `boolean`          | `false`     | Hide column from rendering                                         |
| **filter**       | `boolean`          | `true`      | Enable column filter                                               |
| **search**       | `boolean`          | `true`      | Include in global search                                           |
| **sort**         | `boolean`          | `true`      | Enable sorting                                                     |
| **html**         | `boolean`          | `false`     | Column contains raw HTML                                           |
| **cellRenderer** | `Function`         | -           | Custom cell renderer: `(row) => '<strong>html</strong>'` (sanitized automatically) |
| **headerClass**  | `string`           | `""`        | Custom header cell class                                           |
| **cellClass**    | `string`           | `""`        | Custom body cell class                                             |

## Events

| Event              | Payload                  | Description                                                                                 |
| ------------------ | :----------------------- | ------------------------------------------------------------------------------------------- |
| **changeServer**   | `IServerChangeResponse`  | Server mode only — aggregate event with full state (page, sort, search, filters, change_type) |
| **pageChange**     | `number`                 | User clicked pagination button (silent on programmatic resets)                               |
| **pageSizeChange** | `number`                 | Page size dropdown changed                                                                   |
| **sortChange**     | `ISortChangeResponse`    | Column sort applied (does NOT reset page)                                                    |
| **filterChange**   | `IColumnDefinition[]`    | Column filter value or condition changed                                                     |
| **searchChange**   | `string`                 | Global search prop changed                                                                   |
| **rowSelect**      | `Record[]`               | Row selection changed (user interaction only)                                                |
| **rowClick**       | `Record`                 | Row single click                                                                             |
| **rowDBClick**     | `Record`                 | Row double click                                                                             |
| **reset**          | -                        | `reset()` called — only event during reset, all others suppressed                            |

### Event rules

- Sort does **not** reset page
- Filter/search/pagesize resets to page 1 but only emits the specific event (not `pageChange`)
- `pageChange` fires only from explicit user pagination clicks
- During reset, only `reset` (+ `changeServer` in server mode) emits — all other events suppressed

## Methods

| Method                   | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| **reset()**              | Reset all state (selection, filters, search, sort, page) |
| **getFilteredRows()**    | Returns all filtered rows                            |
| **getVisibleRows()**     | Returns current page visible rows                    |
| **getColumnFilters()**   | Returns column definitions with current filter state |
| **getSelectedRows()**    | Returns all selected rows                            |
| **clearSelectedRows()**  | Deselect all rows                                    |
| **selectRow(index)**     | Select row by index                                  |
| **unselectRow(index)**   | Deselect row by index                                |
| **isRowSelected(index)** | Check if row is selected                             |

## Slots

### Custom cell rendering (named by column field)

```html
<vue3-datatable :rows="rows" :columns="cols">
    <template #name="{ value }">
        <strong>{{ value.name }}</strong>
    </template>
</vue3-datatable>
```

### Pagination arrow slots

```html
<template #firstArrow> &laquo; </template>
<template #previousArrow> &lsaquo; </template>
<template #nextArrow> &rsaquo; </template>
<template #lastArrow> &raquo; </template>
```

### Empty state slot

```html
<template #noData>
    <div>No records found.</div>
</template>
```

## Server Mode Example

```html
<vue3-datatable
    :rows="rows"
    :columns="cols"
    :loading="loading"
    :totalRows="totalRows"
    :isServerMode="true"
    :pageSize="10"
    :sortable="true"
    :columnFilter="true"
    @page-change="onPageChange"
    @page-size-change="onPageSizeChange"
    @sort-change="onSortChange"
    @filter-change="onFilterChange"
    @search-change="onSearchChange"
/>
```

## Changelogs

[Changelogs](https://vue3-datatable-document.vercel.app/changelog)

## License

**@bhplugin/vue3-datatable** is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Our other plugins

### Angular Datatable - [**@bhplugin/ng-datatable**](https://www.npmjs.com/package/@bhplugin/ng-datatable)

## Support

<a target="_blank" href="https://www.buymeacoffee.com/bhplugin">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="60">
</a>
