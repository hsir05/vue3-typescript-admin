<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter" />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
export default defineComponent({
  name: "MemberListDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("会员列表");

    function openDrawer(t: string) {
      title.value = t;
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
      title,
      ...toRefs(state),

      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
