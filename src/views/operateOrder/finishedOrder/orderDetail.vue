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
          <n-descriptions-item label="司机姓名[工号]">{{ detail?.driverNo }} </n-descriptions-item>
          <n-descriptions-item label="司机手机号">{{ detail?.driverPhone }} </n-descriptions-item>
          <n-descriptions-item label="车牌号">{{ detail?.plateNumber }} </n-descriptions-item>
          <n-descriptions-item label="车辆类型">{{ detail?.vehicleTypeName }} </n-descriptions-item>
        </n-descriptions>
      </n-spin>

      <div class="p-30px mt-10px bg-white step">
        <n-steps vertical :current="(current as number)" :status="currentStatus">
          <n-step
            :title="item.title"
            v-for="(item, index) in step"
            :key="index"
            :description="item.time"
          >
            <template #finish-icon>
              <n-icon :component="item.icon" />
              <n-icon>
                <DocumentIcon />
              </n-icon>
            </template>
          </n-step>
        </n-steps>
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
          >{{ detail?.passengerGender === 0 ? "女士" : "先生" }}
        </n-descriptions-item>
        <n-descriptions-item label="用车时间">{{
          detail?.orderServiceDuration
        }}</n-descriptions-item>
        <n-descriptions-item label="下单地点">{{
          detail?.customerCreateOrderAddress
        }}</n-descriptions-item>
        <n-descriptions-item label="订单留言">{{ detail?.orderMessage }}</n-descriptions-item>
        <n-descriptions-item label="上车地点">{{ detail?.orderBeginAddress }}</n-descriptions-item>
        <n-descriptions-item label="下车地点">{{ detail?.orderEndAddress }}</n-descriptions-item>
        <n-descriptions-item label="订单预计时长">{{
          detail?.orderEstimateDuration
        }}</n-descriptions-item>
        <n-descriptions-item label="订单预计里程">{{
          detail?.orderEstimateMileage
        }}</n-descriptions-item>
        <n-descriptions-item label="需付预付款金额">{{
          detail?.needAdvanceAmount
        }}</n-descriptions-item>
        <n-descriptions-item label="已付预付款金额">{{
          detail?.paidAdvanceAmount
        }}</n-descriptions-item>
        <n-descriptions-item label="下单车型信息">{{
          detail?.vehicleTypeName
        }}</n-descriptions-item>
      </n-descriptions>

      <!-- 表格 -->
      <p class="mt-10px ml-10px">订单预付款信息</p>
      <n-data-table
        ref="table"
        :data="orderAdvanceRDTOList"
        :columns="columns"
        class="box-border mt-10px"
        min-height="100px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>

    <OrderAdvanceModal ref="orderAdvanceModalRef" width="930px" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import { useRoute } from "vue-router";
import { StepsProps } from "naive-ui";
import { TableDataItemInter } from "./type";
import OrderAdvanceModal from "./orderAdvanceModal.vue";
import { DocumentTextOutline as DocumentIcon, TimeOutline as TimeIcon } from "@vicons/ionicons5";
import Map from "@/components/Map/BaiduMap.vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { EyeOutline as EyeIcon } from "@vicons/ionicons5";

import { getOrderFinishedDetail, getOrderAdvance } from "@/api/operateOrder/operateOrder";
export default defineComponent({
  name: "FinisherOrderDetail",
  components: { Map, DocumentIcon, OrderAdvanceModal },
  setup() {
    const route = useRoute();
    const loading = ref(false);
    const baiduMapRef = ref();
    const currentRef = ref<number | null>(2);
    const step = ref([
      {
        title: "下单",
        icon: DocumentIcon,
        time: "10:56:16",
      },
      {
        title: "接单",
        icon: DocumentIcon,
        time: "10:56:16",
      },
    ]);
    const detail = ref();
    const orderAdvance = ref();
    const orderAdvanceModalRef = ref();

    const orderAdvanceRDTOList = ref([]);

    const columns = [
      {
        title: "交易流水号",
        key: "dealSerialNumber",
        align: "center",
      },
      {
        title: "支付渠道类型",
        key: "paymentChannelType",
        align: "center",
      },
      {
        title: "预付款金额",
        key: "advanceAmount",
        align: "center",
      },
      {
        title: "已支付订单金额",
        key: "paidOrderAmount",
        align: "center",
      },
      {
        title: "已退款金额",
        key: "refundedAmount",
        align: "center",
      },
      {
        title: "记录时间",
        key: "createTime",
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 100,
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "x详情",
                type: "primary",
                isIconBtn: true,
                icon: EyeIcon,
                onClick: hanldleSee.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(async () => {
      getDetail(route.query.id as string);
      getOrderAdvanceData(route.query.id as string);
      const { renderBaiduMap } = baiduMapRef.value;
      await renderBaiduMap(103.841521, 36.067212);
      //   addBoundary()
    });

    const getDetail = async (orderId: string) => {
      if (!orderId) {
        return false;
      }
      try {
        loading.value = true;
        let res = await getOrderFinishedDetail({ orderId });
        // console.log(res.data);
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
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getOrderAdvanceData = async (orderId: string) => {
      if (!orderId) {
        return false;
      }
      try {
        loading.value = true;
        let res = await getOrderAdvance({ orderId });
        console.log(res.data);
        orderAdvanceRDTOList.value = res.data.orderAdvanceRDTOList;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    function hanldleSee(record: Recordable) {
      const { handleModal } = orderAdvanceModalRef.value;
      handleModal(record.orderAdvanceFlowOutRDTOList);
    }

    return {
      currentStatus: ref<StepsProps["status"]>("finish"),
      getRowKeyId: (row: TableDataItemInter) => row.dealSerialNumber,
      current: currentRef,
      orderAdvanceModalRef,
      baiduMapRef,
      TimeIcon,
      loading,
      detail,
      orderAdvance,
      orderAdvanceRDTOList,
      columns,
      DocumentIcon,
      step,
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
  width: 570px;
  height: 100%;
  overflow-y: scroll;
}

.right {
  width: calc(100% - 570px - 15px);
  height: 100%;
  padding: 5px;
  background-color: $white;
  margin-left: 10px;
  box-sizing: border-box;
  overflow-y: scroll;

  .map {
    height: 400px;
  }
}
</style>
