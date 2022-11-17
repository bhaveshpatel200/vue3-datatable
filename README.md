# @bhplugin/vue3-datatable

## Example

[Document & Demos](https://vue3-datatable-document.vercel.app)

## Install

#### NPM

```bash
npm install @bhplugin/vue3-datatable --save
```

#### Yarn

```bash
yarn add @bhplugin/vue3-datatable
```

#### Bower

```bash
bower install @bhplugin/vue3-datatable --save
```

## Usage

```html
<template>
  <vue3-datatable :rows="rows" :columns="cols" :totalRows="rows?.length">
  </vue3-datatable>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import Vue3Datatable from "@bhplugin/vue3-datatable";
  import "@bhplugin/vue3-datatable/dist/style.css";

  const cols = ref([
    { field: "id", title: "ID", width: "90px", filter: false },
    { field: "name", title: "Name" },
    { field: "username", title: "Username" },
    { field: "email", title: "Email" },
    { field: "phone", title: "Phone" },
    { field: "date", title: "Date", type: "date" },
    { field: "active", title: "Active", type: "bool" },
    { field: "age", title: "Age", type: "number" },
    { field: "address.city", title: "Address" },
    { field: "company.name", title: "Company" },
  ]);

  const rows = ref([
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496",
        },
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
      date: "Tue Sep 27 2022 22:19:57",
      age: 10,
      active: true,
    },
    .......
  ]);
</script>
```

## Props

| Props                | Type                    | Default                             | Description                         |
| -------------------- | :---------------------- | ----------------------------------- | ----------------------------------- |
| columns (required)   | array<colDef>           | []                                  | table columns                       |
| rows (required)      | array<any>              | []                                  | table rows                          |
| totalRows (required) | number                  | 0                                   | total number of rows                |
| skin                 | string                  | "table-striped table-hover"         | custom class for skin               |
| loading              | boolean                 | false                               | enable loader                       |
| hasCheckbox          | boolean                 | false                               | enable checkbox                     |
| search               | string                  | ""                                  | enable global search                |
| page                 | number                  | 1                                   | current page                        |
| pageSize             | number                  | 10                                  | number of rows per page             |
| pageSizeOptions      | array<number>           | [10, 20, 30, 50, 100]               | pagesize options                    |
| showPageSize         | boolean                 | true                                | enable pagesize options             |
| rowClass             | array<string>, function | ""                                  | custom row class                    |
| cellClass            | array<string>, function | ""                                  | custom cell class                   |
| sortable             | boolean                 | true                                | enable sorting                      |
| sortColumn           | string                  | "id"                                | name of sort column                 |
| sortDirection        | string                  | "asc"                               | sort direction (asc or desc)        |
| columnFilter         | boolean                 | false                               | enable individual column filter     |
| pagination           | boolean                 | true                                | enable pagination                   |
| showNumbers          | boolean                 | true                                | enable numbers pagination           |
| showNumbersCount     | number                  | 5                                   | show numbers of count in pagination |
| showFirstPage        | boolean                 | true                                | enable first page in pagination     |
| showLastPage         | boolean                 | true                                | enable last page in pagination      |
| firstArrow           | string                  | default arrow                       | custom arrow                        |
| lastArrow            | string                  | default arrow                       | custom arrow                        |
| previousArrow        | string                  | default arrow                       | custom arrow                        |
| nextArrow            | string                  | default arrow                       | custom arrow                        |
| paginationInfo       | string                  | "Showing {0} to {1} of {2} entries" | custom pagination info              |
| noDataContent        | string                  | No data available                   | custom no data message              |

## Columns options

| Props        | Type             | Default   | Description                                           |
| ------------ | :--------------- | --------- | ----------------------------------------------------- |
| isUnique     | boolean          | false     | db column is primary key or not                       |
| field        | string           | ""        | db column name                                        |
| title        | string           | ""        | display column name                                   |
| value        | string           | ""        | filter value if filter enabled                        |
| condition    | string           | "contain" | default condition for column filter if filter enabled |
| type         | string           | ""        | column type (string, date, number, bool)              |
| width        | string           | ""        | custom width of column                                |
| minWidth     | string           | ""        | custom minimum width of column                        |
| maxWidth     | string           | ""        | custom maximum width of column                        |
| hide         | boolean          | false     | show/hide column                                      |
| filter       | boolean          | true      | enable column filter                                  |
| search       | boolean          | true      | enabled global search                                 |
| sort         | boolean          | true      | enable sorting                                        |
| cellRenderer | function, string | true      | custom cell rendering                                 |

## Events

| Name           | Description                                   |
| -------------- | --------------------------------------------- |
| sortChange     | will trigger when sorting changed             |
| searchChange   | will trigger when search changed              |
| pageChange     | will trigger when page changed                |
| pageSizeChange | will trigger when pagesize changed            |
| rowSelect      | will trigger when row selected using checkbox |
| filterChange   | will trigger when column filter changed       |

## Methods

| Name                 | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| reset                | will reset all options like selected rows, filter, search, currennt page etc |
| getSelectedRows      | will returns all selected rows                                               |
| getColumnFilters     | will return all column filters                                               |
| clearSelectedRows    | will unselect all selected rows                                              |
| selectRow(index)     | will select row with the given index (non-existent row will be ignored)      |
| unselectRow(index)   | will unselect row with the given index (non-existent row will be ignored)    |
| isRowSelected(index) | will return true if the row with given index is selected                     |

## License

@bhplugin/vue3-datatable is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
