<template>
    <div class="bh-datatable bh-relative bh-text-sm bh-font-normal bh-text-black bh-antialiased">
        <div class="bh-table-responsive" :class="{ 'bh-min-h-[300px]': currentLoader }" :style="{ height: props.stickyHeader ? props.height : undefined }">
            <table :class="[props.skin]">
                <thead :class="{ 'bh-sticky bh-top-0 bh-z-10': props.stickyHeader }">
                    <column-header
                        :all="props"
                        :current-sort-column="currentSortColumn"
                        :current-sort-direction="currentSortDirection"
                        :is-open-filter="isOpenFilter"
                        :check-all="selectedAll"
                        :column-filter-lang="props.columnFilterLang"
                        @select-all="selectAll"
                        @sort-change="sortChange"
                        @filter-change="filterChange"
                        @toggle-filter-menu="toggleFilterMenu"
                    />
                </thead>
                <tbody>
                    <template v-if="filterRowCount">
                        <tr
                            v-for="(item, i) in filterItems"
                            :key="rowKey(item, i)"
                            :class="[typeof props.rowClass === 'function' ? props.rowClass(item) : props.rowClass, props.selectRowOnClick ? 'bh-cursor-pointer' : '']"
                            @click.prevent="rowClick(item, i)"
                        >
                            <td
                                v-if="props.hasCheckbox"
                                :class="{
                                    'bh-sticky bh-left-0 bh-bg-blue-light': props.stickyFirstColumn,
                                }"
                            >
                                <div class="bh-checkbox">
                                    <input v-model="selected" type="checkbox" :value="uniqueKey ? item[uniqueKey] : i" @click.stop />
                                    <div>
                                        <icon-check class="check" />
                                    </div>
                                </div>
                            </td>
                            <template v-for="(col, j) in props.columns">
                                <td
                                    v-if="!col.hide"
                                    :key="col.field"
                                    :class="[
                                        typeof props.cellClass === 'function' ? props.cellClass(item) : props.cellClass,
                                        j === 0 && props.stickyFirstColumn ? 'bh-sticky bh-left-0 bh-bg-blue-light' : '',
                                        props.hasCheckbox && j === 0 && props.stickyFirstColumn ? 'bh-left-[52px]' : '',
                                        col.cellClass ? col.cellClass : '',
                                    ]"
                                >
                                    <template v-if="col.field && slots[col.field]">
                                        <slot :name="col.field" :value="item"></slot>
                                    </template>
                                    <div v-else-if="col.cellRenderer && typeof col.cellRenderer === 'function'" v-html="col.cellRenderer(item)"></div>
                                    <template v-else>
                                        {{ cellValue(item, col.field) }}
                                    </template>
                                </td>
                            </template>
                        </tr>
                    </template>
                    <tr v-if="!filterRowCount && !currentLoader">
                        <td :colspan="props.columns.length + 1">
                            {{ props.noDataContent }}
                        </td>
                    </tr>

                    <template v-if="!filterRowCount && currentLoader">
                        <tr v-for="i in props.pageSize" :key="i" class="bh-h-11 !bh-border-transparent !bh-bg-white">
                            <td :colspan="props.columns.length + 1" class="!bh-border-transparent !bh-p-0">
                                <div class="bh-skeleton-box bh-h-8"></div>
                            </td>
                        </tr>
                    </template>
                </tbody>

                <tfoot v-if="props.cloneHeaderInFooter" :class="{ 'bh-sticky bh-bottom-0': props.stickyHeader }">
                    <column-header
                        :all="props"
                        :current-sort-column="currentSortColumn"
                        :current-sort-direction="currentSortDirection"
                        :is-open-filter="isOpenFilter"
                        :is-footer="true"
                        :check-all="selectedAll"
                        @select-all="selectAll"
                        @sort-change="sortChange"
                        @filter-change="filterChange"
                        @toggle-filter-menu="toggleFilterMenu"
                    />
                </tfoot>
            </table>

            <div v-if="filterRowCount && currentLoader" class="bh-absolute bh-inset-0 bh-grid bh-place-content-center bh-bg-blue-light/50">
                <icon-loader />
            </div>
        </div>
        <div v-if="props.pagination && filterRowCount" class="bh-pagination bh-py-5" :class="{ 'bh-pointer-events-none bh-opacity-50': currentLoader }">
            <div class="bh-flex bh-flex-col bh-flex-wrap bh-items-center bh-gap-4 sm:bh-flex-row">
                <div class="bh-pagination-info bh-flex bh-items-center">
                    <span class="bh-mr-2">
                        {{ stringFormat(props.paginationInfo, filterRowCount ? offset : 0, limit, filterRowCount) }}
                    </span>
                    <select v-if="props.showPageSize" v-model="currentPageSize" class="bh-pagesize">
                        <option v-for="option in props.pageSizeOptions" :key="option" :value="option">
                            {{ option }}
                        </option>
                    </select>
                </div>

                <div class="bh-pagination-number bh-inline-flex bh-items-center bh-space-x-1 sm:bh-ml-auto">
                    <button v-if="props.showFirstPage" type="button" class="bh-page-item first-page" :class="{ disabled: currentPage <= 1 }" @click="currentPage = 1">
                        <span v-if="props.firstArrow" v-html="props.firstArrow"> </span>
                        <svg v-else aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
                            <g fill="currentColor" fill-rule="evenodd">
                                <path d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                <path d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                            </g>
                        </svg>
                    </button>
                    <button type="button" class="bh-page-item previous-page" :class="{ disabled: currentPage <= 1 }" @click="previousPage">
                        <span v-if="props.previousArrow" v-html="props.previousArrow"> </span>
                        <svg v-else aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
                            <path fill="currentColor" fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </button>

                    <template v-if="props.showNumbers">
                        <button
                            v-for="page in paging"
                            :key="page"
                            type="button"
                            class="bh-page-item"
                            :class="{
                                disabled: currentPage === page,
                                'bh-active': page === currentPage,
                            }"
                            @click="movePage(page)"
                        >
                            {{ page }}
                        </button>
                    </template>

                    <button type="button" class="bh-page-item next-page" :class="{ disabled: currentPage >= maxPage }" @click="nextPage">
                        <span v-if="props.nextArrow" v-html="props.nextArrow"> </span>
                        <svg v-else aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
                            <path fill="currentColor" fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8L4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>

                    <button v-if="props.showLastPage" type="button" class="bh-page-item last-page" :class="{ disabled: currentPage >= maxPage }" @click="currentPage = maxPage">
                        <span v-if="props.lastArrow" v-html="props.lastArrow"> </span>
                        <svg v-else aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
                            <g fill="currentColor" fill-rule="evenodd">
                                <path d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8L3.646 2.354a.5.5 0 0 1 0-.708z" />
                                <path d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8L7.646 2.354a.5.5 0 0 1 0-.708z" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue';
import columnHeader from './column-header.vue';
import iconCheck from './icon-check.vue';
import iconLoader from './icon-loader.vue';

const slots = useSlots();

export type ColumnType = 'string' | 'date' | 'number' | 'bool';

export type FilterCondition =
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

export interface colDef {
    isUnique?: boolean;
    field?: string;
    title?: string;
    value?: string | number | boolean;
    condition?: FilterCondition;
    type?: ColumnType;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    hide?: boolean;
    filter?: boolean;
    search?: boolean;
    sort?: boolean;
    html?: boolean;
    cellRenderer?: ((row: Record<string, unknown>) => string) | string;
    headerClass?: string;
    cellClass?: string;
}

export interface ServerChangePayload {
    current_page: number;
    pagesize: number;
    offset: number;
    sort_column: string;
    sort_direction: string;
    search: string;
    column_filters: colDef[];
    change_type: string;
}

export interface SortChangePayload {
    offset: number;
    limit: number;
    field: string;
    direction: string;
}

interface Props {
    loading?: boolean;
    isServerMode?: boolean;
    skin?: string;
    totalRows?: number;
    rows?: Array<Record<string, unknown>>;
    columns?: Array<colDef>;
    hasCheckbox?: boolean;
    search?: string;
    columnChooser?: boolean;
    page?: number;
    pageSize?: number;
    pageSizeOptions?: Array<number>;
    showPageSize?: boolean;
    rowClass?: string | string[] | ((row: Record<string, unknown>) => string);
    cellClass?: string | string[] | ((row: Record<string, unknown>) => string);
    sortable?: boolean;
    sortColumn?: string;
    sortDirection?: string;
    columnFilter?: boolean;
    columnFilterLang?: Record<string, string> | null;
    pagination?: boolean;
    showNumbers?: boolean;
    showNumbersCount?: number;
    showFirstPage?: boolean;
    showLastPage?: boolean;
    firstArrow?: string;
    lastArrow?: string;
    nextArrow?: string;
    previousArrow?: string;
    paginationInfo?: string;
    noDataContent?: string;
    stickyHeader?: boolean;
    height?: string;
    stickyFirstColumn?: boolean;
    cloneHeaderInFooter?: boolean;
    selectRowOnClick?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    isServerMode: false,
    skin: 'bh-table-striped bh-table-hover',
    totalRows: 0,
    rows: () => [],
    columns: () => [],
    hasCheckbox: false,
    search: '',
    columnChooser: false,
    page: 1,
    pageSize: 10,
    pageSizeOptions: () => [10, 20, 30, 50, 100],
    showPageSize: true,
    rowClass: '',
    cellClass: '',
    sortable: false,
    sortColumn: 'id',
    sortDirection: 'asc',
    columnFilter: false,
    columnFilterLang: null,
    pagination: true,
    showNumbers: true,
    showNumbersCount: 5,
    showFirstPage: true,
    showLastPage: true,
    firstArrow: '',
    lastArrow: '',
    nextArrow: '',
    previousArrow: '',
    paginationInfo: 'Showing {0} to {1} of {2} entries',
    noDataContent: 'No data available',
    stickyHeader: false,
    height: '500px',
    stickyFirstColumn: false,
    cloneHeaderInFooter: false,
    selectRowOnClick: false,
});

// set default columns values
for (const item of props.columns || []) {
    const type = (item.type?.toLowerCase() as ColumnType) || 'string';
    item.type = type;
    item.isUnique = item.isUnique !== undefined ? item.isUnique : false;
    item.hide = item.hide !== undefined ? item.hide : false;
    item.filter = item.filter !== undefined ? item.filter : true;
    item.search = item.search !== undefined ? item.search : true;
    item.sort = item.sort !== undefined ? item.sort : true;
    item.html = item.html !== undefined ? item.html : false;
    item.condition = !type || type === 'string' ? 'contain' : 'equal';
}

const filterItems = ref<Array<Record<string, unknown>>>([]);
const currentPage = ref(props.page);
const currentPageSize = ref(props.pagination ? props.pageSize : props.rows?.length);
const oldPageSize = props.pageSize;
const currentSortColumn = ref(props.sortColumn);
const oldSortColumn = props.sortColumn;
const currentSortDirection = ref(props.sortDirection);
const oldSortDirection = props.sortDirection;
const filterRowCount = ref(props.totalRows);
const selected = ref<Array<string | number>>([]);
const selectedAll = ref<boolean | null>(null);
const currentLoader = ref(props.loading);
const currentSearch = ref(props.search);
const oldColumns = JSON.parse(JSON.stringify(props.columns)) as colDef[];

const isOpenFilter = ref<string | null>(null);

// row click
const timer = ref<ReturnType<typeof setTimeout> | null>(null);
const clickCount = ref(0);
const delay = ref(230);

onMounted(() => {
    filterRows();
});

const emit = defineEmits<{
    change: [payload: ServerChangePayload];
    sortChange: [payload: SortChangePayload];
    searchChange: [search: string];
    pageChange: [page: number];
    pageSizeChange: [pageSize: number];
    rowSelect: [rows: Array<Record<string, unknown>>];
    filterChange: [columns: colDef[]];
    rowClick: [row: Record<string, unknown>];
    rowDBClick: [row: Record<string, unknown>];
}>();

defineExpose({
    reset() {
        reset();
    },
    getSelectedRows() {
        return getSelectedRows();
    },
    getColumnFilters() {
        return getColumnFilters();
    },
    clearSelectedRows() {
        return clearSelectedRows();
    },
    selectRow(index: number) {
        selectRow(index);
    },
    unselectRow(index: number) {
        unselectRow(index);
    },
    isRowSelected(index: number) {
        return isRowSelected(index);
    },
    getFilteredRows() {
        return filteredRows();
    },
    getVisibleRows() {
        return getVisibleRows();
    },
});

const stringFormat = (template: string, ...args: Array<string | number>) => {
    return template.replace(/{(\d+)}/g, (match, number: string) => {
        const idx = parseInt(number, 10);
        return idx < args.length ? String(args[idx]) : match;
    });
};

const uniqueKey = computed(() => {
    const col = props.columns.find((d) => d.isUnique);
    return col?.field || null;
});

// Maximum number of pages
const maxPage = computed(() => {
    const totalPages = currentPageSize.value! < 1 ? 1 : Math.ceil(filterRowCount.value / currentPageSize.value!);
    return Math.max(totalPages || 0, 1);
});

// The starting value of the page number
const offset = computed(() => {
    return (currentPage.value - 1) * currentPageSize.value! + 1;
});

// Maximum number of pages
const limit = computed(() => {
    const lim = currentPage.value * currentPageSize.value!;
    return filterRowCount.value >= lim ? lim : filterRowCount.value;
});

// Paging array
const paging = computed(() => {
    let startPage: number, endPage: number;
    const isMaxSized = typeof props.showNumbersCount !== 'undefined' && props.showNumbersCount < maxPage.value;
    // recompute if maxSize
    if (isMaxSized) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(currentPage.value - Math.floor(props.showNumbersCount / 2), 1);
        endPage = startPage + props.showNumbersCount - 1;

        // Adjust if limit is exceeded
        if (endPage > maxPage.value) {
            endPage = maxPage.value;
            startPage = endPage - props.showNumbersCount + 1;
        }
    } else {
        startPage = 1;
        endPage = maxPage.value;
    }

    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i);

    return pages;
});

const filteredRows = () => {
    let rows = props.rows || [];

    if (!props.isServerMode) {
        // column filters
        if (props.columnFilter) {
            props.columns?.forEach((d) => {
                if (d.filter && ((d.value !== undefined && d.value !== null && d.value !== '') || d.condition === 'is_null' || d.condition === 'is_not_null')) {
                    // string filters
                    if (d.type === 'string') {
                        if (d.value && !d.condition) {
                            d.condition = 'contain';
                        }

                        const val = String(d.value).toLowerCase();

                        if (d.condition === 'contain') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field)?.toString().toLowerCase().includes(val);
                            });
                        } else if (d.condition === 'not_contain') {
                            rows = rows.filter((item) => {
                                return !cellValue(item, d.field)?.toString().toLowerCase().includes(val);
                            });
                        } else if (d.condition === 'equal') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field)?.toString().toLowerCase() === val;
                            });
                        } else if (d.condition === 'not_equal') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field)?.toString().toLowerCase() !== val;
                            });
                        } else if (d.condition === 'start_with') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field)?.toString().toLowerCase().startsWith(val);
                            });
                        } else if (d.condition === 'end_with') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field)?.toString().toLowerCase().endsWith(val);
                            });
                        }
                    }
                    // number filters
                    else if (d.type === 'number') {
                        if (d.value && !d.condition) {
                            d.condition = 'equal';
                        }

                        const val = parseFloat(String(d.value));

                        if (d.condition === 'equal') {
                            rows = rows.filter((item) => {
                                const cv = cellValue(item, d.field);
                                return cv != null && parseFloat(String(cv)) === val;
                            });
                        } else if (d.condition === 'not_equal') {
                            rows = rows.filter((item) => {
                                const cv = cellValue(item, d.field);
                                return cv != null && parseFloat(String(cv)) !== val;
                            });
                        } else if (d.condition === 'greater_than') {
                            rows = rows.filter((item) => {
                                const cv = cellValue(item, d.field);
                                return cv != null && parseFloat(String(cv)) > val;
                            });
                        } else if (d.condition === 'greater_than_equal') {
                            rows = rows.filter((item) => {
                                const cv = cellValue(item, d.field);
                                return cv != null && parseFloat(String(cv)) >= val;
                            });
                        } else if (d.condition === 'less_than') {
                            rows = rows.filter((item) => {
                                const cv = cellValue(item, d.field);
                                return cv != null && parseFloat(String(cv)) < val;
                            });
                        } else if (d.condition === 'less_than_equal') {
                            rows = rows.filter((item) => {
                                const cv = cellValue(item, d.field);
                                return cv != null && parseFloat(String(cv)) <= val;
                            });
                        }
                    }
                    // date filters
                    else if (d.type === 'date') {
                        if (d.value && !d.condition) {
                            d.condition = 'equal';
                        }

                        if (d.condition === 'equal') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field) && dateFormat(cellValue(item, d.field)) === d.value;
                            });
                        } else if (d.condition === 'not_equal') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field) && dateFormat(cellValue(item, d.field)) !== d.value;
                            });
                        } else if (d.condition === 'greater_than') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field) && dateFormat(cellValue(item, d.field)) > String(d.value);
                            });
                        } else if (d.condition === 'less_than') {
                            rows = rows.filter((item) => {
                                return cellValue(item, d.field) && dateFormat(cellValue(item, d.field)) < String(d.value);
                            });
                        }
                    }
                    // boolean filters
                    else if (d.type === 'bool') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) === d.value;
                        });
                    }

                    if (d.condition === 'is_null') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) == null || cellValue(item, d.field) === '';
                        });
                        d.value = '';
                    } else if (d.condition === 'is_not_null') {
                        d.value = '';
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field);
                        });
                    }
                }
            });
        }

        // global search
        if (currentSearch.value && rows?.length) {
            const final: Array<Record<string, unknown>> = [];

            const keys = (props.columns || [])
                .filter((d) => d.search && !d.hide)
                .map((d) => {
                    return d.field;
                });

            for (let j = 0; j < rows?.length; j++) {
                for (let i = 0; i < keys.length; i++) {
                    if (cellValue(rows[j], keys[i])?.toString().toLowerCase().includes(currentSearch.value.toLowerCase())) {
                        final.push(rows[j]);
                        break;
                    }
                }
            }

            rows = final;
        }

        // sort rows
        if (props.sortable) {
            const collator = new Intl.Collator(undefined, {
                numeric: props.columns.find((col) => col.field === currentSortColumn.value)?.type === 'number',
                sensitivity: 'base',
            });
            const sortOrder = currentSortDirection.value === 'desc' ? -1 : 1;

            rows.sort((a: Record<string, unknown>, b: Record<string, unknown>): number => {
                const valA = cellValue(a, currentSortColumn.value);
                const valB = cellValue(b, currentSortColumn.value);

                return collator.compare(String(valA ?? ''), String(valB ?? '')) * sortOrder;
            });
        }
    }

    return rows;
};

const filterRows = () => {
    let result: Array<Record<string, unknown>> = [];
    const rows = filteredRows();

    if (props.isServerMode) {
        filterRowCount.value = props.totalRows || 0;
        result = rows;
    } else {
        filterRowCount.value = rows?.length || 0;
        result = rows.slice(offset.value - 1, limit.value);
    }

    filterItems.value = result || [];
    return result;
};
watch(
    () => props.loading,
    () => {
        currentLoader.value = props.loading;
    },
);

const toggleFilterMenu = (col: colDef | null) => {
    if (col) {
        if (isOpenFilter.value === col.field) {
            isOpenFilter.value = null;
        } else {
            isOpenFilter.value = col.field ?? null;
        }
    } else {
        isOpenFilter.value = null;
    }
};

// previous page
const previousPage = () => {
    if (currentPage.value === 1) {
        return;
    }
    currentPage.value--;
};

// page change
const movePage = (page: number) => {
    currentPage.value = page;
};

// next page
const nextPage = () => {
    if (currentPage.value >= maxPage.value) {
        return;
    }
    currentPage.value++;
};

// page changed
const changePage = () => {
    selectAll(false);

    if (props.isServerMode) {
        changeForServer('page');
    } else {
        filterRows();
        emit('pageChange', currentPage.value);
    }
};
watch(() => currentPage.value, changePage);

// watch page prop
watch(
    () => props.page,
    (newPage) => {
        currentPage.value = newPage;
    },
);

// row update
const changeRows = () => {
    selectAll(false);
    filterRows();
};
watch(() => props.rows, changeRows);

// pagesize changed
const changePageSize = () => {
    selectAll(false);

    if (props.isServerMode) {
        // for server side paginations
        if (currentPage.value === 1) {
            changeForServer('pagesize', true);
        } else {
            currentPage.value = 1; // changeForServer method call when currentPage change
        }
    } else {
        currentPage.value = 1;
        filterRows();
        emit('pageSizeChange', currentPageSize.value!);
    }
};
watch(() => currentPageSize.value, changePageSize);

// sorting
const sortChange = (field: string | undefined) => {
    if (!field) return;
    let direction = 'asc';
    if (field === currentSortColumn.value) {
        if (currentSortDirection.value === 'asc') {
            direction = 'desc';
        }
    }
    const sortOffset = (currentPage.value - 1) * currentPageSize.value!;
    const sortLimit = currentPageSize.value!;
    currentSortColumn.value = field;
    currentSortDirection.value = direction;

    selectAll(false);
    filterRows();

    if (props.isServerMode) {
        changeForServer('sort');
    } else {
        emit('sortChange', { offset: sortOffset, limit: sortLimit, field, direction });
    }
};

// checkbox
const checkboxChange = (value: Array<string | number>) => {
    selectedAll.value = value.length > 0 && filterItems.value.length > 0 && value.length === filterItems.value.length;

    const rows = filterItems.value.filter((d, i) => selected.value.includes(uniqueKey.value ? (d[uniqueKey.value] as string | number) : i));

    emit('rowSelect', rows);
};
watch(() => selected.value, checkboxChange);
const selectAll = (checked: boolean) => {
    if (checked) {
        selected.value = filterItems.value.map((d, i) => (uniqueKey.value ? (d[uniqueKey.value] as string | number) : i));
    } else {
        selected.value = [];
    }
};

// columns filter
const filterChange = () => {
    selectAll(false);

    if (props.isServerMode) {
        // for server side paginations
        if (currentPage.value === 1) {
            changeForServer('filter', true);
        } else {
            currentPage.value = 1; // changeForServer method call when currentPage change
        }
    } else {
        currentPage.value = 1;
        filterRows();
        emit('filterChange', props.columns);
    }
};

// search
const changeSearch = () => {
    selectAll(false);

    if (props.isServerMode) {
        // for server side paginations
        if (currentPage.value === 1) {
            changeForServer('search', true);
        } else {
            currentPage.value = 1; // changeForServer method call when currentPage change
        }
    } else {
        currentPage.value = 1;
        filterRows();
        emit('searchChange', currentSearch.value);
    }
};

watch(
    () => props.search,
    () => {
        currentSearch.value = props.search;
        changeSearch();
    },
);

const rowKey = (item: Record<string, unknown>, index: number): string | number => {
    if (uniqueKey.value) {
        const val = item[uniqueKey.value];
        return (val as string | number) ?? index;
    }
    return index;
};

const cellValue = (item: Record<string, unknown>, field: string | undefined): unknown => {
    return field?.split('.').reduce<unknown>((obj, key) => (obj as Record<string, unknown> | undefined)?.[key], item);
};

const dateFormat = (date: unknown) => {
    try {
        if (!date) {
            return '';
        }
        const dt = new Date(date as string | number);
        const day = dt.getDate();
        const month = dt.getMonth() + 1;
        const year = dt.getFullYear();

        return year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
    } catch {
        /* invalid date */
    }
    return '';
};

//row click
const rowClick = (item: Record<string, unknown>, index: number) => {
    clickCount.value++;

    if (clickCount.value === 1) {
        timer.value = setTimeout(() => {
            clickCount.value = 0;

            if (props.selectRowOnClick) {
                if (isRowSelected(index)) {
                    unselectRow(index);
                } else {
                    selectRow(index);
                }

                checkboxChange(selected.value);
            }
            emit('rowClick', item);
        }, delay.value);
    } else if (clickCount.value === 2) {
        if (timer.value) {
            clearTimeout(timer.value);
        }
        clickCount.value = 0;
        emit('rowDBClick', item);
    }
};

// emit change event for server side pagination
const changeForServer = (changeType: string, isResetPage = false) => {
    if (props.isServerMode) {
        currentLoader.value = true;
        setDefaultCondition();

        const res: ServerChangePayload = {
            current_page: isResetPage ? 1 : currentPage.value,
            pagesize: currentPageSize.value!,
            offset: (currentPage.value - 1) * currentPageSize.value!,
            sort_column: currentSortColumn.value,
            sort_direction: currentSortDirection.value,
            search: currentSearch.value,
            column_filters: props.columns,
            change_type: changeType,
        };
        emit('change', res);
    }
};

// set default conditions when values exists and condition empty
const setDefaultCondition = () => {
    for (let i = 0; i < props.columns.length; i++) {
        const d = props.columns[i];

        if (d.filter && ((d.value !== undefined && d.value !== null && d.value !== '') || d.condition === 'is_null' || d.condition === 'is_not_null')) {
            if (d.type === 'string' && d.value && !d.condition) {
                d.condition = 'contain';
            }
            if (d.type === 'number' && d.value && !d.condition) {
                d.condition = 'equal';
            }
            if (d.type === 'date' && d.value && !d.condition) {
                d.condition = 'equal';
            }
        }
    }
};

// methods
const reset = () => {
    selectAll(false);
    for (let i = 0; i < props.columns.length; i++) {
        props.columns[i] = oldColumns[i];
    }
    currentSearch.value = '';
    currentPageSize.value = oldPageSize;
    currentSortColumn.value = oldSortColumn;
    currentSortDirection.value = oldSortDirection;

    if (props.isServerMode) {
        // for server side paginations
        if (currentPage.value === 1) {
            changeForServer('reset', true);
        } else {
            currentPage.value = 1; // changeForServer method call when currentPage change
        }
    } else {
        currentPage.value = 1;
        filterRows();
    }
};
const getSelectedRows = () => {
    const rows = filterItems.value.filter((d, i) => selected.value.includes(uniqueKey.value ? (d[uniqueKey.value] as string | number) : i));
    return rows;
};
const getColumnFilters = () => {
    return props.columns;
};
const clearSelectedRows = () => {
    selected.value = [];
};
const selectRow = (index: number) => {
    if (!isRowSelected(index)) {
        const row = filterItems.value[index];
        if (row) {
            selected.value.push(uniqueKey.value ? (row[uniqueKey.value] as string | number) : index);
        }
    }
};
const unselectRow = (index: number) => {
    if (isRowSelected(index)) {
        const row = filterItems.value[index];
        if (row) {
            const key = uniqueKey.value ? (row[uniqueKey.value] as string | number) : index;
            selected.value = selected.value.filter((d) => d !== key);
        }
    }
};
const isRowSelected = (index: number) => {
    const row = filterItems.value[index];

    if (row) {
        return selected.value.includes(uniqueKey.value ? (row[uniqueKey.value] as string | number) : index);
    }
    return false;
};
const getVisibleRows = () => {
    const rows = filterRows();
    return rows;
};
</script>
