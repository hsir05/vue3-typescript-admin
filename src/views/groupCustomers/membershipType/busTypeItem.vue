<template>
  <n-form
    ref="formRef"
    :rules="rules"
    :disabled="disabled"
    label-placement="left"
    :style="{ maxWidth: '380px' }"
    require-mark-placement="right-hanging"
    label-width="100"
    :model="form"
  >
    <n-divider title-placement="left">{{ `业务类型-${orderBusinessTypeName}` }}</n-divider>
    <n-form-item label="会员折扣" path="rate">
      <n-input-number v-model:value="form.rate" :min="0" clearable placeholder="输入会员折扣" />
    </n-form-item>
    <n-form-item label="下单限制" path="limit">
      <n-input-number v-model:value="form.limit" :min="0" clearable placeholder="输入下单限制" />
    </n-form-item>

    <n-button
      attr-type="button"
      :loading="loading"
      type="primary"
      @click="handleValidate"
      style="display: none"
      >保存</n-button
    >
  </n-form>
</template>
<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { FormInst } from "naive-ui";
// import { FormItem } from "./type"

const props = defineProps({
  rate: {
    type: Number,
    require: true,
    default: null,
  },
  limit: {
    type: Number,
    require: true,
    default: null,
  },
  orderBusinessType: {
    type: String,
    require: true,
    default: " ",
  },
  orderBusinessTypeName: {
    type: String,
    require: true,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const { disabled, loading, rate, limit, orderBusinessTypeName } = toRefs(props);

const emit = defineEmits(["validate"]);

const formRef = ref<FormInst | null>(null);
const form = ref({
  rate: rate,
  limit: limit,
});
const rules = {
  rate: { type: "number", required: true, trigger: ["blur", "input"], message: "请输入下单限制" },
  limit: { type: "number", required: true, trigger: ["blur", "input"], message: "请输入会员描述" },
};
function handleValidate(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      emit("validate");
    }
  });
}
</script>
