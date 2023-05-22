<template>
  <div class="box">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="80"
      :show-feedback="false"
      class="form-box pb-10px bg-white pt-10px mb-5px"
      :model="queryValue"
    >
      <n-form-item label="订单号" path="orderIdEq">
        <n-input
          v-model:value="queryValue.orderIdEq"
          clearable
          placeholder="输入订单号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="订单状态" path="orderStateEq">
        <n-select v-model:value="queryValue.orderStateEq" :options="options" style="width: 150px" />
      </n-form-item>

      <div class="ml-10px">
        <n-button attr-type="button" type="primary" @click="handleQuery">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>

    <!-- 表格 -->
    <div class="p-5px box-border bg-white" style="height: calc(100vh - 180px)">
      <n-data-table
        :columns="columns"
        :row-key="getRowKeyId"
        min-height="calc(100vh - 300px)"
        flex-height
        :scroll-x="1000"
        :data="data"
        bordered
        :loading="loading"
        :pagination="false"
      />

      <!-- 分页 -->
      <n-pagination
        v-if="itemCount"
        v-model:page="pagination.pageIndex"
        v-model:page-size="pagination.pageSize"
        v-model:item-count="itemCount"
        :page-slot="5"
        :show-size-picker="true"
        :show-quick-jumper="true"
        class="mt-10px justify-end mr-10px"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>
    <!-- <DetailDrawer ref="detailDrawerRef" /> -->
  </div>
</template>
<script lang="ts" setup>
import { ref, h, reactive, toRaw, onMounted } from "vue";
import type { DataTableColumns } from "naive-ui";
import { FormInst, NTag } from "naive-ui";
import { pageSizes } from "@/config/table";
import { IPagination, IState } from "@/interface/common/common";
import TableActions from "@/components/TableActions/TableActions.vue";
import { IForm, ITableData } from "./type";
import { getOrder } from "@/api/order/order";
// import DetailDrawer from "./detailDrawer.vue";
import dayjs from "dayjs";

const loading = ref(true);
const formRef = ref<FormInst | null>(null);
const queryValue = ref<IForm>({
  orderIdEq: null,
  orderStateEq: null,
});
const data = ref([]);
const detailDrawerRef = ref();
const orderState: IState = {
  OS00001: { text: "待付款", color: "rgba(246, 115, 52, 1)" },
  OS00002: { text: "待发货", color: "rgba(255, 141, 26, 1)" },
  OS00003: { text: "待收货", color: "rgba(227, 60, 100, 1)" },
  OS00004: { text: "待评价", color: "rgba(67, 207, 124, 1)" },
  OS00005: { text: "已取消", color: "rgba(153, 153, 153, 1)" },
  OS00006: { text: "已完成", color: "rgba(165, 214, 63, 1)" },
};
const getRowKeyId = (row: ITableData) => row.id;
const itemCount = ref(null);
const options = ref([
  {
    label: "待付款",
    value: "OS00001",
  },
  {
    label: "待发货",
    value: "OS00002",
  },
  {
    label: "待收货",
    value: "OS00003",
  },
  {
    label: "待评论",
    value: "OS00004",
  },
  {
    label: "已取消",
    value: "OS00005",
  },
  {
    label: "已完成",
    value: "OS00006",
  },
]);
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
});

const columns: DataTableColumns<ITableData> = [
  {
    title: "订单ID",
    align: "center",
    key: "orderId",
  },
  {
    title: "所属商户名称",
    align: "center",
    key: "shopName",
  },
  { title: "收货人姓名", align: "center", key: "consigneeName" },
  { title: "总运费(元)", align: "center", key: "totalPostage" },

  {
    title: "应付费用总额(元)",
    align: "center",
    key: "totalFeePayable",
  },
  {
    title: "商品总价(元)",
    align: "center",
    key: "totalCommodityPrice",
  },
  {
    title: "订单状态",
    align: "center",
    key: "orderState",
    width: 90,
    render(row: ITableData) {
      return h(
        NTag,
        {
          color: {
            color: orderState[row.orderState].color,
            textColor: "white",
            borderColor: orderState[row.orderState].color,
          },
        },
        { default: () => orderState[row.orderState].text }
      );
    },
  },
  {
    title: "创建时间",
    key: "createTime",
    align: "center",
    render(record: ITableData) {
      return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm"));
    },
  },
  {
    title: "操作",
    align: "center",
    key: "action",
    render(row: ITableData) {
      return h(TableActions as any, {
        actions: [
          {
            label: "详情",
            size: "14px",
            onclick: () => {
              handleDetail(row.id);
            },
          },
        ],
      });
    },
  },
];

onMounted(() => {
  getData(toRaw(pagination));
});

const getData = async (page: IPagination) => {
  try {
    loading.value = true;
    let option = {
      page: page,
      search: {
        ...queryValue.value,
      },
    };
    console.log(option);
    data.value = [];
    let res = await getOrder(option);
    console.log(res.data.content);
    data.value = res.data.content;
    itemCount.value = res.data.totalElements;
    loading.value = false;
  } catch (err) {
    console.log(err);
    loading.value = false;
  }
};
const handleDetail = (orderId: string) => {
  const { openModal } = detailDrawerRef.value;
  openModal(orderId);
};
const handleQuery = () => {
  pagination.pageIndex = 1;
  getData(toRaw(pagination));
};
const handleReset = () => {
  queryValue.value = {
    orderIdEq: null,
    orderStateEq: null,
  };
  pagination.pageIndex = 1;
  getData(toRaw(pagination));
};

function handlePage(page: number) {
  pagination.pageIndex = page;
  getData(toRaw(pagination));
}
// 每页显示
function handlePageSize(pageSize: number) {
  pagination.pageSize = pageSize;
  getData(toRaw(pagination));
}
</script>
<style lang="scss" scoped>
.box {
  font-size: 18px;
  font-weight: 400;
  box-sizing: border-box;
  height: calc(100vh - 115px);

  .price-range {
    @include flex(center, flex-start);
  }

  .form-box {
    @include flex(center, flex-start);
    flex-wrap: wrap;
  }
}
</style>
