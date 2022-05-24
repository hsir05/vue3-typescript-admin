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
      <n-form-item label="交易类型" path="dealTypeEQ">
        <n-radio-group v-model:value="queryValue.dealTypeEQ">
          <n-space>
            <n-radio :value="null">全部</n-radio>
            <n-radio :value="0">入账</n-radio>
            <n-radio :value="1">出账</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="交易流水号" path="dealSerialNumberEQ">
        <n-input
          v-model:value="queryValue.dealSerialNumberEQ"
          clearable
          placeholder="输入交易流水号"
        />
      </n-form-item>
      <n-form-item label="交易时间(起始)" path="dealTimeGE">
        <n-date-picker
          v-model:value="queryValue.dealTimeGE"
          style="width: 120px"
          type="date"
          clearable
        />
      </n-form-item>
      <n-form-item label="交易时间(结束)" path="dealTimeLE">
        <n-date-picker
          v-model:value="queryValue.dealTimeLE"
          style="width: 120px"
          type="date"
          clearable
        />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <div class="bg-white p-10px" style="height: calc(100% - 95px)">
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 95px - 280px)"
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
import { defineComponent, ref, h, toRaw, reactive, onMounted } from "vue";
import { FormInst } from "naive-ui";
import { PaginationInter } from "@/api/type";
import { TableDataItemInrter } from "./type";
import { pageSizes } from "@/config/table";
import dayjs from "dayjs";
import { getOverviewPage } from "@/api/individualCustomers/individualCustomers";
export default defineComponent({
  name: "TransactionList",
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      dealTypeEQ: null,
      dealTimeGE: null,
      dealTimeLE: null,
      dealSerialNumberEQ: null,
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
        title: "客户手机号",
        key: "customer.customerPhone",
        align: "center",
      },
      {
        title: "交易流水号",
        key: "dealSerialNumber",
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
        title: "实充交易金额(元)",
        key: "rechargeDealAmount",
        align: "center",
      },
      {
        title: "赠送交易金额(元)",
        key: "giftDealAmount",
        align: "center",
      },

      {
        title: "交易总金额(元)",
        key: "totalDealAmount",
        align: "center",
      },
      {
        title: "交易后钱包余额(元)",
        key: "customerWalletBalance",
        align: "center",
      },
      {
        title: "当前钱包余额(元)",
        key: "customerWalletBalance",
        align: "center",
      },

      {
        title: "钱包类型",
        key: "customerWallet.customerWalletTypeName",
        align: "center",
      },
      {
        title: "交易时间",
        key: "create_time",
        align: "center",
        render(record: TableDataItemInrter) {
          return h("span", dayjs(record.dealTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },

      {
        title: "备注",
        key: "dealNote",
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
        let res = await getOverviewPage({ page, search: search });
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
        dealTypeEQ: null,
        dealTimeGE: null,
        dealTimeLE: null,
        dealSerialNumberEQ: null,
      };
      getData(pagination);
    };

    function handlePage(page: number) {
      console.log(page);
      pagination.pageIndex = page;
      getData(toRaw(pagination));
    }
    function handlePageSize(pageSize: number) {
      console.log(pageSize);
      pagination.pageSize = pageSize;
      //   getData(toRaw(pagination));
    }

    return {
      queryValue,
      pagination,
      formRef,
      columns,
      loading,
      pageSizes,
      data,
      getRowKeyId: (row: TableDataItemInrter) => row.customerWalletDealRecordId,
      itemCount,

      searchHandle,
      handlePageSize,
      handlePage,
      reset,
    };
  },
});
</script>
