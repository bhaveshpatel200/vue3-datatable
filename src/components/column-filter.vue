<template>
    <div class="bh-filter-menu bh-absolute bh-z-[1] bh-bg-white bh-shadow-md bh-rounded-md bh-top-full bh-right-0 bh-w-32 bh-mt-1">
        <div class="bh-text-[13px] bh-font-normal bh-rounded bh-overflow-hidden" @click.stop="close">
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

<script lang="ts">
/**
 * Props for the column filters translation
 * 
 * @default
 * 
 * ```json
 * {
    "no_filter":"No filter",
    "contain":"Contain",
    "not_contain":"Not contain",
    "equal":"Equal",
    "not_equal":"Not equal",
    "start_with":"Starts with",
    "end_with":"Ends with",
    "greater_than":"Greater than",
    "greater_than_equal":"Greater than or equal",
    "less_than":"Less than",
    "less_than_equal":"Less than or equal",
    "is_null":"Is null",
    "is_not_null":"Not null"
    }
    ```
 * You can override the default values by passing a new object to the `columnFilterLang` prop.
 * 
 * @example
 * 
 * ```json
 * {
    "no_filter":"Aucun",
    "contain":"Contiens",
    "not_contain":"Ne contiens pas",
    "equal":"Egale",
    "not_equal":"Différent",
    "start_with":"Commence par",
    "end_with":"Termine par",
    "greater_than":"Supérieur à",
    "greater_than_equal":"Sup. ou égale à",
    "less_than":"Inférieur à",
    "less_than_equal":"Inf. ou égale à",
    "is_null":"Est null",
    "is_not_null":"Non null"
    }
    ```
 */
export interface ColumnFilterLangProps {
    no_filter?: string;
    contain?: string;
    not_contain?: string;
    equal?: string;
    not_equal?: string;
    start_with?: string;
    end_with?: string;
    greater_than?: string;
    greater_than_equal?: string;
    less_than?: string;
    less_than_equal?: string;
    is_null?: string;
    is_not_null?: string;
}
</script>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, withDefaults } from 'vue';

const props = withDefaults(
    defineProps<{
        columnFilterLang?: ColumnFilterLangProps;
        column: any;
    }>(),
    {
        columnFilterLang: () => ({
            no_filter: 'No filter',
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
        }),
    }
);

onBeforeUnmount(() => {
    document.removeEventListener('click', close);
});
onMounted(() => {
    document.addEventListener('click', close);
});

const emit = defineEmits<{
    close: [];
    filterChange: [any];
}>();

const close = () => {
    emit('close');
};

const select = (condition: string) => {
    props.column.condition = condition;
    if (condition === '') {
        props.column.value = '';
    }

    emit('filterChange', props.column);
};
</script>
