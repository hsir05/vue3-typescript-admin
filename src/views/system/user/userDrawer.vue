<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
export default defineComponent({
  name: "UserDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
    });

    const title = ref("菜单");

    function openDrawer(t: string) {
      title.value = t;
      state.isDrawer = true;
    }

    return {
      ...toRefs(state),
      title,
      openDrawer,
    };
  },
});
</script>
