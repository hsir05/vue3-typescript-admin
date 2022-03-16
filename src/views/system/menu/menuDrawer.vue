<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter" />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst } from "naive-ui";
// import { tableDataItem } from "./type";
export default defineComponent({
  name: "MenuDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const formRef = ref<FormInst | null>(null);

    const title = ref("菜单");

    // const form = ref<tableDataItem>({
    //   name: null,
    //   account: null,
    //   email: null,
    //   sex: null,
    //   phone: null,
    //   id: null,
    //   status: 1,
    // });

    function openDrawer(t: string) {
      title.value = t;
      state.isDrawer = true;
    }

    function handleReset() {
      //   form.value = { name: null, account: null, email: null, sex: null, phone: null, status: 1 };
      formRef.value?.restoreValidation();
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      title,
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
