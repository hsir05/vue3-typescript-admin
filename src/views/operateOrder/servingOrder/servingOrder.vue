<template>
  <div class="overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="120"
      style="flex-wrap: wrap"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="queryValue"
    >
      <n-form-item label="流量方订单号" path="influxOrderNoEq">
        <n-input
          v-model:value="queryValue.influxOrderNoEq"
          clearable
          placeholder="输入流量方订单号"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="流量方" path="influxCodeEq">
        <n-select
          v-model:value="queryValue.influxCodeEq"
          placeholder="选择流量方"
          :options="influxData"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="订单类型" path="orderTypeEq">
        <n-select
          v-model:value="queryValue.orderTypeEq"
          placeholder="选择订单类型"
          :options="orderData"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="下单客户电话" path="customerPhoneEq">
        <n-input
          v-model:value="queryValue.customerPhoneEq"
          clearable
          placeholder="输入下单客户电话"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="运营企业" path="operationCompanyIdEq">
        <n-select
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择运营企业"
          :options="companyData"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="司机工号" path="driverNoEq">
        <n-input
          v-model:value="queryValue.driverNoEq"
          clearable
          placeholder="输入司机工号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="车牌号" path="plateNumberEq">
        <n-input
          v-model:value="queryValue.plateNumberEq"
          clearable
          placeholder="输入车牌号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="订单状态" path="orderStateEq">
        <n-select
          v-model:value="queryValue.orderStateEq"
          placeholder="选择订单状态"
          :options="orderStateData"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="交易时间(起始)" path="timeGe">
        <n-date-picker
          v-model:value="queryValue.timeGe"
          type="date"
          :is-date-disabled="disablePreviousDate"
          style="width: 150px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易时间(结束)" path="timeLe">
        <n-date-picker
          v-model:value="queryValue.timeLe"
          :is-date-disabled="disablePreviousDate"
          type="date"
          style="width: 150px"
          clearable
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :scroll-x="1400"
      :columns="columns"
      :row-key="getRowKeyId"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-page="handlePage"
      @on-pagination="handlePageSize"
    />
  </div>
  <FinishOrderPriceModel ref="adjustFinishOrderPriceRef" @on-save-after="handleSaveAfter" />
  <AdjustCancelOrderPriceModel
    ref="adjustCancelOrderPriceModelRef"
    @on-save-after="handleSaveAfter"
  />
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { useRouter } from "vue-router";
import { EyeOutline as EyeIcon } from "@vicons/ionicons5";
import {
  IssuesCloseOutlined as IssuesCloseIcon,
  ForkOutlined as ForkOutlinedIcon,
  MoneyCollectFilled as MoneyCollectFilledIcon,
} from "@vicons/antd";
import BasicTable from "@/components/Table/Table.vue";
import { TableDataItemInter, QueryForm } from "./type";
import { getOrderPage, singleFinishOrder } from "@/api/operateOrder/operateOrder";
import { getDict, getInfluxList, getAllOperateCompany } from "@/api/common/common";
import { PaginationInter } from "@/api/type";
import { objInter } from "@/interface/common/common";
import { useDialog, useMessage } from "naive-ui";
import dayjs from "dayjs";
import FinishOrderPriceModel from "./adjustFinishOrderPrice.vue";
import AdjustCancelOrderPriceModel from "./adjustCancelOrderPrice.vue";
export default defineComponent({
  name: "ServingOrder",
  components: { BasicTable, FinishOrderPriceModel, AdjustCancelOrderPriceModel },
  setup() {
    const loading = ref(false);
    const userDrawerRef = ref();
    const basicTableRef = ref();
    const dispatchRef = ref();
    const adjustFinishOrderPriceRef = ref();
    const adjustCancelOrderPriceModelRef = ref();
    const itemCount = ref(null);
    const router = useRouter();
    const dialog = useDialog();
    const message = useMessage();
    const queryValue = ref<QueryForm>({
      timeGe: null,
      timeLe: null,
      influxOrderNoEq: null,
      influxCodeEq: null,
      operationCompanyIdEq: null,
      orderStateEq: null,
      plateNumberEq: null,
      orderTypeEq: null,
      driverNoEq: null,
      customerPhoneEq: null,
    });

    const data = ref<TableDataItemInter[]>([]);

    const orderObj: objInter = {};
    const orderStateObj: objInter = {};
    const influxData = ref([]);
    const orderData = ref([]);
    const orderStateData = ref([]);
    const companyData = ref([]);
    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: TableDataItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "流量方订单号",
        key: "influxOrderNo",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "下单车型",
        key: "orderPlaceVehicleList.vehicleTypeName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(row: TableDataItemInter) {
          return h(
            "span",
            row.orderPlaceVehicleList.reduce((pre, next) => (pre += next.vehicleTypeName), "")
          );
        },
      },
      {
        title: "订单类型",
        key: "orderType",
        ellipsis: {
          tooltip: true,
        },
        align: "center",

        render(row: TableDataItemInter) {
          return h("span", orderObj[row.orderType]);
        },
      },
      {
        title: "下单客户电话",
        key: "customerPhone",
        align: "center",
      },
      {
        title: "出发地",
        key: "orderBeginAddress",
        ellipsis: {
          tooltip: true,
        },
        align: "center",
      },
      {
        title: "目的地",
        key: "orderEndAddress",
        ellipsis: {
          tooltip: true,
        },
        align: "center",
      },

      {
        title: "运营企业",
        key: "operationCompanyName",
        ellipsis: {
          tooltip: true,
        },
        align: "center",
      },
      {
        title: "司机工号",
        key: "driverNo",
        align: "center",
      },
      {
        title: "车牌号",
        key: "plateNumber",
        align: "center",
      },
      {
        title: "订单状态",
        key: "orderState",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", orderStateObj[row.orderState]);
        },
      },
      {
        title: "用车时间",
        key: "useVehicleTime",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.useVehicleTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "170px",
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "详情",
                type: "primary",
                isIconBtn: true,
                icon: EyeIcon,
                onClick: handleDetail.bind(null, record.orderId),
                auth: ["dict001"],
              },
              {
                label: "人工派单",
                type: "primary",
                isIconBtn: true,
                icon: ForkOutlinedIcon,
                isShow: !(record.orderState === "OS00001"),
                onClick: handleManualDispatch.bind(null, record.orderId),
                auth: ["dict001"],
              },
              {
                label: "价格调整",
                type: "primary",
                isIconBtn: true,
                icon: MoneyCollectFilledIcon,
                isShow: !(
                  record.orderState === "OS00007" &&
                  (record.influxCode === "IFT0001" ||
                    record.influxCode === "IFT0005" ||
                    record.influxCode === "IFT0009")
                ),
                onClick: adjustFinishOrderPrice.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "价格调整",
                type: "primary",
                isIconBtn: true,
                icon: MoneyCollectFilledIcon,
                isShow: !(record.orderState === "OS00008" && record.influxCode === "IFT0001"),
                onClick: adjustCancelOrderPrice.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "订单改派",
                type: "primary",
                isIconBtn: true,
                icon: ForkOutlinedIcon,
                isShow: !(
                  record.orderState === "OS00002" ||
                  record.orderState === "OS00003" ||
                  record.orderState === "OS00004" ||
                  record.orderState === "OS00005"
                ),
                onClick: handleReassignment.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "结单",
                type: "primary",
                isIconBtn: true,
                icon: IssuesCloseIcon,
                isShow: !(record.orderState === "OS00007" || record.orderState === "OS00008"),
                onClick: finishOrder.bind(null, record.influxOrderNo),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getAllData();
    });

    const getAllData = async () => {
      Promise.all([
        getAllOperateCompany(),
        getDict({ parentEntryCode: "OT00000" }),
        getDict({ parentEntryCode: "OS00000" }),
        getInfluxList(),
      ])
        .then((res) => {
          let dataArr = res.map((item) => item.data);

          companyData.value = dataArr[0].map(
            (item: { operationCompanyName: string; operationCompanyId: string }) => {
              let obj = {
                label: item.operationCompanyName,
                value: item.operationCompanyId,
              };
              return obj;
            }
          );
          orderData.value = dataArr[1].map((item: { entryName: string; entryCode: string }) => {
            let obj = {
              label: item.entryName,
              value: item.entryCode,
            };
            return obj;
          });
          orderStateData.value = dataArr[2].map(
            (item: { entryName: string; entryCode: string }) => {
              let obj = {
                label: item.entryName,
                value: item.entryCode,
              };
              return obj;
            }
          );
          influxData.value = dataArr[3].map((item: { entryName: string; entryCode: string }) => {
            let obj = {
              label: item.entryName,
              value: item.entryCode,
            };
            return obj;
          });

          for (let key of dataArr[1]) {
            if (!orderObj[key.entryCode]) {
              orderObj[key.entryCode] = key.entryName;
            }
          }
          for (let key of dataArr[2]) {
            if (!orderObj[key.entryCode]) {
              orderStateObj[key.entryCode] = key.entryName;
            }
          }

          getData({ pageIndex: 1, pageSize: 10 });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getOrderPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleDetail(orderId: string) {
      router.push({
        path: "/operate-order/order-detail",
        query: { id: orderId, orderState: "serving" },
      });
    }

    // 完成待支付订单价格调整
    function adjustFinishOrderPrice(record: Recordable) {
      const { handleModal } = adjustFinishOrderPriceRef.value;
      handleModal("完成订单价格调整", record.orderId);
      console.log(record);
    }

    //取消待支付订单价格调整
    function adjustCancelOrderPrice(record: Recordable) {
      const { handleModal } = adjustCancelOrderPriceModelRef.value;
      handleModal("取消订单价格调整", record.orderId);
      console.log(record);
    }

    // 人工派单
    function handleManualDispatch(record: string) {
      console.log("人工派单");
      router.push({
        path: "/operate-order/dispatch",
        query: { id: record },
      });
    }

    // 单个结单
    function finishOrder(influxOrderNo: string) {
      console.log(influxOrderNo);
      dialog.warning({
        title: "提示",
        content: "您确定结单？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          try {
            loading.value = true;
            let res = await singleFinishOrder({ influxOrderNo });
            console.log(res);
            message.success(window.$tips(res.code));
            loading.value = false;
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        },
        onNegativeClick: () => {},
      });
    }

    //订单改派
    function handleReassignment(record: Recordable) {
      router.push({
        path: "/operate-order/change-dispatch",
        query: { id: record.orderId },
      });
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        timeGe: null,
        timeLe: null,
        influxOrderNoEq: null,
        influxCodeEq: null,
        operationCompanyIdEq: null,
        orderStateEq: null,
        plateNumberEq: null,
        orderTypeEq: null,
        driverNoEq: null,
        customerPhoneEq: null,
      };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }

    function handlePageSize(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }

    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      queryValue,
      data,
      loading,
      userDrawerRef,
      basicTableRef,
      orderStateData,
      companyData,
      influxData,
      orderData,
      columns,
      itemCount,
      adjustFinishOrderPriceRef,
      adjustCancelOrderPriceModelRef,
      disablePreviousDate(ts: number) {
        return ts >= 4102329600000 && ts <= 1451577600000;
      },
      getRowKeyId: (row: TableDataItemInter) => row.orderId,

      reloadPage,
      searchHandle,
      reset,
      handlePage,
      handlePageSize,
      dispatchRef,
      handleSaveAfter,
    };
  },
});
</script>
