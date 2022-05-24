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
      <n-form-item label="客户手机号" path="contactPhoneLike">
        <n-input
          v-model:value="queryValue.contactPhoneLike"
          clearable
          placeholder="输入客户手机号"
        />
      </n-form-item>

      <n-form-item label="联系电话" path="contactPhoneLike">
        <n-input v-model:value="queryValue.contactPhoneLike" clearable placeholder="输入联系电话" />
      </n-form-item>

      <n-form-item label="状态" path="dealStateEq">
        <n-radio-group v-model:value="queryValue.dealStateEq">
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
import { defineComponent, ref, h, reactive, onMounted } from "vue";
import { FormInst, NTag } from "naive-ui";
import { TableDataItemInter, QueryFormInter } from "./type";
import { PaginationInter } from "@/api/type";
import { pageSizes } from "@/config/table";
import { CheckboxOutline as CheckboxIcon } from "@vicons/ionicons5";
import TableActions from "@/components/TableActions/TableActions.vue";
import { getRefundApplicationPage } from "@/api/individualCustomers/individualCustomers";
import RefundModal from "./refundModal.vue";
import dayjs from "dayjs";
export default defineComponent({
  name: "WalletRefundApplication",
  components: { RefundModal },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref<QueryFormInter>({
      invoiceApplicationTimeLE: null,
      contactPhoneLike: null,
      dealStateEq: null,
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const refundModalRef = ref();
    const pagination = reactive({
      page: 1,
      pageSize: 10,
    });

    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: TableDataItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "客户姓名",
        key: "customerName",
        align: "center",
        render() {
          return h("span", "匿名");
        },
      },
      {
        title: "客户手机号",
        key: "customerPhone",
        align: "center",
      },
      {
        title: "联系电话",
        key: "contactPhone",
        align: "center",
      },

      {
        title: "状态",
        key: "dealState",
        align: "center",
        render(row: TableDataItemInter) {
          return h(
            NTag,
            {
              type: row.dealState === 1 ? "success" : "error",
            },
            {
              default: () => (row.dealState === 1 ? "正常" : "锁定"),
            }
          );
        },
      },
      {
        title: "申请时间",
        key: "createTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "处理结果",
        key: "dealResult",
        align: "center",
      },
      {
        title: "处理人",
        key: "dealName",
        align: "center",
      },
      {
        title: "处理时间",
        key: "dealTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h(
            "span",
            record.dealState === 0 ? "-" : dayjs(record.dealTime).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "200px",
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "处理申请",
                type: "primary",
                icon: CheckboxIcon,
                isIconBtn: true,
                isShow: record.dealState === 0 ? false : true,
                onClick: handleAppliction.bind(null, record.customerWalletRefundApplicationId),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    const data = ref([]);

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10, sort: [] });
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getRefundApplicationPage({ page, search: search });
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
      getData({ pageIndex: 1, pageSize: 10 });
    };

    const reset = () => {
      queryValue.value = {
        invoiceApplicationTimeLE: null,
        contactPhoneLike: null,
        dealStateEq: null,
      };
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function handleAppliction(customerWalletRefundApplicationId: string) {
      const { handleModal } = refundModalRef.value;
      handleModal(customerWalletRefundApplicationId);
    }

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
      refundModalRef,
      pageSizes,
      data,
      getRowKeyId: (row: TableDataItemInter) => row.customerWalletRefundApplicationId,
      itemCount,

      searchHandle,
      handlePageSize,
      handlePage,
      reset,
    };
  },
});
</script>
