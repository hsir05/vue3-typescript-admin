<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      size="large"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '400px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="会员名称" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输入会员名称" />
      </n-form-item>
      <n-form-item label="会员折扣" path="discount">
        <n-input v-model:value="form.discount" clearable placeholder="输入会员折扣" />
      </n-form-item>
      <n-form-item label="下单限制" path="limit">
        <n-input v-model:value="form.limit" clearable placeholder="输入下单限制" />
      </n-form-item>
      <n-form-item label="会员折扣" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输入会员折扣" />
      </n-form-item>
      <n-form-item label="下单限制" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输入下单限制" />
      </n-form-item>

      <n-form-item label="会员折扣" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输入会员折扣" />
      </n-form-item>
      <n-form-item label="下单限制" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输入下单限制" />
      </n-form-item>

      <n-form-item label="会员类型" path="type">
        <n-select v-model:value="form.type" placeholder="选择会员类型" :options="sexOptions" />
      </n-form-item>

      <n-form-item label="会员状态" path="status">
        <n-radio-group v-model:value="form.status">
          <n-space>
            <n-radio :value="item.value" v-for="item in statusOptions" :key="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="会员描述" path="descript">
        <n-input
          v-model:value="form.descript"
          type="textarea"
          placeholder="输入会员描述"
          round
          clearable
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
import { statusOptions, sexOptions } from "@/config/form";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "UserDrawer",
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
      name: null,
      discount: null,
      descript: null,
      status: null,
      limit: null,
      type: null,
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
        name: null,
        discount: null,
        descript: null,
        status: null,
        limit: null,
        type: null,
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
      formRef,
      title,
      rules: {},
      statusOptions,
      sexOptions,
      form,
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
