<template>
  <div class="h-full box-border order-reserve-time">
    <div class="order-reserve-time-left">
      <n-data-table
        ref="table"
        :data="cityData.result"
        :columns="columns"
        class="box-border"
        min-height="560px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="order-reserve-time-right ml-10px"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, h } from "vue";
import { tableItemProps, tableDataItem } from "./type";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import cityData from "@/config/cityData.json";

export default defineComponent({
  name: "OrderReserveTime",
  setup() {
    const columns = [
      //     {
      //     title: "序号",
      //     key: "index",
      //     align: "center",
      //     width: 65,
      //     render(_: tableItemProps, rowIndex: number) {
      //       return h("span", `${rowIndex + 1}`);
      //     },
      //   },
      {
        title: "城市名称",
        key: "label",
        width: 120,
        align: "center",
      },
      {
        title: "城市编码",
        key: "value",
        width: 90,
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 90,
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    function handleEdit() {}

    return {
      cityData,
      columns,
      getRowKeyId: (row: tableItemProps) => row.id,
    };
  },
});
</script>
<style lang="scss" scoped>
.order-reserve-time {
  display: flex;
  align-content: flex-start;
  justify-content: space-between;

  &-left {
    width: 300px;
  }
  &-right {
    width: calc(100% - 300px - 10px);
  }
}
</style>
