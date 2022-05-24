<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="客户手机号" path="customerPhoneLike">
        <n-input
          v-model:value="queryValue.customerPhoneLike"
          clearable
          placeholder="输入客户手机号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="申请时间(起始)" path="invoiceApplicationTimeLE">
        <n-date-picker
          v-model:value="queryValue.invoiceApplicationTimeLE"
          style="width: 120px"
          type="date"
          clearable
        />
      </n-form-item>
      <n-form-item label="申请时间(结束)" path="invoiceApplicationTimeGE">
        <n-date-picker
          v-model:value="queryValue.invoiceApplicationTimeGE"
          style="width: 120px"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="发票申请状态" path="invoiceApplicationStateEQ">
        <n-select
          clearable
          filterable
          v-model:value="queryValue.invoiceApplicationStateEQ"
          style="width: 150px"
          placeholder="发票申请状态"
          :options="invoiceAppOptions"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <InvoiceDrawer ref="invoiceDrawerRef" :width="700" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import InvoiceDrawer from "./invoiceDrawer.vue";
import { TableDataItemInter } from "./type";
import { invoiceAppOptions, invoiceAppObj } from "@/config/form";
import { getInvoiceAppPage } from "@/api/individualCustomers/individualCustomers";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "InvoiceApplicationList",
  components: { BasicTable, InvoiceDrawer },
  setup() {
    const loading = ref(false);
    const invoiceDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      invoiceApplicationTimeLE: null,
      invoiceApplicationTimeGE: null,
      invoiceApplicationStateEQ: null,
      customerPhoneLike: null,
    });

    const data = ref<TableDataItemInter[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: TableDataItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "客户手机号",
        key: "customerPhone",
        align: "center",
      },
      {
        title: "发票申请类型",
        key: "invoiceApplicationTypeName",
        align: "center",
      },
      {
        title: "发票金额(元)",
        key: "invoiceAmount",
        align: "center",
      },

      {
        title: "发票类型",
        key: "invoiceType",
        align: "center",
      },

      {
        title: "发票抬头",
        key: "invoiceTitle",
        align: "center",
      },
      {
        title: "纳税人识别号",
        key: "taxpayerIdentificationNumber",
        align: "center",
      },

      {
        title: "发票内容",
        key: "invoiceContent",
        align: "center",
      },
      {
        title: "申请时间",
        key: "invoiceApplicationTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.invoiceApplicationTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "发票申请状态",
        key: "invoiceApplicationState",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", invoiceAppObj[record.invoiceApplicationState]);
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handleSee.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                isIconBtn: true,
                icon: RemoveIcon,
                secondary: true,
                auth: ["dict002"],
                popConfirm: {
                  onPositiveClick: handleRemove.bind(null, record),
                  title: "您确定删除?",
                },
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10, sort: [] });
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getInvoiceAppPage({ page, search: search });
        console.log(res.data);
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleSee(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = invoiceDrawerRef.value;
      openDrawer(record);
    }

    function handleRemove(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        invoiceApplicationTimeLE: null,
        invoiceApplicationTimeGE: null,
        invoiceApplicationStateEQ: null,
        customerPhoneLike: null,
      };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      queryValue,
      data,
      loading,
      invoiceDrawerRef,
      basicTableRef,
      invoiceAppOptions,
      getRowKeyId: (row: TableDataItemInter) => row.customerInvoiceApplicationId,
      columns,
      itemCount,

      reloadPage,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
