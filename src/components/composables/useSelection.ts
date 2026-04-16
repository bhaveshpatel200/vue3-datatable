import { computed, ref, type Ref } from 'vue';
import { cellValue } from '../utils';

interface IUseSelectionOptions {
    filterItems: Ref<Array<Record<string, unknown>>>;
    uniqueKey: Ref<string | null>;
}

export function useSelection(options: IUseSelectionOptions) {
    const selected = ref<Array<string | number>>([]);

    const getRowKey = (row: Record<string, unknown>, index: number): string | number => {
        if (options.uniqueKey.value) {
            const val = cellValue(row, options.uniqueKey.value);
            return (val as string | number) ?? index;
        }
        return index;
    };

    // Three-state checkbox computed reactively from selected + filterItems
    // Reacts to BOTH selection changes AND visible-row changes (page/filter/sort)
    const selectedAll = computed<boolean | null>(() => {
        const items = options.filterItems.value;
        if (selected.value.length === 0 || items.length === 0) return false;
        const allSelected = items.every((d, i) => selected.value.includes(getRowKey(d, i)));
        if (allSelected) return true;
        const anySelected = items.some((d, i) => selected.value.includes(getRowKey(d, i)));
        return anySelected ? null : false;
    });

    const selectAll = (checked: boolean) => {
        if (checked) {
            selected.value = options.filterItems.value.map((d, i) => getRowKey(d, i));
        } else {
            selected.value = [];
        }
    };

    const clearSelection = () => {
        selected.value = [];
    };

    const selectRow = (index: number) => {
        if (!isRowSelected(index)) {
            const row = options.filterItems.value[index];
            if (row) {
                selected.value.push(getRowKey(row, index));
            }
        }
    };

    const unselectRow = (index: number) => {
        if (isRowSelected(index)) {
            const row = options.filterItems.value[index];
            if (row) {
                const key = getRowKey(row, index);
                selected.value = selected.value.filter((d) => d !== key);
            }
        }
    };

    const toggleRow = (index: number) => {
        if (isRowSelected(index)) unselectRow(index);
        else selectRow(index);
    };

    const isRowSelected = (index: number): boolean => {
        const row = options.filterItems.value[index];
        if (row) {
            return selected.value.includes(getRowKey(row, index));
        }
        return false;
    };

    const getSelectedRows = (): Array<Record<string, unknown>> => {
        return options.filterItems.value.filter((d, i) => selected.value.includes(getRowKey(d, i)));
    };

    return {
        selected,
        selectedAll,
        getRowKey,
        selectAll,
        clearSelection,
        selectRow,
        unselectRow,
        toggleRow,
        isRowSelected,
        getSelectedRows,
        clearSelectedRows: clearSelection,
    };
}

/** Compute the unique key field from columns. */
export const useUniqueKey = (columns: Ref<Array<{ isUnique?: boolean; field?: string }>>) => {
    return computed(() => {
        const col = columns.value.find((d) => d.isUnique);
        return col?.field || null;
    });
};
