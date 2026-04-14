import { computed, ref, watch, type Ref } from 'vue';

interface IUsePaginationOptions {
    page: Ref<number>;
    pageSize: Ref<number>;
    showNumbersCount: Ref<number>;
    pagination: Ref<boolean>;
    totalRows: Ref<number>;
}

export function usePagination(options: IUsePaginationOptions) {
    const currentPage = ref(options.page.value);
    const currentPageSize = ref(options.pagination.value ? options.pageSize.value : options.totalRows.value);
    const initialPageSize = options.pageSize.value;

    // Sync from prop
    watch(options.page, (val: number) => {
        currentPage.value = val;
    });

    const maxPage = computed(() => {
        const size = currentPageSize.value ?? 1;
        const totalPages = size < 1 ? 1 : Math.ceil(options.totalRows.value / size);
        return Math.max(totalPages || 0, 1);
    });

    const offset = computed(() => {
        return (currentPage.value - 1) * (currentPageSize.value ?? 0) + 1;
    });

    const limit = computed(() => {
        const lim = currentPage.value * (currentPageSize.value ?? 0);
        return options.totalRows.value >= lim ? lim : options.totalRows.value;
    });

    const paging = computed(() => {
        let startPage: number;
        let endPage: number;
        const count = options.showNumbersCount.value;
        const isMaxSized = count < maxPage.value;

        if (isMaxSized) {
            startPage = Math.max(currentPage.value - Math.floor(count / 2), 1);
            endPage = startPage + count - 1;
            if (endPage > maxPage.value) {
                endPage = maxPage.value;
                startPage = endPage - count + 1;
            }
        } else {
            startPage = 1;
            endPage = maxPage.value;
        }

        return Array.from({ length: endPage + 1 - startPage }, (_, i) => startPage + i);
    });

    const previousPage = () => {
        if (currentPage.value <= 1) return;
        currentPage.value--;
    };

    const nextPage = () => {
        if (currentPage.value >= maxPage.value) return;
        currentPage.value++;
    };

    const movePage = (page: number) => {
        currentPage.value = page;
    };

    const resetPage = () => {
        currentPage.value = 1;
    };

    return {
        currentPage,
        currentPageSize,
        initialPageSize,
        maxPage,
        offset,
        limit,
        paging,
        previousPage,
        nextPage,
        movePage,
        resetPage,
    };
}
