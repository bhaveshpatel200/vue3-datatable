<template>
    <div class="bh-p-10">
        <div class="bh-mb-2">
            <input
                type="text"
                v-model="params.search"
                placeholder="Search..."
                class="bh-border bh-border-solid bh-bg-white bh-p-2 bh-outline-0 bh-border-gray-200 focus:bh-border-gray-200 bh-rounded"
            />
            <button type="button" class="btn mb-4 bh-p-2" @click="datatable.reset()">Reset</button> <br />
        </div>

        <vue3-datatable
            ref="datatable"
            :loading="loading"
            :rows="rows"
            :columns="cols"
            :totalRows="total_rows"
            :isServerMode="true"
            :page="params.current_page"
            :pageSize="params.pagesize"
            :pageSizeOptions="[3, 5, 10]"
            :sortable="true"
            :sortColumn="params.sort_column"
            :sortDirection="params.sort_direction"
            :search="params.search"
            :hasCheckbox="true"
            :columnFilter="false"
            @change="changeServer"
        >
        </vue3-datatable>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Vue3Datatable from './components/custom-table.vue';
import '../dist/style.css';

onMounted(() => {
    getUsers();
});

const datatable: any = ref(null);
const loading: any = ref(true);
const total_rows = ref(0);
const rows: any = ref(null);
const cols =
    ref([
        { field: 'id', title: 'ID', isUnique: true, filter: false },
        { field: 'firstName', title: 'First Name' },
        { field: 'lastName', title: 'Last Name' },
        { field: 'email', title: 'Email' },
        { field: 'age', title: 'Age', type: 'number' },
        { field: 'dob', title: 'Birthdate', type: 'date' },
        { field: 'address.city', title: 'City' },
        { field: 'isActive', title: 'Active', type: 'bool' },
    ]) || [];

const changeServer = (data: any) => {
    params.current_page = data.current_page;
    params.pagesize = data.pagesize;
    params.sort_column = data.sort_column;
    params.sort_direction = data.sort_direction;
    params.column_filters = data.column_filters;
    params.search = data.search;

    filterUsers();
};

const params = reactive({
    current_page: 1,
    pagesize: 5,
    sort_column: 'id',
    sort_direction: 'desc',
    column_filters: [],
    search: '',
});

let controller: any;
let timer: any;
const filterUsers = () => {
    clearTimeout(timer);
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
            signal: signal, // Assign the signal to the fetch request
        });

        const data = await response.json();

        rows.value = data?.data;
        total_rows.value = data?.meta?.total;
    } catch {}

    loading.value = false;
};
</script>
