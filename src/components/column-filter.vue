<template>
    <div class="bh-filter-menu bh-absolute bh-right-0 bh-top-full bh-z-[1] bh-mt-1 bh-w-32 bh-rounded-md bh-bg-white bh-shadow-md">
        <div class="bh-overflow-hidden bh-rounded bh-text-[13px] bh-font-normal" @click.stop="close">
            <button type="button" :class="{ active: props.column.condition === '' }" @click="select('')">
                {{ (props.columnFilterLang && props.columnFilterLang['no_filter']) ?? 'No filter' }}
            </button>
            <template v-if="props.column.type === 'string'">
                <button type="button" :class="{ active: props.column.condition === 'contain' }" @click="select('contain')">
                    {{ (props.columnFilterLang && props.columnFilterLang['contain']) ?? 'Contain' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'not_contain' }" @click="select('not_contain')">
                    {{ (props.columnFilterLang && props.columnFilterLang['not_contain']) ?? 'Not contain' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'equal' }" @click="select('equal')">
                    {{ (props.columnFilterLang && props.columnFilterLang['equal']) ?? 'Equal' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'not_equal' }" @click="select('not_equal')">
                    {{ (props.columnFilterLang && props.columnFilterLang['not_equal']) ?? 'Not equal' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'start_with' }" @click="select('start_with')">
                    {{ (props.columnFilterLang && props.columnFilterLang['start_with']) ?? 'Starts with' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'end_with' }" @click="select('end_with')">
                    {{ (props.columnFilterLang && props.columnFilterLang['end_with']) ?? 'Ends with' }}
                </button>
            </template>
            <template v-else-if="props.column.type === 'number'">
                <button type="button" :class="{ active: props.column.condition === 'equal' }" @click="select('equal')">
                    {{ (props.columnFilterLang && props.columnFilterLang['equal']) ?? 'Equal' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'not_equal' }" @click="select('not_equal')">
                    {{ (props.columnFilterLang && props.columnFilterLang['not_equal']) ?? 'Not equal' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'greater_than' }" @click="select('greater_than')">
                    {{ (props.columnFilterLang && props.columnFilterLang['greater_than']) ?? 'Greater than' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'greater_than_equal' }" @click="select('greater_than_equal')">
                    {{ (props.columnFilterLang && props.columnFilterLang['greater_than_equal']) ?? 'Greater than or equal' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'less_than' }" @click="select('less_than')">
                    {{ (props.columnFilterLang && props.columnFilterLang['less_than']) ?? 'Less than' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'less_than_equal' }" @click="select('less_than_equal')">
                    {{ (props.columnFilterLang && props.columnFilterLang['less_than_equal']) ?? 'Less than or equal' }}
                </button>
            </template>
            <template v-else-if="props.column.type === 'date'">
                <button type="button" :class="{ active: props.column.condition === 'equal' }" @click="select('equal')">
                    {{ (props.columnFilterLang && props.columnFilterLang['equal']) ?? 'Equal' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'not_equal' }" @click="select('not_equal')">
                    {{ (props.columnFilterLang && props.columnFilterLang['not_equal']) ?? 'Not equal' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'greater_than' }" @click="select('greater_than')">
                    {{ (props.columnFilterLang && props.columnFilterLang['greater_than']) ?? 'Greater than' }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'less_than' }" @click="select('less_than')">
                    {{ (props.columnFilterLang && props.columnFilterLang['less_than']) ?? 'Less than' }}
                </button>
            </template>

            <button type="button" :class="{ active: props.column.condition === 'is_null' }" @click="select('is_null')">
                {{ (props.columnFilterLang && props.columnFilterLang['is_null']) ?? 'Is null' }}
            </button>
            <button type="button" :class="{ active: props.column.condition === 'is_not_null' }" @click="select('is_not_null')">
                {{ (props.columnFilterLang && props.columnFilterLang['is_not_null']) ?? 'Not null' }}
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import type { colDef, FilterCondition } from './custom-table.vue';

interface ColumnFilterProps {
    column: colDef;
    columnFilterLang?: Record<string, string> | null;
}

const props = withDefaults(defineProps<ColumnFilterProps>(), {
    columnFilterLang: null,
});

onBeforeUnmount(() => {
    document.removeEventListener('click', close);
});
onMounted(() => {
    document.addEventListener('click', close);
});

const emit = defineEmits<{
    close: [];
    filterChange: [column: colDef];
}>();

const close = () => {
    emit('close');
};

const select = (condition: FilterCondition) => {
    props.column.condition = condition;
    if (condition === '') {
        props.column.value = '';
    }

    emit('filterChange', props.column);
};
</script>
