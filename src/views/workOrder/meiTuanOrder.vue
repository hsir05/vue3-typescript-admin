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
      <n-form-item label="美团订单编号" path="mtOrderIdEq">
        <n-input
          v-model:value="queryForm.mtOrderIdEq"
          clearable
          placeholder="输入美团订单编号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="处理状态" label-placement="left" path="processStateEq">
        <n-select
          v-model:value="queryForm.processStateEq"
          clearable
          filterable
          placeholder="处理状态"
          style="width: 150px"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="退款状态" label-placement="left" path="refundTypeEq">
        <n-select
          v-model:value="queryForm.refundTypeEq"
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
import { PaginationState } from "@/api/type";
import { getMeiTuanPage } from "@/api/workOrder/workOrder";
export default defineComponent({
  name: "MeiTuanOrder",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const itemCount = ref(null);

    const queryForm = ref({
      mtOrderIdEq: null,
      processStateEq: null,
      refundTypeEq: null,
    });
    const message = useMessage();

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { ...queryForm.value };
        let res = await getMeiTuanPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

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
        key: "orderComplaintId",
        align: "center",
      },
      {
        title: "美团工单编号",
        key: "mtCaseId",
        align: "center",
      },
      {
        title: "问题分类",
        key: "faqId",
        align: "center",
      },
      {
        title: "处理状态",
        key: "processState",
        align: "center",
      },
      {
        title: "退款类型",
        key: "sourceType",
        align: "center",
      },
      {
        title: "退款金额(元)",
        key: "refundAmount",
        align: "center",
      },
      {
        title: "处理人",
        key: "handler",
        align: "center",
      },
    ];

    return {
      queryForm,
      itemCount,
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
