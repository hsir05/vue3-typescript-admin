<template>
  <n-form
    ref="formItemRef"
    :rules="rules"
    :disabled="disabled"
    label-placement="left"
    :style="{ maxWidth: '380px' }"
    require-mark-placement="right-hanging"
    label-width="100"
    :model="formItem"
  >
    <n-divider title-placement="left" style="margin-top: 10px">{{
      `业务类型-${orderBusinessTypeName}`
    }}</n-divider>
    <n-form-item label="会员折扣" path="rate">
      <n-input-number v-model:value="formItem.rate" :min="0" clearable placeholder="输入会员折扣" />
    </n-form-item>
    <n-form-item label="下单限制" path="limit">
      <n-input-number
        v-model:value="formItem.limit"
        :min="0"
        clearable
        placeholder="输入下单限制"
      />
    </n-form-item>

    <n-button
      attr-type="button"
      :loading="loading"
      style="display: none"
      type="primary"
      @click="formItemSubmit"
      >保存</n-button
    >
  </n-form>
</template>
<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { FormInst } from "naive-ui";
import { FormItemInter } from "./type";

const props = defineProps({
  rate: {
    type: Number as PropType<number | null>,
    require: true,
    default: null,
  },
  limit: {
    type: Number as PropType<number | null>,
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
const { disabled, loading, orderBusinessTypeName } = toRefs(props);

const emit = defineEmits(["validate"]);

const formItemRef = ref<FormInst | null>(null);
const formItem = ref<FormItemInter>({
  rate: props.rate,
  limit: props.limit,
  orderBusinessType: props.orderBusinessType,
});

const rules = {
  rate: { type: "number", required: true, trigger: ["blur", "input"], message: "请输入下单限制" },
  limit: { type: "number", required: true, trigger: ["blur", "input"], message: "请输入会员描述" },
};

function formItemSubmit() {
  formItemRef.value?.validate((errors) => {
    if (!errors) {
      emit("validate", true, {
        rate: formItem.value.rate,
        limit: formItem.value.limit,
        orderBusinessType: formItem.value.orderBusinessType,
        orderBusinessTypeName: props.orderBusinessTypeName,
      });
    } else {
      emit("validate", false, {});
    }
  });
}

defineExpose({
  formItemSubmit,
});
</script>
