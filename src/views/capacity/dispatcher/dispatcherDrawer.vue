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
      <n-form-item label="所在企业名称" path="enterpriseName">
        <n-select
          clearable
          filterable
          v-model:value="form.enterpriseName"
          placeholder="选择所在企业名称"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="值班调度人姓名" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输入紧急联系人姓名" />
      </n-form-item>
      <n-form-item label="值班调度人手机号" path="phone">
        <n-input
          v-model:value="form.phone"
          :maxlengn="11"
          clearable
          placeholder="输入紧急联系人手机号"
        />
      </n-form-item>

      <n-form-item label="值班调度人邮箱" path="email">
        <n-input v-model:value="form.email" clearable placeholder="输入值班调度人邮箱" />
      </n-form-item>

      <n-form-item label="值班开始时间" path="time_start">
        <n-time-picker v-model:value="form.time_start" />
      </n-form-item>
      <n-form-item label="值班结束时间" path="time_end">
        <n-time-picker v-model:value="form.time_end" />
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
import { FormItemRule } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "DispatcherDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const title = ref("企业紧急联系人");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      enterpriseName: null,
      name: null,
      phone: null,
      email: null,
      time_start: null,
      time_end: null,
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
        enterpriseName: null,
        name: null,
        phone: null,
        email: null,
        time_start: null,
        time_end: null,
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
      form,
      formRef,
      options: [],
      rules: {
        enterpriseName: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入所在企业名称",
        },
        enterpriseNum: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入所在企业编号",
        },
        name: { required: true, trigger: ["blur", "input"], message: "请输入紧急联系人姓名" },
        email: { required: true, trigger: ["blur", "input"], message: "请输入紧急联系人邮箱" },
        time_start: { required: true, trigger: ["blur", "input"], message: "请选择值班开始时间" },
        time_end: { required: true, trigger: ["blur", "input"], message: "请选择值班结束时间" },
        phone: {
          required: true,
          trigger: ["input"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^1\d{10}$/.test(value);
          },
          message: "请输入正确格式的电话号码",
        },
      },
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
