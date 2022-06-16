<template>
  <n-descriptions label-placement="left" bordered :column="2" class="mt-15px">
    <n-descriptions-item label="调整内容" :span="2">{{
      detail?.adjustContent
    }}</n-descriptions-item>
    <n-descriptions-item label="调整原因" :span="2">{{ detail?.adjustReason }}</n-descriptions-item>
    <n-descriptions-item label="调整人">{{ detail?.adjustUser }}</n-descriptions-item>
    <n-descriptions-item label="调整时间">{{ detail?.adjustTime }}</n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
interface DetailInter {
  orderInvalidNote: string | null;
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

const { detail } = toRefs(props);
</script>
