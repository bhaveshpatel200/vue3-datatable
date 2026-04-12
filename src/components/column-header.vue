<template>
    <tr key="hdrrow">
        <th
            v-if="props.all.hasCheckbox"
            :key="'chkall'"
            class="bh-w-px"
            :class="{
                'bh-sticky bh-z-[1] bh-bg-blue-light': props.all.stickyHeader || props.all.stickyFirstColumn,
                'bh-top-0': props.all.stickyHeader,
                'bh-left-0': props.all.stickyFirstColumn,
            }"
        >
            <div class="bh-checkbox">
                <input ref="selectedAll" type="checkbox" @click.stop="onSelectAll" />
                <div>
                    <icon-check class="check" />
                    <icon-dash class="intermediate" />
                </div>
            </div>
        </th>
        <template v-for="(col, j) in props.all.columns">
            <th
                v-if="!col.hide"
                :key="col.field"
                class="bh-z-[1] bh-select-none"
                :class="[
                    props.all.sortable && col.sort ? 'bh-cursor-pointer' : '',
                    j === 0 && props.all.stickyFirstColumn ? 'bh-sticky bh-left-0 bh-bg-blue-light' : '',
                    props.all.hasCheckbox && j === 0 && props.all.stickyFirstColumn ? 'bh-left-[52px]' : '',
                ]"
                :style="{
                    width: col.width,
                    'min-width': col.minWidth,
                    'max-width': col.maxWidth,
                }"
            >
                <div class="bh-flex bh-items-center" :class="[col.headerClass ? col.headerClass : '']" @click="props.all.sortable && col.sort && emit('sortChange', col.field)">
                    {{ col.title }}
                    <span v-if="props.all.sortable && col.sort" class="bh-sort bh-ml-3 bh-flex bh-items-center" :class="[props.currentSortColumn, props.currentSortDirection]">
                        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                            <polygon
                                points="3.11,6.25 10.89,6.25 7,1.75 "
                                fill="currentColor"
                                class="bh-text-black/20"
                                :class="[props.currentSortColumn === col.field && props.currentSortDirection === 'asc' ? '!bh-text-primary' : '']"
                            ></polygon>
                            <polygon
                                points="7,12.25 10.89,7.75 3.11,7.75 "
                                fill="currentColor"
                                class="bh-text-black/20"
                                :class="[props.currentSortColumn === col.field && props.currentSortDirection === 'desc' ? '!bh-text-primary' : '']"
                            ></polygon>
                        </svg>
                    </span>
                </div>

                <template v-if="props.all.columnFilter && !props.isFooter">
                    <div v-if="col.filter" class="bh-relative bh-filter">
                        <input v-if="col.type === 'string'" v-model.trim="col.value" type="text" class="bh-form-control" @input="debouncedFilterChange" />
                        <input v-else-if="col.type === 'number'" v-model.number.trim="col.value" type="number" class="bh-form-control" @input="debouncedFilterChange" />
                        <input v-else-if="col.type === 'date'" v-model="col.value" type="date" class="bh-form-control" @change="onDateChange" />
                        <select v-else-if="col.type === 'bool'" v-model="col.value" class="bh-form-control" @change="emit('filterChange')" @click="emit('toggleFilterMenu', null)">
                            <option :value="undefined">All</option>
                            <option :value="true">True</option>
                            <option :value="false">False</option>
                        </select>

                        <button v-if="col.type !== 'bool'" type="button" @click.stop="emit('toggleFilterMenu', col)">
                            <icon-filter class="bh-w-4" />
                        </button>

                        <column-filter
                            v-show="props.isOpenFilter === col.field"
                            :column="col"
                            :column-filter-lang="props.columnFilterLang"
                            @close="emit('toggleFilterMenu', null)"
                            @filter-change="emit('filterChange')"
                        />
                    </div>
                </template>
            </th>
        </template>
    </tr>
</template>
<script setup lang="ts">
import { watch, ref, onBeforeUnmount } from 'vue';
import type { IColumnDefinition } from './types';
import columnFilter from './column-filter.vue';
import iconCheck from './icon-check.vue';
import iconDash from './icon-dash.vue';
import iconFilter from './icon-filter.vue';

interface ColumnHeaderProps {
    all: {
        hasCheckbox: boolean;
        stickyHeader: boolean;
        stickyFirstColumn: boolean;
        sortable: boolean;
        columnFilter: boolean;
        columns: IColumnDefinition[];
    };
    currentSortColumn: string;
    currentSortDirection: string;
    isOpenFilter: string | null;
    isFooter?: boolean;
    checkAll: boolean | null;
    columnFilterLang?: Record<string, string> | null;
}

const selectedAll = ref<HTMLInputElement | null>(null);

const props = withDefaults(defineProps<ColumnHeaderProps>(), {
    isFooter: false,
    columnFilterLang: null,
});

const emit = defineEmits<{
    selectAll: [checked: boolean];
    sortChange: [field: string | undefined];
    filterChange: [];
    toggleFilterMenu: [col: IColumnDefinition | null];
}>();

const onSelectAll = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('selectAll', target.checked);
};

let filterTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedFilterChange = () => {
    if (filterTimer) {
        clearTimeout(filterTimer);
    }
    filterTimer = setTimeout(() => {
        emit('filterChange');
    }, 300);
};

const onDateChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const val = input.value;
    // only emit when date value is valid with a 4-digit year (YYYY-MM-DD)
    if (!val || /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        debouncedFilterChange();
    }
};

onBeforeUnmount(() => {
    if (filterTimer) {
        clearTimeout(filterTimer);
    }
});

const checkboxChange = () => {
    if (selectedAll.value) {
        selectedAll.value.indeterminate = props.checkAll === null; // some selected
        selectedAll.value.checked = props.checkAll === true; // all selected
    }
};
watch(() => props.checkAll, checkboxChange);
</script>
