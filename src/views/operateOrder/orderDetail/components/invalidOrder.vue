<template>
  <n-descriptions label-placement="left" bordered :column="1" class="mt-15px">
    <n-descriptions-item label="无效原因">{{ detail?.orderInvalidNote }}</n-descriptions-item>
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
