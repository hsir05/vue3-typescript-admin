<template>
  <BasicDrawer v-model:show="isDrawer" title="代金券详情" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="代金券名称">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="代金券面值(元)">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="获得时间">{{
        dayjs(detail?.couponAchieveTime).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>
      <n-descriptions-item label="获得时机">{{
        couponAchieveOpportunityObj[detail?.couponAchieveOpportunity]
      }}</n-descriptions-item>
      <n-descriptions-item label="获得备注">{{
        detail?.couponConsumeNote || "暂无"
      }}</n-descriptions-item>
      <n-descriptions-item label="生效时间">{{
        dayjs(detail?.couponEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>
      <n-descriptions-item label="失效时间">{{
        dayjs(detail?.couponEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>

      <n-descriptions-item label="消费时间">{{ detail?.couponConsumeTime }}</n-descriptions-item>
      <n-descriptions-item label="消费备注">{{ detail?.couponName || "暂无" }}</n-descriptions-item>
      <n-descriptions-item label="消费规则">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="获得备注">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="使用限制金额(元)">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="可使用城市">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="可使用的订单类型">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="可使用的车型">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="可使用的时间">{{ detail?.couponName }}</n-descriptions-item>
      <n-descriptions-item label="可使用的星期">{{ detail?.couponName }}</n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { getCouponDetail } from "@/api/marketing/marketing";
import { couponUseStateObj, couponAchieveOpportunityObj } from "@/config/form";

import dayjs from "dayjs";
export default defineComponent({
  name: "DetailDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const detail = ref();

    function openDrawer(customerCouponId: string) {
      if (customerCouponId) {
        getDetail(customerCouponId);
      }
      state.isDrawer = true;
    }

    const getDetail = async (customerCouponId: string) => {
      try {
        state.loading = true;
        let res = await getCouponDetail({ customerCouponId });
        console.log(res.data);
        detail.value = res.data;
        detail.value = { ...detail.value, ...res.data.customerCouponConsumeRule };
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    function uploadChange(list: string[]) {
      console.log(list);
    }

    function handleReset() {}

    return {
      ...toRefs(state),
      detail,
      dayjs,
      couponUseStateObj,
      couponAchieveOpportunityObj,
      openDrawer,
      onCloseAfter,
      handleSaveAfter,
      handleReset,
      uploadChange,
    };
  },
});
</script>
