<template>
  <div class="cancel-customer">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="90"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="司机工号" path="driverNoLike">
        <n-input
          v-model:value="queryValue.driverNoLike"
          clearable
          placeholder="输入司机工号"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item label="所在企业名称" path="operationCompanyIdEq">
        <n-select
          clearable
          filterable
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择所在企业名称"
          :options="companyData"
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

    <TransactionRecord ref="transactionRecordRef" :width="900" @on-save-after="handleSaveAfter" />
    <ThresholdModal ref="thresholdModalRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRaw, h, onMounted, reactive } from "vue";
import { useMessage, FormInst } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import TransactionRecord from "./transactionRecordDrawer.vue";
import ThresholdModal from "./thresholdModal.vue";
import { TableItemInter } from "./type";
import { PaginationState } from "@/api/type";
import dayjs from "dayjs";
import { pageSizes } from "@/config/table";
import { ReaderOutline as ReaderIcon } from "@vicons/ionicons5";
import { PayCircleOutlined as PayCircleIcon } from "@vicons/antd";
import { getAllOperateCompany } from "@/api/common/common";
import { getWalletPage } from "@/api/driverFinance/driverFinance";
export default defineComponent({
  name: "Wallet",
  components: { TransactionRecord, ThresholdModal },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      driverNoLike: null,
      operationCompanyIdEq: null,
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const transactionRecordRef = ref();
    const thresholdModalRef = ref();
    const companyData = ref([]);

    const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
    });
    const message = useMessage();

    const columns = [
      // {
      //     type: "selection",
      // },
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: TableItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "司机工号",
        key: "driverNo",
        align: "center",
      },
      {
        title: "司机姓名",
        key: "driverFullName",
        align: "center",
      },
      {
        title: "司机性别",
        key: "driverGender",
        align: "center",
        render(row: TableItemInter) {
          return h(
            "span",
            `${row.driverGender === 1 ? "男" : row.driverGender === 0 ? "女" : "未知"}`
          );
        },
      },
      {
        title: "司机手机号",
        key: "driverPhone",
        align: "center",
      },
      {
        title: "运营企业",
        key: "operationCompanyName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "总金额(元)",
        key: "totalBalance",
        align: "center",
      },
      {
        title: "冻结金额(元)",
        key: "frozenAmount",
        align: "center",
      },
      {
        title: "可用余额(元)",
        key: "availablealance",
        align: "center",
      },
      {
        title: "预留阈值",
        key: "reserveBalanceLimit",
        align: "center",
      },
      {
        title: "钱包创建时间",
        key: "createTime",
        align: "center",
        render(record: TableItemInter) {
          return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        render(record: TableItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "交易记录",
                type: "primary",
                icon: ReaderIcon,
                isIconBtn: true,
                onClick: handleRecord.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "修改预留阀值",
                type: "primary",
                icon: PayCircleIcon,
                isIconBtn: true,
                onClick: handleThreshold.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    const data = ref([]);

    onMounted(() => {
      getAllCompanyData();
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        console.log(res);
        companyData.value = res.data.map(
          (item: { operationCityName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCityName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getWalletPage({ page, search: search });
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
        driverNoLike: null,
        operationCompanyIdEq: null,
      };
      message.info("点击了删除");
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function handleRecord(record: Recordable) {
      const { openDrawer } = transactionRecordRef.value;
      openDrawer(record.driverWalletId);
    }
    function handleThreshold(record: Recordable) {
      console.log(record);
      const { handleModal } = thresholdModalRef.value;
      handleModal({
        reserveBalanceLimit: record.reserveBalanceLimit,
        driverWalletId: record.driverWalletId,
      });
    }
    function handlePage(page: number) {
      console.log(page);
      pagination.pageIndex = page;
      getData(toRaw(pagination));
    }
    function handlePageSize(pageSize: number) {
      console.log(pageSize);
      pagination.pageSize = pageSize;
      getData(toRaw(pagination));
    }

    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      queryValue,
      pagination,
      transactionRecordRef,
      thresholdModalRef,
      formRef,
      columns,
      loading,
      pageSizes,
      data,
      companyData,
      getRowKeyId: (row: TableItemInter) => row.driverWalletId,
      itemCount,

      searchHandle,
      handlePageSize,
      handlePage,
      reset,
      handleSaveAfter,
    };
  },
});
</script>
