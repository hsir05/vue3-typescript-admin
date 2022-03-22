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
      <n-form-item label="运营企业名称" path="companyName">
        <n-input v-model:value="form.companyName" clearable placeholder="输入运营企业名称" />
      </n-form-item>
      <n-form-item label="运营企业编号" path="companyCode">
        <n-input v-model:value="form.companyCode" clearable placeholder="输入运营企业编号" />
      </n-form-item>
      <n-form-item label="社会统一信用代码" path="socityCode">
        <n-input v-model:value="form.socityCode" clearable placeholder="输入社会统一信用代码" />
      </n-form-item>
      <n-form-item label="代理商" path="agent">
        <n-input v-model:value="form.agent" clearable placeholder="输入代理商" />
      </n-form-item>

      <n-form-item label="运营城市名称" path="cityCode">
        <n-select
          clearable
          filterable
          v-model:value="form.cityCode"
          placeholder="选择运营城市"
          @update:value="handleUpdateValue"
          :options="cityData.result"
        />
      </n-form-item>

      <n-form-item label="运营城市编码">
        <n-input
          v-model:value="form.cityCode"
          clearable
          :disabled="true"
          placeholder="输入运营城市编码"
        />
      </n-form-item>

      <n-form-item label="管理员姓名" path="adminName">
        <n-input v-model:value="form.adminName" clearable placeholder="输入管理员姓名" />
      </n-form-item>
      <n-form-item label="管理员性别" path="sex">
        <n-select v-model:value="form.sex" placeholder="选择性别" :options="sexOptions" />
      </n-form-item>
      <n-form-item label="管理员电话号码" path="phone">
        <n-input v-model:value="form.phone" clearable placeholder="输入电话号码" :maxlength="11" />
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
import { defineComponent, reactive, toRaw, toRefs, ref, unref } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { rules } from "./data";
import { statusOptions, sexOptions } from "@/config/form";
import { tableDataItem } from "./type";
import cityData from "@/config/cityData.json";

export default defineComponent({
  name: "OprComDrawer",
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
      companyName: null,
      companyCode: null,
      socityCode: null,
      agent: null,
      cityCode: null,
      cityName: null,
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

    function handleUpdateValue(_: string, option: SelectOption) {
      console.log(option);
      // console.log(toRaw(form.value));
      form.value = {
        ...toRaw(form.value),
        cityName: option.label as string,
        cityCode: option.value as string,
      };
      console.log(form.value);

      //    form.value.city = unref(option).label
      //    form.value.code = option.value
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        companyName: null,
        companyCode: null,
        socityCode: null,
        agent: null,
        cityCode: null,
        cityName: null,
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
      rules,
      statusOptions,
      sexOptions,
      cityData,
      form,
      openDrawer,
      handleUpdateValue,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
