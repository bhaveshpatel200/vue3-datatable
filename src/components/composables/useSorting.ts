import { ref, type Ref } from 'vue';

type SortDir = 'asc' | 'desc';

interface IUseSortingOptions {
    sortColumn: Ref<string>;
    sortDirection: Ref<SortDir>;
}

export function useSorting(options: IUseSortingOptions) {
    const currentSortColumn = ref(options.sortColumn.value);
    const currentSortDirection = ref<SortDir>(options.sortDirection.value);
    const initialSortColumn = options.sortColumn.value;
    const initialSortDirection = options.sortDirection.value;

    const toggleSort = (field: string): { field: string; direction: 'asc' | 'desc' } => {
        let direction: 'asc' | 'desc' = 'asc';
        if (field === currentSortColumn.value && currentSortDirection.value === 'asc') {
            direction = 'desc';
        }
        currentSortColumn.value = field;
        currentSortDirection.value = direction;
        return { field, direction };
    };

    const resetSort = () => {
        currentSortColumn.value = initialSortColumn;
        currentSortDirection.value = initialSortDirection;
    };

    return {
        currentSortColumn,
        currentSortDirection,
        initialSortColumn,
        initialSortDirection,
        toggleSort,
        resetSort,
    };
}
