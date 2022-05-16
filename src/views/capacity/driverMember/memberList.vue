<template>
  <BasicDrawer v-model:show="isDrawer" title="会员列表" @on-close-after="onCloseAfter" />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  name: "MemberListDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    function openDrawer() {
      state.isDrawer = true;
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    function handleReset() {}

    return {
      ...toRefs(state),
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
