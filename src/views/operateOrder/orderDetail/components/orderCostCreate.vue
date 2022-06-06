<template>
  <n-descriptions label-placement="left" bordered :column="3" class="mt-15px">
    <n-descriptions-item label="结束服务地点" :span="3">{{
      detail?.driverEndServiceAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="服务时长"
      >{{ detail?.orderServiceDuration }} 分钟</n-descriptions-item
    >
    <n-descriptions-item label="服务里程"
      >{{ detail?.orderServiceMileage }} 公里</n-descriptions-item
    >
    <n-descriptions-item label="行程录音"
      >{{ detail?.orderServiceMileage }} 公里</n-descriptions-item
    >
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
interface DetailInter {
  driverEndServiceAddress: string | null;
  orderServiceDuration: string | null;
  orderServiceMileage: string | null;
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

const { detail } = toRefs(props);
</script>
