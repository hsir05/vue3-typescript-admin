<template>
  <n-form
    ref="formRef"
    :rules="rules"
    label-placement="left"
    class="charge"
    require-mark-placement="right-hanging"
    label-width="130"
    :model="form"
  >
    <n-form-item label="基础计费" path="operateCity">
      <n-select
        clearable
        filterable
        v-model:value="form.operateCity"
        placeholder="选择基础计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="里程计费" path="operateCity">
      <n-select
        clearable
        filterable
        v-model:value="form.operateCity"
        placeholder="选择里程计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="时长计费" path="operateCity">
      <n-select
        clearable
        filterable
        v-model:value="form.operateCity"
        placeholder="选择时长计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="取消计费" path="operateCity">
      <n-select
        clearable
        filterable
        v-model:value="form.operateCity"
        placeholder="选择取消计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="等待计费" path="operateCity">
      <n-select
        clearable
        filterable
        v-model:value="form.operateCity"
        placeholder="选择等待计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="工作日浮动" path="operateCity">
      <n-select
        clearable
        filterable
        v-model:value="form.operateCity"
        placeholder="选择工作日浮动"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>

    <n-form-item label="节假日浮动" path="operateCity">
      <n-select
        clearable
        filterable
        v-model:value="form.operateCity"
        placeholder="选择节假日浮动"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>

    <div class="text-center flex-center">
      <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
        >确认开通</n-button
      >
      <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
        >取消</n-button
      >
    </div>
  </n-form>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { formState } from "./type";
import { FormInst, useMessage } from "naive-ui";
import { Add as AddIcon } from "@vicons/ionicons5";

export default defineComponent({
  name: "ChargeForm",
  components: {
    AddIcon,
  },
  setup() {
    const loading = ref(false);
    const formRef = ref<FormInst | null>(null);
    const form = ref<formState>({
      operateCity: null,
    });
    const message = useMessage();

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleReset() {}

    function handleAdd() {}

    return {
      loading,
      formRef,
      form,
      option: [],
      rules: {},

      handleValidate,
      handleAdd,
      handleReset,
    };
  },
});
</script>
<style lang="scss" scoped>
.charge {
  background-color: $white;
  margin-left: 10px;
  padding-top: 30px;
  min-width: 400px;
  padding-right: 40px;
  box-sizing: border-box;
}
</style>
