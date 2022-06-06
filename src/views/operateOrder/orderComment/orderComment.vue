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
      <n-form-item label="订单号" path="orderNoEq">
        <n-input
          v-model:value="queryValue.orderNoEq"
          clearable
          placeholder="输入流量方订单号"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="下单客户电话" path="customerPhoneEq">
        <n-input
          v-model:value="queryValue.customerPhoneEq"
          clearable
          placeholder="输入下单客户电话"
          :maxlength="11"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="评论星级" path="serviceStarEq">
        <n-select
          v-model:value="queryValue.serviceStarEq"
          placeholder="选择评论星级"
          :options="options"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="交易时间(起始)" path="evaluationTimeGe">
        <n-date-picker
          v-model:value="queryValue.evaluationTimeGe"
          type="date"
          style="width: 150px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易时间(结束)" path="evaluationTimeLe">
        <n-date-picker
          v-model:value="queryValue.evaluationTimeLe"
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
import { getOrderEvaluationPage, getOrderType } from "@/api/operateOrder/operateOrder";
export default defineComponent({
  name: "OrderComment",
  components: { BasicTable },
  setup() {
    const loading = ref(false);
    const basicTableRef = ref();
    const itemCount = ref(null);
    const router = useRouter();
    const queryValue = ref<FormInter>({
      orderNoEq: null,
      customerPhoneEq: null,
      serviceStarEq: null,
      orderTypeEq: null,
      evaluationTimeGe: null,
      evaluationTimeLe: null,
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
                onClick: handleDetail.bind(null, record.orderId),
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
        let res = await getOrderEvaluationPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    async function handleDetail(orderId: string) {
      try {
        let res = await getOrderType({ orderId });
        console.log(res.data);
        if (res.data) {
          switch (res.data) {
            case "orderServinged":
              pathTo(orderId, "serving");
              break;
            case "orderFinished":
              pathTo(orderId, "finished");
              break;
            case "orderCancelled":
              pathTo(orderId, "channel");
              break;
            case "orderInvalided":
              pathTo(orderId, "invalid");
              break;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    const pathTo = (id: string, type: string) => {
      router.push({
        path: "/operate-order/order-detail",
        query: { id: id, orderState: type },
      });
    };

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        orderNoEq: null,
        customerPhoneEq: null,
        serviceStarEq: null,
        orderTypeEq: null,
        evaluationTimeGe: null,
        evaluationTimeLe: null,
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
