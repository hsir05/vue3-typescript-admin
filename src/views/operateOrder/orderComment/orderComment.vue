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
      <n-form-item label="订单号" path="orderNo">
        <n-input
          v-model:value="queryValue.orderNo"
          clearable
          placeholder="输入流量方订单号"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="下单客户电话" path="customerPhoneEq">
        <n-input
          v-model:value="queryValue.orderNo"
          clearable
          placeholder="输入下单客户电话"
          :maxlength="11"
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

      <n-form-item label="评论星级" path="serviceStar">
        <n-select
          v-model:value="queryValue.serviceStar"
          placeholder="选择评论星级"
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
import { getOrderEvaluationPage } from "@/api/operateOrder/operateOrder";
export default defineComponent({
  name: "OrderComment",
  components: { BasicTable },
  setup() {
    const loading = ref(false);
    const basicTableRef = ref();
    const itemCount = ref(null);
    const router = useRouter();
    const queryValue = ref<FormInter>({
      timeGe: null,
      timeLe: null,
      orderNo: null,
      orderTypeEq: null,
      driverNoEq: null,
      customerPhoneEq: null,
      serviceStar: null,
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
        title: "订单号",
        key: "orderNo",
        align: "center",
      },
      {
        title: "下单客户电话",
        key: "customerPhone",
        align: "center",
      },
      {
        title: "司机工号",
        key: "operationCompanyDriver.driverNo",
        align: "center",
      },
      {
        title: "司机姓名",
        key: "operationCompanyDriver.driverFullName",
        align: "center",
      },
      {
        title: "评论星级",
        key: "serviceStar",
        align: "center",
      },
      {
        title: "评论内容",
        key: "evaluationContent",
        align: "center",
      },
      {
        title: "评论时间",
        key: "name",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.evaluationTime).format("YYYY-MM-DD HH:mm:ss"));
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
        // let search = { ...queryValue.value };
        let res = await getOrderEvaluationPage({ page, search: {} });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleDetail(record: Recordable) {
      console.log("点击了编辑", record.id);
      router.push({ path: "/operate-order/finished-detail", query: { id: record.id } });
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
        orderNo: null,
        orderTypeEq: null,
        driverNoEq: null,
        customerPhoneEq: null,
        serviceStar: null,
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
      //   getData(toRaw(pagination));
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
      getRowKeyId: (row: TableDataItemInter) => row.orderId,
      statusOptions,
      options: [],
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
