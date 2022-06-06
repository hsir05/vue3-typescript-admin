<template>
  <div class="flex-align-start order-detail h-full">
    <div class="left">
      <n-spin :show="loading">
        <CustomerInfo :detail="detail" />
      </n-spin>

      <div class="p-30px mt-10px bg-white step">
        <StepItem
          :date="item.date || null"
          :orderState="item.orderState"
          :isDate="item.isDate"
          :isActive="index === activeIndex"
          :index="index"
          v-for="(item, index) in step"
          :key="index"
          @update-event="handleEvent"
        />
      </div>
    </div>
    <div class="right">
      <Map ref="baiduMapRef" class="map" />

      <transition name="fade-slide" mode="out-in" appear>
        <component :is="componentId" :detail="detail" />
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { TableDataItemInter, StepInter } from "./type";
import Map from "@/components/Map/BaiduMap.vue";
import StepItem from "./stepItem.vue";

import CustomerInfo from "./components/customerInfo.vue";
import AcceptOrder from "./components/acceptOrder.vue";
import CreateOrder from "./components/createOrder.vue";
import ReceptionPassenger from "./components/receptionPassenger.vue";
import DriverArrivePickupAddress from "./components/driverArrivePickupAddress.vue";
import DriverBeginService from "./components/driverBeginService.vue";
import DriverEndService from "./components/driverEndService.vue";
import DriverSubmissionCost from "./components/driverSubmissionCost.vue";
import OrderCostCreate from "./components/orderCostCreate.vue";
import InvalidOrder from "./components/invalidOrder.vue";
import CancelOrder from "./components/cancelOrder.vue";
import { objInter } from "@/interface/common/common";
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
  components: {
    Map,
    StepItem,
    CustomerInfo,
    CreateOrder,
    AcceptOrder,
    ReceptionPassenger,
    DriverArrivePickupAddress,
    DriverBeginService,
    DriverEndService,
    DriverSubmissionCost,
    OrderCostCreate,
    InvalidOrder,
    CancelOrder,
  },
  setup() {
    const route = useRoute();
    const loading = ref(false);
    const baiduMapRef = ref();

    const step = ref<StepInter[]>([]);
    const detail = ref();
    const activeIndex = ref(0);

    const state = reactive({
      componentId: "CreateOrder",
    });

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

        if (detail.value.orderPlaceVehicleList) {
          let str = "";
          for (let i = 0; i < detail.value.orderPlaceVehicleList.length; i++) {
            if (i === detail.value.orderPlaceVehicleList.length - 1) {
              str += detail.value.orderPlaceVehicleList[i].vehicleTypeName;
            } else {
              str += detail.value.orderPlaceVehicleList[i].vehicleTypeName + ",";
            }
          }
          detail.value.vehicleTypeName = str;
        }

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
          orderInvalidTime,
          orderCancelTime,
          driverAcceptOrderTime,
          driverReceptionPassengerTime,
          driverArrivePickupAddressTime,
          driverBeginServiceTime,
          driverEndServiceTime,
          orderCostCreateTime,
          driverSubmissionCostTime,
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

        // 无效订单
        if (orderInvalidTime) {
          step.value.push({
            orderState: OrderDataEnum.INVALIDORDER,
            date: orderInvalidTime,
            isDate: !isSameDay(new Date(orderCreateTime), new Date(orderInvalidTime)),
          });
        }
        // 取消订单
        if (!driverAcceptOrderTime && orderCancelTime) {
          step.value.push({
            orderState: OrderDataEnum.CACELORDER,
            date: orderCancelTime,
            isDate: !isSameDay(new Date(orderCreateTime), new Date(orderCancelTime)),
          });
        }
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

        // 取消订单
        if (orderCancelTime) {
          step.value.push({
            orderState: OrderDataEnum.CACELORDER,
            date: orderCancelTime,
            isDate: !isSameDay(new Date(driverAcceptOrderTime), new Date(orderCancelTime)),
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

        // 提交费用
        if (!driverSubmissionCostTime) {
          step.value.push({ orderState: OrderDataEnum.DRIVERSUBMISSIONCOST });
          resolve(true);
          return;
        }
        step.value.push({
          orderState: OrderDataEnum.DRIVERSUBMISSIONCOST,
          date: driverSubmissionCostTime,
          isDate: !isSameDay(new Date(driverEndServiceTime), new Date(driverSubmissionCostTime)),
        });

        // 支付
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

    const handleEvent = (orderState: string, index: number) => {
      activeIndex.value = index;
      let componentsObj: objInter = {
        createOrderState: "CreateOrder",
        invalidOrder: "InvalidOrder",
        acceptOrderState: "AcceptOrder",
        receptionPassengerState: "ReceptionPassenger",
        driverArrivePickupAddressState: "DriverArrivePickupAddress",
        driverBeginServiceState: "DriverBeginService",
        driverEndServiceState: "DriverEndService",
        driverSubmissionCostState: "DriverSubmissionCost",
        orderCostCreateState: "OrderCostCreate",
        cancelOrderState: "CancelOrder",
      };
      state.componentId = componentsObj[orderState];
    };

    return {
      getRowKeyId: (row: TableDataItemInter) => row.dealSerialNumber,
      baiduMapRef,
      ...toRefs(state),
      loading,
      activeIndex,
      detail,
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
