<template>
  <n-descriptions label-placement="left" bordered :column="2">
    <n-descriptions-item label="流量方" :span="2">{{ detail?.influxName }}</n-descriptions-item>
    <n-descriptions-item label="流量方订单号" :span="2">{{
      detail?.influxOrderNo
    }}</n-descriptions-item>
    <n-descriptions-item label="订单类型">{{ detail?.orderType }}</n-descriptions-item>
    <n-descriptions-item label="订单状态">{{ detail?.orderState }}</n-descriptions-item>
    <n-descriptions-item label="客户手机号">{{ detail?.customerPhone }} </n-descriptions-item>
    <n-descriptions-item label="乘车人手机号">{{ detail?.passengerPhone }} </n-descriptions-item>
    <n-descriptions-item label="司机姓名[工号]" :span="2" v-if="detail?.driverFullName">
      {{ detail?.driverFullName }}
      <span v-if="detail?.driverNo">[{{ detail?.driverNo }}]</span>
    </n-descriptions-item>
    <n-descriptions-item label="司机手机号" v-if="detail?.driverPhone"
      >{{ detail?.driverPhone }}
    </n-descriptions-item>
    <n-descriptions-item label="车牌号" v-if="detail?.plateNumber"
      >{{ detail?.plateNumber }}
    </n-descriptions-item>
    <n-descriptions-item label="车辆类型" :span="2" v-if="detail?.vehicleTypeName"
      >{{ detail?.vehicleTypeName }}
    </n-descriptions-item>
  </n-descriptions>
</template>
<script lang="ts" setup>
import { toRefs } from "vue";

interface DetailInter {
  influxName: string | null;
  influxOrderNo: string | null;
  orderType: string | null;
  orderState: string | null;
  customerPhone: string | null;
  passengerPhone: string | null;
  driverNo: string | null;
  driverPhone: string | null;
  plateNumber: string | null;
  driverFullName: string | null;
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
