<template>
    <div class="bh-datatable bh-antialiased bh-relative bh-text-black bh-text-sm bh-font-normal">
        <div class="bh-table-responsive" :class="{ 'bh-min-h-[300px]': currentLoader }" :style="{ height: props.stickyHeader && props.height }">
            <table :class="[props.skin]">
                <thead :class="{ 'bh-sticky bh-top-0 bh-z-10': props.stickyHeader }">
                    <column-header
                        :all="props"
                        :currentSortColumn="currentSortColumn"
                        :currentSortDirection="currentSortDirection"
                        :isOpenFilter="isOpenFilter"
                        :checkAll="selectedAll"
                        :columnFilterLang="props.columnFilterLang"
                        @selectAll="selectAll"
                        @sortChange="sortChange"
                        @filterChange="filterChange"
                        @toggleFilterMenu="toggleFilterMenu"
                    />
                </thead>
                <tbody>
                    <template v-if="filterRowCount">
                        <tr
                            v-for="(item, i) in filterItems"
                            :key="item[uniqueKey] ? item[uniqueKey] : i"
                            :class="[typeof props.rowClass === 'function' ? rowClass(item) : props.rowClass, props.selectRowOnClick ? 'bh-cursor-pointer' : '']"
                            @click.prevent="rowClick(item, i)"
                        >
                            <td
                                v-if="props.hasCheckbox"
                                :class="{
                                    'bh-sticky bh-left-0 bh-bg-blue-light': props.stickyFirstColumn,
                                }"
                            >
                                <div class="bh-checkbox">
                                    <input v-model="selected" type="checkbox" :value="item[uniqueKey] ? item[uniqueKey] : i" @click.stop />
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
                                        typeof props.cellClass === 'function' ? cellClass(item) : props.cellClass,
                                        j === 0 && props.stickyFirstColumn ? 'bh-sticky bh-left-0 bh-bg-blue-light' : '',
                                        props.hasCheckbox && j === 0 && props.stickyFirstColumn ? 'bh-left-[52px]' : '',
                                        col.cellClass ? col.cellClass : '',
                                    ]"
                                >
                                    <template v-if="slots[col.field]">
                                        <slot :name="col.field" :value="item"></slot>
                                    </template>
                                    <div v-else-if="col.cellRenderer" v-html="col.cellRenderer(item)"></div>
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
                        <tr v-for="i in props.pageSize" :key="i" class="!bh-bg-white bh-h-11 !bh-border-transparent">
                            <td :colspan="props.columns.length + 1" class="!bh-p-0 !bh-border-transparent">
                                <div class="bh-skeleton-box bh-h-8"></div>
                            </td>
                        </tr>
                    </template>
                </tbody>

                <tfoot v-if="props.cloneHeaderInFooter" :class="{ 'bh-sticky bh-bottom-0': props.stickyHeader }">
                    <column-header
                        :all="props"
                        :currentSortColumn="currentSortColumn"
                        :currentSortDirection="currentSortDirection"
                        :isOpenFilter="isOpenFilter"
                        :isFooter="true"
                        :checkAll="selectedAll"
                        @selectAll="selectAll"
                        @sortChange="sortChange"
                        @filterChange="filterChange"
                        @toggleFilterMenu="toggleFilterMenu"
                    />
                </tfoot>
            </table>

            <div v-if="filterRowCount && currentLoader" class="bh-absolute bh-inset-0 bh-bg-blue-light/50 bh-grid bh-place-content-center">
                <icon-loader />
            </div>
        </div>
        <div v-if="props.pagination && filterRowCount" class="bh-pagination bh-py-5" :class="{ 'bh-pointer-events-none': currentLoader }">
            <div class="bh-flex bh-items-center bh-flex-wrap bh-flex-col sm:bh-flex-row bh-gap-4">
                <div class="bh-pagination-info bh-flex bh-items-center">
                    <span class="bh-mr-2">
                        {{ stringFormat(props.paginationInfo, filterRowCount ? offset : 0, limit, filterRowCount) }}
                    </span>
                    <select v-if="props.showPageSize" v-model="currentPageSize" class="bh-pagesize">
                        <option v-for="option in props.pageSizeOptions" :value="option" :key="option">
                            {{ option }}
                        </option>
                    </select>
                </div>

                <div class="bh-pagination-number sm:bh-ml-auto bh-inline-flex bh-items-center bh-space-x-1">
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
                            <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                            />
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
                            <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8L4.646 2.354a.5.5 0 0 1 0-.708z"
                            />
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
import { computed, onMounted, Ref, ref, useSlots, watch } from 'vue';
import columnHeader from './column-header.vue';
import iconCheck from './icon-check.vue';
import iconLoader from './icon-loader.vue';

const slots = useSlots();

export interface colDef {
    isUnique?: boolean;
    field?: string;
    title?: string;
    value?: any;
    condition?: any;
    type?: string; // string|date|number|bool
    width?: string | undefined;
    minWidth?: string | undefined;
    maxWidth?: string | undefined;
    hide?: boolean;
    filter?: boolean; // column filter
    search?: boolean; // global search
    sort?: boolean;
    html?: boolean;
    cellRenderer?: [Function, string];
    headerClass?: string;
    cellClass?: string;
}

interface Props {
    loading?: boolean;
    isServerMode?: boolean;
    skin?: string;
    totalRows?: number;
    rows?: Array<any>;
    columns?: Array<colDef>;
    hasCheckbox?: boolean;
    search?: string;
    columnChooser?: boolean;
    page?: number; // default: 1
    pageSize?: number; // default: 10
    pageSizeOptions?: Array<number>; // default: [10, 20, 30, 50, 100]
    showPageSize?: boolean;
    rowClass?: [Array<string>, Function];
    cellClass?: [Array<string>, Function];
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
    paginationInfo?: string; // default: "Showing {0} to {1} of {2} entries"
    noDataContent?: string; // default: "No data available",
    stickyHeader?: boolean;
    height?: string; // default 450px - only working with sticky headers
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
    rowClass: <never>[],
    cellClass: <never>[],
    cellRenderer: null,
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
    const type = item.type?.toLowerCase() || 'string';
    item.type = type;
    item.isUnique = item.isUnique !== undefined ? item.isUnique : false;
    item.hide = item.hide !== undefined ? item.hide : false;
    item.filter = item.filter !== undefined ? item.filter : true;
    item.search = item.search !== undefined ? item.search : true;
    item.sort = item.sort !== undefined ? item.sort : true;
    item.html = item.html !== undefined ? item.html : false;
    item.condition = !type || type === 'string' ? 'contain' : 'equal';
}

const filterItems: Ref<Array<any>> = ref([]);
const currentPage = ref(props.page);
const currentPageSize = ref(props.pagination ? props.pageSize : props.rows?.length);
const oldPageSize = props.pageSize;
const currentSortColumn = ref(props.sortColumn);
const oldSortColumn = props.sortColumn;
const currentSortDirection = ref(props.sortDirection);
const oldSortDirection = props.sortDirection;
const filterRowCount = ref(props.totalRows);
const selected: Ref<Array<any>> = ref([]);
const selectedAll: any = ref(null);
const currentLoader = ref(props.loading);
const currentSearch = ref(props.search);
const oldColumns = JSON.parse(JSON.stringify(props.columns));

const isOpenFilter: any = ref(null);

// row click
const timer: any = ref(null);
let clickCount: Ref<number> = ref(0);
const delay: Ref<number> = ref(230);

onMounted(() => {
    filterRows();
});
const emit = defineEmits(['change', 'sortChange', 'searchChange', 'pageChange', 'pageSizeChange', 'rowSelect', 'filterChange', 'rowClick', 'rowDBClick']);
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
});

const stringFormat = (template: string, ...args: any[]) => {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

const uniqueKey = computed(() => {
    const col = props.columns.find((d) => d.isUnique);

    return col?.field || null;
});

// Maximum number of pages
const maxPage = computed(() => {
    const totalPages = <number>currentPageSize.value < 1 ? 1 : Math.ceil(<number>filterRowCount.value / <number>currentPageSize.value);
    return Math.max(totalPages || 0, 1);
});

// The starting value of the page number
const offset = computed(() => {
    return (currentPage.value - 1) * <number>currentPageSize.value + 1;
});

// Maximum number of pages
const limit = computed(() => {
    const limit = currentPage.value * <number>currentPageSize.value;
    return <number>filterRowCount.value >= limit ? limit : filterRowCount.value;
});

// Paging array
const paging = computed(() => {
    let startPage: number, endPage: number;
    let isMaxSized = typeof props.showNumbersCount !== 'undefined' && <number>props.showNumbersCount < maxPage.value;
    // recompute if maxSize
    if (isMaxSized) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(currentPage.value - Math.floor(<number>props.showNumbersCount / 2), 1);
        endPage = startPage + <number>props.showNumbersCount - 1;

        // Adjust if limit is exceeded
        if (endPage > maxPage.value) {
            endPage = maxPage.value;
            startPage = endPage - <number>props.showNumbersCount + 1;
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
        props.columns?.forEach((d) => {
            if (d.filter && ((d.value !== undefined && d.value !== null && d.value !== '') || d.condition === 'is_null' || d.condition == 'is_not_null')) {
                // string filters
                if (d.type === 'string') {
                    if (d.value && !d.condition) {
                        d.condition = 'contain';
                    }

                    if (d.condition === 'contain') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field)?.toString().toLowerCase().includes(d.value.toLowerCase());
                        });
                    } else if (d.condition === 'not_contain') {
                        rows = rows.filter((item) => {
                            return !cellValue(item, d.field)?.toString().toLowerCase().includes(d.value.toLowerCase());
                        });
                    } else if (d.condition === 'equal') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field)?.toString().toLowerCase() === d.value.toLowerCase();
                        });
                    } else if (d.condition === 'not_equal') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field)?.toString().toLowerCase() !== d.value.toLowerCase();
                        });
                    } else if (d.condition == 'start_with') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field)?.toString().toLowerCase().indexOf(d.value.toLowerCase()) === 0;
                        });
                    } else if (d.condition == 'end_with') {
                        rows = rows.filter((item) => {
                            return (
                                cellValue(item, d.field)
                                    ?.toString()
                                    .toLowerCase()
                                    .substr(d.value.length * -1) === d.value.toLowerCase()
                            );
                        });
                    }
                }
                // number filters
                else if (d.type === 'number') {
                    if (d.value && !d.condition) {
                        d.condition = 'equal';
                    }

                    if (d.condition === 'equal') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) && parseFloat(cellValue(item, d.field)) === parseFloat(d.value);
                        });
                    } else if (d.condition === 'not_equal') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) && parseFloat(cellValue(item, d.field)) !== parseFloat(d.value);
                        });
                    } else if (d.condition === 'greater_than') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) && parseFloat(cellValue(item, d.field)) > parseFloat(d.value);
                        });
                    } else if (d.condition === 'greater_than_equal') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) && parseFloat(cellValue(item, d.field)) >= parseFloat(d.value);
                        });
                    } else if (d.condition === 'less_than') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) && parseFloat(cellValue(item, d.field)) < parseFloat(d.value);
                        });
                    } else if (d.condition === 'less_than_equal') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) && parseFloat(cellValue(item, d.field)) <= parseFloat(d.value);
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
                            return cellValue(item, d.field) && dateFormat(cellValue(item, d.field)) > d.value;
                        });
                    } else if (d.condition === 'less_than') {
                        rows = rows.filter((item) => {
                            return cellValue(item, d.field) && dateFormat(cellValue(item, d.field)) < d.value;
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
                        return cellValue(item, d.field) == null || cellValue(item, d.field) == '';
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

        if (currentSearch.value && rows?.length) {
            let final: Array<any> = [];

            const keys = (props.columns || [])
                .filter((d) => d.search && !d.hide)
                .map((d) => {
                    return d.field;
                });

            for (var j = 0; j < rows?.length; j++) {
                for (var i = 0; i < keys.length; i++) {
                    if (cellValue(rows[j], keys[i])?.toString().toLowerCase().includes(currentSearch.value.toLowerCase())) {
                        final.push(rows[j]);
                        break;
                    }
                }
            }

            rows = final;
        }

        // sort rows
        var collator = new Intl.Collator(undefined, {
            numeric: props.columns.find((col) => col.field == currentSortColumn.value)?.type === 'number',
            sensitivity: 'base',
        });
        const sortOrder = currentSortDirection.value === 'desc' ? -1 : 1;

        rows.sort((a: any, b: any): number => {
            const valA = currentSortColumn.value?.split('.').reduce((obj: any, key: string) => obj?.[key], a);
            const valB = currentSortColumn.value?.split('.').reduce((obj: any, key: string) => obj?.[key], b);

            return collator.compare(valA, valB) * sortOrder;
        });
    }

    return rows;
};

const filterRows = () => {
    let result = [];
    let rows = filteredRows();

    if (props.isServerMode) {
        filterRowCount.value = props.totalRows || 0;
        result = rows;
    } else {
        filterRowCount.value = rows?.length || 0;
        result = rows.slice(offset.value - 1, <number>limit.value);
    }

    filterItems.value = result || [];
};
watch(
    () => props.loading,
    () => {
        currentLoader.value = props.loading;
    }
);

const toggleFilterMenu = (col: colDef) => {
    if (col) {
        if (isOpenFilter.value === col.field) {
            isOpenFilter.value = null;
        } else {
            isOpenFilter.value = col.field;
        }
    } else {
        isOpenFilter.value = null;
    }
};

// previous page
const previousPage = () => {
    if (currentPage.value == 1) {
        return false;
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
        return false;
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

// row update
const changeRows = () => {
    if (!props.isServerMode) {
        currentPage.value = 1;
    }
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
        emit('pageSizeChange', currentPageSize.value);
    }
};
watch(() => currentPageSize.value, changePageSize);

// sorting
const sortChange = (field: string) => {
    let direction = 'asc';
    if (field == currentSortColumn.value) {
        if (currentSortDirection.value === 'asc') {
            direction = 'desc';
        }
    }
    let offset = (currentPage.value - 1) * <number>currentPageSize.value;
    let limit = currentPageSize.value;
    currentSortColumn.value = field;
    currentSortDirection.value = direction;

    selectAll(false);
    filterRows();

    if (props.isServerMode) {
        changeForServer('sort');
    } else {
        emit('sortChange', { offset, limit, field, direction });
    }
};

// checkboax
const checkboxChange = (value: any) => {
    selectedAll.value = value.length && filterItems.value.length && value.length === filterItems.value.length;

    const rows = filterItems.value.filter((d, i) => selected.value.includes(uniqueKey.value ? d[uniqueKey.value as never] : i));

    emit('rowSelect', rows);
};
watch(() => selected.value, checkboxChange);
const selectAll = (checked: any) => {
    if (checked) {
        selected.value = filterItems.value.map((d, i) => (uniqueKey.value ? d[uniqueKey.value as never] : i));
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
    }
);

const cellValue = (item: any, field: string | undefined) => {
    return field?.split('.').reduce((obj, key) => obj?.[key], item);
};

const dateFormat = (date: any) => {
    try {
        if (!date) {
            return '';
        }
        const dt = new Date(date);
        const day = dt.getDate();
        const month = dt.getMonth() + 1;
        const year = dt.getFullYear();

        return year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
    } catch {}
    return '';
};

//row click
const rowClick = (item: any, index: number) => {
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
        clearTimeout(timer.value);
        clickCount.value = 0;
        emit('rowDBClick', item);
    }
};

// emit change event for server side pagination
const changeForServer = (changeType: string, isResetPage = false) => {
    if (props.isServerMode) {
        setDefaultCondition();

        const res = {
            current_page: isResetPage ? 1 : currentPage.value,
            pagesize: currentPageSize.value,
            offset: (currentPage.value - 1) * <number>currentPageSize.value,
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
        let d = props.columns[i];

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
    const rows = filterItems.value.filter((d, i) => selected.value.includes(uniqueKey.value ? d[uniqueKey.value as never] : i));
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
        const rows = filterItems.value.find((d, i) => i === index);
        selected.value.push(uniqueKey.value ? rows[uniqueKey.value as never] : index);
    }
};
const unselectRow = (index: number) => {
    if (isRowSelected(index)) {
        const rows = filterItems.value.find((d, i) => i === index);
        selected.value = selected.value.filter((d) => d !== (uniqueKey.value ? rows[uniqueKey.value as never] : index));
    }
};
const isRowSelected = (index: number) => {
    const rows = filterItems.value.find((d, i) => i === index);

    if (rows) {
        return selected.value.includes(uniqueKey.value ? rows[uniqueKey.value as never] : index);
    }
    return false;
};
</script>
