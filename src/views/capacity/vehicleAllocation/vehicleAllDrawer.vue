<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter" />
</template>
<script lang="ts">
import { defineComponent, ref, unref, reactive, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "VehicleAllDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("菜单");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      agent: null,
      contacts: null,
      phone: null,
      account: null,
      operateCity: null,
      sex: null,
      create_time: null,
      status: null,
    });

    function openDrawer(t: string, record?: tableDataItem) {
      console.log(record);
      if (record) {
        form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));

          handleSaveAfter();

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        agent: null,
        contacts: null,
        phone: null,
        account: null,
        operateCity: null,
        sex: null,
        create_time: null,
        status: null,
      };
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
      formRef,
      title,
      onCloseAfter,
      openDrawer,
      handleValidate,
    };
  },
});
</script>
