<template>
  <n-descriptions label-placement="left" bordered :column="3" class="mt-15px">
    <n-descriptions-item label="开始服务地点" :span="3">{{
      detail?.driverBeginServiceAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="服务时长"
      >{{ detail?.orderServiceDuration }} 分钟</n-descriptions-item
    >
    <n-descriptions-item label="服务里程"
      >{{ detail?.orderServiceMileage }} 公里</n-descriptions-item
    >
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
interface DetailInter {
  driverBeginServiceAddress: string | null;
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
