<template>
  <BasicDrawer v-model:show="isDrawer" title="充值" @on-close-after="onCloseAfter">
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
        >{{ dayjs(walletInfo?.customerWalletCreateTime).format("YYYY-MM-DD HH:mm") }}
      </n-descriptions-item>
    </n-descriptions>
    <n-divider title-placement="left">充值</n-divider>
    <!-- 充值 -->
    <n-form
      ref="formRef"
      :rules="rule"
      inline
      label-placement="left"
      label-width="120"
      :style="{ flexWrap: 'wrap' }"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="form"
    >
      <n-form-item label="实充金额" path="rechargeAmount">
        <n-input-number
          v-model:value="form.rechargeAmount"
          :min="0"
          clearable
          style="width: 180px"
          placeholder="输入实充金额"
        />
      </n-form-item>
      <n-form-item label="赠送金额" path="giftAmount">
        <n-input-number
          v-model:value="form.giftAmount"
          style="width: 180px"
          :min="0"
          clearable
          placeholder="输入赠送金额"
        />
      </n-form-item>

      <n-form-item label="充值说明" path="rechargeNote">
        <n-input
          v-model:value="form.rechargeNote"
          clearable
          placeholder="输入充值说明"
          style="width: 180px"
        />
      </n-form-item>

      <n-form-item label="管理员登陆密码" path="password">
        <n-input
          v-model:value="form.password"
          type="password"
          placeholder="请输入管理员登陆密码"
          style="width: 180px"
        />
      </n-form-item>
    </n-form>
    <div class="text-center flex-center">
      <n-button attr-type="button" type="primary" @click="handleValidate">提交</n-button>
      <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import dayjs from "dayjs";
import { FormInst, useMessage } from "naive-ui";
import { RechargeInter } from "./type";
import {
  customerWalletRecharge,
  getWalletDetail,
} from "@/api/individualCustomers/individualCustomers";
import md5 from "blueimp-md5";
export default defineComponent({
  name: "Recharge",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const walletInfo = ref();
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const form = ref<RechargeInter>({
      customerWalletId: null,
      rechargeAmount: null,
      giftAmount: null,
      rechargeNote: null,
      password: null,
    });

    function openDrawer(customerWalletId: string) {
      if (customerWalletId) {
        form.value.customerWalletId = customerWalletId;
        getDetail(customerWalletId);
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

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;

          try {
            let res = await customerWalletRecharge({
              ...form.value,
              password: md5(form.value.password as string),
            });
            console.log(res);
            message.success(window.$tips[res.code]);
            state.loading = false;
            handleSaveAfter();
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log(errors);
          state.loading = false;
        }
      });
    }
    function reset() {
      let customerWalletId = form.value.customerWalletId;
      form.value = {
        customerWalletId,
        rechargeAmount: null,
        giftAmount: null,
        rechargeNote: null,
        password: null,
      };
      formRef.value?.restoreValidation();
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      form.value.customerWalletId = null;
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    return {
      form,
      formRef,
      ...toRefs(state),
      dayjs,
      openDrawer,
      onCloseAfter,
      walletInfo,
      handleValidate,
      reset,
      rule: {
        rechargeNote: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入充值说明",
        },
        password: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入管理员登陆密码",
        },
        rechargeAmount: {
          required: true,
          type: "number",
          trigger: ["blur", "input"],
          message: "请输入实充金额",
        },
        giftAmount: {
          required: true,
          type: "number",
          trigger: ["blur", "input"],
          message: "请输入赠送金额",
        },
      },
    };
  },
});
</script>
