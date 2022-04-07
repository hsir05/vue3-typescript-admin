<template>
  <div class="h-full overflow-hidden box-border bg-white">
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      class="mt-20px"
      :style="{ maxWidth: '500px', margin: '20px auto' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="可提现的星期" path="time">
        <n-select
          clearable
          multiple
          filterable
          style="width: 380px"
          v-model:value="form.time"
          placeholder="选择可提现的星期"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="可提现开始时间" path="time_start">
        <n-time-picker v-model:value="form.time_start" style="width: 380px" />
      </n-form-item>
      <n-form-item label="可提现开始时间" path="time_end">
        <n-time-picker v-model:value="form.time_end" style="width: 380px" />
      </n-form-item>

      <n-form-item label="时段内可提现次数" path="count">
        <n-input-number
          v-model:value="form.count"
          style="width: 380px"
          :min="0"
          clearable
          placeholder="时段内可提现次数"
        />
      </n-form-item>

      <n-form-item label="单次提现金额上限" path="limit">
        <n-input-number
          v-model:value="form.limit"
          style="width: 380px"
          :min="0"
          clearable
          placeholder="单次提现金额上限"
        />
      </n-form-item>

      <n-form-item label="会员描述" path="descript">
        <n-input
          v-model:value="form.descript"
          style="width: 380px"
          type="textarea"
          placeholder="输入会员描述"
          round
          clearable
        />
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
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "Withdrawal",
  setup() {
    const formRef = ref<FormInst | null>(null);
    const loading = ref(false);
    const message = useMessage();

    const form = ref<tableDataItem>({
      time: null,
      time_end: null,
      time_start: null,
      count: null,
      limit: null,
      descript: null,
    });

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          loading.value = true;
          console.log(unref(form));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleReset() {
      form.value = {
        time: null,
        time_end: null,
        time_start: null,
        count: null,
        limit: null,
        descript: null,
      };
      formRef.value?.restoreValidation();
    }

    return {
      form,
      loading,
      formRef,
      rules: {
        time: { required: true, trigger: ["blur", "input"], message: "请输入会员名称" },
        time_end: { required: true, trigger: ["blur", "input"], message: "请输入可提现开始时间" },
        time_start: { required: true, trigger: ["blur", "input"], message: "请输入可提现开始时间" },
        count: { required: true, trigger: ["blur", "input"], message: "请输入时段内可提现次数" },
        limit: { required: true, trigger: ["blur", "input"], message: "请输入单次提现金额上限" },
        descript: { required: true, trigger: ["blur", "input"], message: "请输入会员描述" },
      },
      options: [],

      handleValidate,
      handleReset,
    };
  },
});
</script>
