<template>
  <n-descriptions label-placement="left" bordered :column="3" class="mt-10px">
    <n-descriptions-item label="客户手机号">{{ detail?.customerPhone }}</n-descriptions-item>
    <n-descriptions-item label="客户称呼">{{ detail?.customerNickname }}</n-descriptions-item>
    <n-descriptions-item label="用户端类型">{{ detail?.deviceChannelType }}</n-descriptions-item>
    <n-descriptions-item label="用户端版本">{{ detail?.deviceChannelVersion }}</n-descriptions-item>
    <n-descriptions-item label="订单算费类型">{{ detail?.orderChargeType }}</n-descriptions-item>
    <n-descriptions-item label="结单方式">{{ detail?.finishOrderType }}</n-descriptions-item>
    <n-descriptions-item label="是否选择钱包余额扣费">{{
      detail?.orderWalletBalanceDeduction
    }}</n-descriptions-item>
    <n-descriptions-item label="乘车人手机号">{{ detail?.passengerPhone }}</n-descriptions-item>
    <n-descriptions-item label="乘车人称呼"
      >{{ detail?.passengerGender ? "暂无" : detail?.passengerGender === 0 ? "女士" : "先生" }}
    </n-descriptions-item>
    <n-descriptions-item label="用车时间">{{ detail?.orderServiceDuration }}</n-descriptions-item>
    <n-descriptions-item label="下单地点" :span="2">{{
      detail?.customerCreateOrderAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="订单预计时长">{{
      detail?.orderEstimateDuration
    }}</n-descriptions-item>
    <n-descriptions-item label="订单留言" :span="2">{{ detail?.orderMessage }}</n-descriptions-item>
    <n-descriptions-item label="订单预计里程">{{
      detail?.orderEstimateMileage
    }}</n-descriptions-item>
    <n-descriptions-item label="上车地点" :span="2">{{
      detail?.orderBeginAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="需付预付款金额(元)">{{
      detail?.needAdvanceAmount
    }}</n-descriptions-item>
    <n-descriptions-item label="下车地点" :span="2">{{
      detail?.orderEndAddress
    }}</n-descriptions-item>

    <n-descriptions-item label="已付预付款金额(元)">{{
      detail?.paidAdvanceAmount
    }}</n-descriptions-item>
    <n-descriptions-item label="下单车型信息">{{ detail?.vehicleTypeName }}</n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
interface DetailInter {
  customerPhone: string | null;
  customerNickname: string | null;
  deviceChannelType: string | null;
  deviceChannelVersion: string | null;
  orderChargeType: string | null;
  finishOrderType: string | null;
  orderWalletBalanceDeduction: string | null;
  passengerPhone: string | null;
  passengerGender: number | null;

  orderServiceDuration: string | null;
  customerCreateOrderAddress: string | null;
  orderEstimateDuration: string | null;
  orderMessage: string | null;
  orderEstimateMileage: string | null;
  orderBeginAddress: string | null;
  needAdvanceAmount: number | null;
  orderEndAddress: string | null;
  paidAdvanceAmount: number | null;
  vehicleTypeName: string | null;
}
const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

const { detail } = toRefs(props);
</script>
