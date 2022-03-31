<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter" />
</template>
<script lang="ts">
import { defineComponent, toRefs, ref, reactive } from "vue";
export default defineComponent({
  name: "DriversDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("菜单");

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
    }

    function handleReset() {}

    return {
      ...toRefs(state),
      title,

      onCloseAfter,
      handleReset,
    };
  },
});
</script>
