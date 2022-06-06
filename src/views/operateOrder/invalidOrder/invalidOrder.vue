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
          :options="options"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="订单类型" path="orderTypeEq">
        <n-select
          v-model:value="queryValue.orderTypeEq"
          placeholder="选择订单类型"
          :options="options"
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
          :options="options"
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
          :options="options"
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
import { statusOptions } from "@/config/form";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
import { getOrderInvalidPage } from "@/api/operateOrder/operateOrder";

import { getDict } from "@/api/common/common";
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
    const orderBusObj: objInter = {};

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
      getOrderTypeData();
    });

    const getOrderTypeData = async () => {
      try {
        loading.value = true;
        let res = await getDict({ parentEntryCode: "OT00000" });
        let result = await getDict({ parentEntryCode: "OBT0000" });
        for (let key of res.data) {
          if (!orderObj[key.entryCode]) {
            orderObj[key.entryCode] = key.entryName;
          }
        }

        for (let key of result.data) {
          if (!orderObj[key.entryCode]) {
            orderBusObj[key.entryCode] = key.entryName;
          }
        }
        getData({ pageIndex: 1, pageSize: 10 });
      } catch (err) {
        console.log(err);
      }
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
      statusOptions,
      options: [],
      getRowKeyId: (row: TableDataItemInter) => row.orderId,
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
