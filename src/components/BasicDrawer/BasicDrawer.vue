<template>
  <n-drawer
    v-model:show="isDrawer"
    :width="width"
    :placement="placement"
    :on-mask-click="onMaskClick"
  >
    <n-drawer-content :title="title">
      <slot></slot>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { toRefs, ref } from "vue";
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
    type: String,
    defalut: "right",
  },
});
const isDrawer = ref(false);
const { title, width, placement } = toRefs(props);

// function openDrawer(){
//   isDrawer.value = true;
// };
//@ts-ignore
// function closeDrawer() {
//   isDrawer.value = false;
// };
const emit = defineEmits(["handleMaskClick"]);
const onMaskClick = () => {
  isDrawer.value = false;
  emit("handleMaskClick");
};
</script>
