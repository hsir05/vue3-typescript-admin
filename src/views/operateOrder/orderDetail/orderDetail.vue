<template>
  <div class="flex-align-start order-detail h-full">
    <div class="left">
      <n-spin :show="loading">
        <n-descriptions label-placement="left" bordered :column="2">
          <n-descriptions-item label="流量方" :span="2">{{
            detail?.influxName
          }}</n-descriptions-item>
          <n-descriptions-item label="流量方订单号" :span="2">{{
            detail?.influxOrderNo
          }}</n-descriptions-item>
          <n-descriptions-item label="订单类型">{{ detail?.orderType }}</n-descriptions-item>
          <n-descriptions-item label="订单状态">{{ detail?.orderState }}</n-descriptions-item>
          <n-descriptions-item label="客户手机号">{{ detail?.customerPhone }} </n-descriptions-item>
          <n-descriptions-item label="乘车人手机号"
            >{{ detail?.passengerPhone }}
          </n-descriptions-item>
          <n-descriptions-item label="司机姓名[工号]" :span="2">
            {{ detail?.driverFullName }}
            <span v-if="detail?.driverNo">[{{ detail?.driverNo }}]</span>
          </n-descriptions-item>
          <n-descriptions-item label="司机手机号">{{ detail?.driverPhone }} </n-descriptions-item>
          <n-descriptions-item label="车牌号">{{ detail?.plateNumber }} </n-descriptions-item>
          <n-descriptions-item label="车辆类型" :span="2"
            >{{ detail?.vehicleTypeName }}
          </n-descriptions-item>
        </n-descriptions>
      </n-spin>

      <div class="p-30px mt-10px bg-white step">
        <StepItem
          :date="item.date || null"
          :orderState="item.orderState"
          :isDate="item.isDate"
          v-for="(item, index) in step"
          :key="index"
          @update-event="handleEvent"
        />
      </div>
    </div>
    <div class="right">
      <Map ref="baiduMapRef" class="map" />

      <n-descriptions label-placement="left" bordered :column="3" class="mt-10px">
        <n-descriptions-item label="客户手机号">{{ detail?.customerPhone }}</n-descriptions-item>
        <n-descriptions-item label="客户称呼">{{ detail?.customerNickname }}</n-descriptions-item>
        <n-descriptions-item label="用户端类型">{{
          detail?.deviceChannelType
        }}</n-descriptions-item>
        <n-descriptions-item label="用户端版本">{{
          detail?.deviceChannelVersion
        }}</n-descriptions-item>
        <n-descriptions-item label="订单算费类型">{{
          detail?.orderChargeType
        }}</n-descriptions-item>
        <n-descriptions-item label="结单方式">{{ detail?.finishOrderType }}</n-descriptions-item>
        <n-descriptions-item label="是否选择钱包余额扣费">{{
          detail?.orderWalletBalanceDeduction
        }}</n-descriptions-item>
        <n-descriptions-item label="乘车人手机号">{{ detail?.passengerPhone }}</n-descriptions-item>
        <n-descriptions-item label="乘车人称呼"
          >{{ detail?.passengerGender ? "暂无" : detail?.passengerGender === 0 ? "女士" : "先生" }}
        </n-descriptions-item>
        <n-descriptions-item label="用车时间">{{
          detail?.orderServiceDuration
        }}</n-descriptions-item>
        <n-descriptions-item label="下单地点" :span="2">{{
          detail?.customerCreateOrderAddress
        }}</n-descriptions-item>
        <n-descriptions-item label="订单预计时长">{{
          detail?.orderEstimateDuration
        }}</n-descriptions-item>
        <n-descriptions-item label="订单留言" :span="2">{{
          detail?.orderMessage
        }}</n-descriptions-item>
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
        <n-descriptions-item label="下单车型信息">{{
          detail?.vehicleTypeName
        }}</n-descriptions-item>
      </n-descriptions>

      <!-- 表格 -->
      <OrderAdvance />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { TableDataItemInter } from "./type";
import Map from "@/components/Map/BaiduMap.vue";
import OrderAdvance from "./orderAdvance.vue";
import StepItem from "./stepItem.vue";
import {
  getOrderDetail,
  getOrderFinishedDetail,
  getOrderInvalidDetail,
  getOrderCannelDetail,
} from "@/api/operateOrder/operateOrder";
import { isSameDay } from "@/utils/index";
import startIcon from "@/assets/image/icon_begin_address.png";
import endIcon from "@/assets/image/icon_end_address.png";
import { OrderDataEnum } from "@/enums/dict";
export default defineComponent({
  name: "FinisherOrderDetail",
  components: { Map, OrderAdvance, StepItem },
  setup() {
    const route = useRoute();
    const loading = ref(false);
    const baiduMapRef = ref();
    const currentRef = ref<number | null>(2);
    interface StepInter {
      orderState: string;
      date?: number | null;
      isDate?: boolean;
    }

    const step = ref<StepInter[]>([]);
    const detail = ref();
    const orderAdvance = ref();

    onMounted(async () => {
      getDetail(route.query.id as string);
    });

    const getDetail = async (orderId: string) => {
      if (!orderId) {
        return false;
      }
      try {
        loading.value = true;
        let res = null;
        console.log(route.query.orderState);
        let orderState = route.query.orderState;
        switch (orderState) {
          case "serving":
            res = await getOrderDetail({ orderId });
            break;
          case "finished":
            res = await getOrderFinishedDetail({ orderId });
            break;
          case "channel":
            res = await getOrderCannelDetail({ orderId });
            break;
          case "invalid":
            res = await getOrderInvalidDetail({ orderId });
            break;
        }
        console.log(res.data);
        detail.value = res.data;

        let str = "";
        for (let i = 0; i < detail.value.orderPlaceVehicleList.length; i++) {
          if (i === detail.value.orderPlaceVehicleList.length - 1) {
            str += detail.value.orderPlaceVehicleList[i].vehicleTypeName;
          } else {
            str += detail.value.orderPlaceVehicleList[i].vehicleTypeName + ",";
          }
        }
        detail.value.vehicleTypeName = str;

        await getOrderStep();
        await handleMap();

        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getOrderStep = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const {
          orderCreateTime,
          driverAcceptOrderTime,
          driverReceptionPassengerTime,
          driverArrivePickupAddressTime,
          driverBeginServiceTime,
          driverEndServiceTime,
          orderCostCreateTime,
        } = detail.value;
        if (!orderCreateTime) {
          resolve(true);
          return;
        }
        step.value.push({
          orderState: OrderDataEnum.CREATEORDER,
          date: orderCreateTime,
          isDate: true,
        });
        if (!driverAcceptOrderTime) {
          step.value.push({ orderState: OrderDataEnum.ORDEREND });
          resolve(true);
          return;
        }

        if (
          detail.value.orderDispatchRecordList &&
          detail.value.orderDispatchRecordList.length > 0
        ) {
          for (let i = 0; i < detail.value.orderDispatchRecordList.length; i++) {
            let item = detail.value.orderDispatchRecordList[i];
            if (i === 0) {
              step.value.push({
                orderState: OrderDataEnum.ACCEPTORDER,
                date: item.dispatchOrderTime,
                isDate: !isSameDay(new Date(orderCreateTime), new Date(item.dispatchOrderTime)),
              });
            } else {
              step.value.push({
                orderState: OrderDataEnum.ACCEPTORDER,
                date: item.dispatchOrderTime,
                isDate: !isSameDay(
                  new Date(detail.value.orderDispatchRecordList[i - 1]),
                  new Date(item.dispatchOrderTime)
                ),
              });
            }
          }
        } else {
          step.value.push({
            orderState: OrderDataEnum.ACCEPTORDER,
            date: driverAcceptOrderTime,
            isDate: !isSameDay(new Date(orderCreateTime), new Date(driverAcceptOrderTime)),
          });
        }
        if (!driverReceptionPassengerTime) {
          step.value.push({ orderState: OrderDataEnum.ORDEREND });
          resolve(true);
          return;
        }
        step.value.push({
          orderState: OrderDataEnum.RECEPTIONPASSENGER,
          date: driverReceptionPassengerTime,
          isDate: !isSameDay(
            new Date(driverAcceptOrderTime),
            new Date(driverReceptionPassengerTime)
          ),
        });
        if (!driverArrivePickupAddressTime) {
          step.value.push({ orderState: OrderDataEnum.ORDEREND });
          resolve(true);
          return;
        }
        step.value.push({
          orderState: OrderDataEnum.DRIVERARRIVERPICKUPADDRESS,
          date: driverArrivePickupAddressTime,
          isDate: !isSameDay(
            new Date(driverReceptionPassengerTime),
            new Date(driverArrivePickupAddressTime)
          ),
        });
        if (!driverBeginServiceTime) {
          step.value.push({ orderState: OrderDataEnum.ORDEREND });
          resolve(true);
          return;
        }
        step.value.push({
          orderState: OrderDataEnum.DRIVERBEGINSERVICES,
          date: driverBeginServiceTime,
          isDate: !isSameDay(
            new Date(driverArrivePickupAddressTime),
            new Date(driverBeginServiceTime)
          ),
        });
        if (!driverEndServiceTime) {
          step.value.push({ orderState: OrderDataEnum.ORDEREND });
          resolve(true);
          return;
        }
        step.value.push({
          orderState: OrderDataEnum.DRIVERENDSERVICES,
          date: driverEndServiceTime,
          isDate: !isSameDay(new Date(driverBeginServiceTime), new Date(driverEndServiceTime)),
        });
        if (!orderCostCreateTime) {
          step.value.push({ orderState: OrderDataEnum.ORDEREND });
          resolve(true);
          return;
        }
        step.value.push({
          orderState: OrderDataEnum.ORDERCOSTCREATE,
          date: orderCostCreateTime,
          isDate: !isSameDay(new Date(driverEndServiceTime), new Date(orderCostCreateTime)),
        });
        if (!driverAcceptOrderTime) {
          step.value.push({ orderState: OrderDataEnum.ORDEREND });
          resolve(true);
          return;
        }
        step.value.push({ orderState: OrderDataEnum.ORDEREND });
        resolve(true);
      });
    };

    const handleMap = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const beginLng = detail.value.orderBeginAddressLongitude * 1e-6;
        const beginEnd = detail.value.orderBeginAddressLatitude * 1e-6;
        const endLng = detail.value.orderEndAddressLongitude * 1e-6;
        const EndLat = detail.value.orderEndAddressLatitude * 1e-6;
        const { renderBaiduMap, trackIng } = baiduMapRef.value;
        renderBaiduMap(beginLng, beginEnd);
        trackIng(beginLng, beginEnd, endLng, EndLat, startIcon, endIcon);

        resolve(true);
      });
    };

    const handleEvent = (orderState: string) => {
      console.log(orderState);
    };

    return {
      getRowKeyId: (row: TableDataItemInter) => row.dealSerialNumber,
      current: currentRef,
      baiduMapRef,
      loading,
      detail,
      orderAdvance,
      step,
      handleEvent,
    };
  },
});
</script>
<style lang="scss" scoped>
.order-detail {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.left {
  width: 500px;
  height: 100%;
  overflow-y: scroll;
}

.right {
  width: calc(100% - 500px - 15px);
  height: 100%;
  padding: 5px;
  background-color: $white;
  margin-left: 10px;
  box-sizing: border-box;
  overflow-y: scroll;

  .map {
    height: 320px;
  }
}
</style>
