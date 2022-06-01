<template>
  <n-data-table
    ref="table"
    :data="orderData"
    :columns="orderColumns"
    class="box-border"
    :row-key="getRowKeyId"
    :pagination="false"
  />
</template>
<script lang="ts" setup>
import { toRefs, ref } from "vue";
import { tableDataItem } from "./type";
const getRowKeyId = (row: tableDataItem) => row.id;
const props = defineProps({
  id: {
    type: String,
    default: () => "",
  },
});
const { id } = toRefs(props);
console.log(id);

const orderData = ref([
  {
    id: "123123",
    vehicleType: "雷诺",
    orderLimit: "3",
    beforTime: "3",
    afterTime: "3",
  },
]);
const orderColumns = [
  {
    title: "车型",
    key: "vehicleType",
    width: 80,
    align: "center",
  },
  {
    title: "单量上限",
    key: "orderLimit",
    width: 80,
    align: "center",
  },
  {
    title: "用车前占用时间",
    key: "beforTime",
    width: 95,
    align: "center",
  },
  {
    title: "用车后占用时间",
    key: "afterTime",
    width: 95,
    align: "center",
  },
];
</script>
