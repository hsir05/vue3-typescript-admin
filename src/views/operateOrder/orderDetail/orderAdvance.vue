<template>
  <div>
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
    <OrderAdvanceFlowOutModal ref="orderAdvanceFlowOutModalRef" width="930px" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, h } from "vue";
import { getOrderAdvance } from "@/api/operateOrder/operateOrder";
import { useRoute } from "vue-router";
import { TableDataItemInter } from "./type";
import TableActions from "@/components/TableActions/TableActions.vue";
import { EyeOutline as EyeIcon } from "@vicons/ionicons5";
import OrderAdvanceFlowOutModal from "./orderAdvanceFlowOutModal.vue";
const route = useRoute();
const loading = ref(false);
const orderAdvanceFlowOutModalRef = ref();

const orderAdvanceRDTOList = ref([]);
const getRowKeyId = (row: TableDataItemInter) => row.dealSerialNumber;

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
  getOrderAdvanceData(route.query.id as string);
});

const getOrderAdvanceData = async (orderId: string) => {
  if (!orderId) {
    return false;
  }
  try {
    loading.value = true;
    let res = await getOrderAdvance({ orderId });
    orderAdvanceRDTOList.value = res.data.orderAdvanceRDTOList;
    loading.value = false;
  } catch (err) {
    console.log(err);
    loading.value = false;
  }
};

function hanldleSee(record: Recordable) {
  const { handleModal } = orderAdvanceFlowOutModalRef.value;
  handleModal(record.orderAdvanceFlowOutRDTOList);
}
</script>
