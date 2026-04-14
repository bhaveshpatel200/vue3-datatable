/**
 * @bhplugin/vue3-datatable — Type Definitions
 *
 * This module exports all public types and interfaces for the Vue3 Datatable component.
 * All interfaces are prefixed with `I` following TypeScript naming conventions.
 */

// ---------------------------------------------------------------------------
// Column Types
// ---------------------------------------------------------------------------

/** Supported data types for column filtering and sorting behavior. */
export type IColumnType = 'string' | 'date' | 'number' | 'bool';

/**
 * Available filter conditions for column-level filtering.
 *
 * - **String filters:** `contain`, `not_contain`, `equal`, `not_equal`, `start_with`, `end_with`
 * - **Number filters:** `equal`, `not_equal`, `greater_than`, `greater_than_equal`, `less_than`, `less_than_equal`
 * - **Date filters:** `equal`, `not_equal`, `greater_than`, `less_than`
 * - **Shared:** `is_null`, `is_not_null`
 * - **Empty string (`''`):** Clears the active filter condition
 */
export type IFilterCondition =
    | 'contain'
    | 'not_contain'
    | 'equal'
    | 'not_equal'
    | 'start_with'
    | 'end_with'
    | 'greater_than'
    | 'greater_than_equal'
    | 'less_than'
    | 'less_than_equal'
    | 'is_null'
    | 'is_not_null'
    | '';

// ---------------------------------------------------------------------------
// Column Definition
// ---------------------------------------------------------------------------

/**
 * Column definition object that describes each column in the datatable.
 *
 * @example
 * ```ts
 * const columns: IColumnDefinition[] = [
 *     { field: 'id', title: 'ID', isUnique: true, type: 'number' },
 *     { field: 'name', title: 'Full Name', sort: true, filter: true },
 *     { field: 'email', title: 'Email', cellRenderer: (row) => `<a href="mailto:${row.email}">${row.email}</a>` },
 *     { field: 'dob', title: 'Date of Birth', type: 'date' },
 *     { field: 'isActive', title: 'Active', type: 'bool' },
 * ];
 * ```
 */
export interface IColumnDefinition {
    /**
     * Mark this column as the unique row identifier.
     * Used for row selection tracking, `:key` binding, and checkbox values.
     * Only one column should have `isUnique: true` per datatable.
     * @default false
     */
    isUnique?: boolean;

    /**
     * The property path to access this column's data from each row object.
     * Supports nested paths with dot notation (e.g., `'address.city'`).
     */
    field?: string;

    /** Display title shown in the column header. */
    title?: string;

    /**
     * Current filter value for this column.
     * Automatically managed by the datatable when column filtering is enabled.
     * Can be pre-set to apply an initial filter on mount.
     */
    value?: string | number | boolean;

    /**
     * Active filter condition for this column.
     * Available conditions depend on the column `type`.
     * @see {@link IFilterCondition}
     */
    condition?: IFilterCondition;

    /**
     * Data type of the column. Determines which filter conditions are available
     * and how sorting/comparison is performed.
     * @default 'string'
     */
    type?: IColumnType;

    /** Fixed width for this column (e.g., `'200px'`, `'15%'`). */
    width?: string;

    /** Minimum width for this column (e.g., `'100px'`). */
    minWidth?: string;

    /** Maximum width for this column (e.g., `'400px'`). */
    maxWidth?: string;

    /**
     * Hide this column from the table. Hidden columns are excluded from rendering
     * but their data remains accessible.
     * @default false
     */
    hide?: boolean;

    /**
     * Enable per-column filtering for this column.
     * Only applies when the datatable's `columnFilter` prop is `true`.
     * @default true
     */
    filter?: boolean;

    /**
     * Include this column in global search matching.
     * When the user types in the search input, this column's values are checked.
     * @default true
     */
    search?: boolean;

    /**
     * Enable sorting for this column.
     * Only applies when the datatable's `sortable` prop is `true`.
     * @default true
     */
    sort?: boolean;

    /**
     * Whether the column content contains raw HTML.
     * @default false
     */
    html?: boolean;

    /**
     * Custom cell renderer function or HTML string.
     * When a function is provided, it receives the full row object and should return an HTML string.
     * The rendered HTML is injected via `v-html`.
     *
     * @example
     * ```ts
     * cellRenderer: (row) => `<strong>${row.name}</strong>`
     * ```
     *
     * **Note:** For complex rendering, prefer using named slots instead:
     * ```html
     * <vue3-datatable :columns="cols">
     *     <template #name="{ value }">
     *         <strong>{{ value.name }}</strong>
     *     </template>
     * </vue3-datatable>
     * ```
     */
    cellRenderer?: ((row: Record<string, unknown>) => string) | string;

    /** CSS class(es) applied to the `<th>` header cell's inner `<div>`. */
    headerClass?: string;

    /** CSS class(es) applied to each `<td>` body cell in this column. */
    cellClass?: string;
}

// ---------------------------------------------------------------------------
// Event Payloads
// ---------------------------------------------------------------------------

/**
 * Payload emitted by the `@change` event in server mode.
 * Contains the full current state of the datatable for making server-side API requests.
 *
 * @example
 * ```ts
 * const onServerChange = (payload: IServerChangeResponse) => {
 *     fetch('/api/data', {
 *         method: 'POST',
 *         body: JSON.stringify({
 *             page: payload.current_page,
 *             limit: payload.pagesize,
 *             sort: payload.sort_column,
 *             order: payload.sort_direction,
 *             search: payload.search,
 *             filters: payload.column_filters,
 *         }),
 *     });
 * };
 * ```
 */
export interface IServerChangeResponse {
    /** Current page number (1-based). */
    current_page: number;

    /** Number of rows per page. */
    pagesize: number;

    /** Zero-based row offset: `(current_page - 1) * pagesize`. */
    offset: number;

    /** Column field name currently being sorted. */
    sort_column: string;

    /** Sort direction. */
    sort_direction: 'asc' | 'desc';

    /** Current global search string. */
    search: string;

    /** Array of column definitions with their current filter values and conditions. */
    column_filters: IColumnDefinition[];

    /**
     * Type of change that triggered this event.
     * Possible values: `'page'`, `'pagesize'`, `'sort'`, `'filter'`, `'search'`, `'reset'`.
     */
    change_type: string;
}

/**
 * Payload emitted by the `@sortChange` event when a column sort is applied.
 *
 * @example
 * ```ts
 * const onSort = (payload: ISortChangeResponse) => {
 *     console.log(`Sorted by ${payload.field} ${payload.direction}`);
 * };
 * ```
 */
export interface ISortChangeResponse {
    /** Zero-based row offset at the time of sort. */
    offset: number;

    /** Current page size (rows per page). */
    limit: number;

    /** Column field name that was sorted. */
    field: string;

    /** Sort direction: `'asc'` or `'desc'`. */
    direction: 'asc' | 'desc';
}

// ---------------------------------------------------------------------------
// Datatable Props
// ---------------------------------------------------------------------------

/**
 * Props interface for the Vue3 Datatable component.
 *
 * @example
 * ```html
 * <vue3-datatable
 *     :rows="data"
 *     :columns="columns"
 *     :sortable="true"
 *     :pagination="true"
 *     :page-size="20"
 *     :has-checkbox="true"
 *     @sort-change="onSort"
 *     @page-change="onPage"
 * />
 * ```
 */
export interface IDataTableProps {
    /**
     * Show a loading overlay on the table.
     * When `true`, a spinner is displayed over the table body and pagination is disabled.
     * @default false
     */
    loading?: boolean;

    /**
     * Enable server-side mode.
     * When `true`, the datatable does not perform client-side sorting, filtering, or pagination.
     * Instead, it emits events and expects the parent to provide pre-processed data.
     * @default false
     */
    isServerMode?: boolean;

    /**
     * CSS class(es) applied to the `<table>` element for visual styling.
     * Built-in skins: `'bh-table-striped'`, `'bh-table-hover'`, `'bh-table-bordered'`, `'bh-table-compact'`.
     * @default 'bh-table-striped bh-table-hover'
     */
    skin?: string;

    /**
     * Total number of rows across all pages.
     * **Required in server mode** for correct pagination calculation.
     * Ignored in client mode (computed automatically from `rows.length`).
     * @default 0
     */
    totalRows?: number;

    /**
     * Array of row data objects to display.
     * Each object's keys should correspond to the `field` values defined in `columns`.
     * @default []
     */
    rows?: Array<Record<string, unknown>>;

    /**
     * Array of column definitions that describe the table structure.
     * @see {@link IColumnDefinition}
     * @default []
     */
    columns?: Array<IColumnDefinition>;

    /**
     * Show a checkbox column as the first column for row selection.
     * Selected rows can be retrieved via the `getSelectedRows()` exposed method.
     * @default false
     */
    hasCheckbox?: boolean;

    /**
     * Global search string. When non-empty, rows are filtered to those containing
     * the search string in any searchable column (columns with `search: true`).
     * In server mode, the value is passed in the `@change` payload for server-side filtering.
     * @default ''
     */
    search?: string;

    /**
     * Current page number (1-based).
     * In server mode, used to sync the datatable's page with the parent's state.
     * @default 1
     */
    page?: number;

    /**
     * Number of rows displayed per page.
     * @default 10
     */
    pageSize?: number;

    /**
     * Options shown in the "rows per page" dropdown selector.
     * @default [10, 20, 30, 50, 100]
     */
    pageSizeOptions?: Array<number>;

    /**
     * Show the page size dropdown selector in the pagination area.
     * @default true
     */
    showPageSize?: boolean;

    /**
     * CSS class(es) applied to each `<tr>` row element.
     * Can be a static string, array of strings, or a function that receives the row data
     * and returns a class string.
     *
     * @example
     * ```ts
     * // Static
     * rowClass: 'my-row'
     *
     * // Dynamic
     * rowClass: (row) => row.isActive ? 'active-row' : 'inactive-row'
     * ```
     * @default ''
     */
    rowClass?: string | string[] | ((row: Record<string, unknown>) => string);

    /**
     * CSS class(es) applied to each `<td>` cell element.
     * Accepts the same types as `rowClass`.
     * @default ''
     */
    cellClass?: string | string[] | ((row: Record<string, unknown>) => string);

    /**
     * Enable column sorting. When `true`, clicking a column header sorts the data.
     * Individual columns can opt out via `sort: false` in their column definition.
     * @default false
     */
    sortable?: boolean;

    /**
     * Initial sort column field name.
     * @default ''
     */
    sortColumn?: string;

    /**
     * Initial sort direction.
     * @default 'asc'
     */
    sortDirection?: 'asc' | 'desc';

    /**
     * Enable per-column filter inputs below each column header.
     * Each column can opt out via `filter: false` in its column definition.
     * @default false
     */
    columnFilter?: boolean;

    /**
     * Custom labels for column filter condition dropdown menu items.
     * Pass a Record mapping condition keys to display strings for i18n support.
     *
     * @example
     * ```ts
     * columnFilterLang: {
     *     no_filter: 'Kein Filter',
     *     contain: 'Enthält',
     *     equal: 'Gleich',
     *     // ...
     * }
     * ```
     * @default null
     */
    columnFilterLang?: Record<string, string> | null;

    /**
     * Show the pagination area below the table.
     * @default true
     */
    pagination?: boolean;

    /**
     * Show numbered page buttons in the pagination area.
     * @default true
     */
    showNumbers?: boolean;

    /**
     * Maximum number of page number buttons visible at once.
     * Additional pages are accessible via prev/next buttons.
     * @default 5
     */
    showNumbersCount?: number;

    /**
     * Show the "first page" navigation button.
     * @default true
     */
    showFirstPage?: boolean;

    /**
     * Show the "last page" navigation button.
     * @default true
     */
    showLastPage?: boolean;

    /**
     * Template string for pagination info text.
     * Placeholders: `{0}` = start row, `{1}` = end row, `{2}` = total rows.
     * @default 'Showing {0} to {1} of {2} entries'
     */
    paginationInfo?: string;

    /**
     * Text displayed when the table has no data and is not loading.
     * @default 'No data available'
     */
    noDataContent?: string;

    /**
     * Make the table header sticky so it remains visible when scrolling vertically.
     * Requires `height` to be set for the scrollable container.
     * @default false
     */
    stickyHeader?: boolean;

    /**
     * Height of the scrollable table container. Only takes effect when `stickyHeader` is `true`.
     * @default '500px'
     */
    height?: string;

    /**
     * Make the first data column sticky (fixed to the left) when scrolling horizontally.
     * @default false
     */
    stickyFirstColumn?: boolean;

    /**
     * Clone the table header as a footer row at the bottom of the table.
     * @default false
     */
    cloneHeaderInFooter?: boolean;

    /**
     * Toggle row selection when clicking anywhere on the row (not just the checkbox).
     * @default false
     */
    selectRowOnClick?: boolean;
}
