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
      <n-form-item label="集团客户名称" path="groupCustomerNameLike">
        <n-input
          v-model:value="queryValue.groupCustomerNameLike"
          clearable
          placeholder="输入集团客户名称"
        />
      </n-form-item>
      <n-form-item label="登录账号" path="groupCustomerLoginAccountLike">
        <n-input
          v-model:value="queryValue.groupCustomerLoginAccountLike"
          clearable
          placeholder="输入登录账号"
        />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

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

    <TransactionRecord ref="transactionRecordRef" :width="800" @on-save-after="handleSaveAfter" />
    <Recharge ref="rechargeRef" :width="700" @on-save-after="handleSaveAfter" />
    <Refund ref="refundRef" :width="700" @on-save-after="handleSaveAfter" />
    <Transfer ref="transferRef" :width="700" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import { FormInst } from "naive-ui";
import BasicTable from "@/components/Table/Table.vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import TransactionRecord from "./transactionRecordDrawer.vue";
import Refund from "./refundDrawer.vue";
import Transfer from "./transferDrawer.vue";
import Recharge from "./rechargeDrawer.vue";
import { TableDataItemInter } from "./type";
import { pageSizes } from "@/config/table";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
import { getGroupCustomerWalletPage } from "@/api/groupCustomers/groupCustomers";
import { ReaderOutline as ReaderIcon, WalletOutline as WalletIcon } from "@vicons/ionicons5";
import {
  PayCircleOutlined as PayCircleIcon,
  TransactionOutlined as TransactionIcon,
  RedEnvelopeOutlined as RedEnvelopeIcon,
} from "@vicons/antd";
export default defineComponent({
  name: "GroupWallet",
  components: { TransactionRecord, BasicTable, Recharge, Refund, Transfer },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      groupCustomerNameLike: null,
      groupCustomerLoginAccountLike: null,
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const transactionRecordRef = ref();
    const rechargeRef = ref();
    const basicTableRef = ref();
    const refundRef = ref();
    const transferRef = ref();

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
        title: "集团客户名称",
        key: "groupCustomerName",
        align: "center",
      },
      {
        title: "登录账号",
        key: "groupCustomerLoginAccount",
        align: "center",
      },
      {
        title: "实充余额",
        key: "rechargeAmountBalance",
        align: "center",
      },
      {
        title: "赠送余额",
        key: "giftAmountBalance",
        align: "center",
      },
      {
        title: "冻结金额",
        key: "frozenAmount",
        align: "center",
      },

      {
        title: "可用余额",
        key: "availableBalance",
        align: "center",
      },
      {
        title: "总余额",
        key: "totalBalance",
        align: "center",
      },
      {
        title: "钱包创建时间",
        key: "groupCustomerWalletCreateTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.groupCustomerWalletCreateTime).format("YYYY-MM-DD HH:mm"));
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
                label: "员工钱包",
                type: "primary",
                icon: WalletIcon,
                isIconBtn: true,
                onClick: handleRecord.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "交易记录",
                type: "primary",
                icon: ReaderIcon,
                isIconBtn: true,
                onClick: handleRecord.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "充值",
                type: "primary",
                icon: PayCircleIcon,
                isIconBtn: true,
                onClick: handleRecharge.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "退款",
                type: "primary",
                icon: RedEnvelopeIcon,
                isIconBtn: true,
                onClick: handleRefund.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "转账",
                type: "primary",
                icon: TransactionIcon,
                isIconBtn: true,
                onClick: handleTransfer.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    const data = ref([]);

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getGroupCustomerWalletPage({ page, search: search });
        console.log(res);
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
        groupCustomerNameLike: null,
        groupCustomerLoginAccountLike: null,
      };
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function handleRecord(record: Recordable) {
      console.log(record);
      const { openDrawer } = transactionRecordRef.value;
      openDrawer();
    }
    function handleRecharge(record: Recordable) {
      console.log(record);
      const { openDrawer } = rechargeRef.value;
      openDrawer();
    }

    function handleRefund(record: Recordable) {
      console.log(record);
      const { openDrawer } = refundRef.value;
      openDrawer();
    }
    function handleTransfer(record: Recordable) {
      console.log(record);
      const { openDrawer } = transferRef.value;
      openDrawer();
    }

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10, sort: [] });
    }

    function handlePage(pagination: PaginationInter) {
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
      getData(toRaw(pagination));
    }

    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      queryValue,
      transactionRecordRef,
      refundRef,
      rechargeRef,
      transferRef,
      formRef,
      columns,
      loading,
      pageSizes,
      data,
      basicTableRef,
      getRowKeyId: (row: TableDataItemInter) => row.groupCustomerWalletId,
      itemCount,

      searchHandle,
      reloadPage,
      handlepagSize,
      //   handlePageSize,
      handlePage,
      reset,
      handleSaveAfter,
    };
  },
});
</script>
