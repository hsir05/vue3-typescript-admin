<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter" />
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { useMessage } from "naive-ui";
import { tableDataItem } from "../type";
export default defineComponent({
  name: "AdDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const title = ref("");
    const message = useMessage();

    function openDrawer(t: string, record?: tableDataItem) {
      console.log(record);
      if (record) {
        // form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      //   formRef.value?.validate((errors) => {
      //     if (!errors) {
      //       state.loading = true;
      //       state.disabled = true;
      //       console.log(unref(form));

      handleSaveAfter();

      //       message.success("验证成功");
      //     } else {
      //       console.log(errors);
      message.error("验证失败");
      //     }
      //   });
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      //   form.value = { name: null, account: null, email: null, sex: null, phone: null, status: 1 };
      //   formRef.value?.restoreValidation();
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
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
