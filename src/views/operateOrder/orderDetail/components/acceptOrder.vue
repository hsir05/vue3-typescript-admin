<template>
  <n-descriptions label-placement="left" bordered :column="3" class="mt-15px">
    <n-descriptions-item label="接单地点">{{
      detailItem?.driverAcceptOrderAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="派单类型">{{ detailItem?.orderDispatchType }}</n-descriptions-item>
    <n-descriptions-item label="司机姓名[工号]"
      >{{ detailItem?.driverFullName }}{{ detailItem?.driverNo }}</n-descriptions-item
    >
    <n-descriptions-item label="司机手机号">{{ detailItem?.driverPhone }}</n-descriptions-item>
    <n-descriptions-item label="所属运营企业" :span="2">{{
      detailItem?.operationCompanyName
    }}</n-descriptions-item>
    <n-descriptions-item label="所属班级">{{
      detailItem?.operationCompanyDriverClazzName || "暂无"
    }}</n-descriptions-item>
    <n-descriptions-item label="车牌号">{{ detailItem?.plateNumber }}</n-descriptions-item>
    <n-descriptions-item label="车辆类型">{{ detailItem?.vehicleTypeName }}</n-descriptions-item>

    <n-descriptions-item label="车辆品牌/车系">{{ detailItem?.vehicleBrand }}</n-descriptions-item>
    <n-descriptions-item label="车辆颜色" :span="2">{{
      detailItem?.vehicleColor
    }}</n-descriptions-item>
    <n-descriptions-item label="抽成比率">
      <n-tag
        type="success"
        v-if="detailItem?.influxDivideRate && detailItem?.influxDivideRate !== 0"
      >
        流量方抽成比率:{{ detailItem?.influxDivideRate * 100 }}%
      </n-tag>
      <n-tag type="success" class="ml-10px"
        >平台抽成比率:{{ detailItem?.platformDivideRate * 100 }}%</n-tag
      >
      <n-tag
        type="success"
        class="ml-10px"
        v-if="detailItem?.agencyDivideRate && detailItem?.agencyDivideRate !== 0"
        >代理商抽成比率:{{ detailItem?.agencyDivideRate * 100 }}%
      </n-tag>
      <n-tag
        type="success"
        class="ml-10px"
        v-if="detailItem?.companyDivideRate && detailItem?.companyDivideRate !== 0"
        >企业抽成比率:{{ detailItem?.companyDivideRate * 100 }}%</n-tag
      >
      <n-tag
        type="success"
        class="ml-10px"
        v-if="detailItem?.driverDivideRate && detailItem?.driverDivideRate !== 0"
        >司机抽成比率:{{ detailItem?.driverDivideRate * 100 }}%</n-tag
      >
    </n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs, ref, watch } from "vue";
interface DetailInter {
  driverAcceptOrderAddress: string | null;
  orderDispatchType: string | null;
  driverNo: string | null;
  driverFullName: string | null;
  driverPhone: string | null;
  operationCompanyName: string | null;
  plateNumber: string | null;
  operationCompanyDriverClazzName: string | null;
  vehicleBrand: string | null;
  vehicleTypeName: string | null;

  orderServiceDuration: string | null;
  vehicleColor: string | null;

  influxDivideRate: number;
  platformDivideRate: number;
  agencyDivideRate: number;
  companyDivideRate: number;
  driverDivideRate: number;
  orderDispatchRecordList: [];
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
  currentActiveDate: {
    type: Number,
    default: () => 1,
  },
});

const { detail, currentActiveDate } = toRefs(props);

interface ItemInter extends DetailInter {
  dispatchOrderTime: number;
}
const dispatchItem = ref<ItemInter | undefined>();
const detailItem = ref<DetailInter>();

detailItem.value = detail.value;

watch(currentActiveDate, () => {
  dispatchItem.value = detail.value.orderDispatchRecordList.find(
    (item: ItemInter) => item.dispatchOrderTime === currentActiveDate.value
  );
  if (dispatchItem.value) {
    detailItem.value = Object.assign(detail.value, dispatchItem.value);
    // detailItem.value = dispatchItem.value
  }
});

if (detail.value.orderDispatchRecordList && detail.value.orderDispatchRecordList.length > 0) {
  dispatchItem.value = detail.value.orderDispatchRecordList.find(
    (item: ItemInter) => item.dispatchOrderTime === currentActiveDate.value
  );
  if (dispatchItem.value) {
    detailItem.value = Object.assign(detail.value, dispatchItem.value);
  }
}
</script>
