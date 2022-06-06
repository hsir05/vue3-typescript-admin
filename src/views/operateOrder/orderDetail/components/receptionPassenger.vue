<template>
  <n-descriptions label-placement="left" bordered :column="3" class="mt-15px">
    <n-descriptions-item label="去接乘客地点" :span="3">{{
      detail?.customerCreateOrderAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="去接乘客行驶时长"
      >{{ detail?.driverReceptionPassengerDuration }} 分钟</n-descriptions-item
    >
    <n-descriptions-item label="去接乘客行驶里程"
      >{{ detail?.driverReceptionPassengerMileage }} 公里</n-descriptions-item
    >
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
interface DetailInter {
  customerCreateOrderAddress: string | null;
  driverReceptionPassengerDuration: string | null;
  driverReceptionPassengerMileage: string | null;
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

const { detail } = toRefs(props);
</script>
