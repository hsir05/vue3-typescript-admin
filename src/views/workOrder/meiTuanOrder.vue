<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      :show-feedback="false"
      label-width="120"
      :model="queryForm"
    >
      <n-form-item label="美团订单编号" path="mtOrderIdEq">
        <n-input
          v-model:value="queryForm.mtOrderIdEq"
          clearable
          placeholder="输入美团订单编号"
          style="width: 190px"
        />
      </n-form-item>

      <n-form-item label="处理状态" label-placement="left" path="processStateEq">
        <n-select
          v-model:value="queryForm.processStateEq"
          clearable
          filterable
          placeholder="处理状态"
          style="width: 150px"
          :options="processStateData"
        />
      </n-form-item>

      <n-form-item label="退款状态" label-placement="left" path="refundTypeEq">
        <n-select
          v-model:value="queryForm.refundTypeEq"
          clearable
          filterable
          placeholder="退款状态"
          style="width: 150px"
          :options="refundTypeData"
        />
      </n-form-item>

      <n-button attr-type="button" :loading="loading" class="ml-10px" type="primary" @click="query"
        >查找</n-button
      >
    </n-form>

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
import { FormInst } from "naive-ui";
import { tableDataItem } from "./type";
import BasicTable from "@/components/Table/Table.vue";
import { PaginationState } from "@/api/type";
import { getMeiTuanPage } from "@/api/workOrder/workOrder";
import { processStateData, refundTypeData } from "@/config/form";
export default defineComponent({
  name: "MeiTuanOrder",
  components: { BasicTable },
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const itemCount = ref(null);
    const basicTableRef = ref();
    const data = ref([]);
    const queryForm = ref({
      mtOrderIdEq: null,
      processStateEq: null,
      refundTypeEq: null,
    });
    // const message = useMessage();
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
        render(row: tableDataItem) {
          return h("span", row.processState === 0 ? "未处理" : "已处理");
        },
      },
      {
        title: "退款类型",
        key: "refundType",
        align: "center",
        render(row: tableDataItem) {
          return h(
            "span",
            row.refundType === 0 ? "不涉及退款" : row.refundType === 1 ? "部分退" : "全额退"
          );
        },
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
          getData({ pageIndex: 1, pageSize: 10 });
        } else {
          console.log(errors);
        }
      });
    }

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationState) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationState) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }

    return {
      queryForm,
      queryFormRef,
      itemCount,
      loading,
      columns,
      data,
      processStateData,
      basicTableRef,
      refundTypeData,
      getRowKeyId: (row: tableDataItem) => row.id,
      handlePage,
      handlepagSize,
      reloadPage,
      query,
    };
  },
});
</script>
