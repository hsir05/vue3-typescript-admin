<template>
  <BasicDrawer v-model:show="isDrawer" title="兑换码详情" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="兑换码">{{ detail?.exchangeCode }}</n-descriptions-item>
      <n-descriptions-item label="兑换类型">{{
          stateData.get(detail?.exchangeCodeExchangeType)
      }}</n-descriptions-item>
      <n-descriptions-item label="生效时间" :span="2">{{
        dayjs(detail?.exchangeCodeEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>
      <n-descriptions-item label="生成时间" :span="2">{{
        dayjs(detail?.exchangeCodeEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>
      <n-descriptions-item label="可兑换次数">{{
        detail?.exchangeCodeUsableCount
      }}</n-descriptions-item>
      <n-descriptions-item label="已兑换次数">{{
        detail?.exchangeCodeUsedCount
      }}</n-descriptions-item>
      <n-descriptions-item v-if="isShow" label="兑换实充金额">{{
        detail?.exchangeRechargeAmount
      }}</n-descriptions-item>
      <n-descriptions-item v-if="isShow" label="兑换赠送金额">{{
        detail?.exchangeGiftAmount
      }}</n-descriptions-item>
    </n-descriptions>

    <n-descriptions label-placement="left" bordered :column="2" title="代金券" v-for="item in coupon">
      <n-descriptions-item label="代金券名称">{{ item.couponName}}</n-descriptions-item>
      <n-descriptions-item label="代金券面值(元)">{{ item.couponDenomination}}</n-descriptions-item>
      <n-descriptions-item label="代金券数量">{{ item.couponCount}}</n-descriptions-item>
      <n-descriptions-item label="代金券有效天数">{{ item.couponEffectiveDays}}</n-descriptions-item>
      <n-descriptions-item label="使用限制金额(元)">{{ item.customerCouponConsumeRule.couponLimitedAmount}}</n-descriptions-item>
      <n-descriptions-item label="可使用的城市">{{ item.customerCouponConsumeRule.couponUsedCityNames}}</n-descriptions-item>
      <n-descriptions-item label="可使用的车型" :span="2">{{ item.customerCouponConsumeRule.couponUsedVehicleTypeNames}}</n-descriptions-item>
      <n-descriptions-item label="可使用的时间">{{ item.customerCouponConsumeRule.couponUsedDayTimeSectionDesc}}</n-descriptions-item>
      <n-descriptions-item label="可使用的星期">{{ item.customerCouponConsumeRule.couponUsedWeekSectionDesc}}</n-descriptions-item>
      <n-descriptions-item label="可使用的订单类型" :span="2">{{ item.customerCouponConsumeRule.couponUsedOrderTypeNames}}</n-descriptions-item>
    </n-descriptions>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { getExchangeCodeDetail } from "@/api/marketing/marketing";
import dayjs from "dayjs";
import {getDict} from "@/api/common/common";
export default defineComponent({
  name: "CodeDetailDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const detail = ref();
    const coupon = ref([])
    const isShow = ref(false)
    const stateData: Map<string, string> = new Map();
    function openDrawer(exchangeCodeId: string) {
      if (exchangeCodeId) {
        getDetail(exchangeCodeId);
      }
      state.isDrawer = true;
    }

    const getDetail = async (exchangeCodeId: string) => {
      try {
        state.loading = true;
        let dict = await getDict({parentEntryCode: "EXT0000"});
        dict.data.map((item: { entryName: string; entryCode: string }) => {
          stateData.set(item.entryCode, item.entryName);
        });
        let res = await getExchangeCodeDetail({ exchangeCodeId });
        console.log(res);
        if (res.data.exchangeCodeExchangeType ==="EXT0002"){
          isShow.value = true;
        }
        detail.value = res.data;
        coupon.value = res.data.coupon;
        console.log(coupon.value)
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
      dayjs,
      detail,
      coupon,
      isShow,
      openDrawer,
      onCloseAfter,
      stateData,
    };
  },
});
</script>
