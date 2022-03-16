<template>
  <div class="bg-white mt-10px p-10px" style="calc(100% - 95px)">
    <!-- 表格 -->
    <n-data-table
      ref="table"
      striped
      v-bind="getBindValues"
      :scroll-x="1090"
      class="box-border"
      :min-height="getTableHeight"
      flex-height
      :row-key="getRowKeyId"
      :pagination="false"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, toRaw, unref, computed } from "vue";
import { basicProps } from "./props";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "SimpleTable",
  props: {
    ...basicProps,
  },
  setup(props) {
    const getTableHeight = computed(() => "calc(100vh - 95px - 280px)");

    const getBindValues = computed(() => {
      return {
        columns: toRaw(unref(props).columns),
        loading: toRaw(unref(props).loading),
        data: toRaw(unref(props).data),
      };
    });

    return {
      getTableHeight,
      getBindValues,
      getRowKeyId: (row: tableDataItem) => row.id,
    };
  },
});
</script>
