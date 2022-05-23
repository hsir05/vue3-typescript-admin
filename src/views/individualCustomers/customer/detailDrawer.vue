<template>
  <BasicDrawer v-model:show="isDrawer" title="个人客户信息" @on-close-after="onCloseAfter">
    <n-tabs type="segment">
      <n-tab-pane name="chap1" tab="基本信息">
        <n-descriptions label-placement="left" bordered :column="2">
          <n-descriptions-item label="客户昵称">暂无</n-descriptions-item>
          <n-descriptions-item label="客户姓名">暂无</n-descriptions-item>
          <n-descriptions-item label="客户性别">{{
            detail.customer.customerGender
          }}</n-descriptions-item>
          <n-descriptions-item label="客户生日">暂无</n-descriptions-item>
          <n-descriptions-item label="客户邮箱">暂无</n-descriptions-item>
          <n-descriptions-item label="客户手机号">{{
            detail.customer.customerPhone
          }}</n-descriptions-item>
          <n-descriptions-item label="会员名称">{{
            detail.customer.customerMemberName
          }}</n-descriptions-item>
          <n-descriptions-item label="客户状态">{{
            detail.customer.customerLock === 0 ? "正常" : "锁定"
          }}</n-descriptions-item>
          <n-descriptions-item label="客户注册时间">{{
            dayjs(detail.customer.customerRegTime).format("YYYY-MM-DD HH:mm")
          }}</n-descriptions-item>
        </n-descriptions>
      </n-tab-pane>
      <n-tab-pane name="chap2" tab="钱包及免密支付信息">
        <n-descriptions label-placement="left" bordered :column="2" title="个人钱包信息">
          <n-descriptions-item label="可用余额">{{
            detail.customerWallet.availableBalance
          }}</n-descriptions-item>
          <n-descriptions-item label="总余额">{{
            detail.customerWallet.totalBalance
          }}</n-descriptions-item>
          <n-descriptions-item label="钱包创建时间">{{
            dayjs(detail.customer.customerRegTime).format("YYYY-MM-DD HH:mm")
          }}</n-descriptions-item>
        </n-descriptions>
      </n-tab-pane>
    </n-tabs>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { getCustomerDetail } from "@/api/individualCustomers/individualCustomers";
import dayjs from "dayjs";
export default defineComponent({
  name: "DetailDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const detail = ref({
      customer: {
        customerGender: null,
        customerPhone: null,
        customerMemberName: null,
        customerRegTime: null,
        customerLock: null,
      },
      customerWallet: {
        availableBalance: null,
        totalBalance: null,
        customerWalletCreateTime: null,
      },
    });

    function openDrawer(customerId: string) {
      if (customerId) {
        getDetail(customerId);
      }
      state.isDrawer = true;
    }

    const getDetail = async (customerId: string) => {
      try {
        state.loading = true;
        let res = await getCustomerDetail({ customerId });
        console.log(res);
        detail.value = res.data;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      ...toRefs(state),
      openDrawer,
      onCloseAfter,
      detail,
      dayjs,
    };
  },
});
</script>
