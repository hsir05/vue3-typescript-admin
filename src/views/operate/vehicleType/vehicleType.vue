<template>
  <div class="h-full box-border vehicle-type">
    <div class="simple-table">
      <n-data-table
        ref="table"
        striped
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="400px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="table-edit"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import { tableItemProps } from "./props";
export default defineComponent({
  name: "VehicleType",
  setup() {
    const data = ref([
      {
        orderType: "专车业务",
        vehicleType: "专车-经济型",
        lock: 0,
        id: 123123,
      },
    ]);

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 60,
        render(_: tableItemProps, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "订单业务类型",
        key: "orderType",
        width: 110,
        align: "center",
      },
      {
        title: "车辆类型名称",
        key: "vehicleType",
        width: 110,
        align: "center",
      },
      {
        title: "锁定",
        key: "lock",
        width: 65,
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        render(record: tableItemProps) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                onClick: handleSee.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    function handleSee() {}
    function handleEdit() {}

    return {
      data,
      columns,
      getRowKeyId: (row: tableItemProps) => row.id,
    };
  },
});
</script>
<style lang="scss" scoped>
.vehicle-type {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  background-color: $white;
  padding: 5px;
  .simple-table {
    width: 50%;
  }
  .table-edit {
    width: 50%;
  }
}
</style>
