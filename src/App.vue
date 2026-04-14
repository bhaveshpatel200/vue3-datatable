<template>
    <div class="bh-p-10">
        <div class="bh-mb-2 bh-flex bh-items-center bh-gap-2">
            <input
                v-model="params.search"
                type="text"
                placeholder="Search..."
                class="bh-rounded bh-border bh-border-solid bh-border-gray-200 bh-bg-white bh-p-2 bh-outline-0 focus:bh-border-gray-200"
            />
            <button type="button" class="bh-rounded bh-bg-primary bh-px-4 bh-py-2 bh-text-white" @click="datatable?.reset()">Reset</button>
            <button type="button" class="bh-rounded bh-border bh-border-solid bh-border-gray-200 bh-px-4 bh-py-2" @click="logSelectedRows">Get Selected</button>
        </div>

        <vue3-datatable
            ref="datatable"
            :loading="loading"
            :rows="rows"
            :columns="cols"
            :total-rows="total_rows"
            :is-server-mode="true"
            :page="params.current_page"
            :page-size="params.pagesize"
            :page-size-options="[5, 10, 20, 50]"
            :sortable="true"
            :sort-column="params.sort_column"
            :sort-direction="params.sort_direction"
            :search="params.search"
            :has-checkbox="true"
            :column-filter="true"
            :show-page-size="true"
            :show-numbers="true"
            :show-first-page="true"
            :show-last-page="true"
            :column-filter-lang="filterLang"
            :select-row-on-click="true"
            @change="changeServer"
            @sort-change="onSortChange"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
            @search-change="onSearchChange"
            @filter-change="onFilterChange"
            @row-select="onRowSelect"
            @row-click="onRowClick"
            @row-d-b-click="onRowDBClick"
        >
            <template #isActive="{ value }">
                <span :class="value.isActive ? 'bh-text-green-600' : 'bh-text-red-600'">
                    {{ value.isActive ? 'Active' : 'Inactive' }}
                </span>
            </template>
        </vue3-datatable>
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

const params = reactive<{
    current_page: number;
    pagesize: number;
    sort_column: string;
    sort_direction: 'asc' | 'desc';
    search: string;
}>({
    current_page: 1,
    pagesize: 10,
    sort_column: 'id',
    sort_direction: 'desc',
    search: '',
});

// server-side: aggregate change handler
const changeServer = (data: IServerChangeResponse) => {
    params.current_page = data.current_page;
    params.pagesize = data.pagesize;
    params.sort_column = data.sort_column;
    params.sort_direction = data.sort_direction;
    params.search = data.search;

    filterUsers();
};

// individual event handlers
const onSortChange = (data: ISortChangeResponse) => {
    console.log('sortChange:', data);
};

const onPageChange = (page: number) => {
    console.log('pageChange:', page);
};

const onPageSizeChange = (pageSize: number) => {
    console.log('pageSizeChange:', pageSize);
};

const onSearchChange = (val: string) => {
    console.log('searchChange:', val);
};

const onFilterChange = (columns: IColumnDefinition[]) => {
    console.log('filterChange:', columns);
};

const onRowSelect = (selectedRows: Array<Record<string, unknown>>) => {
    console.log('rowSelect:', selectedRows.length, 'rows');
};

const onRowClick = (row: Record<string, unknown>) => {
    console.log('rowClick:', row);
};

const onRowDBClick = (row: Record<string, unknown>) => {
    console.log('rowDBClick:', row);
};

const logSelectedRows = () => {
    const selected = datatable.value?.getSelectedRows();
    console.log('Selected rows:', selected);
};

// debounced fetch
let controller: AbortController | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const filterUsers = () => {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        getUsers();
    }, 300);
};

const getUsers = async () => {
    if (controller) {
        controller.abort();
    }
    controller = new AbortController();
    const signal = controller.signal;

    try {
        loading.value = true;

        const response = await fetch('https://vue3-datatable-document.vercel.app/api/user', {
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
