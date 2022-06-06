<template>
  <n-descriptions label-placement="left" bordered :column="3" class="mt-15px">
    <n-descriptions-item label="到达上车地点" :span="3">{{
      detail?.driverArrivePickupAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="到达上车地点后等待时长"
      >{{ detail?.driverWaitPassengerDuration }} 分钟</n-descriptions-item
    >
    <n-descriptions-item label="等待中行驶里程"
      >{{ detail?.driverWaitPassengerMileage }} 公里</n-descriptions-item
    >
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
interface DetailInter {
  driverArrivePickupAddress: string | null;
  driverWaitPassengerDuration: string | null;
  driverWaitPassengerMileage: string | null;
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

const { detail } = toRefs(props);
</script>
