<template>
  <div
    class="bh-filter-menu bh-absolute bh-z-[1] bh-bg-white bh-shadow-md bh-rounded-md bh-top-full bh-right-0 bh-w-32 bh-mt-1"
  >
    <div class="bh-text-[13px] bh-font-normal bh-rounded bh-overflow-hidden" @click.stop="close">
      <button
        type="button"
        :class="{ active: props.column.condition === '' }"
        @click="select('')"
      >
        No filter
      </button>
      <template v-if="props.column.type === 'string'">
        <button
          type="button"
          :class="{ active: props.column.condition === 'contain' }"
          @click="select('contain')"
        >
          Contain
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'not_contain' }"
          @click="select('not_contain')"
        >
          Not contain
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'equal' }"
          @click="select('equal')"
        >
          Equal
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'not_equal' }"
          @click="select('not_equal')"
        >
          Not equal
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'start_with' }"
          @click="select('start_with')"
        >
          Starts with
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'end_with' }"
          @click="select('end_with')"
        >
          Ends with
        </button>
      </template>
      <template v-else-if="props.column.type === 'number'">
        <button
          type="button"
          :class="{ active: props.column.condition === 'equal' }"
          @click="select('equal')"
        >
          Equal
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'not_equal' }"
          @click="select('not_equal')"
        >
          Not Equal
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'greater_than' }"
          @click="select('greater_than')"
        >
          Greater than
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'greater_than_equal' }"
          @click="select('greater_than_equal')"
        >
          Greater than or equal
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'less_than' }"
          @click="select('less_than')"
        >
          Less than
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'less_than_equal' }"
          @click="select('less_than_equal')"
        >
          Less than or equal
        </button>
      </template>
      <template v-else-if="props.column.type === 'date'">
        <button
          type="button"
          :class="{ active: props.column.condition === 'equal' }"
          @click="select('equal')"
        >
          Equal
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'not_equal' }"
          @click="select('not_equal')"
        >
          Not equal
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'greater_than' }"
          @click="select('greater_than')"
        >
          Greater than
        </button>
        <button
          type="button"
          :class="{ active: props.column.condition === 'less_than' }"
          @click="select('less_than')"
        >
          Less than
        </button>
      </template>

      <button
        type="button"
        :class="{ active: props.column.condition === 'is_null' }"
        @click="select('is_null')"
      >
        Is null
      </button>
      <button
        type="button"
        :class="{ active: props.column.condition === 'is_not_null' }"
        @click="select('is_not_null')"
      >
        Not null
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

const props = defineProps(["column"]);

onBeforeUnmount(() => {
  document.removeEventListener("click", close);
});
onMounted(() => {
  document.addEventListener("click", close);
});
const emit = defineEmits(["close", "filterChange"]);

const close = () => {
  emit("close");
};

const select = (condition: any) => {
  props.column.condition = condition;
  if (condition === "") {
    props.column.value = "";
  }

  emit("filterChange", props.column);
};
</script>
