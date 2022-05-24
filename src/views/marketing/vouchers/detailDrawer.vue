<template>
  <BasicDrawer v-model:show="isDrawer" title="代金券详情" @on-close-after="onCloseAfter">
    <n-spin :show="loading">
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

        <n-descriptions-item label="消费时间">{{
          detail?.couponConsumeTime || "暂无"
        }}</n-descriptions-item>
        <n-descriptions-item label="消费备注">{{
          detail?.couponConsumeNote || "暂无"
        }}</n-descriptions-item>
        <n-descriptions-item label="消费规则">{{
          detail?.customerCouponConsumeRuleName
        }}</n-descriptions-item>
        <n-descriptions-item label="获得备注">{{
          detail?.couponAchieveNote || "暂无"
        }}</n-descriptions-item>
        <n-descriptions-item label="使用限制金额(元)">{{
          detail?.couponLimitedAmount
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用城市">{{
          detail?.couponUsedCityNames
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的订单类型">{{
          detail?.couponUsedOrderTypeNames
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的车型" :span="2">{{
          detail?.couponUsedVehicleTypeNames
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的时间" :span="2">{{
          detail?.couponUsedDayTimeSection
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的星期" :span="2">{{
          detail?.couponUsedWeekSection
        }}</n-descriptions-item>
      </n-descriptions>
    </n-spin>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { getCouponDetail } from "@/api/marketing/marketing";
import { couponUseStateObj, couponAchieveOpportunityObj } from "@/config/form";
import { withdrawalWeekOptions, withdrawalHourOptions } from "@/config/form";
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
        detail.value = { ...res.data, ...res.data.customerCouponConsumeRule };
        delete detail.value.customerCouponConsumeRule;

        let result = detail.value.couponUsedWeekSection
          .split()
          .some((item: string) => item === "0");
        if (!result) {
          detail.value.couponUsedWeekSection = "无限制";
        } else {
          let weeksStr = "";
          for (let i = 0; i < withdrawalWeekOptions.length; i++) {
            if (i === withdrawalWeekOptions.length - 1) {
              weeksStr += withdrawalWeekOptions[i].label;
            } else if (detail.value.couponUsedWeekSection[i] === "1") {
              weeksStr += withdrawalWeekOptions[i].label + ",";
            }
          }
          detail.value.couponUsedWeekSection = weeksStr;
        }
        let value = detail.value.couponUsedDayTimeSection
          .split()
          .some((item: string) => item === "0");
        if (!value) {
          detail.value.couponUsedDayTimeSection = "无限制";
        } else {
          let hourStr = "";
          for (let i = 0; i < withdrawalHourOptions.length; i++) {
            if (i === withdrawalHourOptions.length - 1) {
              hourStr += withdrawalHourOptions[i].label;
            } else if (detail.value.couponUsedDayTimeSection[i] === "1") {
              hourStr += withdrawalHourOptions[i].label + ",";
            }
          }
          detail.value.couponUsedDayTimeSection = hourStr;
        }
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
      detail.value = null;
    }

    return {
      ...toRefs(state),
      detail,
      dayjs,
      couponUseStateObj,
      couponAchieveOpportunityObj,
      openDrawer,
      onCloseAfter,
      handleSaveAfter,
    };
  },
});
</script>
