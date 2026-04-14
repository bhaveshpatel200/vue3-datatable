<template>
    <tr key="hdrrow">
        <th
            v-if="props.hasCheckbox"
            :key="'chkall'"
            class="bh-w-px"
            :class="{
                'bh-sticky bh-z-[1] bh-bg-blue-light': props.stickyHeader || props.stickyFirstColumn,
                'bh-top-0': props.stickyHeader,
                'bh-left-0': props.stickyFirstColumn,
            }"
        >
            <div class="bh-checkbox">
                <input ref="checkboxRef" type="checkbox" @click.stop="onSelectAll" />
                <div>
                    <icon-check class="check" />
                    <icon-dash class="intermediate" />
                </div>
            </div>
        </th>
        <template v-for="(col, j) in props.columns">
            <th
                v-if="!col.hide"
                :key="col.field"
                class="bh-z-[1] bh-select-none"
                :class="[
                    props.sortable && col.sort ? 'bh-cursor-pointer' : '',
                    j === 0 && props.stickyFirstColumn ? 'bh-sticky bh-left-0 bh-bg-blue-light' : '',
                    props.hasCheckbox && j === 0 && props.stickyFirstColumn ? 'bh-left-[52px]' : '',
                ]"
                :style="{
                    width: col.width,
                    'min-width': col.minWidth,
                    'max-width': col.maxWidth,
                }"
            >
                <div class="bh-flex bh-items-center" :class="[col.headerClass ? col.headerClass : '']" @click="props.sortable && col.sort && emit('sortChange', col.field)">
                    {{ col.title }}
                    <span v-if="props.sortable && col.sort" class="bh-sort bh-ml-3 bh-flex bh-items-center">
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

                <template v-if="props.columnFilter && !props.isFooter">
                    <div v-if="col.filter" class="bh-relative bh-filter">
                        <input v-if="col.type === 'string'" :value="col.value" type="text" class="bh-form-control" @input="onFilterInput(col.field!, ($event.target as HTMLInputElement).value)" />
                        <input
                            v-else-if="col.type === 'number'"
                            :value="col.value"
                            type="number"
                            class="bh-form-control"
                            @input="onFilterInput(col.field!, ($event.target as HTMLInputElement).value === '' ? undefined : Number(($event.target as HTMLInputElement).value))"
                        />
                        <input
                            v-else-if="col.type === 'date'"
                            :value="col.value"
                            type="date"
                            class="bh-form-control"
                            @change="onDateFilterChange(col.field!, ($event.target as HTMLInputElement).value)"
                        />
                        <select v-else-if="col.type === 'bool'" :value="col.value" class="bh-form-control" @change="onBoolFilterChange(col.field!, ($event.target as HTMLSelectElement).value)">
                            <option :value="undefined">All</option>
                            <option :value="true">True</option>
                            <option :value="false">False</option>
                        </select>

                        <button v-if="col.type !== 'bool'" type="button" @click.stop="emit('toggleFilterMenu', col.field!)">
                            <icon-filter class="bh-w-4" />
                        </button>

                        <ColumnFilterMenu
                            v-show="props.isOpenFilter === col.field"
                            :column="col"
                            :column-filter-lang="props.columnFilterLang"
                            @close="emit('toggleFilterMenu', '')"
                            @condition-change="(field: string, condition: IFilterCondition) => emit('conditionChange', field, condition)"
                        />
                    </div>
                </template>
            </th>
        </template>
    </tr>
</template>
<script setup lang="ts">
import { watch, ref, onBeforeUnmount } from 'vue';
import type { IFilterCondition } from './types';
import type { INormalizedColumn } from './filter-strategies';
import ColumnFilterMenu from './column-filter.vue';
import iconCheck from './icon-check.vue';
import iconDash from './icon-dash.vue';
import iconFilter from './icon-filter.vue';

interface IColumnHeaderProps {
    hasCheckbox: boolean;
    stickyHeader: boolean;
    stickyFirstColumn: boolean;
    sortable: boolean;
    columnFilter: boolean;
    columns: INormalizedColumn[];
    currentSortColumn: string;
    currentSortDirection: string;
    isOpenFilter: string | null;
    isFooter?: boolean;
    checkAll: boolean | null;
    columnFilterLang?: Record<string, string> | null;
}

const checkboxRef = ref<HTMLInputElement | null>(null);

const props = withDefaults(defineProps<IColumnHeaderProps>(), {
    isFooter: false,
    columnFilterLang: null,
});

const emit = defineEmits<{
    selectAll: [checked: boolean];
    sortChange: [field: string | undefined];
    filterValueChange: [field: string, value: string | number | boolean | undefined];
    conditionChange: [field: string, condition: IFilterCondition];
    toggleFilterMenu: [field: string];
}>();

const onSelectAll = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('selectAll', target.checked);
};

// Debounced filter for text/number inputs
let filterTimer: ReturnType<typeof setTimeout> | null = null;
const onFilterInput = (field: string, value: string | number | boolean | undefined) => {
    if (filterTimer) clearTimeout(filterTimer);
    filterTimer = setTimeout(() => {
        emit('filterValueChange', field, typeof value === 'string' ? value.trim() : value);
    }, 300);
};

// Date filter — only emit on valid 4-digit year dates
const onDateFilterChange = (field: string, value: string) => {
    if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        if (filterTimer) clearTimeout(filterTimer);
        filterTimer = setTimeout(() => {
            emit('filterValueChange', field, value || undefined);
        }, 300);
    }
};

// Bool filter — immediate
const onBoolFilterChange = (field: string, value: string) => {
    let parsed: boolean | undefined;
    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;
    else parsed = undefined;
    emit('filterValueChange', field, parsed);
    emit('toggleFilterMenu', '');
};

onBeforeUnmount(() => {
    if (filterTimer) clearTimeout(filterTimer);
});

// Sync header checkbox state
const syncCheckbox = () => {
    if (checkboxRef.value) {
        checkboxRef.value.indeterminate = props.checkAll === null;
        checkboxRef.value.checked = props.checkAll === true;
    }
};
watch(() => props.checkAll, syncCheckbox);
</script>
