import { computed, reactive, ref, watch, type Ref } from 'vue';
import type { IColumnDefinition, IColumnType, IFilterCondition } from '../types';
import { applyColumnFilters, applyGlobalSearch, applySorting, type INormalizedColumn } from '../filter-strategies';

interface IColumnFilterState {
    value: string | number | boolean | undefined;
    condition: IFilterCondition;
}

interface IUseFilteringOptions {
    rows: Ref<Array<Record<string, unknown>>>;
    columns: Ref<IColumnDefinition[]>;
    isServerMode: Ref<boolean>;
    columnFilter: Ref<boolean>;
    sortable: Ref<boolean>;
    sortColumn: Ref<string>;
    sortDirection: Ref<string>;
    search: Ref<string>;
    totalRows: Ref<number>;
}

export function useFiltering(options: IUseFilteringOptions) {
    const currentSearch = ref(options.search.value);
    const isOpenFilter = ref<string | null>(null);

    // Internal column state — replaces direct prop mutations
    const columnFilterState = reactive<Map<string, IColumnFilterState>>(new Map());

    // Normalize columns with defaults (immutable — never mutates props)
    const normalizedColumns = computed<INormalizedColumn[]>(() => {
        return options.columns.value.map((col) => {
            const type = (col.type?.toLowerCase() as IColumnType) || 'string';
            const field = col.field ?? '';
            const filterState = columnFilterState.get(field);
            return {
                field,
                type,
                condition: filterState?.condition ?? col.condition ?? (type === 'bool' ? '' : type === 'string' ? 'contain' : 'equal'),
                value: filterState?.value ?? col.value,
                filter: col.filter ?? true,
                search: col.search ?? true,
                sort: col.sort ?? true,
                hide: col.hide ?? false,
                // Pass through display properties
                title: col.title,
                width: col.width,
                minWidth: col.minWidth,
                maxWidth: col.maxWidth,
                headerClass: col.headerClass,
                cellClass: col.cellClass,
                isUnique: col.isUnique ?? false,
                html: col.html ?? false,
                cellRenderer: col.cellRenderer,
            };
        });
    });

    // Initialize filter state from columns
    const initFilterState = () => {
        columnFilterState.clear();
        options.columns.value.forEach((col) => {
            const field = col.field ?? '';
            const type = (col.type?.toLowerCase() as IColumnType) || 'string';
            columnFilterState.set(field, {
                value: col.value,
                condition: col.condition ?? (type === 'bool' ? '' : type === 'string' ? 'contain' : 'equal'),
            });
        });
    };
    initFilterState();

    // Snapshot of initial state for reset
    const initialFilterState = new Map<string, IColumnFilterState>();
    columnFilterState.forEach((state, field) => {
        initialFilterState.set(field, { ...state });
    });

    // Filtered + sorted rows (computed — cached by Vue)
    const filteredRows = computed(() => {
        let rows = options.rows.value || [];

        if (!options.isServerMode.value) {
            if (options.columnFilter.value) {
                rows = applyColumnFilters(rows, normalizedColumns.value);
            }

            rows = applyGlobalSearch(rows, normalizedColumns.value, currentSearch.value);

            if (options.sortable.value) {
                const isNumeric = normalizedColumns.value.find((c) => c.field === options.sortColumn.value)?.type === 'number';
                rows = applySorting(rows, options.sortColumn.value, options.sortDirection.value, isNumeric);
            }
        }

        return rows;
    });

    // Total row count after filtering
    const filterRowCount = computed(() => {
        if (options.isServerMode.value) {
            return options.totalRows.value || 0;
        }
        return filteredRows.value.length;
    });

    // Sync search prop
    watch(options.search, (val: string) => {
        currentSearch.value = val;
    });

    // Update filter value for a column
    const setFilterValue = (field: string, value: string | number | boolean | undefined) => {
        const state = columnFilterState.get(field);
        if (state) {
            state.value = value;
            // Auto-set default condition when user types with no filter selected
            if (value !== undefined && value !== '' && state.condition === '') {
                const col = options.columns.value.find((c) => c.field === field);
                const type = (col?.type?.toLowerCase() as IColumnType) || 'string';
                state.condition = type === 'string' ? 'contain' : 'equal';
            }
        }
    };

    // Update filter condition for a column
    const setFilterCondition = (field: string, condition: IFilterCondition) => {
        const state = columnFilterState.get(field);
        if (state) {
            state.condition = condition;
            if (condition === '') {
                state.value = undefined;
            }
        }
    };

    const toggleFilterMenu = (field: string | null) => {
        if (field && isOpenFilter.value === field) {
            isOpenFilter.value = null;
        } else {
            isOpenFilter.value = field;
        }
    };

    // Build column definitions with current filter state merged back (for events/payloads)
    const getColumnsWithFilterState = (): IColumnDefinition[] => {
        return options.columns.value.map((col) => {
            const field = col.field ?? '';
            const type = (col.type?.toLowerCase() as IColumnType) || 'string';
            const state = columnFilterState.get(field);
            return {
                ...col,
                type,
                value: state?.value,
                condition: state?.condition,
            };
        });
    };

    const resetFilters = () => {
        initialFilterState.forEach((state, field) => {
            columnFilterState.set(field, { ...state });
        });
        currentSearch.value = '';
    };

    return {
        currentSearch,
        isOpenFilter,
        normalizedColumns,
        filteredRows,
        filterRowCount,
        columnFilterState,
        setFilterValue,
        setFilterCondition,
        toggleFilterMenu,
        getColumnsWithFilterState,
        resetFilters,
    };
}
