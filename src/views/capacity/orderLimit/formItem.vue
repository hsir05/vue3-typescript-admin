<template>
  <n-form
    ref="formItemRef"
    inline
    :rules="rules"
    label-placement="left"
    style="width: 300px"
    require-mark-placement="right-hanging"
    label-width="60"
    :model="formItem"
  >
    <n-form-item path="vehicleType">
      <n-select
        clearable
        filterable
        style="width: 140px"
        v-model:value="formItem.vehicleType"
        placeholder="选择车型"
        :options="options"
      />
    </n-form-item>
    <n-form-item path="orderLimit">
      <n-input
        v-model:value="formItem.orderLimit"
        clearable
        placeholder="输入单量上限"
        style="width: 140px"
      />
    </n-form-item>
  </n-form>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { FormInst } from "naive-ui";
import { vhchileDataState } from "./type";

export default defineComponent({
  name: "FormItem",
  props: {
    item: {
      type: Object as PropType<vhchileDataState>,
    },
  },
  setup() {
    const formItemRef = ref<FormInst | null>(null);
    const formItem = ref<vhchileDataState>({
      vehicleType: null,
      orderLimit: null,
    });

    function formItemSubmit() {
      formItemRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(formItem));
        } else {
          console.log(errors);
        }
      });
    }

    return {
      formItemRef,
      formItem,
      formItemSubmit,
      options: [],
      rules: {
        vehicleType: { required: true, trigger: ["blur", "input"], message: "请选择车型" },
        orderLimit: { required: true, trigger: ["blur", "input"], message: "请输入单量上限" },
      },
    };
  },
});
</script>
