<template>
    <div class="bh-p-10">
        <div class="bh-mb-2 bh-flex bh-items-center bh-gap-2">
            <input
                v-model="params.search"
                type="text"
                placeholder="Search..."
                class="bh-rounded bh-border bh-border-solid bh-border-gray-200 bh-bg-white bh-p-2 bh-outline-0 focus:bh-border-gray-200"
            />
            <button type="button" class="bh-rounded bh-bg-primary bh-px-4 bh-py-2 bh-text-white" @click="reset">Reset</button>
            <button type="button" class="bh-rounded bh-border bh-border-solid bh-border-gray-200 bh-px-4 bh-py-2" @click="logSelectedRows">Get Selected</button>
        </div>

        <vue3-datatable
            ref="datatable"
            :rows="rows"
            :columns="cols"
            :loading="loading"
            :total-rows="total_rows"
            :is-server-mode="true"
            :page="params.current_page"
            :page-size="params.pagesize"
            :sortable="true"
            :column-filter="true"
            :has-checkbox="true"
            :search="params.search"
            :sort-column="params.sort_column"
            :sort-direction="params.sort_direction"
            :column-filter-lang="filterLang"
            @search-change="searchChange"
            @change-server="changeServer"
            @sort-change="sortChange"
            @page-change="changePage"
            @page-size-change="changePageSize"
            @filter-change="filterChange"
            @row-select="rowSelect"
            @row-click="rowClick"
            @row-d-b-click="rowDBClick"
            @reset="onReset"
        />
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Vue3Datatable } from './components/index';
import type { IColumnDefinition, IServerChangeResponse, ISortChangeResponse } from './components/index';
import '../dist/style.css';

onMounted(() => {
    getUsers();
});

const datatable = ref<InstanceType<typeof Vue3Datatable> | null>(null);
const loading = ref(true);
const total_rows = ref(0);
const rows = ref<Array<Record<string, unknown>>>([]);

const cols = ref<IColumnDefinition[]>([
    { field: 'id', title: 'ID', isUnique: true, filter: false, type: 'number' },
    { field: 'firstName', title: 'First Name' },
    { field: 'lastName', title: 'Last Name' },
    { field: 'email', title: 'Email' },
    { field: 'age', title: 'Age', type: 'number' },
    { field: 'dob', title: 'Birthdate', type: 'date' },
    { field: 'address.city', title: 'City' },
    { field: 'isActive', title: 'Active', type: 'bool' },
]);

const filterLang: Record<string, string> = {
    no_filter: 'No filter Selected',
    contain: 'Contain',
    not_contain: 'Not contain',
    equal: 'Equal',
    not_equal: 'Not equal',
    start_with: 'Starts with',
    end_with: 'Ends with',
    greater_than: 'Greater than',
    greater_than_equal: 'Greater than or equal',
    less_than: 'Less than',
    less_than_equal: 'Less than or equal',
    is_null: 'Is null',
    is_not_null: 'Not null',
};

const defaultParams = {
    current_page: 5,
    pagesize: 10,
    sort_column: 'id',
    sort_direction: 'desc' as 'asc' | 'desc',
    search: '',
    column_filters: [] as IColumnDefinition[],
};

const params = reactive({ ...defaultParams });

// server-side: aggregate change handler — single source of truth for fetching
const changeServer = (data: IServerChangeResponse) => {
    console.log('changeServer:', data);
};

// individual event handlers (logging only — @change handles fetch)
const sortChange = (data: ISortChangeResponse) => {
    console.log('sortChange:', data);
    params.sort_column = data.field;
    params.sort_direction = data.direction;
    getUsers();
};

const changePage = (page: number) => {
    console.log('pageChange:', page);
    params.current_page = page;
    getUsers();
};

const changePageSize = (size: number) => {
    console.log('pageSizeChange:', size);
    params.pagesize = size;
    params.current_page = 1;
    getUsers();
};

const searchChange = (val: string) => {
    console.log('searchChange:', val);
    params.search = val;
    params.current_page = 1;

    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        getUsers();
    }, 300);
};

const filterChange = (columns: IColumnDefinition[]) => {
    console.log('filterChange:', columns);
    params.column_filters = columns;
    params.current_page = 1;
    getUsers();
};

const rowSelect = (selectedRows: Array<Record<string, unknown>>) => {
    console.log('rowSelect:', selectedRows.length, 'rows');
};

const rowClick = (row: Record<string, unknown>) => {
    console.log('rowClick:', row);
};

const rowDBClick = (row: Record<string, unknown>) => {
    console.log('rowDBClick:', row);
};

const logSelectedRows = () => {
    const selected = datatable.value?.getSelectedRows();
    console.log('Selected rows:', selected);
};

const reset = () => {
    Object.assign(params, { ...defaultParams });
    datatable.value?.reset();
};

const onReset = () => {
    console.log('reset');
    getUsers();
};

// debounced fetch
let controller: AbortController | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

const getUsers = async () => {
    if (controller) {
        controller.abort();
    }
    controller = new AbortController();
    const signal = controller.signal;

    try {
        loading.value = true;

        // const response = await fetch('https://vue3-datatable-document.vercel.app/api/user', {
        const response = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            body: JSON.stringify(params),
            signal: signal,
        });

        const data = await response.json();

        rows.value = data?.data ?? [];
        total_rows.value = data?.meta?.total ?? 0;
    } catch {
        /* request aborted or failed */
    }

    loading.value = false;
};
</script>
