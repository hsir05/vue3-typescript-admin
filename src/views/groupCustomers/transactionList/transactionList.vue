<template>
  <div class="cancel-customer">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="120"
      class="pt-15px pb-15px bg-white mb-5px"
      style="flex-wrap: wrap"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="交易类型" path="dealTypeEq">
        <n-radio-group v-model:value="queryValue.dealTypeEq">
          <n-space>
            <n-radio :value="null">全部</n-radio>
            <n-radio :value="0">入账</n-radio>
            <n-radio :value="1">出账</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="交易流水号" path="dealSerialNumberEq">
        <n-input
          v-model:value="queryValue.dealSerialNumberEq"
          clearable
          placeholder="输入交易流水号"
        />
      </n-form-item>
      <n-form-item label="交易时间(起始)" path="dealTimeGe">
        <n-date-picker
          v-model:value="queryValue.dealTimeGe"
          style="width: 120px"
          type="datetime"
          clearable
        />
      </n-form-item>
      <n-form-item label="交易时间(结束)" path="dealTimeLe">
        <n-date-picker
          v-model:value="queryValue.dealTimeLe"
          style="width: 120px"
          type="datetime"
          clearable
        />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <div class="bg-white p-10px">
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 95px - 240px)"
        flex-height
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />

      <n-pagination
        v-model:page="pagination.pageIndex"
        v-model:page-size="pagination.pageSize"
        v-model:item-count="itemCount"
        :page-slot="5"
        show-size-picker
        show-quick-jumper
        class="mt-10px justify-end"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, reactive, onMounted, toRaw } from "vue";
import { FormInst } from "naive-ui";
import { PaginationInter } from "@/api/type";
import { getGroupCustomeRecordPage } from "@/api/groupCustomers/groupCustomers";
import { TableDataItemInrter, QueryFormInter } from "./type";
import { pageSizes } from "@/config/table";
import dayjs from "dayjs";
export default defineComponent({
  name: "TransactionList",
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref<QueryFormInter>({
      dealSerialNumberEq: null,
      dealTypeEq: null,
      dealTimeGe: null,
      dealTimeLe: null,
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
    });
    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: TableDataItemInrter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "集团客户名称",
        key: "groupCustomerName",
        align: "center",
      },
      {
        title: "交易流水号",
        key: "groupCustomerWalletDealRecordId",
        align: "center",
      },
      {
        title: "交易类型",
        key: "dealType",
        align: "center",
        render(row: TableDataItemInrter) {
          return h("span", `${row.dealType === 1 ? "出账" : "入帐"}`);
        },
      },

      {
        title: "实充交易金额",
        key: "rechargeDealAmount",
        align: "center",
      },
      {
        title: "赠送交易金额",
        key: "giftDealAmount",
        width: 110,
        align: "center",
      },

      {
        title: "交易总金额",
        key: "totalDealAmount",
        width: 110,
        align: "center",
      },
      {
        title: "交易后钱包余额",
        key: "groupCustomerWalletBalance",
        align: "center",
      },
      {
        title: "当前钱包余额",
        key: "totalBalance",
        width: 110,
        align: "center",
      },

      {
        title: "交易时间",
        key: "dealTime",
        width: 110,
        align: "center",
        render(record: TableDataItemInrter) {
          return h("span", dayjs(record.dealTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "备注",
        key: "dealNote",
        width: 110,
        align: "center",
      },
    ];

    const data = ref([]);

    onMounted(() => {
      getData(pagination);
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getGroupCustomeRecordPage({ page, search: search });
        console.log(res.data);
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      getData(pagination);
    };
    const reset = () => {
      queryValue.value = {
        dealSerialNumberEq: null,
        dealTypeEq: null,
        dealTimeGe: null,
        dealTimeLe: null,
      };
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function handlePage(pageIndex: number) {
      pagination.pageIndex = pageIndex;
      getData(toRaw(pagination));
    }
    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
      getData(toRaw(pagination));
    }

    return {
      queryValue,
      pagination,
      formRef,
      columns,
      loading,
      pageSizes,
      data,
      getRowKeyId: (row: TableDataItemInrter) => row.groupCustomerWalletDealRecordId,
      itemCount,

      searchHandle,
      handlePageSize,
      handlePage,
      reset,
    };
  },
});
</script>
