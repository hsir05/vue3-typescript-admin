<template>
  <n-drawer v-model:show="isDrawer" :width="width" placement="right">
    <n-drawer-content :title="title">
      <slot></slot>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  name: "Drawer",
  props: {
    title: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 305,
    },
  },
  emits: ["open-drawer", "close-drawer"],
  setup(props, { emit }) {
    const state = reactive({
      width: props.width,
      title: props.title,
      isDrawer: false,
    });

    function openDrawer() {
      state.isDrawer = true;
      emit;
    }
    function closeDrawer() {
      state.isDrawer = false;
    }

    return {
      ...toRefs(state),

      openDrawer,
      closeDrawer,
    };
  },
});
</script>
