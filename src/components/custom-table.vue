<template>
    <div class="bh-datatable bh-relative bh-text-sm bh-font-normal bh-text-black bh-antialiased">
        <div class="bh-table-responsive" :class="{ 'bh-min-h-[300px]': currentLoader }" :style="{ height: props.stickyHeader ? props.height : undefined }">
            <table :class="[props.skin]">
                <thead :class="{ 'bh-sticky bh-top-0 bh-z-10': props.stickyHeader }">
                    <column-header
                        :has-checkbox="props.hasCheckbox"
                        :sticky-header="props.stickyHeader"
                        :sticky-first-column="props.stickyFirstColumn"
                        :sortable="props.sortable"
                        :column-filter="props.columnFilter"
                        :columns="normalizedColumns"
                        :current-sort-column="currentSortColumn"
                        :current-sort-direction="currentSortDirection"
                        :is-open-filter="isOpenFilter"
                        :check-all="selectedAll"
                        :column-filter-lang="props.columnFilterLang"
                        @select-all="onSelectAll"
                        @sort-change="onSortChange"
                        @filter-value-change="onFilterValueChange"
                        @condition-change="onConditionChange"
                        @toggle-filter-menu="onToggleFilterMenu"
                    />
                </thead>
                <tbody>
                    <template v-if="filterRowCount">
                        <tr
                            v-for="(item, i) in visibleRows"
                            :key="getRowKey(item, i)"
                            :class="[typeof props.rowClass === 'function' ? props.rowClass(item) : props.rowClass, props.selectRowOnClick ? 'bh-cursor-pointer' : '']"
                            @click.prevent="handleClick(item, i)"
                            @dblclick.prevent="handleDblClick(item)"
                        >
                            <td
                                v-if="props.hasCheckbox"
                                :class="{
                                    'bh-sticky bh-left-0 bh-bg-blue-light': props.stickyFirstColumn,
                                }"
                            >
                                <div class="bh-checkbox">
                                    <input v-model="selected" type="checkbox" :value="getRowKey(item, i)" @click.stop />
                                    <div>
                                        <icon-check class="check" />
                                    </div>
                                </div>
                            </td>
                            <template v-for="(col, j) in normalizedColumns">
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
                        <td :colspan="normalizedColumns.length + 1">
                            <slot name="noData">
                                {{ props.noDataContent }}
                            </slot>
                        </td>
                    </tr>

                    <template v-if="!filterRowCount && currentLoader">
                        <tr v-for="i in props.pageSize" :key="i" class="bh-h-11 !bh-border-transparent !bh-bg-white">
                            <td :colspan="normalizedColumns.length + 1" class="!bh-border-transparent !bh-p-0">
                                <div class="bh-skeleton-box bh-h-8"></div>
                            </td>
                        </tr>
                    </template>
                </tbody>

                <tfoot v-if="props.cloneHeaderInFooter" :class="{ 'bh-sticky bh-bottom-0': props.stickyHeader }">
                    <column-header
                        :has-checkbox="props.hasCheckbox"
                        :sticky-header="props.stickyHeader"
                        :sticky-first-column="props.stickyFirstColumn"
                        :sortable="props.sortable"
                        :column-filter="props.columnFilter"
                        :columns="normalizedColumns"
                        :current-sort-column="currentSortColumn"
                        :current-sort-direction="currentSortDirection"
                        :is-open-filter="isOpenFilter"
                        :is-footer="true"
                        :check-all="selectedAll"
                        @select-all="onSelectAll"
                        @sort-change="onSortChange"
                        @filter-value-change="onFilterValueChange"
                        @condition-change="onConditionChange"
                        @toggle-filter-menu="onToggleFilterMenu"
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
                        <slot name="firstArrow">
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
                                <g fill="currentColor" fill-rule="evenodd">
                                    <path d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                    <path d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                </g>
                            </svg>
                        </slot>
                    </button>
                    <button type="button" class="bh-page-item previous-page" :class="{ disabled: currentPage <= 1 }" @click="previousPage">
                        <slot name="previousArrow">
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
                                <path
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                                />
                            </svg>
                        </slot>
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
                        <slot name="nextArrow">
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
                                <path
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8L4.646 2.354a.5.5 0 0 1 0-.708z"
                                />
                            </svg>
                        </slot>
                    </button>

                    <button v-if="props.showLastPage" type="button" class="bh-page-item last-page" :class="{ disabled: currentPage >= maxPage }" @click="currentPage = maxPage">
                        <slot name="lastArrow">
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
                                <g fill="currentColor" fill-rule="evenodd">
                                    <path d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8L3.646 2.354a.5.5 0 0 1 0-.708z" />
                                    <path d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8L7.646 2.354a.5.5 0 0 1 0-.708z" />
                                </g>
                            </svg>
                        </slot>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRef, useSlots, watch } from 'vue';
import columnHeader from './column-header.vue';
import iconCheck from './icon-check.vue';
import iconLoader from './icon-loader.vue';

import type { IColumnDefinition, IFilterCondition, IServerChangeResponse, ISortChangeResponse, IDataTableProps } from './types';
import { cellValue, stringFormat } from './utils';
import { usePagination } from './composables/usePagination';
import { useSorting } from './composables/useSorting';
import { useFiltering } from './composables/useFiltering';
import { useSelection, useUniqueKey } from './composables/useSelection';
import { useRowClick } from './composables/useRowClick';

const slots = useSlots();

const props = withDefaults(defineProps<IDataTableProps>(), {
    loading: false,
    isServerMode: false,
    skin: 'bh-table-striped bh-table-hover',
    totalRows: 0,
    rows: () => [],
    columns: () => [],
    hasCheckbox: false,
    search: '',
    page: 1,
    pageSize: 10,
    pageSizeOptions: () => [10, 20, 30, 50, 100],
    showPageSize: true,
    rowClass: '',
    cellClass: '',
    sortable: false,
    sortColumn: '',
    sortDirection: 'asc',
    columnFilter: false,
    columnFilterLang: null,
    pagination: true,
    showNumbers: true,
    showNumbersCount: 5,
    showFirstPage: true,
    showLastPage: true,
    paginationInfo: 'Showing {0} to {1} of {2} entries',
    noDataContent: 'No data available',
    stickyHeader: false,
    height: '500px',
    stickyFirstColumn: false,
    cloneHeaderInFooter: false,
    selectRowOnClick: false,
});

const emit = defineEmits<{
    change: [payload: IServerChangeResponse];
    sortChange: [payload: ISortChangeResponse];
    searchChange: [search: string];
    pageChange: [page: number];
    pageSizeChange: [pageSize: number];
    rowSelect: [rows: Array<Record<string, unknown>>];
    filterChange: [columns: IColumnDefinition[]];
    rowClick: [row: Record<string, unknown>];
    rowDBClick: [row: Record<string, unknown>];
}>();

// ── Composables ──────────────────────────────────────────────────────────────

const { currentSortColumn, currentSortDirection, toggleSort, resetSort } = useSorting({
    sortColumn: toRef(props, 'sortColumn'),
    sortDirection: toRef(props, 'sortDirection'),
});

const { currentSearch, isOpenFilter, normalizedColumns, filteredRows, filterRowCount, setFilterValue, setFilterCondition, toggleFilterMenu, getColumnsWithFilterState, resetFilters } = useFiltering({
    rows: toRef(props, 'rows'),
    columns: toRef(props, 'columns'),
    isServerMode: toRef(props, 'isServerMode'),
    columnFilter: toRef(props, 'columnFilter'),
    sortable: toRef(props, 'sortable'),
    sortColumn: currentSortColumn,
    sortDirection: currentSortDirection,
    search: toRef(props, 'search'),
    totalRows: toRef(props, 'totalRows'),
});

const { currentPage, currentPageSize, initialPageSize, maxPage, offset, limit, paging, previousPage, nextPage, movePage } = usePagination({
    page: toRef(props, 'page'),
    pageSize: toRef(props, 'pageSize'),
    showNumbersCount: toRef(props, 'showNumbersCount'),
    pagination: toRef(props, 'pagination'),
    totalRows: filterRowCount,
});

const uniqueKey = useUniqueKey(toRef(props, 'columns'));

// Visible rows = paginated slice of filtered rows
const visibleRows = computed(() => {
    const rows = filteredRows.value;
    if (props.isServerMode) return rows;
    return rows.slice(offset.value - 1, limit.value);
});

const { selected, selectedAll, getRowKey, selectAll, selectRow, unselectRow, isRowSelected, getSelectedRows, clearSelectedRows, shouldSuppressEmit } = useSelection({
    filterItems: visibleRows,
    uniqueKey,
});

const currentLoader = ref(props.loading);
watch(
    () => props.loading,
    (val: boolean) => {
        currentLoader.value = val;
    },
);

// ── Row click ────────────────────────────────────────────────────────────────

const { handleClick, handleDblClick } = useRowClick(
    (item, index) => {
        if (props.selectRowOnClick) {
            if (isRowSelected(index)) unselectRow(index);
            else selectRow(index);
            emit('rowSelect', getSelectedRows());
        }
        emit('rowClick', item);
    },
    (item) => {
        emit('rowDBClick', item);
    },
);

// ── Watchers & event handlers ────────────────────────────────────────────────

let suppressPageEvent = false;

// Selection watcher — emit rowSelect only from user interactions
watch(selected, () => {
    if (shouldSuppressEmit()) return;
    emit('rowSelect', getSelectedRows());
});

// Page change
watch(currentPage, () => {
    selectAll(false, true);
    if (props.isServerMode) {
        if (!suppressPageEvent) {
            emitServerChange('page');
            emit('pageChange', currentPage.value);
        }
        suppressPageEvent = false;
    } else {
        emit('pageChange', currentPage.value);
    }
});

// Row data updated
watch(
    () => props.rows,
    () => {
        selectAll(false, true);
    },
);

// Page size change
watch(currentPageSize, () => {
    selectAll(false, true);
    if (props.isServerMode) {
        suppressPageEvent = true;
        currentPage.value = 1;
        emitServerChange('pagesize', true);
    } else {
        currentPage.value = 1;
    }
    emit('pageSizeChange', currentPageSize.value!);
});

// ── Event handlers from sub-components ───────────────────────────────────────

const onSelectAll = (checked: boolean) => {
    selectAll(checked);
};

const onSortChange = (field: string | undefined) => {
    if (!field) return;
    const { field: sortField, direction } = toggleSort(field);
    selectAll(false, true);

    const sortOffset = (currentPage.value - 1) * (currentPageSize.value ?? 0);
    const sortLimit = currentPageSize.value ?? 0;

    if (props.isServerMode) {
        emitServerChange('sort');
    }
    emit('sortChange', { offset: sortOffset, limit: sortLimit, field: sortField, direction });
};

const onFilterValueChange = (field: string, value: string | number | boolean | undefined) => {
    setFilterValue(field, value);
    triggerFilterChange();
};

const onConditionChange = (field: string, condition: IFilterCondition) => {
    setFilterCondition(field, condition);
    triggerFilterChange();
};

const triggerFilterChange = () => {
    selectAll(false, true);
    if (props.isServerMode) {
        suppressPageEvent = true;
        currentPage.value = 1;
        emitServerChange('filter', true);
    } else {
        currentPage.value = 1;
    }
    emit('filterChange', getColumnsWithFilterState());
};

const onToggleFilterMenu = (field: string) => {
    toggleFilterMenu(field || null);
};

// Search watcher
watch(
    () => props.search,
    () => {
        currentSearch.value = props.search;
        selectAll(false, true);
        if (props.isServerMode) {
            suppressPageEvent = true;
            currentPage.value = 1;
            emitServerChange('search', true);
        } else {
            currentPage.value = 1;
        }
        emit('searchChange', currentSearch.value);
    },
);

// ── Server mode helper ───────────────────────────────────────────────────────

const emitServerChange = (changeType: string, isResetPage = false) => {
    if (!props.isServerMode) return;
    currentLoader.value = true;

    const res: IServerChangeResponse = {
        current_page: isResetPage ? 1 : currentPage.value,
        pagesize: currentPageSize.value!,
        offset: (currentPage.value - 1) * (currentPageSize.value ?? 0),
        sort_column: currentSortColumn.value,
        sort_direction: currentSortDirection.value,
        search: currentSearch.value,
        column_filters: getColumnsWithFilterState(),
        change_type: changeType,
    };
    emit('change', res);
};

// ── Reset ────────────────────────────────────────────────────────────────────

const reset = () => {
    selectAll(false, true);
    resetFilters();
    resetSort();
    currentPageSize.value = initialPageSize;

    if (props.isServerMode) {
        suppressPageEvent = true;
        currentPage.value = 1;
        emitServerChange('reset', true);
    } else {
        currentPage.value = 1;
    }
};

// ── Exposed methods ──────────────────────────────────────────────────────────

onMounted(() => {
    // Initial load — no action needed, computed values handle it
});

defineExpose({
    reset,
    getSelectedRows,
    getColumnFilters: () => getColumnsWithFilterState(),
    clearSelectedRows,
    selectRow,
    unselectRow,
    isRowSelected,
    getFilteredRows: () => filteredRows.value,
    getVisibleRows: () => visibleRows.value,
});
</script>
