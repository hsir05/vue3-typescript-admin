<template>
  <BasicDrawer v-model:show="isDrawer" title="转账" @on-close-after="onCloseAfter">
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
        >{{ dayjs(walletInfo?.customerWalletCreateTime).format("YYYY-MM-DD HH:mm:ss") }}
      </n-descriptions-item>
    </n-descriptions>

    <n-divider title-placement="left">转账金额</n-divider>
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
      <n-form-item label="对方客户手机号" path="targetCustomerId">
        <n-select
          v-model:value="form.targetCustomerId"
          remote
          clearable
          filterable
          placeholder="输入对方客户手机号"
          style="width: 180px"
          @search="handleSearch"
          :options="options"
        />
        <!-- 
                <n-input v-model:value="form.targetCustomerId" :maxlength="11" clearable placeholder="输入对方客户手机号"
                    style="width: 180px" /> -->
      </n-form-item>

      <n-form-item label="实充转账金额" path="rechargeAmount">
        <n-input-number
          v-model:value="form.rechargeAmount"
          :min="0"
          clearable
          style="width: 180px"
          placeholder="输入实充转账金额"
        />
      </n-form-item>
      <n-form-item label="赠送转账金额" path="giftAmount">
        <n-input-number
          v-model:value="form.giftAmount"
          style="width: 180px"
          :min="0"
          clearable
          placeholder="输入赠送转账金额"
        />
      </n-form-item>

      <n-form-item label="转账说明" path="transferNote">
        <n-input
          v-model:value="form.transferNote"
          clearable
          placeholder="输入转账说明"
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
      <n-button attr-type="button" type="primary" @click="submit">提交</n-button>
      <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { TransferInter } from "./type";
import md5 from "blueimp-md5";
import dayjs from "dayjs";
import {
  customerWalletTransfer,
  getPhoneCusotmer,
  getWalletDetail,
} from "@/api/individualCustomers/individualCustomers";
export default defineComponent({
  name: "Transfer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const selectLoading = ref(false);
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const options = ref<SelectOption[]>([]);
    const form = ref<TransferInter>({
      customerWalletId: null,
      targetCustomerId: null,
      rechargeAmount: null,
      giftAmount: null,
      transferNote: null,
      password: null,
    });

    const walletInfo = ref();

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
    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res = await customerWalletTransfer({
              ...form.value,
              password: md5(form.value.password as string),
            });
            message.success(window.$tips[res.code]);
            state.loading = false;
            handleSaveAfter();
          } catch (err) {
            console.log(err);
            state.loading = false;
          }
          handleSaveAfter();
        } else {
          console.log(errors);
        }
      });
    }

    const handleSearch = async (query: string) => {
      if (!query.length) {
        options.value = [];
        return;
      }
      selectLoading.value = true;
      try {
        let res = await getPhoneCusotmer({ customerPhoneHeader: query });
        options.value = res.data.map((item: { customerId: string; customerPhone: string }) => {
          return {
            label: item.customerPhone,
            value: item.customerId,
          };
        });
        selectLoading.value = false;
      } catch (err) {
        console.log(err);
        selectLoading.value = false;
      }
    };

    function reset() {
      let customerWalletId = form.value.customerWalletId;
      form.value = {
        customerWalletId,
        targetCustomerId: null,
        rechargeAmount: null,
        giftAmount: null,
        transferNote: null,
        password: null,
      };
      formRef.value?.restoreValidation();
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      form.value.customerWalletId = null;
    }

    return {
      form,
      formRef,
      rule: {
        transferNote: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入转账说明",
        },
        targetCustomerId: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入对方客户手机号",
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
      options,
      walletInfo,
      dayjs,
      handleSearch,
      ...toRefs(state),
      openDrawer,
      onCloseAfter,
      submit,
      reset,
    };
  },
});
</script>
