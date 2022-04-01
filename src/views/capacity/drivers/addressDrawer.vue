<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" :width="700" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      size="large"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '440px' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="司机详细家庭地址" path="address">
        <n-input v-model:value="form.address" clearable placeholder="输入司机详细家庭地址" />
      </n-form-item>
    </n-form>

    <div class="text-center flex-center">
      <n-button
        attr-type="button"
        :loading="loading"
        size="large"
        type="primary"
        @click="handleValidate"
        >保存</n-button
      >
      <n-button attr-type="button" type="warning" size="large" class="ml-10px" @click="handleReset"
        >重置</n-button
      >
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { addressState } from "./type";
export default defineComponent({
  name: "AddressDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("司机家庭地址编辑");
    const message = useMessage();

    const formRef = ref<FormInst | null>(null);
    const form = ref<addressState>({
      address: null,
      lng: null,
      lat: null,
    });

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

    function openDrawer(t: string, record?: addressState) {
      console.log(record);
      if (!record) {
        state.disabled = true;
        state.isDrawer = true;
      } else if (record) {
        form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isDrawer = true;
    }

    function handleReset() {}

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
    }

    return {
      ...toRefs(state),
      title,
      formRef,
      form,
      rules: {
        address: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入司机的详细家庭地址",
        },
      },

      onCloseAfter,
      openDrawer,
      handleReset,
      handleValidate,
    };
  },
});
</script>
