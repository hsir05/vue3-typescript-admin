<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '460px' }"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="支付渠道" path="channel">
        <n-select
          clearable
          filterable
          v-model:value="form.channel"
          placeholder="选择支付渠道"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="充值比率" path="ratio">
        <n-input-number v-model:value="form.ratio" :min="0" clearable />
      </n-form-item>

      <n-form-item label="最低起充金额" path="minAmount">
        <n-input-number v-model:value="form.minAmount" clearable />
      </n-form-item>

      <n-form-item label="累计实充额度" path="cumulativeQuota">
        <n-input-number v-model:value="form.cumulativeQuota" clearable />
      </n-form-item>

      <n-form-item label="开始时间" path="startTime">
        <n-date-picker v-model:value="form.startTime" type="datetime" clearable />
      </n-form-item>

      <n-form-item label="结束时间" path="endTime">
        <n-date-picker v-model:value="form.endTime" type="datetime" clearable />
      </n-form-item>

      <n-form-item label="活动描述" path="remark">
        <n-input v-model:value="form.remark" type="textarea" clearable placeholder="输入活动描述" />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存</n-button
        >
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
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
  name: "RechargeActivity",
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
      channel: null,
      ratio: null,
      minAmount: null,
      cumulativeQuota: null,
      startTime: null,
      endTime: null,
      remark: null,
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
        channel: null,
        ratio: null,
        minAmount: null,
        cumulativeQuota: null,
        startTime: null,
        endTime: null,
        remark: null,
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
      title,
      formRef,
      form,
      options: [],
      rules: {
        startTime: { required: true, trigger: ["blur", "input"], message: "请选择广告生效时间" },
        endTime: { required: true, trigger: ["blur", "input"], message: "请选择广告失效时间" },
        adUrl: { required: true, trigger: ["blur", "input"], message: "请上传广告" },
      },

      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
