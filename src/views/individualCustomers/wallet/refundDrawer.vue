<template>
  <BasicDrawer v-model:show="isDrawer" title="退款" @on-close-after="onCloseAfter">
    <WalletItem title="个人客户钱包退款" />

    <n-alert title="提示" type="warning" class="mt-20px mb-20px">
      退款操作将针对客户钱包进行全额退款,实充余额及赠送余额都将归零!
    </n-alert>
    <n-form-item
      ref="queryFormRef"
      :rule="queryRule"
      label-width="130"
      label="管理员登陆密码"
      label-placement="left"
    >
      <n-input
        v-model:value="password"
        type="password"
        clearable
        placeholder="输入管理员登陆密码"
        style="width: 320px"
      />
    </n-form-item>

    <div class="text-center flex-center">
      <n-button attr-type="button" type="primary" @click="handleValidate">提交</n-button>
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import WalletItem from "./walletItem.vue";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "Refund",
  components: {
    WalletItem,
  },
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const password = ref(null);
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();

    function openDrawer(record?: tableDataItem) {
      console.log(record);
      if (record) {
        console.log(record);
      }
      state.isDrawer = true;
    }

    async function handleValidate() {
      try {
        await formRef.value?.validate();
        console.log(password.value);
      } catch (err) {
        console.log(err);
        message.error("验证失败");
      }
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      ...toRefs(state),
      queryRule: {
        required: true,
        trigger: ["blur", "input"],
        message: "请输入管理员登陆密码",
      },
      password,
      openDrawer,
      onCloseAfter,
      handleValidate,
    };
  },
});
</script>
