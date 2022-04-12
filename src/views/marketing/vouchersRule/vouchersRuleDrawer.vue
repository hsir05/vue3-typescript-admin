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
      <n-form-item label="消费规则名称" path="rule">
        <n-input v-model:value="form.rule" clearable placeholder="输入消费规则名称" />
      </n-form-item>

      <n-form-item label="使用限制金额(元)" path="limitAmount">
        <n-input-number v-model:value="form.limitAmount" clearable />
      </n-form-item>

      <n-form-item label="可使用的城市" path="cityCode">
        <n-select
          clearable
          filterable
          v-model:value="form.cityCode"
          placeholder="选择可使用的城市"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="可使用的订单类型" path="orderType">
        <n-select
          clearable
          filterable
          v-model:value="form.orderType"
          placeholder="选择可使用的订单类型"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="可使用的车型" path="vehcicle">
        <n-select
          clearable
          filterable
          v-model:value="form.vehcicle"
          placeholder="选择可使用的车型"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="可使用的时间" path="stageTime">
        <n-select
          clearable
          filterable
          v-model:value="form.stageTime"
          placeholder="选择可使用的时间"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="可使用的星期" path="stageWeek">
        <n-select
          clearable
          filterable
          v-model:value="form.stageWeek"
          placeholder="选择可使用的星期"
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
  name: "VouchersRuleDrawer",
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
      rule: null,
      limitAmount: null,
      cityCode: null,
      orderType: null,
      vehcicle: null,
      stageTime: null,
      stageWeek: null,
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
