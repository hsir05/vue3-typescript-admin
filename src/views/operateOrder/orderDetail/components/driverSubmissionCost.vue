<template>
  <n-descriptions label-placement="left" bordered :column="3" class="mt-15px">
    <n-descriptions-item label="提交费用地点" :span="2">{{
      detail?.driverSubmissionCostAddress
    }}</n-descriptions-item>
    <n-descriptions-item label="提交费用期间行驶时长"
      >{{ detail?.driverSubmissionCostDuration }} 分钟</n-descriptions-item
    >
    <n-descriptions-item label="提交费用期间行驶里程"
      >{{ detail?.driverSubmissionCostMileage }} 公里</n-descriptions-item
    >
    <n-descriptions-item label="修改前服务时长"
      >{{ detail?.orderServiceDurationBeforeModification }} 分钟
    </n-descriptions-item>
    <n-descriptions-item label="最终服务时长"
      >{{ detail?.orderServiceDuration }} 分钟</n-descriptions-item
    >
    <n-descriptions-item label="修改前服务里程"
      >{{ detail?.orderServiceMileageBeforeModification }} 公里
    </n-descriptions-item>
    <n-descriptions-item label="最终服务里程">
      {{ detail?.orderServiceMileage }} 公里
    </n-descriptions-item>
    <n-descriptions-item label="订单固定费用"
      >{{ (detail.orderFixedCost || 0).toFixed(2) }} 元
    </n-descriptions-item>
    <n-descriptions-item label="订单时长费用"
      >{{ (detail?.orderDurationCost || 0).toFixed(2) }} 元
    </n-descriptions-item>
    <n-descriptions-item label="订单里程费用"
      >{{ (detail?.orderMileageCost || 0).toFixed(2) }} 元</n-descriptions-item
    >
    <n-descriptions-item label="订单等待费用"
      >{{ (detail?.driverWaitPassengerDurationCost || 0).toFixed(2) }} 元
    </n-descriptions-item>
    <n-descriptions-item label="订单浮动费用"
      >{{ (detail?.orderFloatCost || 0).toFixed(2) }} 元</n-descriptions-item
    >
    <n-descriptions-item label="订单调整费用"
      >{{ (detail?.orderAdjustCost || 0).toFixed(2) }} 元</n-descriptions-item
    >
    <n-descriptions-item label="附加费用"
      >{{
        (detail?.cleaningCost + detail?.parkingCost + detail?.roadCost).toFixed(2)
      }}
      元</n-descriptions-item
    >
    <n-descriptions-item label="抹零费用"
      >{{ (detail?.smallChangeAmount || 0).toFixed(2) }} 元</n-descriptions-item
    >
    <n-descriptions-item label="总报价"
      >{{ (detail?.orderTotalCost || 0).toFixed(2) }} 元</n-descriptions-item
    >
    <n-descriptions-item label="总抽成金额" :span="2"
      >{{ (detail?.totalRate || 0).toFixed(2) }} 元</n-descriptions-item
    >

    <n-descriptions-item label="抽成金额(比率)">
      <n-tag type="success"
        >流量方: {{ (detail.orderTotalCost * detail?.influxDivideRate).toFixed(2) }}元 ({{
          detail?.influxDivideRate * 100
        }}%)
      </n-tag>
      <n-tag type="success" class="ml-10px"
        >平台: {{ (detail.orderTotalCost * detail?.platformDivideRate).toFixed(2) }}元 ({{
          detail?.platformDivideRate * 100
        }}%)</n-tag
      >
      <n-tag type="success" class="ml-10px"
        >代理商: {{ (detail.orderTotalCost * detail?.agencyDivideRate).toFixed(2) }}元 ({{
          detail?.agencyDivideRate * 100
        }}%)
      </n-tag>
      <n-tag type="success" class="ml-10px"
        >企业: {{ (detail.orderTotalCost * detail?.companyDivideRate).toFixed(2) }}元 ({{
          detail?.companyDivideRate * 100
        }}%)</n-tag
      >
      <n-tag type="success" class="ml-10px"
        >司机: {{ (detail.orderTotalCost * detail?.driverDivideRate).toFixed(2) }} 元({{
          detail?.driverDivideRate * 100
        }}%)</n-tag
      >
    </n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";
import { NTag } from "naive-ui";
interface DetailInter {
  driverSubmissionCostAddress: string | null;
  driverSubmissionCostDuration: string | null;
  driverSubmissionCostMileage: string | null;
  orderServiceDurationBeforeModification: string | null;
  orderServiceDuration: string | null;
  orderServiceMileageBeforeModification: string | null;
  driverNo: string | null;
  orderFixedCost: number;
  orderDurationCost: number;
  orderServiceMileage: string | null;
  orderMileageCost: number;
  driverWaitPassengerDurationCost: number;
  orderFloatCost: number;
  orderAdjustCost: number;
  cleaningCost: number;
  smallChangeAmount: number;
  orderTotalCost: number;
  parkingCost: number;
  roadCost: number;
  influxDivideRate: number;
  platformDivideRate: number;
  agencyDivideRate: number;
  companyDivideRate: number;
  driverDivideRate: number;
  totalRate: number;
}

const props = defineProps({
  detail: {
    type: Object as PropType<DetailInter>,
    default: () => {},
  },
});

const { detail } = toRefs(props);
detail.value.totalRate =
  detail.value.orderTotalCost *
  (detail.value.influxDivideRate +
    detail.value.platformDivideRate +
    detail.value.agencyDivideRate +
    detail.value.companyDivideRate +
    detail.value.driverDivideRate);
</script>
