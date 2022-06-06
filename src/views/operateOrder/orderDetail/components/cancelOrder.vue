<template>
  <n-descriptions label-placement="left" bordered :column="2" class="mt-15px">
    <n-descriptions-item label="取消原因">{{ detail?.orderCancelReason }}</n-descriptions-item>

    <n-descriptions-item label="取消费用">{{ detail?.orderCancelCost }}</n-descriptions-item>

    <n-descriptions-item label="取消备注">{{ detail?.orderCancelNote }}</n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
interface DetailInter {
  orderCancelReason: string | null;
  orderCancelCost: string | null;
  orderCancelNote: string | null;
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

const { detail } = toRefs(props);
</script>
