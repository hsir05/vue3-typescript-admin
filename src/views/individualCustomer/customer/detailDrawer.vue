<template>
  <BasicDrawer v-model:show="isDrawer" title="个人客户信息" @on-close-after="onCloseAfter" />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "DetailDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    function openDrawer(record?: tableDataItem) {
      console.log(record);
      if (record) {
        console.log(record);
      }
      state.isDrawer = true;
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      ...toRefs(state),
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
