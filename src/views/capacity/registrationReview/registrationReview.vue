<template>
  <div class="">
    <n-tabs type="segment">
      <n-tab-pane name="chap1" tab="平台未审核司机">
        <n-data-table
          :loading="loading"
          ref="table"
          striped
          :columns="columns"
          class="box-border"
          :row-key="getRowKeyId"
          :data="data"
          :pagination="pagination"
        />
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="平台审核通过司机">
        <n-data-table
          :loading="loading"
          ref="table"
          striped
          :columns="columns"
          class="box-border"
          :row-key="getRowKeyId"
          :data="data"
          :pagination="pagination"
        />
      </n-tab-pane>
      <n-tab-pane name="chap3" tab="平台审核为通过司机">
        <n-data-table
          :loading="loading"
          ref="table"
          striped
          :columns="columns"
          class="box-border"
          :row-key="getRowKeyId"
          :data="data"
          :pagination="pagination"
        />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h } from "vue";
import { tableDataItem } from "../agent/type";
export default defineComponent({
  name: "RegistrationReview",
  setup() {
    const loading = ref(false);
    const data = ref([{ id: "qweqwe" }]);

    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
    ];

    return {
      loading,
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.id,

      data,
      columns,
    };
  },
});
</script>
