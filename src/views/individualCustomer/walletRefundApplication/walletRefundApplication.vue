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
      <n-form-item label="客户手机号" path="phone">
        <n-input v-model:value="queryValue.phone" clearable placeholder="输入客户手机号" />
      </n-form-item>

      <n-form-item label="联系电话" path="phone">
        <n-input v-model:value="queryValue.phone" clearable placeholder="输入联系电话" />
      </n-form-item>

      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="queryValue.type">
          <n-space>
            <n-radio :value="null">全部</n-radio>
            <n-radio :value="0">待处理</n-radio>
            <n-radio :value="1">已处理</n-radio>
          </n-space>
        </n-radio-group>
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

    <RefundModal ref="refundModalRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, reactive } from "vue";
import { useMessage, FormInst, NTag } from "naive-ui";
import { tableDataItem } from "./type";
import { pageSizes } from "@/config/table";
import { CheckboxOutline as CheckboxIcon } from "@vicons/ionicons5";
import TableActions from "@/components/TableActions/TableActions.vue";
import RefundModal from "./refundModal.vue";
export default defineComponent({
  name: "WalletRefundApplication",
  components: { RefundModal },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      type: 1,
      phone: null,
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const refundModalRef = ref();
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
        title: "客户姓名",
        key: "name",
        align: "center",
      },
      {
        title: "客户手机号",
        key: "phone",
        align: "center",
      },
      {
        title: "联系电话",
        key: "relation",
        align: "center",
      },

      {
        title: "状态",
        key: "status",
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.status === 1 ? "success" : "error",
            },
            {
              default: () => (row.status === 1 ? "正常" : "锁定"),
            }
          );
        },
      },
      {
        title: "申请时间",
        key: "create_time",
        width: 110,
        align: "center",
      },
      {
        title: "处理结果",
        key: "result",
        width: 110,
        align: "center",
      },
      {
        title: "处理人",
        key: "resultPerson",
        width: 110,
        align: "center",
      },
      {
        title: "处理时间",
        key: "result_time",
        width: 110,
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "200px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "处理申请",
                type: "primary",
                icon: CheckboxIcon,
                onClick: handleAppliction.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    const data = ref([
      {
        id: "12313123",
        status: "number",
        name: "number",
        phone: "number",
        relation: "number",
        create_time: "number",
        result: "number",
        resultPerson: "number",
        result_time: "number",
      },
    ]);

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      //   getData({ page: 1, pageSize: 10 });
    };

    const reset = () => {
      queryValue.value = {
        type: 1,
        phone: null,
      };
      message.info("点击了删除");
      //   getData({ page: 1, pageSize: 10 });
    };

    function handleAppliction(record: Recordable) {
      console.log(record);

      const { handleModal } = refundModalRef.value;
      handleModal();
    }

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
      refundModalRef,
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
