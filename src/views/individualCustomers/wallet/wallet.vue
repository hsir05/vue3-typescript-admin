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
      <n-form-item label="客户手机号" path="customerPhoneLike">
        <n-input
          v-model:value="queryValue.customerPhoneLike"
          clearable
          :maxlenght="11"
          placeholder="输入客户手机号"
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

    <TransactionRecord ref="transactionRecordRef" :width="1000" @on-save-after="handleSaveAfter" />
    <Recharge ref="rechargeRef" :width="700" @on-save-after="handleSaveAfter" />
    <Refund ref="refundRef" :width="700" @on-save-after="handleSaveAfter" />
    <Transfer ref="transferRef" :width="700" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref, onMounted, reactive, toRaw } from "vue";
import { FormInst } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import TransactionRecord from "./transactionRecordDrawer.vue";
import Refund from "./refundDrawer.vue";
import Transfer from "./transferDrawer.vue";
import Recharge from "./rechargeDrawer.vue";
import { TableDataItemInter } from "./type";
import { PaginationInter } from "@/api/type";
import { pageSizes } from "@/config/table";
import { ReaderOutline as ReaderIcon } from "@vicons/ionicons5";
import { getCustomerWalletPage } from "@/api/individualCustomers/individualCustomers";
import {
  PayCircleOutlined as PayCircleIcon,
  TransactionOutlined as TransactionIcon,
  RedEnvelopeOutlined as RedEnvelopeIcon,
} from "@vicons/antd";
import dayjs from "dayjs";
export default defineComponent({
  name: "Wallet",
  components: { TransactionRecord, Recharge, Refund, Transfer },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      customerPhoneLike: null,
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const transactionRecordRef = ref();
    const rechargeRef = ref();
    const refundRef = ref();
    const transferRef = ref();
    const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      sort: [],
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
        title: "客户昵称",
        key: "customerNickname",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render() {
          return h("span", "匿名");
        },
      },
      {
        title: "客户姓名",
        key: "name",
        align: "center",
        render() {
          return h("span", "匿名");
        },
      },
      {
        title: "客户手机号",
        key: "customer.customerPhone",
        align: "center",
        width: 130,
      },
      {
        title: "实充余额(元)",
        key: "rechargeAmountBalance",
        align: "center",
      },
      {
        title: "赠送余额(元)",
        key: "giftAmountBalance",
        align: "center",
      },

      {
        title: "冻结金额(元)",
        key: "frozenAmount",
        align: "center",
      },
      {
        title: "可用余额(元)",
        key: "availableBalance",
        align: "center",
      },
      {
        title: "总余额(元)",
        key: "totalBalance",
        align: "center",
      },
      {
        title: "钱包创建时间",
        key: "customerWalletCreateTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.customerWalletCreateTime).format("YYYY-MM-DD HH:mm"));
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
                label: "交易记录",
                type: "primary",
                icon: ReaderIcon,
                isIconBtn: true,
                onClick: handleRecord.bind(null, record.customerWalletId),
                auth: ["dict001"],
              },
              {
                label: "充值",
                type: "primary",
                icon: PayCircleIcon,
                isIconBtn: true,
                onClick: handleRecharge.bind(null, record.customerWalletId),
                auth: ["dict001"],
              },
              {
                label: "退款",
                type: "primary",
                icon: RedEnvelopeIcon,
                isIconBtn: true,
                onClick: handleRefund.bind(null, record.customerWalletId),
                auth: ["dict001"],
              },
              {
                label: "转账",
                type: "primary",
                icon: TransactionIcon,
                isIconBtn: true,
                onClick: handleTransfer.bind(null, record.customerWalletId),
                auth: ["dict001"],
              },
            ],
          });
        },
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
        let res = await getCustomerWalletPage({ page, search: search });
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
      unref(queryValue).customerPhoneLike = null;
      getData(pagination);
    };

    function handleRecord(customerWalletId: string) {
      const { openDrawer } = transactionRecordRef.value;
      openDrawer(customerWalletId);
    }
    function handleRecharge(customerWalletId: string) {
      const { openDrawer } = rechargeRef.value;
      openDrawer(customerWalletId);
    }

    function handleRefund(customerWalletId: string) {
      const { openDrawer } = refundRef.value;
      openDrawer(customerWalletId);
    }
    function handleTransfer(customerWalletId: string) {
      const { openDrawer } = transferRef.value;
      openDrawer(customerWalletId);
    }

    function handlePage(pageIndex: number) {
      pagination.pageIndex = pageIndex;
      getData(toRaw(pagination));
    }
    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
      getData(toRaw(pagination));
    }

    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData(pagination);
    }

    return {
      queryValue,
      pagination,
      transactionRecordRef,
      refundRef,
      rechargeRef,
      transferRef,
      formRef,
      columns,
      loading,
      pageSizes,
      data,
      getRowKeyId: (row: TableDataItemInter) => row.customerWalletId,
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
