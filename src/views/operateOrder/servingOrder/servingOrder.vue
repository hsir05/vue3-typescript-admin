<template>
  <div class="h-full overflow-hidden box-border">
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
      :columns="columns"
      :row-key="getRowKeyId"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <!-- <UserDrawer ref="userDrawerRef" :width="500" @on-save-after="handleSaveAfter" /> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { EyeOutline as EyeIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import { TableDataItemInter, QueryForm } from "./type";
import { statusOptions } from "@/config/form";
import { getOrderPage } from "@/api/operateOrder/operateOrder";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "ServingOrder",
  components: { BasicTable },
  setup() {
    const loading = ref(false);
    const userDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
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
      },
      {
        title: "下单车型",
        key: "orderPlaceVehicleList.vehicleTypeName",
        align: "center",
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
        align: "center",
      },
      {
        title: "下单客户电话",
        key: "customerPhone",
        align: "center",
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
        title: "订单状态",
        key: "orderState",
        align: "center",
      },
      {
        title: "用车时间",
        key: "useVehicleTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.useVehicleTime).format("YYYY-MM-DD HH:mm:ss"));
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
                isIconBtn: true,
                icon: EyeIcon,
                onClick: handleEdit.bind(null, record.orderId),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                isIconBtn: true,
                icon: CreateIcon,
                secondary: true,
                auth: ["dict002"],
                popConfirm: {
                  onPositiveClick: handleRemove.bind(null, record),
                  title: "您确定删除?",
                },
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10 });
    });

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

    function handleEdit(orderId: string) {
      const { openDrawer } = userDrawerRef.value;
      openDrawer(orderId);
    }

    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = userDrawerRef.value;
      openDrawer("新增用户");
    }
    function handleRemove(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
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
      userDrawerRef,
      basicTableRef,
      statusOptions,
      options: [],
      columns,
      itemCount,
      getRowKeyId: (row: TableDataItemInter) => row.orderId,

      reloadPage,
      handleAdd,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
