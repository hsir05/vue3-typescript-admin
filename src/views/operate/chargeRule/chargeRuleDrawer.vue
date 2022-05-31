<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '440px' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="套餐价(元)" path="packagePrice">
        <n-input-number v-model:value="form.packagePrice" clearable placeholder="输入套餐价" />
      </n-form-item>
      <n-form-item label="包含里程(公)" path="containMileage">
        <n-input-number v-model:value="form.containMileage" clearable placeholder="输入包含里程" />
      </n-form-item>
      <n-form-item label="包含时长(分)" path="containDuration">
        <n-input-number v-model:value="form.containDuration" clearable placeholder="输入包含时长" />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存
        </n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { statusOptions, sexOptions } from "@/config/form";
import { FormInter } from "./type";
import { FormItemRule } from "naive-ui";
import { saveChargeRuleBase } from "@/api/operate/chargeRule";
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
    const title = ref("计费规则");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
      packagePrice: null,
      containMileage: null,
      containDuration: null,
    });

    function openDrawer(t: string) {
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          try {
            state.loading = true;
            let res = await saveChargeRuleBase(form.value);
            message.success(window.$tips[res.code]);
            handleSaveAfter();
            state.loading = false;
          } catch (err) {
            state.loading = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        packagePrice: null,
        containMileage: null,
        containDuration: null,
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
        packagePrice: {
          required: true,
          type: "number",
          trigger: ["input", "blur"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^1\d{10}$/.test(value);
          },
          message: "请填写正整数或两位小数",
        },
        containMileage: {
          required: true,
          type: "number",
          trigger: ["input", "blur"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^\+?[1-9][0-9]*$/.test(value);
          },
          message: "请填写正整数",
        },
        containDuration: {
          required: true,
          type: "number",
          trigger: ["input", "blur"],
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
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
