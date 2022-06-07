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
      , , , ,
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

      <n-form-item label="业务类型" path="orderStateEq">
        <n-select
          v-model:value="queryValue.orderStateEq"
          placeholder="选择订单状态"
          :options="orderBusData"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="交易时间(起始)" path="timeGe">
        <n-date-picker
          v-model:value="queryValue.timeGe"
          type="date"
          style="width: 150px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易时间(结束)" path="timeLe">
        <n-date-picker
          v-model:value="queryValue.timeLe"
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
        <n-button attr-type="button" type="primary" class="ml-10px" @click="downloadInfo"
          >导出对账信息</n-button
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
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { TableDataItemInter, FormInter } from "./type";
import { statusOptions } from "@/config/form";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
import {
  getOrderChannelPage,
  downloadOrderCancelled,
  downloadStatement,
} from "@/api/operateOrder/operateOrder";
import { getDict, getInfluxList, getAllOperateCompany, downloadFile } from "@/api/common/common";
import { objInter } from "@/interface/common/common";
export default defineComponent({
  name: "ChannelOrder",
  components: { BasicTable },
  setup() {
    const loading = ref(false);
    const basicTableRef = ref();
    const itemCount = ref(null);
    const router = useRouter();
    const queryValue = ref<FormInter>({
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
      orderBusinessType: null,
    });

    const data = ref<TableDataItemInter[]>([]);

    const orderObj: objInter = {};
    const message = useMessage();
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
          return h("span", row.orderBusinessType ? orderBusObj[row.orderBusinessType] : "暂无");
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
          return h("span", row.orderType ? orderObj[row.orderType] : "暂无");
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
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "目的地",
        key: "orderEndAddress",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },

      {
        title: "运营企业",
        key: "operationCompanyName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(row: TableDataItemInter) {
          return h("span", row.operationCompanyName ? row.operationCompanyName : "暂无");
        },
      },
      {
        title: "司机工号",
        key: "driverNo",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", row.driverNo ? row.driverNo : "暂无");
        },
      },
      {
        title: "车牌号",
        key: "plateNumber",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", row.plateNumber ? row.plateNumber : "暂无");
        },
      },
      {
        title: "取消时间",
        key: "orderCancelTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.orderCancelTime).format("YYYY-MM-DD HH:mm:ss"));
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
        let res = await getOrderChannelPage({ page, search: search });
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
        query: { id: orderId, orderState: "channel" },
      });
    }

    const download = async () => {
      try {
        if (itemCount.value && itemCount.value >= 3000) {
          message.success("数据超过3000条,请通过条件筛选后下载");
          return;
        }
        let res = await downloadStatement({ search: { ...queryValue.value } });
        await downloadFile(res, "行程单");
      } catch (err) {
        console.log(err);
      }
    };
    const downloadInfo = async () => {
      try {
        if (itemCount.value && itemCount.value >= 3000) {
          message.success("数据超过3000条,请通过条件筛选后下载");
          return;
        }
        let res = await downloadOrderCancelled({ search: { ...queryValue.value } });
        await downloadFile(res, "行程单");
      } catch (err) {
        console.log(err);
      }
    };

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
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
        orderBusinessType: null,
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
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
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
      basicTableRef,
      statusOptions,
      companyData,
      influxData,
      orderData,
      orderBusData,
      columns,
      itemCount,
      getRowKeyId: (row: TableDataItemInter) => row.orderId,

      reloadPage,
      searchHandle,
      downloadInfo,
      download,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
