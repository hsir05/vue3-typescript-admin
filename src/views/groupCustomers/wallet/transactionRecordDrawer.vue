<template>
  <BasicDrawer v-model:show="isDrawer" title="交易记录" @on-close-after="onCloseAfter">
    <WalletItem title="个人客户钱包信息" />
    <n-divider title-placement="left"> 个人客户钱包交易记录</n-divider>
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="top"
      label-width="120"
      class="mb-10px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="交易时间(起始)" path="start">
        <n-date-picker
          v-model:value="queryValue.start"
          type="date"
          style="width: 160px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易时间(结束)" path="end">
        <n-date-picker v-model:value="queryValue.end" type="date" style="width: 160px" clearable />
      </n-form-item>

      <n-form-item label="会员状态" path="type">
        <n-radio-group v-model:value="queryValue.type">
          <n-radio :value="null">全部</n-radio>
          <n-radio :value="1">入帐</n-radio>
          <n-radio :value="0">出帐</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>
    <n-data-table
      :loading="loading"
      ref="table"
      striped
      :columns="columns"
      class="box-border"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="pagination"
    />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, h, ref } from "vue";
import { tableDataItem } from "./type";
import WalletItem from "@/components/WalletItem/WalletItem.vue";

import { FormInst } from "naive-ui";
export default defineComponent({
  name: "TransactionRecord",
  components: {
    WalletItem,
  },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      type: null,
      start: null,
      end: null,
    });
    const loading = ref(false);
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const columns = [
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
        align: "center",
      },
      {
        title: "交易总金额",
        key: "transactionTotalAmount",
        align: "center",
      },
      {
        title: "钱包余额",
        key: "walletBalence",
        align: "center",
      },
      {
        title: "交易时间",
        key: "create_time",
        align: "center",
      },
      {
        title: "交易备注",
        key: "remark",
        align: "center",
      },
    ];

    const data = ref([
      {
        id: "12313123",
        transactionCode: "string",
        transactionType: "string",
        rechargeAmount: "1809798797",
        giveAmount: "string",
        transactionTotalAmount: "string",
        walletBalence: "string",
        create_time: "string",
        remark: "string",
      },
    ]);

    function openDrawer(record?: tableDataItem) {
      console.log(record);
      if (record) {
        console.log(record);
      }
      state.isDrawer = true;
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      //   getData({ page: 1, pageSize: 10 });
    };

    const reset = () => {
      queryValue.value = {
        type: null,
        start: null,
        end: null,
      };
      //   getData({ page: 1, pageSize: 10 });
    };

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      ...toRefs(state),
      columns,
      formRef,
      queryValue,
      loading,
      data,
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.id,

      openDrawer,
      onCloseAfter,
      searchHandle,
      reset,
    };
  },
});
</script>
