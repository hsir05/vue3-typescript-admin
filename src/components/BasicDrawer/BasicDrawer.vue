<template>
  <n-drawer
    v-model:show="isDrawer"
    :width="width"
    :placement="placement"
    :on-mask-click="onMaskClick"
    :on-update:show="handleCloseAfter"
  >
    <n-drawer-content :title="title">
      <slot></slot>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { toRefs, ref } from "vue";
import type { Placement } from "naive-ui/lib/drawer/src/DrawerBodyWrapper";
const props = defineProps({
  title: {
    type: String,
    default: "项目配置",
  },
  width: {
    type: Number,
    default: 305,
  },
  placement: {
    type: String as PropType<Placement>,
    defalut: "right",
  },
});
const isDrawer = ref(false);
// 响应式的引用
const { title, width, placement } = toRefs(props);
// @ts-ignore
// function openDrawer(){
//   isDrawer.value = true;
// };
//@ts-ignore
// function closeDrawer() {
//   isDrawer.value = false;
// };
const emit = defineEmits(["handleMaskClick", "onCloseAfter"]);
const onMaskClick = () => {
  isDrawer.value = false;
  emit("handleMaskClick");
};
const handleCloseAfter = () => {
  isDrawer.value = false;
  emit("onCloseAfter");
};
</script>
