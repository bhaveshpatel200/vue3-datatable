<template>
  <tr key="hdrrow">
    <th
      v-if="props.all.hasCheckbox"
      :key="'chkall'"
      class="bh-w-px"
      :class="{
        'bh-sticky bh-bg-[#f6f7fa] bh-z-[1]':
          props.all.stickyHeader || props.all.stickyFirstColumn,
        'bh-top-0': props.all.stickyHeader,
        'bh-left-0': props.all.stickyFirstColumn,
      }"
    >
      <div class="bh-checkbox">
        <input
          ref="selectedAll"
          type="checkbox"
          @click.stop="emit('selectAll', $event.target.checked)"
        />
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
        class="bh-select-none bh-z-[1]"
        :class="[
          props.all.sortable && col.sort ? 'bh-cursor-pointer' : '',
          j === 0 && props.all.stickyFirstColumn
            ? 'bh-sticky bh-left-0 bh-bg-[#f6f7fa]'
            : '',
          props.all.hasCheckbox && j === 0 && props.all.stickyFirstColumn
            ? 'bh-left-[52px]'
            : '',
        ]"
        :style="{
          width: col.width,
          'min-width': col.minWidth,
          'max-width': col.maxWidth,
        }"
      >
        <div
          class="bh-flex bh-items-center"
          @click="
            props.all.sortable && col.sort && emit('sortChange', col.field)
          "
        >
          {{ col.title }}
          <span
            v-if="props.all.sortable && col.sort"
            class="bh-ml-3 bh-sort"
            :class="[props.currentSortColumn, props.currentSortDirection]"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <polygon
                points="3.11,6.25 10.89,6.25 7,1.75 "
                fill="currentColor"
                class="bh-text-black/20"
                :class="[
                  currentSortColumn === col.field &&
                  currentSortDirection === 'asc'
                    ? '!bh-text-primary'
                    : '',
                ]"
              ></polygon>
              <polygon
                points="7,12.25 10.89,7.75 3.11,7.75 "
                fill="currentColor"
                class="bh-text-black/20"
                :class="[
                  currentSortColumn === col.field &&
                  currentSortDirection === 'desc'
                    ? '!bh-text-primary'
                    : '',
                ]"
              ></polygon>
            </svg>
          </span>
        </div>

        <template v-if="props.all.columnFilter && !props.isFooter">
          <div v-if="col.filter" class="bh-filter bh-relative">
            <input
              v-if="col.type === 'string'"
              v-model.trim="col.value"
              type="text"
              class="form-control"
              @keyup="emit('filterChange')"
            />
            <input
              v-if="col.type === 'number'"
              v-model.number.trim="col.value"
              type="number"
              class="form-control"
              @keyup="emit('filterChange')"
            />
            <input
              v-else-if="col.type === 'date'"
              v-model="col.value"
              type="date"
              class="form-control"
              @change="emit('filterChange')"
            />
            <select
              v-else-if="col.type === 'bool'"
              v-model="col.value"
              class="form-control"
              @change="emit('filterChange')"
              @click="props.isOpenFilter = null"
            >
              <option :value="undefined">All</option>
              <option :value="true">True</option>
              <option :value="false">False</option>
            </select>

            <button
              v-if="col.type !== 'bool'"
              type="button"
              @click.stop="emit('toggleFilterMenu', col)"
            >
              <icon-filter class="bh-w-4" />
            </button>

            <column-filter
              v-show="props.isOpenFilter === col.field"
              :column="col"
              :type="col.type"
              @close="emit('toggleFilterMenu', null)"
              @filterChange="emit('filterChange')"
            />
          </div>
        </template>
      </th>
    </template>
  </tr>
</template>
<script setup lang="ts">
import { watch, ref } from "vue";
import columnFilter from "./column-filter.vue";
import iconCheck from "./icon-check.vue";
import iconDash from "./icon-dash.vue";
import iconFilter from "./icon-filter.vue";

const selectedAll: any = ref(null);

const props = defineProps([
  "all",
  "currentSortColumn",
  "currentSortDirection",
  "isOpenFilter",
  "isFooter",
  "checkAll",
]);

const emit = defineEmits([
  "selectAll",
  "sortChange",
  "filterChange",
  "toggleFilterMenu",
]);
const checkboxChange = () => {
  if (selectedAll.value) {
    selectedAll.value.indeterminate =
      props.checkAll !== 0 ? !props.checkAll : false;
    selectedAll.value.checked = props.checkAll;
  }
};
watch(() => props.checkAll, checkboxChange);
</script>
