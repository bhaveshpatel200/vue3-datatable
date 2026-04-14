import { computed, ref, watch, type Ref } from 'vue';
import { cellValue } from '../utils';

interface IUseSelectionOptions {
    filterItems: Ref<Array<Record<string, unknown>>>;
    uniqueKey: Ref<string | null>;
}

export function useSelection(options: IUseSelectionOptions) {
    const selected = ref<Array<string | number>>([]);
    const selectedAll = ref<boolean | null>(false);
    let suppressEmit = false;

    const getRowKey = (row: Record<string, unknown>, index: number): string | number => {
        if (options.uniqueKey.value) {
            const val = cellValue(row, options.uniqueKey.value);
            return (val as string | number) ?? index;
        }
        return index;
    };

    // Three-state checkbox: true (all), null (some/indeterminate), false (none)
    watch(selected, (value) => {
        if (value.length === 0) {
            selectedAll.value = false;
        } else if (options.filterItems.value.length > 0 && value.length === options.filterItems.value.length) {
            selectedAll.value = true;
        } else {
            selectedAll.value = null;
        }
    });

    const selectAll = (checked: boolean, silent = false) => {
        if (silent) suppressEmit = true;
        if (checked) {
            selected.value = options.filterItems.value.map((d, i) => getRowKey(d, i));
        } else {
            selected.value = [];
        }
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

    const clearSelectedRows = () => {
        selected.value = [];
    };

    /** Check if the emit should be suppressed (returns true once, then resets). */
    const shouldSuppressEmit = (): boolean => {
        if (suppressEmit) {
            suppressEmit = false;
            return true;
        }
        return false;
    };

    return {
        selected,
        selectedAll,
        getRowKey,
        selectAll,
        selectRow,
        unselectRow,
        isRowSelected,
        getSelectedRows,
        clearSelectedRows,
        shouldSuppressEmit,
    };
}

/** Compute the unique key field from columns. */
export const useUniqueKey = (columns: Ref<Array<{ isUnique?: boolean; field?: string }>>) => {
    return computed(() => {
        const col = columns.value.find((d) => d.isUnique);
        return col?.field || null;
    });
};
