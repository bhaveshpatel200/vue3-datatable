/**
 * Props for the column filters translation
 * 
 * @default
 * 
 * ```json
 * {
    "no_filter":"No filter",
    "contain":"Contain",
    "not_contain":"Not contain",
    "equal":"Equal",
    "not_equal":"Not equal",
    "start_with":"Starts with",
    "end_with":"Ends with",
    "greater_than":"Greater than",
    "greater_than_equal":"Greater than or equal",
    "less_than":"Less than",
    "less_than_equal":"Less than or equal",
    "is_null":"Is null",
    "is_not_null":"Not null"
    }
    ```
 * You can override the default values by passing a new object to the `columnFilterLang` prop.
 * 
 * @example
 * 
 * ```json
 * {
    "no_filter":"Aucun",
    "contain":"Contiens",
    "not_contain":"Ne contiens pas",
    "equal":"Egale",
    "not_equal":"Différent",
    "start_with":"Commence par",
    "end_with":"Termine par",
    "greater_than":"Supérieur à",
    "greater_than_equal":"Sup. ou égale à",
    "less_than":"Inférieur à",
    "less_than_equal":"Inf. ou égale à",
    "is_null":"Est null",
    "is_not_null":"Non null"
    }
    ```
 */
export type ColumnFilterLangProps = {
    no_filter?: string;
    contain?: string;
    not_contain?: string;
    equal?: string;
    not_equal?: string;
    start_with?: string;
    end_with?: string;
    greater_than?: string;
    greater_than_equal?: string;
    less_than?: string;
    less_than_equal?: string;
    is_null?: string;
    is_not_null?: string;
};

export type ColumnFilterEmits = {
    close: [];
    filterChange: [value: Column];
};

/**
 * The values that can be used for each object in the `columns` array.
 */
export type Column<T = any> = {
    /**
     * db column is primary key or not
     *
     * @default false
     */
    isUnique?: boolean;
    /**
     * db column name
     */
    field?: string;
    /**
     * display column name
     */
    title?: string;
    /**
     * filter value if filter enabled
     */
    value?: any;
    /**
     * default condition for column filter if filter enabled
     *
     * @default "contain"
     */
    condition?: any;
    /**
     * column type (string, date, number, bool)
     *
     * @default "string"
     */
    type?: 'string' | 'date' | 'number' | 'bool' | string;
    /**
     * custom width of column
     */
    width?: string;
    /**
     * 	custom minimum width of column
     */
    minWidth?: string;
    /**
     * custom maximum width of column
     */
    maxWidth?: string;
    /**
     * show/hide column
     *
     * @default false
     */
    hide?: boolean;
    /**
     * enable column filter
     *
     * @default true
     */
    filter?: boolean;
    /**
     * 	enabled global search
     *
     * @default true
     */
    search?: boolean;
    /**
     * 	enable sorting
     *
     * @default true
     */
    sort?: boolean;
    /**
     * 	enable slot for cell rendering
     *
     * @default false
     */
    slotMode?: boolean;
    /**
     * custom cell rendering
     *
     * @default true
     */
    cellRenderer?: Function | string | boolean;
    /**
     * custom header cell class
     */
    headerClass?: string;
    /**
     * custom cell class
     */
    cellClass?: string;
    html?: boolean;
};

/**
 * The direction of the sort.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * The interface representing the functions and values exposed by the Vue3Datatable component.
 */
export interface Vue3DatatableExposedMethods<T = any> {
    /**
     * Function used to reset all options like selected rows, filter, search, current page etc...
     */
    reset(): void;
    /**
     * Function used to get all selected rows.
     */
    getSelectedRows(): T[];
    /**
     * Function used to get all column filters.
     */
    getColumnFilters(): Column[];
    /**
     * Function used to clear all selected rows.
     */
    clearSelectedRows(): void;
    /**
     * Function used to select a row based on the index passed in.
     *
     * @note non-existent row will be ignored
     */
    selectRow(index: number): void;
    /**
     * Function used to unselect a row based on the index passed in.
     *
     * @note non-existent row will be ignored
     */
    unselectRow(index: number): void;
    /**
     * Function used to check if a row is selected based on the index passed in.
     */
    isRowSelected(index: number): boolean;
    /**
     * Function used to get all filtered rows.
     */
    getFilteredRows(): T[];
}
export type Vue3DatatableChangeEvent = {
    current_page: number;
    pagesize: number;
    offset: number;
    sort_column: Column['field'];
    sort_direction: SortDirection;
    search: string;
    column_filters: Column[];
    change_type: string;
};

export type Vue3DatatableEmits<T = any> = {
    change: [value: Vue3DatatableChangeEvent];
    sortChange: [value: { offset: number; limit: number; field: Column['field']; direction: SortDirection }];
    searchChange: [value?: string];
    pageChange: [value: number];
    pageSizeChange: [value: number];
    rowSelect: [value: Array<T>];
    filterChange: [value: Column[]];
    rowClick: [value: T];
    rowDBClick: [value: T];
};

/**
 * The props for the Vue3Datatable component.
 */
export type Vue3DatatableProps<T = any> = {
    /**
     * The columns that will be displayed in the table.
     */
    columns: Column[];
    /**
     * The rows that will be displayed in the table.
     *
     * This is usually the data from an API call.
     */
    rows?: Array<T>;
    /**
     * Set this to  `true` if you need server side pagination.
     *
     * @default false
     */
    isServerMode?: boolean;
    /**
     * The total number of rows in the table.
     *
     * This is required if `isServerMode` is set to `true`.
     *
     * @default 0
     */
    totalRows?: number;
    /**
     * Custom class for skin
     *
     * Note that the value can be a combination of the following:
     *
     * ```bash
     * bh-table-striped - for stripe row
     * bh-table-hover - for hover row
     * bh-table-bordered - for bordered row
     * bh-table-compact - for compact table
     * ```
     *
     * @default "bh-table-striped bh-table-hove"
     */
    skin?: 'bh-table-striped' | 'bh-table-hover' | 'bh-table-bordered' | 'bh-table-compact' | string;
    /**
     * Set this to `true` to enable the loader.
     *
     * @default false
     */
    loading?: boolean;
    /**
     * Set this to `true` to enable the checkbox column.
     *
     * @default false
     */
    hasCheckbox?: boolean;
    /**
     * The search value for the table.
     *
     * @note You can v-model the value to an input field to enable search.
     *
     * @default ""
     */
    search?: string;
    /**
     * The current page of the table.
     *
     * @default 1
     */
    page?: number; // default: 1
    /**
     * The number of rows to display per page.
     *
     * @default 10
     */
    pageSize?: number; // default: 10
    /**
     * The options for the page size.
     *
     * @default [10, 20, 30, 50, 100]
     */
    pageSizeOptions?: Array<number>; // default: [10, 20, 30, 50, 100]
    /**
     * Set this to `true` to show the page size options.
     *
     * @default true
     */
    showPageSize?: boolean;
    /**
     * Custom class to add to the table row.
     *
     * This can be a string or a function that returns a string.
     *
     * @note This is the same as the value for the `class` attribute in Vue.
     *
     * @default ""
     */
    rowClass?: any;
    /**
     * Custom class to add to the table cells.
     *
     * This can be a string or a function that returns a string.
     *
     * @note This is the same as the value for the `class` attribute in Vue.
     *
     * @default ""
     */
    cellClass?: any;
    /**
     * Set this to `true` to enable sorting on the table.
     *
     * @default false
     */
    sortable?: boolean;
    /**
     * The column to sort by.
     *
     * @note This is the `field` value of the column. By default it is set to `id`.
     *
     * @default "id"
     */
    sortColumn?: string;
    /**
     * The direction of the sort.
     *
     * @default "asc"
     */
    sortDirection?: SortDirection;
    /**
     * Set this to `true` to enable individual column filter.
     *
     * @default false
     */
    columnFilter?: boolean;
    /**
     * Columns filter translation
     */
    columnFilterLang?: ColumnFilterLangProps;
    /**
     * Set this to `true` to enable pagination.
     *
     * @default true
     */
    pagination?: boolean;
    /**
     * Set this to `true` to enable numbers pagination
     *
     * @default true
     */
    showNumbers?: boolean;
    /**
     * Set this to `true` to show numbers of count in pagination
     *
     * @default 5
     */
    showNumbersCount?: number;
    /**
     * Set this to `true` to show the button used to navigate to the first page.
     *
     * @default true
     */
    showFirstPage?: boolean;
    /**
     * Set this to `true` to show the button used to navigate to the last page.
     *
     * @default true
     */
    showLastPage?: boolean;
    /**
     * The text to be displayed in the "Go to first page" pagination button.
     */
    firstArrow?: string;
    /**
     * The text to be displayed in the "Go to last page" pagination button.
     */
    lastArrow?: string;
    /**
     * The text to be displayed in the "Go to next page" pagination button.
     */
    nextArrow?: string;
    /**
     * The text to be displayed in the "Go to previous page" pagination button.
     */
    previousArrow?: string;
    /**
     * Custom pagination info
     *
     * @default "Showing {0} to {1} of {2} entries"
     */
    paginationInfo?: string; // default: "Showing {0} to {1} of {2} entries"
    /**
     * Custom no data content
     *
     * @default "No data available"
     */
    noDataContent?: string; // default: "No data available",
    /**
     * Set this to `true` to enable the sticky header.
     *
     * @default false
     */
    stickyHeader?: boolean;
    /**
     * Set the height of the table.
     *
     * @note This only works with sticky headers.
     *
     * @default "450px"
     */
    height?: string; // default 450px - only working with sticky headers
    /**
     * Set this to `true` to enable the sticky first column.
     *
     * @default false
     */
    stickyFirstColumn?: boolean;
    /**
     * Set this to `true` to clone the header in the footer.
     *
     * @default false
     */
    cloneHeaderInFooter?: boolean;
    /**
     * Set this to `true` to enable the row selection.
     *
     * @default false
     */
    selectRowOnClick?: boolean;
    columnChooser?: boolean;
};

/**
 * The functions emitted by the column header component.
 */
export type ColumHeaderEmits = {
    selectAll: [checked: boolean];
    sortChange: [field: string];
    filterChange: [];
    toggleFilterMenu: [field: Column | null];
};

/**
 * The props for the column header component.
 */
export type ColumnHeaderProps = {
    all: any;
    currentSortColumn: string;
    currentSortDirection: SortDirection;
    isOpenFilter: string | null;
    isFooter?: boolean;
    checkAll?: number | null | boolean;
    columnFilterLang?: ColumnFilterLangProps;
};
