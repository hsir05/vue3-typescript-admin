<template>
  <n-drawer v-model:show="isDrawer" :width="width" placement="right">
    <n-drawer-content :title="title">
      <n-divider title-placement="center">主题</n-divider>
      
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive } from "vue";
export default defineComponent({
  name: "ProjectSetting",
  props: {
    title: {
      type: String,
      default: "项目配置",
    },
    width: {
      type: Number,
      default: 280,
    },
  },
  setup(props) {
    const state = reactive({
      width: props.width,
      title: props.title,
      isDrawer: false,
    });
    function openDrawer() {
      state.isDrawer = true;
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
