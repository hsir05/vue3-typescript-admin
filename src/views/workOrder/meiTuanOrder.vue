<template>
  <div>
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      :show-feedback="false"
      label-width="130"
      :model="queryForm"
    >
      <n-form-item label="美团订单编号" path="orderNumber">
        <n-input
          v-model:value="queryForm.orderNumber"
          clearable
          placeholder="输入美团订单编号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="处理状态" label-placement="left" path="status">
        <n-select
          v-model:value="queryForm.status"
          clearable
          filterable
          placeholder="处理状态"
          style="width: 150px"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="退款状态" label-placement="left" path="status">
        <n-select
          v-model:value="queryForm.status"
          clearable
          filterable
          placeholder="退款状态"
          style="width: 150px"
          :options="options"
        />
      </n-form-item>

      <n-button attr-type="button" :loading="loading" class="ml-10px" type="primary" @click="query"
        >查找</n-button
      >
    </n-form>

    <div class="bg-white mt-10px p-10px" style="height: calc(100% - 95px)">
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
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "MeiTuanOrder",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref({
      orderNumber: null,
      status: null,
    });
    const message = useMessage();

    onMounted(() => {});

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(queryForm));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    const data = ref([]);

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
        title: "美团订单编号",
        key: "transactionCode",
        align: "center",
      },
      {
        title: "美团工单编号",
        key: "transactionType",
        align: "center",
      },
      {
        title: "问题分类",
        key: "rechargeAmount",
        align: "center",
      },
      {
        title: "处理状态",
        key: "giveAmount",
        align: "center",
      },
      {
        title: "退款类型",
        key: "transactionTotalAmount",
        align: "center",
      },
      {
        title: "退款金额(元)",
        key: "walletBalence",
        align: "center",
      },
      {
        title: "处理人",
        key: "create_time",
        align: "center",
      },
    ];

    return {
      queryForm,
      loading,
      columns,
      data,
      getRowKeyId: (row: tableDataItem) => row.id,

      pagination: {
        pageSize: 10,
      },
      options: [],
      query,
    };
  },
});
</script>
