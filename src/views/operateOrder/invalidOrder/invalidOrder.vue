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

      <n-form-item label="订单业务类型" path="orderBusinessTypeEq">
        <n-select
          v-model:value="queryValue.orderBusinessTypeEq"
          placeholder="选择订单业务类型"
          :options="orderBusData"
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

      <n-form-item label="联系人电话" path="passengerPhone">
        <n-input
          v-model:value="queryValue.passengerPhone"
          clearable
          placeholder="输入联系人电话"
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

      <n-form-item label="交易时间(起始)" path="orderInvalidTimeGe">
        <n-date-picker
          v-model:value="queryValue.orderInvalidTimeGe"
          type="date"
          :is-date-disabled="disablePreviousDate"
          style="width: 150px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易时间(结束)" path="orderInvalidTimeLe">
        <n-date-picker
          v-model:value="queryValue.orderInvalidTimeLe"
          type="date"
          :is-date-disabled="disablePreviousDate"
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
      :row-key="getRowKeyId"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { EyeOutline as EyeIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import { useRouter } from "vue-router";
import { TableDataItemInter, FormInter } from "./type";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
import { getOrderInvalidPage } from "@/api/operateOrder/operateOrder";

import { getDict, getInfluxList } from "@/api/common/common";
import { objInter } from "@/interface/common/common";
export default defineComponent({
  name: "InvalidOrder",
  components: { BasicTable },
  setup() {
    const loading = ref(false);
    const basicTableRef = ref();
    const itemCount = ref(null);
    const router = useRouter();
    const queryValue = ref<FormInter>({
      influxOrderNoEq: null,
      influxCodeEq: null,
      orderBusinessTypeEq: null,
      orderTypeEq: null,
      passengerPhone: null,
      customerPhoneEq: null,
      orderInvalidTimeGe: null,
      orderInvalidTimeLe: null,
    });

    const data = ref<TableDataItemInter[]>([]);

    const orderObj: objInter = {};
    const orderBusObj: objInter = {};

    const influxData = ref([]);
    const orderData = ref([]);
    const orderBusData = ref([]);

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
        title: "订单号",
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
        title: "下单时间",
        key: "account",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.orderCancelTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "无效时间",
        key: "name",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.orderCancelTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "无效备注",
        key: "orderInvalidNote",
        align: "center",
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
        getDict({ parentEntryCode: "OT00000" }),
        getDict({ parentEntryCode: "OBT0000" }),
        getInfluxList(),
      ])
        .then((res) => {
          let dataArr = res.map((item) => item.data);

          orderData.value = dataArr[0].map((item: { entryName: string; entryCode: string }) => {
            let obj = {
              label: item.entryName,
              value: item.entryCode,
            };
            return obj;
          });
          orderBusData.value = dataArr[1].map((item: { entryName: string; entryCode: string }) => {
            let obj = {
              label: item.entryName,
              value: item.entryCode,
            };
            return obj;
          });
          influxData.value = dataArr[2].map((item: { entryName: string; entryCode: string }) => {
            let obj = {
              label: item.entryName,
              value: item.entryCode,
            };
            return obj;
          });

          for (let key of dataArr[0]) {
            if (!orderObj[key.entryCode]) {
              orderObj[key.entryCode] = key.entryName;
            }
          }
          for (let key of dataArr[1]) {
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
        let res = await getOrderInvalidPage({ page, search: search });
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
        query: { id: orderId, orderState: "invalid" },
      });
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        influxOrderNoEq: null,
        influxCodeEq: null,
        orderBusinessTypeEq: null,
        orderTypeEq: null,
        passengerPhone: null,
        customerPhoneEq: null,
        orderInvalidTimeGe: null,
        orderInvalidTimeLe: null,
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
      basicTableRef,
      influxData,
      orderBusData,
      orderData,
      getRowKeyId: (row: TableDataItemInter) => row.orderId,
      disablePreviousDate(ts: number) {
        return ts >= 4102329600000 && ts <= 1451577600000;
      },
      columns,
      itemCount,

      reloadPage,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
