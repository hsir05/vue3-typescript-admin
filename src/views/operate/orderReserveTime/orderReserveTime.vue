<template>
  <div class="h-full box-border order-reserve-time">
    <div class="order-reserve-time-left">
      <n-data-table
        ref="table"
        :data="cityData.result"
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 204px)"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="order-reserve-time-right ml-10px">
      <n-alert title="提示" type="warning" class="mb-10px">
        接单预留时间指为了不影响后续订单服务而预留出的时间,
        在这段预留出的时间内，不会再接到立即订单。 <br />
        如：专车业务预约订单的接单预留时间设置为60分钟， 则司机的待服务订单中有一个该类型订单，
        且用车时间在60分钟之内时，不会再接到立即订单。<br />
        新增或编辑接单预留时间时： 点击出现边框即可编辑接单预留时间，
        编辑完成后点击其他位置即可保存(预留时间单位为分钟)。 <br />
        删除接单预留时间时：将边框中的内容清空即可删除该接单预留时间
      </n-alert>

      <n-data-table
        :row-key="getRowKeyId"
        :columns="editColumns"
        :data="editData"
        :pagination="false"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref } from "vue";
import { tableItemProps, tableDataItem, tableEditDataItem } from "./type";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import cityData from "@/config/cityData.json";
// import { NInput } from 'naive-ui'

import ShowOrEdit from "./ShowOrEdit.vue";
export default defineComponent({
  name: "OrderReserveTime",
  setup() {
    const editData = ref([
      {
        id: "123rwrwer",
        orderBusinessType: "立即",
        orderType: "OT00003",
        reserveTime: 0,
        majorBus: "22",
        fastBus: "0",
        taxiBus: "0",
        cityCode: "110000",
        acceptOrderReserveTimeSettingId: "",
      },
      {
        id: "123rwr33wer",
        orderBusinessType: "预约",
        orderType: "OT00003",
        reserveTime: 0,
        majorBus: "1",
        fastBus: "0",
        taxiBus: "0",
        cityCode: "110000",
        acceptOrderReserveTimeSettingId: "",
      },
    ]);
    const columns = [
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

    const editColumns = [
      {
        title: "#",
        key: "orderBusinessType",
        width: 120,
        align: "center",
      },
      {
        title: "专车业务",
        key: "majorBus",
        width: 100,
        render(row: tableEditDataItem, index: number) {
          return h(ShowOrEdit as any, {
            value: row.majorBus,
            onUpdateValue(v: string) {
              editData.value[index].majorBus = v;
            },
          });
        },
      },
      {
        title: "快车业务",
        key: "fastBus",
        width: 90,
        align: "center",
        render(row: tableEditDataItem, index: number) {
          return h(ShowOrEdit as any, {
            value: row.fastBus,
            onUpdateValue(v: string) {
              editData.value[index].fastBus = v;
            },
          });
        },
      },
      {
        title: "出租车业务",
        key: "taxiBus",
        width: 90,
        align: "center",
        render(row: tableEditDataItem, index: number) {
          return h(ShowOrEdit as any, {
            value: row.taxiBus,
            onUpdateValue(v: string) {
              editData.value[index].taxiBus = v;
            },
          });
        },
      },
    ];

    function handleEdit() {}

    return {
      cityData,
      columns,
      getRowKeyId: (row: tableItemProps) => row.id,

      editColumns,
      editData,
    };
  },
});
</script>
<style lang="scss" scoped>
.order-reserve-time {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  &-left {
    width: 300px;
  }
  &-right {
    width: calc(100% - 300px - 10px);
    max-width: 1090px;
    padding: 5px;
    background-color: $white;
    box-sizing: border-box;
  }
}
</style>
