<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
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
      <!-- <n-form-item label="客户手机号" path="phone">
        <n-input v-model:value="form.phone" clearable placeholder="输入客户手机号" />
      </n-form-item> -->
      <n-form-item label="客户手机号" path="phone">
        <n-select
          clearable
          filterable
          v-model:value="form.phone"
          placeholder="选择客户手机号"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="代金券名称" path="voucher">
        <n-input v-model:value="form.voucher" clearable placeholder="输入代金券名称" />
      </n-form-item>
      <n-form-item label="代金券面值(元)" path="voucherFaceValue">
        <n-input-number v-model:value="form.voucherFaceValue" clearable />
      </n-form-item>

      <n-form-item label="赠送数量" path="phone">
        <n-input-number v-model:value="form.voucherFaceValue" clearable />
      </n-form-item>

      <n-form-item label="消费规则" path="status">
        <n-select
          clearable
          filterable
          v-model:value="form.phone"
          placeholder="选择消费规则"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          size="large"
          class="ml-10px"
          @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "VouchersDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      voucherFaceValue: null,
      phone: null,
      startTime: null,
      endTime: null,
      voucher: null,
    });

    function openDrawer(t: string, record?: tableDataItem) {
      console.log(record);
      if (record) {
        // form.value = { ...form.value, ...record };
        message.error("打开");
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

    function handleUpdateValue() {}

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    function uploadChange(list: string[]) {
      console.log(list);
    }

    function handleReset() {}

    return {
      ...toRefs(state),
      title,
      formRef,
      form,
      rules: {},
      options: [],
      openDrawer,
      onCloseAfter,
      handleSaveAfter,
      handleValidate,
      handleReset,
      handleUpdateValue,
      uploadChange,
    };
  },
});
</script>
