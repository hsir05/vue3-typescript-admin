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
      <n-form-item label="代理商" path="agent">
        <n-input v-model:value="form.agent" clearable placeholder="输入代理商" />
      </n-form-item>
      <n-form-item label="运营企业编号" path="contacts">
        <n-input v-model:value="form.contacts" clearable placeholder="输入运营企业编号" />
      </n-form-item>
      <n-form-item label="代理商登录账号" path="account">
        <n-input v-model:value="form.account" clearable placeholder="输入代理商登录账号" />
      </n-form-item>

      <n-form-item label="代理商联系人" path="contacts">
        <n-input v-model:value="form.contacts" clearable placeholder="输入代理商联系人" />
      </n-form-item>

      <n-form-item label="代理运营企业" path="operateCity">
        <n-select
          clearable
          filterable
          v-model:value="form.operateCity"
          placeholder="选择代理运营企业"
          @update:value="handleUpdateValue"
          :options="cityData.result"
        />
      </n-form-item>

      <n-form-item label="联系人性别" path="sex">
        <n-select v-model:value="form.sex" placeholder="选择联系人性别" :options="sexOptions" />
      </n-form-item>
      <n-form-item label="联系人电话" path="phone">
        <n-input
          v-model:value="form.phone"
          clearable
          placeholder="输入联系人电话"
          :maxlength="11"
        />
      </n-form-item>

      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="form.status">
          <n-space>
            <n-radio :value="item.value" v-for="item in statusOptions" :key="item.value">{{
              item.label
            }}</n-radio>
          </n-space>
        </n-radio-group>
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
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { rules } from "./data";
import { statusOptions, sexOptions } from "@/config/form";
import { tableDataItem } from "./type";
import cityData from "@/config/cityData.json";

export default defineComponent({
  name: "AgentDrawer",
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

    function handleUpdateValue(_: string, option: SelectOption) {
      console.log(option);
      // console.log(toRaw(form.value));

      //    form.value.city = unref(option).label
      //    form.value.code = option.value
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
