<template>
  <n-descriptions label-placement="left" bordered :column="3" class="mt-10px">
    <n-descriptions-item label="接单地点">{{
      detail?.driverAcceptOrderAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="派单类型">{{ detail?.orderDispatchType }}</n-descriptions-item>
    <n-descriptions-item label="司机姓名[工号]"
      >{{ detail?.driverFullName }}{{ detail?.driverNo }}</n-descriptions-item
    >
    <n-descriptions-item label="司机手机号">{{ detail?.driverPhone }}</n-descriptions-item>
    <n-descriptions-item label="所属运营企业">{{
      detail?.operationCompanyName
    }}</n-descriptions-item>
    <n-descriptions-item label="所属班级">{{
      detail?.operationCompanyDriverClazzName
    }}</n-descriptions-item>
    <n-descriptions-item label="车牌号">{{ detail?.plateNumber }}</n-descriptions-item>
    <n-descriptions-item label="车辆类型">{{ detail?.vehicleTypeName }}</n-descriptions-item>

    <n-descriptions-item label="车辆品牌/车系">{{ detail?.vehicleBrand }}</n-descriptions-item>
    <n-descriptions-item label="车辆颜色" :span="2">{{ detail?.vehicleColor }}</n-descriptions-item>
    <n-descriptions-item label="抽成比率">
      流量方抽成比率:{{ detail?.influxDivideRate }} 平台抽成比率:{{
        detail?.platformDivideRate
      }}
      代理商抽成比率:{{ detail?.agencyDivideRate }} 企业抽成比率:{{
        detail?.companyDivideRate
      }}
      司机抽成比率:{{ detail?.driverDivideRate }}
    </n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
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

  influxDivideRate: number | null;
  platformDivideRate: string | null;
  agencyDivideRate: string | null;
  companyDivideRate: string | null;
  driverDivideRate: string | null;
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

const { detail } = toRefs(props);
</script>
