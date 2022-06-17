<template>
  <n-descriptions label-placement="left" bordered :column="2" class="mt-15px">
    <n-descriptions-item label="调整内容" style="width: 120px" :span="2">{{
      item?.adjustContent
    }}</n-descriptions-item>
    <n-descriptions-item label="调整原因" :span="2">{{ item?.adjustReason }}</n-descriptions-item>
    <n-descriptions-item label="调整人">{{ item?.adjustUser }}</n-descriptions-item>
    <n-descriptions-item label="调整时间">{{
      dayjs(item?.adjustTime).format("YYYY-MM-DD HH:mm:ss")
    }}</n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs, ref, watch } from "vue";
import dayjs from "dayjs";

interface ItemInter {
  adjustContent: string | null;
  adjustReason: string | null;
  adjustUser: string | null;
  adjustTime: number | null;
}
interface DetailInter {
  orderPriceAdjustRecordList: ItemInter[];
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
const item = ref();

watch(currentActiveDate, () => {
  item.value = detail.value.orderPriceAdjustRecordList.find(
    (item: ItemInter) => item.adjustTime === currentActiveDate.value
  );
});
item.value = detail.value.orderPriceAdjustRecordList.find(
  (item: ItemInter) => item.adjustTime === currentActiveDate.value
);
</script>
<style lang="scss" scoped>
:deep(.n-descriptions-table-header) {
  width: 130px;
}
</style>
