<template>
    <div class="bh-p-10">
        <div class="bh-mb-2">
            <input
                v-model="params.search"
                type="text"
                placeholder="Search..."
                class="bh-rounded bh-border bh-border-solid bh-border-gray-200 bh-bg-white bh-p-2 bh-outline-0 focus:bh-border-gray-200"
            />
            <button type="button" class="btn mb-4 bh-p-2" @click="datatable?.reset()">Reset</button> <br />
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
            :page-size-options="[3, 5, 10]"
            :sortable="true"
            :sort-column="params.sort_column"
            :sort-direction="params.sort_direction"
            :search="params.search"
            :has-checkbox="true"
            :column-filter="false"
            @change="changeServer"
        >
        </vue3-datatable>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Vue3Datatable from './components/custom-table.vue';
import type { colDef, ServerChangePayload } from './components/custom-table.vue';
import '../dist/style.css';

onMounted(() => {
    getUsers();
});

const datatable = ref<InstanceType<typeof Vue3Datatable> | null>(null);
const loading = ref(true);
const total_rows = ref(0);
const rows = ref<Array<Record<string, unknown>>>([]);
const cols = ref<colDef[]>([
    { field: 'id', title: 'ID', isUnique: true, filter: false },
    { field: 'firstName', title: 'First Name' },
    { field: 'lastName', title: 'Last Name' },
    { field: 'email', title: 'Email' },
    { field: 'age', title: 'Age', type: 'number' },
    { field: 'dob', title: 'Birthdate', type: 'date' },
    { field: 'address.city', title: 'City' },
    { field: 'isActive', title: 'Active', type: 'bool' },
]);

const changeServer = (data: ServerChangePayload) => {
    params.current_page = data.current_page;
    params.pagesize = data.pagesize;
    params.sort_column = data.sort_column;
    params.sort_direction = data.sort_direction;
    params.search = data.search;

    filterUsers();
};

const params = reactive({
    current_page: 1,
    pagesize: 5,
    sort_column: 'id',
    sort_direction: 'desc',
    search: '',
});

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
    // cancel request if previous request still pending before next request fire
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
