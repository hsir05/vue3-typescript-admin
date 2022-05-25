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

      <n-form-item label="订单状态" path="orderBusinessTypeEq">
        <n-select
          v-model:value="queryValue.orderBusinessTypeEq"
          placeholder="选择订单状态"
          :options="options"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="交易时间(起始)" path="useVehicleTimeGe">
        <n-date-picker
          v-model:value="queryValue.useVehicleTimeGe"
          type="date"
          style="width: 150px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易时间(结束)" path="useVehicleTimeLe">
        <n-date-picker
          v-model:value="queryValue.useVehicleTimeLe"
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
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
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
// import { NTag } from "naive-ui";
// import UserDrawer from "./userDrawer.vue";
import { tableDataItem } from "./type";
import { statusOptions } from "@/config/form";
import { getOrderFinishedPage } from "@/api/operateOrder/operateOrder";
import { PaginationInter } from "@/api/type";
export default defineComponent({
  name: "FinishedOrder",
  components: { BasicTable },
  setup() {
    const loading = ref(false);
    const basicTableRef = ref();
    const itemCount = ref(null);
    const router = useRouter();
    const queryValue = ref({
      influxOrderNoEq: null,
      influxCodeEq: null,
      orderTypeEq: null,
      customerPhoneEq: null,
      operationCompanyIdEq: null,
      driverNoEq: null,
      plateNumberEq: null,
      orderBusinessTypeEq: null,
      useVehicleTimeGe: null,
      useVehicleTimeLe: null,
    });

    const data = ref<tableDataItem[]>([]);

    const columns = [
      {
        type: "selection",
        align: "center",
      },
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "流量方订单号",
        key: "account",
        align: "center",
      },
      {
        title: "下单车型",
        key: "name",
        align: "center",
      },
      {
        title: "订单类型",
        key: "phone",
        align: "center",
      },
      {
        title: "下单客户电话",
        key: "account",
        align: "center",
      },
      {
        title: "出发地",
        key: "name",
        align: "center",
      },
      {
        title: "目的地",
        key: "phone",
        align: "center",
      },

      {
        title: "运营企业",
        key: "account",
        align: "center",
      },
      {
        title: "司机工号",
        key: "name",
        align: "center",
      },
      {
        title: "车牌号",
        key: "phone",
        align: "center",
      },
      {
        title: "订单状态",
        key: "account",
        align: "center",
      },
      {
        title: "用车时间",
        key: "name",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "130px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "详情",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handleDetail.bind(null, record),
                auth: ["dict001"],
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
        let res = await getOrderFinishedPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    function handleCheckRow(rowKeys: string[]) {
      console.log("选择了", rowKeys);
    }

    function handleDetail(record: Recordable) {
      console.log("点击了编辑", record.id);
      router.push({ path: "/operate-order/finished-detail", query: { id: record.id } });
    }
    function handleBatch() {
      console.log("点击了批量删除");
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
        influxOrderNoEq: null,
        influxCodeEq: null,
        orderTypeEq: null,
        customerPhoneEq: null,
        operationCompanyIdEq: null,
        driverNoEq: null,
        plateNumberEq: null,
        orderBusinessTypeEq: null,
        useVehicleTimeGe: null,
        useVehicleTimeLe: null,
      };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    };

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      //   getData({ page: 1, pageSize: 10 });
    }

    return {
      queryValue,
      data,
      loading,
      basicTableRef,
      statusOptions,
      options: [],
      columns,
      itemCount,

      reloadPage,
      handleBatch,
      searchHandle,
      reset,
      handleCheckRow,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
