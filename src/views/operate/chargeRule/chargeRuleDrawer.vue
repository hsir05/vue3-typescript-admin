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
      <n-form-item label="套餐价(元)" path="price">
        <n-input v-model:value="form.price" clearable placeholder="输入套餐价" />
      </n-form-item>
      <n-form-item label="包含里程(公)" path="distance">
        <n-input v-model:value="form.distance" clearable placeholder="输入包含里程" />
      </n-form-item>
      <n-form-item label="包含时长(分)" path="time">
        <n-input v-model:value="form.time" clearable placeholder="输入包含时长" />
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
import { statusOptions, sexOptions } from "@/config/form";
import { tableDataItem } from "./type";
import { FormItemRule } from "naive-ui";
export default defineComponent({
  name: "ChargeRuleDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      openCityData: [],
      disabled: false,
    });
    const title = ref("菜单");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      ruleDescript: null,
      orderType: null,
      vehicleType: null,
      price: null,
      distance: null,
      time: null,
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
        ruleDescript: null,
        orderType: null,
        vehicleType: null,
        price: null,
        distance: null,
        time: null,
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
      rules: {
        // price: { required: true, trigger: ["blur", "input"], message: "请输入套餐价" },
        // distance: { required: true, trigger: ["blur", "input"], message: "请填写正整数" },
        // time: { required: true, trigger: ["blur", "input"], message: "请填写正整数" },

        price: {
          required: true,
          trigger: ["input"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^1\d{10}$/.test(value);
          },
          message: "请填写正整数或两位小数",
        },
        distance: {
          required: true,
          trigger: ["input"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^\+?[1-9][0-9]*$/.test(value);
          },
          message: "请填写正整数",
        },
        time: {
          required: true,
          trigger: ["input"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^\+?[1-9][0-9]*$/.test(value);
          },
          message: "请填写正整数",
        },
      },
      statusOptions,
      sexOptions,
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
