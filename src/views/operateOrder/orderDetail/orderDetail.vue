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
import acceptIcon from "@/assets/image/icon_driver_accept_order.png";
import pickupIcon from "@/assets/image/icon_driver_arrive_pickup_address.png";
import receptionIcon from "@/assets/image/icon_driver_reception_passenger.png";
import submissionIcon from "@/assets/image/icon_driver_submission_cost.png";
import serviceIcon from "@/assets/image/icon_end_service.png";
// import createIcon from "@/assets/image/icon_order_create.png";
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
        // console.log(optionObj.value);
        const beginLng = detail.value.orderBeginAddressLongitude * 1e-6;
        const beginLat = detail.value.orderBeginAddressLatitude * 1e-6;
        const endLng = detail.value.orderEndAddressLongitude * 1e-6;
        const endLat = detail.value.orderEndAddressLatitude * 1e-6;
        await handleMap({ beginLng, beginLat, endLng, endLat, startIcon, endIcon });

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

    interface MapOptionInter {
      beginLng: number;
      beginLat: number;
      endLng: number;
      endLat: number;
      startIcon: string;
      endIcon: string | null;
      acceptLng?: number | null;
      acceptLat?: number | null;
      otherIcon?: string | null;
    }
    const handleMap = (option: MapOptionInter): Promise<boolean> => {
      return new Promise((resolve) => {
        const { renderBaiduMap, trackIng } = baiduMapRef.value;
        renderBaiduMap(option.beginLng, option.beginLat);
        trackIng(
          option.beginLng,
          option.beginLat,
          option.endLng,
          option.endLat,
          option.startIcon,
          option.endIcon,
          option.acceptLng,
          option.acceptLat,
          option.otherIcon
        );
        resolve(true);
      });
    };

    const handleEvent = async (orderState: string, index: number) => {
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
      console.log(orderState);

      interface OptionInter {
        [Symbol: string]: {
          beginLng: number;
          beginLat: number;
          endLng: number;
          endLat: number;
          startIcon: string;
          endIcon: string | null;
          acceptLng?: number;
          acceptLat?: number;
          otherIcon?: string | null;
        };
      }
      const optionObj: OptionInter = {
        createOrderState: {
          beginLng: detail.value.orderBeginAddressLongitude * 1e-6,
          beginLat: detail.value.orderBeginAddressLatitude * 1e-6,
          endLng: detail.value.orderEndAddressLongitude * 1e-6,
          endLat: detail.value.orderEndAddressLatitude * 1e-6,
          startIcon: startIcon,
          endIcon: endIcon,
          otherIcon: null,
        },
        acceptOrderState: {
          beginLng: detail.value.orderBeginAddressLongitude * 1e-6,
          beginLat: detail.value.orderBeginAddressLatitude * 1e-6,
          endLng: detail.value.orderEndAddressLongitude * 1e-6,
          endLat: detail.value.orderEndAddressLatitude * 1e-6,
          startIcon: startIcon,
          endIcon: endIcon,

          acceptLng: detail.value.driverAcceptOrderAddressLongitude * 1e-6,
          acceptLat: detail.value.driverAcceptOrderAddressLatitude * 1e-6,
          otherIcon: acceptIcon,
        },
        receptionPassengerState: {
          beginLng: detail.value.orderBeginAddressLongitude * 1e-6,
          beginLat: detail.value.orderBeginAddressLatitude * 1e-6,
          endLng: detail.value.orderEndAddressLongitude * 1e-6,
          endLat: detail.value.orderEndAddressLatitude * 1e-6,
          startIcon: startIcon,
          endIcon: endIcon,

          acceptLng: detail.value.driverReceptionPassengerAddressLongitude * 1e-6,
          acceptLat: detail.value.driverReceptionPassengerAddressLatitude * 1e-6,
          otherIcon: receptionIcon,
        },
        driverArrivePickupAddressState: {
          beginLng: detail.value.orderBeginAddressLongitude * 1e-6,
          beginLat: detail.value.orderBeginAddressLatitude * 1e-6,
          endLng: detail.value.orderEndAddressLongitude * 1e-6,
          endLat: detail.value.orderEndAddressLatitude * 1e-6,
          startIcon: startIcon,
          endIcon: endIcon,

          acceptLng: detail.value.driverArrivePickupAddressLongitude * 1e-6,
          acceptLat: detail.value.driverArrivePickupAddressLatitude * 1e-6,
          otherIcon: pickupIcon,
        },
        driverBeginServiceState: {
          beginLng: detail.value.driverBeginServiceAddressLongitude * 1e-6,
          beginLat: detail.value.driverBeginServiceAddressLatitude * 1e-6,
          endLng: detail.value.driverEndServiceAddressLongitude * 1e-6,
          endLat: detail.value.driverEndServiceAddressLatitude * 1e-6,
          startIcon: startIcon,
          endIcon: endIcon,
        },
        driverEndServiceState: {
          beginLng: detail.value.driverEndServiceAddressLongitude * 1e-6,
          beginLat: detail.value.driverEndServiceAddressLatitude * 1e-6,
          endLng: detail.value.driverEndServiceAddressLongitude * 1e-6,
          endLat: detail.value.driverEndServiceAddressLatitude * 1e-6,
          startIcon: serviceIcon,
          endIcon: null,
        },
        driverSubmissionCostState: {
          beginLng: detail.value.driverEndServiceAddressLongitude * 1e-6,
          beginLat: detail.value.driverEndServiceAddressLatitude * 1e-6,
          endLng: detail.value.driverSubmissionCostAddressLongitude * 1e-6,
          endLat: detail.value.driverSubmissionCostAddressLatitude * 1e-6,
          startIcon: serviceIcon,
          endIcon: serviceIcon,
          acceptLng: detail.value.driverSubmissionCostAddressLongitude * 1e-6,
          acceptLat: detail.value.driverSubmissionCostAddressLatitude * 1e-6,
          otherIcon: submissionIcon,
        },
        orderCostCreateState: {
          beginLng: detail.value.driverBeginServiceAddressLongitude * 1e-6,
          beginLat: detail.value.driverBeginServiceAddressLatitude * 1e-6,
          endLng: detail.value.driverEndServiceAddressLongitude * 1e-6,
          endLat: detail.value.driverEndServiceAddressLatitude * 1e-6,
          startIcon: serviceIcon,
          endIcon: null,
        },
      };
      console.log({ ...optionObj[orderState] });

      await handleMap({ ...optionObj[orderState] });
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
  width: 520px;
  height: 100%;
  overflow-y: scroll;
}

.right {
  width: calc(100% - 520px - 15px);
  height: 100%;
  padding: 5px;
  background-color: $white;
  margin-left: 10px;
  box-sizing: border-box;
  overflow-y: scroll;

  .map {
    height: 420px;
  }
}
</style>
