<template>
  <n-descriptions label-placement="left" bordered :column="2" class="mt-15px">
    <n-descriptions-item label="结束服务地点" :span="2">{{
      detail?.driverEndServiceAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="服务时长"
      >{{ detail?.orderServiceDuration }} 分钟</n-descriptions-item
    >
    <n-descriptions-item label="服务里程"
      >{{ detail?.orderServiceMileage }} 公里</n-descriptions-item
    >
    <n-descriptions-item label="行程录音" :span="2">
      <n-tag v-for="(item, index) in fileData" :key="index"
        ><a :href="item.filePath" class="sound-link">{{ item.sourceName }}(点击下载)</a></n-tag
      >
    </n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs, ref, onMounted } from "vue";
import { getOrderSoundfile } from "@/api/operateOrder/operateOrder";
interface DetailInter {
  driverEndServiceAddress: string | null;
  orderServiceDuration: string | null;
  orderServiceMileage: string | null;
  orderNo: string;
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

interface FileInter {
  filePath: string;
  sourceName: string;
}
const fileData = ref<FileInter[]>([]);

onMounted(() => {
  getSoundFile();
});

const getSoundFile = async () => {
  try {
    let res = await getOrderSoundfile({ orderNo: detail.value.orderNo as string });
    console.log(res);
    fileData.value = res.data;
  } catch (err) {
    console.log(err);
  }
};

const { detail } = toRefs(props);
</script>
<style lang="scss" scoped>
.sound-link {
  color: #72afd2;
}
</style>
