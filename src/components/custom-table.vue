<template>
  <div
    class="bh-antialiased bh-relative bh-font-nunito bh-text-black bh-text-sm bh-font-normal"
  >
    <div
      class="bh-table-responsive"
      :class="{ 'bh-min-h-[300px]': curentLoader }"
    >
      <table :class="[props.skin]">
        <thead>
          <tr>
            <th v-if="props.hasCheckbox" :key="'chkall'" class="bh-w-px">
              <div class="bh-relative">
                <input
                  ref="selectedAll"
                  type="checkbox"
                  @click="selectAll($event.target.checked)"
                />
                <div>
                  <icon-check class="check" />
                  <icon-dash class="intermediate" />
                </div>
              </div>
            </th>
            <template v-for="col in columns">
              <th
                v-if="!col.hide"
                :key="col.field"
                class="bh-select-none"
                :class="[props.sortable && col.sort ? 'bh-cursor-pointer' : '']"
                :style="{
                  width: col.width,
                  'min-width': col.minWidth,
                  'max-width': col.maxWidth,
                }"
              >
                <div
                  class="bh-flex bh-items-center"
                  @click="props.sortable && col.sort && sortChange(col.field)"
                >
                  {{ col.title }}
                  <span
                    v-if="props.sortable && col.sort"
                    class="bh-ml-3 bh-sort"
                    :class="[currentSortColumn, currentSortDirection]"
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

                <template v-if="props.columnFilter">
                  <div v-if="col.filter" class="bh-filter bh-relative">
                    <input
                      v-if="col.type === 'string'"
                      v-model.trim="col.value"
                      type="text"
                      class="form-control"
                      @keyup="filterChange"
                    />
                    <input
                      v-if="col.type === 'number'"
                      v-model.number.trim="col.value"
                      type="number"
                      class="form-control"
                      @keyup="filterChange"
                    />
                    <input
                      v-else-if="col.type === 'date'"
                      v-model="col.value"
                      type="date"
                      class="form-control"
                      @change="filterChange"
                    />
                    <select
                      v-else-if="col.type === 'bool'"
                      v-model="col.value"
                      class="form-control"
                      @change="filterChange"
                      @click="isOpenFilter = null"
                    >
                      <option :value="undefined">All</option>
                      <option :value="true">True</option>
                      <option :value="false">False</option>
                    </select>

                    <button
                      v-if="col.type !== 'bool'"
                      type="button"
                      @click.stop="toggleFilterMenu(col)"
                    >
                      <icon-filter class="bh-w-4" />
                    </button>

                    <column-filter
                      v-show="isOpenFilter === col.field"
                      :column="col"
                      :type="col.type"
                      @close="isOpenFilter = null"
                      @filterChange="filterChange"
                    />
                  </div>
                </template>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-if="filterRowCount">
            <tr
              v-for="(item, i) in filterItems"
              :key="item[uniqueKey] ? item[uniqueKey] : i"
              :class="[
                typeof props.rowClass === 'function'
                  ? rowClass(item)
                  : props.rowClass,
              ]"
            >
              <td v-if="props.hasCheckbox">
                <div class="bh-relative">
                  <input
                    v-model="selected"
                    type="checkbox"
                    :value="item[uniqueKey] ? item[uniqueKey] : i"
                  />
                  <div>
                    <icon-check class="check" />
                  </div>
                </div>
              </td>
              <template v-for="col in props.columns">
                <td
                  v-if="!col.hide"
                  :key="col.field"
                  :class="[
                    typeof props.cellClass === 'function'
                      ? cellClass(item)
                      : props.cellClass,
                  ]"
                >
                  <template v-if="slots[col.field]">
                    <slot :name="col.field" :value="item"></slot>
                  </template>
                  <div
                    v-else-if="col.cellRenderer"
                    v-html="col.cellRenderer(item)"
                  ></div>
                  <template v-else>
                    {{ cellValue(item, col.field) }}
                  </template>
                </td>
              </template>
            </tr>
          </template>
          <tr v-else>
            <td :colspan="props.columns.length + 1">
              {{ props.noDataContent }}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="curentLoader"
        class="bh-absolute bh-inset-0 bh-bg-gray-200/50 bh-grid bh-place-content-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          style="margin: auto; background: rgb(241, 242, 243); display: block"
          width="64"
          height="64"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <path
            fill="none"
            stroke="#9ca3af"
            stroke-width="8"
            stroke-dasharray="42.76482137044271 42.76482137044271"
            d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
            stroke-linecap="round"
            style="transform: scale(0.8); transform-origin: 50px 50px"
          >
            <animate
              attributeName="stroke-dashoffset"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;1"
              values="0;256.58892822265625"
            ></animate>
          </path>
        </svg>
      </div>
    </div>
    <div v-if="props.pagination" class="bh-pagination bh-py-5">
      <div
        class="bh-flex bh-items-center bh-flex-wrap bh-flex-col sm:bh-flex-row bh-gap-4"
      >
        <div class="bh-pagination-info bh-flex bh-items-center">
          <span class="bh-mr-2">
            {{
              stringFormat(
                props.paginationInfo,
                filterRowCount ? offset : 0,
                limit,
                filterRowCount
              )
            }}
          </span>
          <select
            v-if="props.showPageSize"
            v-model="curentPageSize"
            class="bh-outline-0 focus:bh-ring-1 focus:bh-ring-[#e0e6ed]/40 bh-border bh-border-[#e0e6ed] bh-rounded bh-p-2"
          >
            <option
              v-for="option in props.pageSizeOptions"
              :value="option"
              :key="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div
          class="bh-pagination-number sm:bh-ml-auto bh-inline-flex bh-items-center bh-space-x-1"
        >
          <button
            v-if="props.showFirstPage"
            type="button"
            class="bh-page-item"
            :class="{ disabled: currentPage <= 1 }"
            @click="currentPage = 1"
          >
            <span v-if="props.firstArrow" v-html="props.firstArrow"> </span>
            <svg
              v-else
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 16 16"
            >
              <g fill="currentColor" fill-rule="evenodd">
                <path
                  d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
                <path
                  d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </g>
            </svg>
          </button>
          <button
            type="button"
            class="bh-page-item"
            :class="{ disabled: currentPage <= 1 }"
            @click="previousPage"
          >
            <span v-if="props.previousArrow" v-html="props.previousArrow">
            </span>
            <svg
              v-else
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          </button>

          <template v-if="props.showNumbers">
            <button
              v-for="page in paging"
              :key="page"
              type="button"
              class="bh-page-item"
              :class="{
                disabled: currentPage === page,
                'bh-active': page === currentPage,
              }"
              @click="movePage(page)"
            >
              {{ page }}
            </button>
          </template>

          <button
            type="button"
            class="bh-page-item"
            :class="{ disabled: currentPage >= maxPage }"
            @click="nextPage"
          >
            <span v-if="props.nextArrow" v-html="props.nextArrow"> </span>
            <svg
              v-else
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8L4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>

          <button
            v-if="props.showLastPage"
            type="button"
            class="bh-page-item"
            :class="{ disabled: currentPage >= maxPage }"
            @click="currentPage = maxPage"
          >
            <span v-if="props.lastArrow" v-html="props.lastArrow"> </span>
            <svg
              v-else
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 16 16"
            >
              <g fill="currentColor" fill-rule="evenodd">
                <path
                  d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8L3.646 2.354a.5.5 0 0 1 0-.708z"
                />
                <path
                  d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8L7.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUpdate,
  onMounted,
  Ref,
  ref,
  useSlots,
  watch,
} from "vue";
import columnFilter from "./column-filter.vue";
import iconCheck from "./icon-check.vue";
import iconDash from "./icon-dash.vue";
import iconFilter from "./icon-filter.vue";

const slots = useSlots();

interface colDef {
  isUnique: boolean;
  field: string;
  title: string;
  value: any;
  condition: any;
  type: string; // string|date|number|bool
  width: [number, string];
  minWidth: [number, string] | undefined;
  maxWidth: [number, string] | undefined;
  hide: boolean;
  filter: boolean; // column filter
  search: boolean; // global search
  sort: boolean;
  html?: boolean;
  cellRenderer?: [Function, string];
}

interface Props {
  loading?: boolean;
  isStatic?: boolean;
  skin?: string;
  totalRows?: number;
  rows?: Array<any>;
  columns?: Array<colDef>;
  hasCheckbox?: boolean;
  search?: string;
  columnChooser?: boolean;
  page?: number; // default: 1
  pageSize?: number; // default: 10
  pageSizeOptions?: Array<number>; // default: [10, 20, 30, 50, 100]
  showPageSize?: boolean;
  rowClass?: [Array<string>, Function];
  cellClass?: [Array<string>, Function];
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: string;
  columnFilter?: boolean;
  pagination?: boolean;
  showNumbers?: boolean;
  showNumbersCount?: number;
  showFirstPage?: boolean;
  showLastPage?: boolean;
  firstArrow?: string;
  lastArrow?: string;
  nextArrow?: string;
  previousArrow?: string;
  paginationInfo?: string; // default: "Showing {0} to {1} of {2} entries"
  noDataContent?: string; // default: "No data available"
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isStatic: true,
  skin: "table-striped table-hover",
  totalRows: 0,
  rows: () => [],
  columns: () => [],
  hasCheckbox: false,
  search: "",
  columnChooser: false,
  page: 1,
  pageSize: 10,
  pageSizeOptions: () => [10, 20, 30, 50, 100],
  showPageSize: true,
  rowClass: <never>[],
  cellClass: <never>[],
  cellRenderer: null,
  sortable: false,
  sortColumn: "id",
  sortDirection: "asc",
  columnFilter: false,
  pagination: true,
  showNumbers: true,
  showNumbersCount: 5,
  showFirstPage: true,
  showLastPage: true,
  firstArrow: "",
  lastArrow: "",
  nextArrow: "",
  previousArrow: "",
  paginationInfo: "Showing {0} to {1} of {2} entries",
  noDataContent: "No data available",
});

// set default columns values
for (const item of props.columns || []) {
  const type = item.type?.toLowerCase() || "string";
  item.type = type;
  item.isUnique = item.isUnique !== undefined ? item.isUnique : false;
  item.hide = item.hide !== undefined ? item.hide : false;
  item.filter = item.filter !== undefined ? item.filter : true;
  item.search = item.search !== undefined ? item.search : true;
  item.sort = item.sort !== undefined ? item.sort : true;
  item.html = item.html !== undefined ? item.html : false;
  item.condition = !type || type === "string" ? "contain" : "equal";
}

const filterItems: Ref<Array<any>> = ref([]);
const currentPage = ref(props.page);
const curentPageSize = ref(props.pageSize);
const currentSortColumn = ref(props.sortColumn);
const currentSortDirection = ref(props.sortDirection);
const filterRowCount = ref(props.totalRows);
const selected: Ref<Array<any>> = ref([]);
const selectedAll: any = ref(null);
const curentLoader = ref(props.loading);
const curentSearch = ref(props.search);
const oldColumns = props.columns;

const isOpenFilter: any = ref(null);

onMounted(() => {
  filterRows();
});
const emit = defineEmits([
  "sortChange",
  "searchChange",
  "pageChange",
  "pageSizeChange",
  "rowSelect",
  "filterChange",
]);
defineExpose({
  reset() {
    reset();
  },
  getSelectedRows() {
    return getSelectedRows();
  },
  getColumnFilters() {
    return getColumnFilters();
  },
  clearSelectedRows() {
    return clearSelectedRows();
  },
  selectRow(index) {
    selectRow(index);
  },
  unselectRow(index) {
    unselectRow(index);
  },
  isRowSelected(index) {
    return isRowSelected(index);
  },
});

const stringFormat = (template: string, ...args: any[]) => {
  return template.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};

const uniqueKey = computed(() => {
  const col = props.columns.find((d) => d.isUnique);

  return col?.field || null;
});

// Maximum number of pages
const maxPage = computed(() => {
  const totalPages =
    <number>curentPageSize.value < 1
      ? 1
      : Math.ceil(<number>filterRowCount.value / <number>curentPageSize.value);
  return Math.max(totalPages || 0, 1);
});

// The starting value of the page number
const offset = computed(() => {
  return (currentPage.value - 1) * <number>curentPageSize.value + 1;
});

// Maximum number of pages
const limit = computed(() => {
  const limit = currentPage.value * <number>curentPageSize.value;
  return <number>filterRowCount.value >= limit ? limit : filterRowCount.value;
});

// Paging array
const paging = computed(() => {
  let startPage: number, endPage: number;
  let isMaxSized =
    typeof props.showNumbersCount !== "undefined" &&
    <number>props.showNumbersCount < maxPage.value;
  // recompute if maxSize
  if (isMaxSized) {
    // Current page is displayed in the middle of the visible ones
    startPage = Math.max(
      currentPage.value - Math.floor(<number>props.showNumbersCount / 2),
      1
    );
    endPage = startPage + <number>props.showNumbersCount - 1;

    // Adjust if limit is exceeded
    if (endPage > maxPage.value) {
      endPage = maxPage.value;
      startPage = endPage - <number>props.showNumbersCount + 1;
    }
  } else {
    startPage = 1;
    endPage = maxPage.value;
  }

  const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
    (i) => startPage + i
  );

  return pages;
});

const filterRows = () => {
  curentLoader.value = true;
  let rows = props.rows || [];

  props.columns?.forEach((d) => {
    if (
      d.filter &&
      ((d.value !== undefined && d.value !== null && d.value !== "") ||
        d.condition === "is_null" ||
        d.condition == "is_not_null")
    ) {
      // string filters
      if (d.type === "string") {
        if (d.condition === "contain") {
          rows = rows.filter((item) => {
            return item[d.field]
              ?.toString()
              .toLowerCase()
              .includes(d.value.toLowerCase());
          });
        } else if (d.condition === "not_contain") {
          rows = rows.filter((item) => {
            return !item[d.field]
              ?.toString()
              .toLowerCase()
              .includes(d.value.toLowerCase());
          });
        } else if (d.condition === "equal") {
          rows = rows.filter((item) => {
            return (
              item[d.field]?.toString().toLowerCase() === d.value.toLowerCase()
            );
          });
        } else if (d.condition === "not_equal") {
          rows = rows.filter((item) => {
            return (
              item[d.field]?.toString().toLowerCase() !== d.value.toLowerCase()
            );
          });
        } else if (d.condition == "start_with") {
          rows = rows.filter((item) => {
            return (
              item[d.field]
                ?.toString()
                .toLowerCase()
                .indexOf(d.value.toLowerCase()) === 0
            );
          });
        } else if (d.condition == "end_with") {
          rows = rows.filter((item) => {
            return (
              item[d.field]
                ?.toString()
                .toLowerCase()
                .substr(d.value.length * -1) === d.value.toLowerCase()
            );
          });
        }
      }
      // number filters
      else if (d.type === "number") {
        if (d.condition === "equal") {
          rows = rows.filter((item) => {
            return (
              item[d.field] && parseFloat(item[d.field]) === parseFloat(d.value)
            );
          });
        } else if (d.condition === "not_equal") {
          rows = rows.filter((item) => {
            return (
              item[d.field] && parseFloat(item[d.field]) !== parseFloat(d.value)
            );
          });
        } else if (d.condition === "greater_than") {
          rows = rows.filter((item) => {
            return (
              item[d.field] && parseFloat(item[d.field]) > parseFloat(d.value)
            );
          });
        } else if (d.condition === "greater_than_equal") {
          rows = rows.filter((item) => {
            return (
              item[d.field] && parseFloat(item[d.field]) >= parseFloat(d.value)
            );
          });
        } else if (d.condition === "less_than") {
          rows = rows.filter((item) => {
            return (
              item[d.field] && parseFloat(item[d.field]) < parseFloat(d.value)
            );
          });
        } else if (d.condition === "less_than_equal") {
          rows = rows.filter((item) => {
            return (
              item[d.field] && parseFloat(item[d.field]) <= parseFloat(d.value)
            );
          });
        }
      }
      // date filters
      else if (d.type === "date") {
        if (d.condition === "equal") {
          rows = rows.filter((item) => {
            return item[d.field] && dateFormat(item[d.field]) === d.value;
          });
        } else if (d.condition === "not_equal") {
          rows = rows.filter((item) => {
            return item[d.field] && dateFormat(item[d.field]) !== d.value;
          });
        } else if (d.condition === "greater_than") {
          rows = rows.filter((item) => {
            return item[d.field] && dateFormat(item[d.field]) > d.value;
          });
        } else if (d.condition === "less_than") {
          rows = rows.filter((item) => {
            return item[d.field] && dateFormat(item[d.field]) < d.value;
          });
        }
      }
      // boolean filters
      else if (d.type === "bool") {
        rows = rows.filter((item) => {
          return item[d.field] === d.value;
        });
      }

      if (d.condition === "is_null") {
        rows = rows.filter((item) => {
          return item[d.field] == null || item[d.field] == "";
        });
        d.value = "";
      } else if (d.condition === "is_not_null") {
        d.value = "";
        rows = rows.filter((item) => {
          return item[d.field];
        });
      }
    }
  });

  if (curentSearch.value && rows.length) {
    let final: Array<any> = [];

    const keys = (props.columns || [])
      .filter((d) => d.search && !d.hide)
      .map((d) => {
        return d.field;
      });

    for (var j = 0; j < rows.length; j++) {
      for (var i = 0; i < keys.length; i++) {
        if (
          cellValue(rows[j], keys[i])
            ?.toString()
            .toLowerCase()
            .includes(curentSearch.value.toLowerCase())
        ) {
          final.push(rows[j]);
          break;
        }
      }
    }

    rows = final;
  }

  // sort rows
  var collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  const sortOrder = currentSortDirection.value === "desc" ? -1 : 1;
  const arr = <any>currentSortColumn?.value?.split(".");

  rows.sort((a: any, b: any): number => {
    if (arr.length === 2) {
      return (
        collator.compare(a[arr[0]]?.[arr[1]], b[arr[0]]?.[arr[1]]) * sortOrder
      );
    } else if (arr.length === 3) {
      return (
        collator.compare(
          a[arr[0]]?.[arr[1]]?.[arr[2]],
          b[arr[0]]?.[arr[1]]?.[arr[2]]
        ) * sortOrder
      );
    } else if (arr.length === 4) {
      return (
        collator.compare(
          a[arr[0]]?.[arr[1]]?.[arr[2]]?.[arr[3]],
          b[arr[0]]?.[arr[1]]?.[arr[2]]?.[arr[3]]
        ) * sortOrder
      );
    } else if (arr.length === 5) {
      return (
        collator.compare(
          a[arr[0]]?.[arr[1]]?.[arr[2]]?.[arr[3]]?.[arr[4]],
          b[arr[0]]?.[arr[1]]?.[arr[2]]?.[arr[3]]?.[arr[4]]
        ) * sortOrder
      );
    } else {
      return (
        collator.compare(
          a[<any>currentSortColumn.value],
          b[<any>currentSortColumn.value]
        ) * sortOrder
      );
    }
  });

  filterRowCount.value = rows.length || 0;

  const result = rows.slice(offset.value - 1, <number>limit.value);

  filterItems.value = result || [];

  curentLoader.value = false;
};
watch(
  () => props.loading,
  () => {
    curentLoader.value = props.loading;
  }
);

const toggleFilterMenu = (col: colDef) => {
  if (isOpenFilter.value === col.field) {
    isOpenFilter.value = null;
  } else {
    isOpenFilter.value = col.field;
  }
};

// previous page
const previousPage = () => {
  if (currentPage.value == 1) {
    return false;
  }
  currentPage.value--;
  // filterRows();
};

// page change
const movePage = (page: number) => {
  currentPage.value = page;
  // filterRows();
};

// next page
const nextPage = () => {
  if (currentPage.value >= maxPage.value) {
    return false;
  }
  currentPage.value++;
  // filterRows();
};

// page changed
const changePage = () => {
  selectAll(false);

  filterRows();
  emit("pageChange", currentPage.value);
};
watch(() => currentPage.value, changePage);

// row update
const changeRows = () => {
  currentPage.value = 1;
  selectAll(false);

  filterRows();
};
watch(() => props.rows, changeRows);

// pagesize changed
const changePageSize = () => {
  currentPage.value = 1;
  selectAll(false);

  filterRows();
  emit("pageSizeChange", curentPageSize.value);
};
watch(() => curentPageSize.value, changePageSize);

// sorting
const sortChange = (field: string) => {
  let direction = "asc";
  if (field == currentSortColumn.value) {
    if (currentSortDirection.value === "asc") {
      direction = "desc";
    }
  }
  let offset = (currentPage.value - 1) * <number>curentPageSize.value;
  let limit = curentPageSize.value;
  currentSortColumn.value = field;
  currentSortDirection.value = direction;

  selectAll(false);
  filterRows();
  emit("sortChange", { offset, limit, field, direction });
};

// checkboax
const checkboxChange = (value: any) => {
  if (selectedAll.value) {
    selectedAll.value.indeterminate =
      value.length &&
      filterItems.value.length &&
      value.length !== filterItems.value.length;

    selectedAll.value.checked =
      value.length &&
      filterItems.value.length &&
      value.length === filterItems.value.length;
  }

  const rows = filterItems.value.filter((d, i) =>
    selected.value.includes(uniqueKey.value ? d[uniqueKey.value as never] : i)
  );

  emit("rowSelect", rows);
};
watch(() => selected.value, checkboxChange);
const selectAll = (checked: any) => {
  if (checked) {
    selected.value = filterItems.value.map((d, i) =>
      uniqueKey.value ? d[uniqueKey.value as never] : i
    );
  } else {
    selected.value = [];
  }
};

// columns filter
const filterChange = () => {
  currentPage.value = 1;
  selectAll(false);
  filterRows();

  emit("filterChange", props.columns);
};
// watch(() => props.columns, filterChange, { deep: true });

// search
const changeSearch = () => {
  // if (currentPage.value === 1) {
  currentPage.value = 1;
  selectAll(false);
  filterRows();
  // } else {
  // currentPage.value = 1;
  // }
  emit("searchChange", curentSearch.value);
};
watch(() => props.search, changeSearch);
watch(
  () => props.search,
  () => {
    curentSearch.value = props.search;
  }
);

const cellValue = (item: object, field: string) => {
  if (field.includes(".")) {
    const arr = field.split(".");
    if (arr.length === 5) {
      return item[arr[0]]?.[arr[1]]?.[arr[2]]?.[arr[3]]?.[arr[4]];
    } else if (arr.length === 4) {
      return item[arr[0]]?.[arr[1]]?.[arr[2]]?.[arr[3]];
    } else if (arr.length === 3) {
      return item[arr[0]]?.[arr[1]]?.[arr[2]];
    }
    return item[arr[0]]?.[arr[1]];
  }
  return item?.[field];
};

const dateFormat = (date: any) => {
  try {
    if (!date) {
      return "";
    }
    const dt = new Date(date);
    const day = dt.getDate();
    const month = dt.getMonth() + 1;
    const year = dt.getFullYear();

    return (
      year +
      "-" +
      (month > 9 ? month : "0" + month) +
      "-" +
      (day > 9 ? day : "0" + day)
    );
  } catch {}
  return "";
};

// methods
const reset = () => {
  props.columns?.forEach((d, i) => {
    d = oldColumns[i];
  });
  curentSearch.value = "";
  currentPage.value = 1;
  currentSortColumn.value = "id";
  currentSortDirection.value = "asc";
  selectAll(false);
  filterRows();
};
const getSelectedRows = () => {
  const rows = filterItems.value.filter((d, i) =>
    selected.value.includes(uniqueKey.value ? d[uniqueKey.value as never] : i)
  );
  return rows;
};
const getColumnFilters = () => {
  return props.columns;
};
const clearSelectedRows = () => {
  selected.value = [];
};
const selectRow = (index) => {
  const rows = filterItems.value.find((d, i) => i === index);
  if (rows) {
    const exist = selected.value.includes(
      uniqueKey.value ? rows[uniqueKey.value as never] : index
    );
    if (!exist) {
      selected.value.push(
        uniqueKey.value ? rows[uniqueKey.value as never] : index
      );
    }
  }
};
const unselectRow = (index) => {
  const rows = filterItems.value.find((d, i) => i === index);
  if (rows) {
    const exist = selected.value.includes(
      uniqueKey.value ? rows[uniqueKey.value as never] : index
    );
    if (exist) {
      selected.value = selected.value.filter(
        (d) => d !== (uniqueKey.value ? rows[uniqueKey.value as never] : index)
      );
    }
  }
};
const isRowSelected = (index) => {
  const rows = filterItems.value.find((d, i) => i === index);

  if (rows) {
    return selected.value.includes(
      uniqueKey.value ? rows[uniqueKey.value as never] : index
    );
  }
  return false;
};
</script>
