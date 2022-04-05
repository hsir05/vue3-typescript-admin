<template>
  <div class="cancel-customer">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="120"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="交易流水号" path="transactionCode">
        <n-input
          v-model:value="queryValue.transactionCode"
          clearable
          placeholder="输入交易流水号"
        />
      </n-form-item>
      <n-form-item label="交易时间(起始)" path="transaction_start">
        <n-date-picker v-model:value="queryValue.transaction_start" type="date" clearable />
      </n-form-item>
      <n-form-item label="交易时间(结束)" path="transaction_end">
        <n-date-picker v-model:value="queryValue.transaction_end" type="date" clearable />
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
        v-model:page="pagination.page"
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
import { defineComponent, ref, h, reactive } from "vue";
import { useMessage, FormInst } from "naive-ui";
import { tableDataItem } from "./type";
import { pageSizes } from "@/config/table";
export default defineComponent({
  name: "TransactionList",
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      transactionCode: null,
      transaction_start: null,
      transaction_end: null,
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const pagination = reactive({
      page: 1,
      pageSize: 10,
    });
    const message = useMessage();

    const columns = [
      {
        type: "selection",
      },
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "客户手机号",
        key: "phone",
        align: "center",
      },
      {
        title: "交易流水号",
        key: "transactionCode",
        align: "center",
      },
      {
        title: "交易类型",
        key: "transactionType",
        align: "center",
      },

      {
        title: "实充交易金额",
        key: "rechargeAmount",
        align: "center",
      },
      {
        title: "赠送交易金额",
        key: "giveAmount",
        width: 110,
        align: "center",
      },

      {
        title: "交易总金额",
        key: "transactionTotalAmount",
        width: 110,
        align: "center",
      },
      {
        title: "交易后钱包余额",
        key: "transactionBlance",
        align: "center",
      },
      {
        title: "当前钱包余额",
        key: "currentAmount",
        width: 110,
        align: "center",
      },

      {
        title: "钱包类型",
        key: "walletType",
        align: "center",
      },
      {
        title: "交易时间",
        key: "create_time",
        width: 110,
        align: "center",
      },
      {
        title: "备注",
        key: "remark",
        width: 110,
        align: "center",
      },
    ];

    const data = ref([
      {
        id: "12313123",
        phone: "string",
        transactionCode: "string",
        transactionType: "string",
        rechargeAmount: "string",
        giveAmount: "string",
        transactionBlance: "string",
        transactionTotalAmount: "string",
        currentAmount: "string",
        walletType: "string",
        remark: "string",
        create_time: "string",
      },
    ]);

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      //   getData({ page: 1, pageSize: 10 });
    };

    const reset = () => {
      queryValue.value = {
        transactionCode: null,
        transaction_start: null,
        transaction_end: null,
      };
      message.info("点击了删除");
      //   getData({ page: 1, pageSize: 10 });
    };

    function handlePage(page: number) {
      console.log(page);
      pagination.page = page;
      //   getData(toRaw(pagination));
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
      getRowKeyId: (row: tableDataItem) => row.id,
      itemCount,

      searchHandle,
      handlePageSize,
      handlePage,
      reset,
    };
  },
});
</script>
