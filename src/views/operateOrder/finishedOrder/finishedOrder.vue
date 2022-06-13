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

      <n-form-item label="下单客户电话" path="customerPhoneEq" v-if="isActive">
        <n-input
          v-model:value="queryValue.customerPhoneEq"
          clearable
          placeholder="输入下单客户电话"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="运营企业" path="operationCompanyIdEq" v-if="isActive">
        <n-select
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择运营企业"
          :options="companyData"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="司机工号" path="driverNoEq" v-if="isActive">
        <n-input
          v-model:value="queryValue.driverNoEq"
          clearable
          placeholder="输入司机工号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="车牌号" path="plateNumberEq" v-if="isActive">
        <n-input
          v-model:value="queryValue.plateNumberEq"
          clearable
          placeholder="输入车牌号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="业务类型" path="orderBusinessTypeEq" v-if="isActive">
        <n-select
          v-model:value="queryValue.orderBusinessTypeEq"
          placeholder="选择业务类型"
          :options="orderBusData"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="交易时间(起始)" path="useVehicleTimeGe" v-if="isActive">
        <n-date-picker
          v-model:value="queryValue.useVehicleTimeGe"
          :is-date-disabled="disablePreviousDate"
          type="date"
          style="width: 150px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易时间(结束)" path="useVehicleTimeLe" v-if="isActive">
        <n-date-picker
          v-model:value="queryValue.useVehicleTimeLe"
          :is-date-disabled="disablePreviousDate"
          type="date"
          style="width: 150px"
          clearable
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" class="mr-10px" @click="toggleActive">{{
          isActive ? "收起" : " 展开"
        }}</n-button>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      :row-key="getRowKeyId"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    >
      <template #toolbarRight>
        <n-button attr-type="button" type="primary" class="ml-10px" @click="download"
          >导出行程单</n-button
        >
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { EyeOutline as EyeIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import { useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { TableDataItemInter } from "./type";
import { getOrderFinishedPage, downloadOrderFinished } from "@/api/operateOrder/operateOrder";
import { PaginationInter } from "@/api/type";
import { getDict, getInfluxList, getAllOperateCompany, downloadFile } from "@/api/common/common";
import { objInter } from "@/interface/common/common";
export default defineComponent({
  name: "FinishedOrder",
  components: { BasicTable },
  setup() {
    const loading = ref(false);
    const basicTableRef = ref();
    const itemCount = ref(null);
    const router = useRouter();
    const isActive = ref(false);
    const queryValue = ref({
      influxOrderNoEq: null,
      influxCodeEq: null,
      orderTypeEq: null,
      customerPhoneEq: null,
      operationCompanyIdEq: null,
      driverNoEq: null,
      plateNumberEq: null,
      orderBusinessTypeEq: null,
      useVehicleTimeGe: new Date().getTime() - 6 * 60 * 60 * 1000 * 24,
      useVehicleTimeLe: new Date().getTime(),
    });
    const message = useMessage();
    const data = ref<TableDataItemInter[]>([]);
    const orderObj: objInter = {};
    const orderBusObj: objInter = {};

    const influxData = ref([]);
    const orderData = ref([]);
    const orderBusData = ref([]);
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
        title: "业务类型",
        key: "orderBusinessType",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(row: TableDataItemInter) {
          return h("span", orderBusObj[row.orderBusinessType]);
        },
      },
      {
        title: "订单类型",
        key: "orderType",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(row: TableDataItemInter) {
          return h("span", orderObj[row.orderType]);
        },
      },
      {
        title: "下单客户电话",
        key: "customerPhone",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "出发地",
        key: "orderBeginAddress",
        align: "center",
      },
      {
        title: "目的地",
        key: "orderEndAddress",
        align: "center",
      },

      {
        title: "运营企业",
        key: "operationCompanyName",
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
        title: "支付金额",
        key: "orderPayAmount",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", `${row.orderPayAmount}元`);
        },
      },
      {
        title: "支付时间",
        key: "orderPayTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.orderPayTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "130px",
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "详情",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handleDetail.bind(null, record.orderId),
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
        getDict({ parentEntryCode: "OBT0000" }),
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
          orderBusData.value = dataArr[2].map((item: { entryName: string; entryCode: string }) => {
            let obj = {
              label: item.entryName,
              value: item.entryCode,
            };
            return obj;
          });
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
              orderBusObj[key.entryCode] = key.entryName;
            }
          }

          console.log(orderBusData);

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
        let res = await getOrderFinishedPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const download = async () => {
      try {
        if (itemCount.value && itemCount.value >= 3000) {
          message.success("数据超过3000条,请通过条件筛选后下载");
          return;
        }
        let res = await downloadOrderFinished({ search: { ...queryValue.value } });
        await downloadFile(res, "行程单");
      } catch (err) {
        console.log(err);
      }
    };
    function handleDetail(orderId: string) {
      router.push({
        path: "/operate-order/order-detail",
        query: { id: orderId, orderState: "finished" },
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
        influxOrderNoEq: null,
        influxCodeEq: null,
        orderTypeEq: null,
        customerPhoneEq: null,
        operationCompanyIdEq: null,
        driverNoEq: null,
        plateNumberEq: null,
        orderBusinessTypeEq: null,
        useVehicleTimeGe: new Date().getTime() - 6 * 60 * 60 * 1000 * 24,
        useVehicleTimeLe: new Date().getTime(),
      };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const toggleActive = () => {
      isActive.value = !isActive.value;
    };
    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
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
      isActive,
      basicTableRef,
      companyData,
      influxData,
      orderData,
      orderBusData,
      columns,
      itemCount,
      download,
      disablePreviousDate(ts: number) {
        return ts >= 4102329600000 && ts <= 1451577600000;
      },
      getRowKeyId: (row: TableDataItemInter) => row.orderId,
      reloadPage,
      toggleActive,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
