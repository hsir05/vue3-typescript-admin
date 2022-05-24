<template>
  <BasicDrawer v-model:show="isDrawer" title="退款" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" title="个人客户钱包信息" bordered :column="3">
      <n-descriptions-item label="客户昵称">{{
        walletInfo?.customerNickname || "匿名"
      }}</n-descriptions-item>
      <n-descriptions-item label="客户姓名">{{
        walletInfo?.customerName || "匿名"
      }}</n-descriptions-item>
      <n-descriptions-item label="客户手机号">{{ walletInfo?.customerPhone }}</n-descriptions-item>
      <n-descriptions-item label="实充余额(元)">{{
        walletInfo?.rechargeAmountBalance
      }}</n-descriptions-item>
      <n-descriptions-item label="赠送余额(元)">{{
        walletInfo?.giftAmountBalance
      }}</n-descriptions-item>
      <n-descriptions-item label="冻结金额(元)">{{ walletInfo?.frozenAmount }}</n-descriptions-item>
      <n-descriptions-item label="可用余额(元)">{{
        walletInfo?.availableBalance
      }}</n-descriptions-item>
      <n-descriptions-item label="总余额(元)">{{ walletInfo?.totalBalance }}</n-descriptions-item>
      <n-descriptions-item label="钱包创建时间"
        >{{ dayjs(walletInfo?.customerWalletCreateTime).format("YYYY-MM-DD HH: mm") }}
      </n-descriptions-item>
    </n-descriptions>

    <n-alert title="提示" type="warning" class="mt-20px mb-20px">
      退款操作将针对客户钱包进行全额退款,实充余额及赠送余额都将归零!
    </n-alert>
    <n-form-item
      ref="formRef"
      :rule="rule"
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
import md5 from "blueimp-md5";
import dayjs from "dayjs";
import {
  customerWalletRefund,
  getWalletDetail,
} from "@/api/individualCustomers/individualCustomers";
export default defineComponent({
  name: "Refund",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const password = ref();
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();

    const walletInfo = ref();
    const customerWalletId = ref();

    function openDrawer(walletId: string) {
      if (walletId) {
        customerWalletId.value = walletId;
        getDetail(walletId);
      }
      state.isDrawer = true;
    }

    const getDetail = async (customerWalletId: string) => {
      try {
        state.loading = true;
        let res = await getWalletDetail({ customerWalletId });
        console.log(res.data);
        walletInfo.value = { ...res.data, ...res.data.customer };
        delete walletInfo.value.customer;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    async function handleValidate() {
      try {
        await formRef.value?.validate(password.value);
        formRef.value?.restoreValidation();
        let res = await customerWalletRefund({
          customerWalletId: customerWalletId.value,
          password: md5(password.value as string),
        });
        console.log(res);
        message.success(window.$tips[res.code]);
        state.loading = false;
        handleSaveAfter();
      } catch (err) {
        console.log(err);
      }
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      customerWalletId.value = null;
      password.value = null;
      walletInfo.value = null;
    }
    function handleSaveAfter() {
      emit("on-save-after");
    }

    return {
      ...toRefs(state),
      formRef,
      dayjs,
      rule: {
        required: true,
        trigger: ["blur", "input"],
        message: "请输入管理员登陆密码",
      },
      password,
      walletInfo,
      openDrawer,
      onCloseAfter,
      handleValidate,
    };
  },
});
</script>
