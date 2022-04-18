<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" width="1000" @on-close-after="onCloseAfter">
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
      <n-form-item label="司机姓氏" path="firstName">
        <n-input v-model:value="form.firstName" clearable placeholder="输入司机姓氏" />
      </n-form-item>
      <n-form-item label="司机名" path="secondName">
        <n-input v-model:value="form.secondName" clearable placeholder="输入司机名" />
      </n-form-item>
      <n-form-item label="司机性别" path="sex">
        <n-select v-model:value="form.sex" placeholder="司机性别" :options="sexOptions" />
      </n-form-item>
      <n-form-item label="司机手机号" path="phone">
        <n-input v-model:value="form.phone" clearable placeholder="输入司机手机号" />
      </n-form-item>
      <n-form-item label="司机民族" path="nation">
        <n-select
          clearable
          filterable
          v-model:value="form.nation"
          placeholder="司机民族"
          :options="nation.result"
        />
      </n-form-item>

      <n-form-item label="司机婚姻状况" path="maritalStatus">
        <n-select
          clearable
          filterable
          v-model:value="form.maritalStatus"
          placeholder="选择司机婚姻状况"
          :options="marital.result"
        />
      </n-form-item>

      <n-form-item label="司机生日" path="birthDay">
        <n-date-picker v-model:value="form.birthDay" type="date" clearable />
      </n-form-item>

      <n-form-item label="司机户口地址" path="address">
        <n-input v-model:value="form.address" clearable placeholder="输入司机户口地址" />
      </n-form-item>
      <n-form-item label="联系人姓名" path="contacts">
        <n-select
          v-model:value="form.contacts"
          placeholder="选择联系人姓名"
          :options="sexOptions"
        />
      </n-form-item>
      <n-form-item label="联系人手机号" path="phone">
        <n-input
          v-model:value="form.phone"
          clearable
          placeholder="输入联系人手机号"
          :maxlength="11"
        />
      </n-form-item>

      <n-form-item label="是否锁定" path="lock">
        <n-radio-group v-model:value="form.lock">
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
          :disabled="disabled"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          :disabled="disabled"
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
import { defineComponent, toRefs, ref, unref, reactive } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { sexOptions, statusOptions } from "@/config/form";
import nation from "@/config/nation.json";
import marital from "@/config/marital.json";
import { tableDataItem } from "./type";
import { rules } from "./data";
export default defineComponent({
  name: "DriversDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("司机信息");
    const message = useMessage();

    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      number: null,
      firstName: null,
      education: null,
      secondName: null,
      companyName: null,
      sex: 1,
      nation: null,
      phone: null,
      name: null,
      status: null,
      lock: 1,
    });

    function openDrawer(t: string, record?: tableDataItem | String) {
      console.log(record);
      if (record === "see") {
        state.disabled = true;
        state.isDrawer = true;
      } else if (record) {
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

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
    }

    function handleReset() {}

    return {
      ...toRefs(state),
      title,
      formRef,
      form,
      rules,
      sexOptions,
      nation,
      marital,
      statusOptions,

      onCloseAfter,
      handleReset,
      openDrawer,
      handleValidate,
    };
  },
});
</script>
