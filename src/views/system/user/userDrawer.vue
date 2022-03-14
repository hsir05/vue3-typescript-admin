<template>
  <BasicDrawer v-model:show="isDrawer" :title="title">
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      :style="{
        maxWidth: '400px',
      }"
      require-mark-placement="right-hanging"
      label-width="90"
      :model="form"
    >
      <n-form-item label="帐号" path="account">
        <n-input v-model:value="form.account" clearable placeholder="输入帐号" />
      </n-form-item>
      <n-form-item label="用户名称" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输入用户名称" />
      </n-form-item>
      <n-form-item label="性别" path="sex">
        <n-select v-model:value="form.sex" placeholder="选择性别" :options="sexOptions" />
      </n-form-item>
      <n-form-item label="电话号码" path="phone">
        <n-input v-model:value="form.phone" clearable placeholder="输入电话号码" :maxlength="11" />
      </n-form-item>
      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="form.status">
          <n-space>
            <n-radio :value="item.value" v-for="item in statusOptions" :key="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="handleValidate">保存</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst, useMessage, FormItemRule } from "naive-ui";
import { statusOptions, sexOptions } from "./data";
export default defineComponent({
  name: "UserDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
    });
    const title = ref("菜单");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    function openDrawer(t: string) {
      title.value = t;
      state.isDrawer = true;
    }

    const rules = {
      account: { required: true, trigger: ["blur", "input"], message: "请输入帐号" },
      name: { required: true, trigger: ["blur", "input"], message: "请输入用户名称" },
      sex: { required: true, trigger: ["blur", "change"], message: "请选择性别" },
      phone: {
        required: true,
        trigger: ["input"],
        validator: (rule: FormItemRule, value: string) => {
          console.log(rule);
          return /^1\d{10}$/.test(value);
        },
        message: "请输入电话号码",
      },
    };

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function reset() {}

    return {
      ...toRefs(state),
      formRef,
      title,
      rules,
      statusOptions,
      sexOptions,
      form: ref({
        name: null,
        account: null,
        email: null,
        sex: null,
        phone: null,
        status: 1,
      }),
      openDrawer,
      reset,
      handleValidate,
    };
  },
});
</script>
