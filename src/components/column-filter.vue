<template>
    <div class="bh-filter-menu bh-w-45 bh-absolute bh-right-0 bh-top-full bh-z-[1] bh-mt-1 bh-whitespace-normal bh-rounded-md bh-bg-white bh-shadow-md">
        <div class="bh-overflow-hidden bh-rounded bh-text-[13px] bh-font-normal" @click.stop="close">
            <button type="button" :class="{ active: props.column.condition === '' }" @click="select('')">
                {{ lang('no_filter', 'No filter') }}
            </button>
            <template v-if="props.column.type === 'string'">
                <button type="button" :class="{ active: props.column.condition === 'contain' }" @click="select('contain')">
                    {{ lang('contain', 'Contain') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'not_contain' }" @click="select('not_contain')">
                    {{ lang('not_contain', 'Not contain') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'equal' }" @click="select('equal')">
                    {{ lang('equal', 'Equal') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'not_equal' }" @click="select('not_equal')">
                    {{ lang('not_equal', 'Not equal') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'start_with' }" @click="select('start_with')">
                    {{ lang('start_with', 'Starts with') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'end_with' }" @click="select('end_with')">
                    {{ lang('end_with', 'Ends with') }}
                </button>
            </template>
            <template v-else-if="props.column.type === 'number'">
                <button type="button" :class="{ active: props.column.condition === 'equal' }" @click="select('equal')">
                    {{ lang('equal', 'Equal') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'not_equal' }" @click="select('not_equal')">
                    {{ lang('not_equal', 'Not equal') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'greater_than' }" @click="select('greater_than')">
                    {{ lang('greater_than', 'Greater than') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'greater_than_equal' }" @click="select('greater_than_equal')">
                    {{ lang('greater_than_equal', 'Greater than or equal') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'less_than' }" @click="select('less_than')">
                    {{ lang('less_than', 'Less than') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'less_than_equal' }" @click="select('less_than_equal')">
                    {{ lang('less_than_equal', 'Less than or equal') }}
                </button>
            </template>
            <template v-else-if="props.column.type === 'date'">
                <button type="button" :class="{ active: props.column.condition === 'equal' }" @click="select('equal')">
                    {{ lang('equal', 'Equal') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'not_equal' }" @click="select('not_equal')">
                    {{ lang('not_equal', 'Not equal') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'greater_than' }" @click="select('greater_than')">
                    {{ lang('greater_than', 'Greater than') }}
                </button>
                <button type="button" :class="{ active: props.column.condition === 'less_than' }" @click="select('less_than')">
                    {{ lang('less_than', 'Less than') }}
                </button>
            </template>

            <button type="button" :class="{ active: props.column.condition === 'is_null' }" @click="select('is_null')">
                {{ lang('is_null', 'Is null') }}
            </button>
            <button type="button" :class="{ active: props.column.condition === 'is_not_null' }" @click="select('is_not_null')">
                {{ lang('is_not_null', 'Not null') }}
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import type { IFilterCondition } from './types';
import type { INormalizedColumn } from './filter-strategies';

interface IColumnFilterProps {
    column: INormalizedColumn;
    columnFilterLang?: Record<string, string> | null;
}

const props = withDefaults(defineProps<IColumnFilterProps>(), {
    columnFilterLang: null,
});

const emit = defineEmits<{
    close: [];
    conditionChange: [field: string, condition: IFilterCondition];
}>();

onMounted(() => {
    document.addEventListener('click', close);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', close);
});

const lang = (key: string, fallback: string): string => {
    return props.columnFilterLang?.[key] ?? fallback;
};

const close = () => {
    emit('close');
};

const select = (condition: IFilterCondition) => {
    emit('conditionChange', props.column.field, condition);
};
</script>
