<template>
  <BasicDrawer v-model:show="isDrawer" title="交易记录" @on-close-after="onCloseAfter">
    <WalletDetail title="个人客户钱包信息" :walletInfo="walletInfo" />

    <n-divider title-placement="left"> 个人客户钱包交易记录</n-divider>
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="top"
      label-width="120"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="交易时间(起始)" path="dealTimeGe">
        <n-date-picker
          v-model:value="queryValue.dealTimeGe"
          :is-date-disabled="disablePreviousDate"
          type="datetime"
          style="width: 180px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易时间(结束)" path="dealTimeLe">
        <n-date-picker
          v-model:value="queryValue.dealTimeLe"
          :is-date-disabled="disablePreviousDate"
          type="datetime"
          style="width: 180px"
          clearable
        />
      </n-form-item>

      <n-form-item label="交易类型" path="dealTypeEq">
        <n-radio-group v-model:value="queryValue.dealTypeEq">
          <n-radio :value="null">全部</n-radio>
          <n-radio :value="0">入帐</n-radio>
          <n-radio :value="1">出帐</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>
    <!-- 表格 -->
    <n-data-table
      :loading="loading"
      ref="table"
      striped
      :columns="columns"
      class="box-border pb-40px"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="pagination"
    />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, h, ref } from "vue";
import { RecordTableItemInter, RecordFormInter } from "./type";
import WalletDetail from "./walletDetail.vue";
import { FormInst } from "naive-ui";
import { dealWay } from "@/config/table";
import { getRecordPage, getWalletDetail } from "@/api/driverFinance/driverFinance";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "TransactionRecord",
  components: {
    WalletDetail,
  },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref<RecordFormInter>({
      driverWalletIdEq: null,
      dealTypeEq: null,
      dealTimeGe: null,
      dealTimeLe: null,
    });
    const loading = ref(false);
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const walletInfo = ref({
      createTime: null,
      driverNo: null,
      driverFullName: null,
      driverPhone: null,
      totalBalance: null,
      frozenAmount: null,
      availablealance: null,
      reserveBalanceLimit: null,
    });
    const data = ref<RecordTableItemInter[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: RecordTableItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "交易流水号",
        key: "dealSerialNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "交易类型",
        key: "dealType",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(row: RecordTableItemInter) {
          return h("span", row.dealType === 0 ? "入帐" : "出帐");
        },
      },
      {
        title: "交易方式",
        key: "dealWay",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(row: RecordTableItemInter) {
          return h("span", dealWay[row.dealWay]);
        },
      },
      {
        title: "交易金额(元)",
        key: "dealAmount",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "钱包余额(元)",
        key: "driverWalletBalance",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "交易时间",
        key: "dealTime",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(record: RecordTableItemInter) {
          return h("span", dayjs(record.dealTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "交易备注",
        key: "dealNote",
        ellipsis: {
          tooltip: true,
        },
        align: "center",
      },
    ];

    function openDrawer(driverWalletId: string) {
      queryValue.value.driverWalletIdEq = driverWalletId;
      getWalletDetailData(driverWalletId);
      getData({ pageIndex: 1, pageSize: 10 });
      state.isDrawer = true;
    }

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        // let search = {
        //     driverWalletIdEq: queryValue.value.driverWalletIdEq,
        //     dealTypeEq: queryValue.value.dealTypeEq,
        //     dealTimeGe: dayjs(queryValue.value.dealTimeGe).format("YYYY-MM-DD HH:mm:ss"),
        //     dealTimeLe: dayjs(queryValue.value.dealTimeLe).format("YYYY-MM-DD HH:mm:ss")
        //  };
        let res = await getRecordPage({ page, search: search });
        data.value = res.data.content;
        console.log(res);
        // itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    const getWalletDetailData = async (driverWalletId: string) => {
      try {
        let res = await getWalletDetail({ driverWalletId });
        console.log(res);
        walletInfo.value = res.data;
      } catch (err) {
        console.log(err);
      }
    };
    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      getData({ pageIndex: 1, pageSize: 10 });
    };

    const reset = () => {
      queryValue.value = {
        driverWalletIdEq: null,
        dealTypeEq: null,
        dealTimeGe: null,
        dealTimeLe: null,
      };
    };

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      reset();
    }

    return {
      ...toRefs(state),
      columns,
      walletInfo,
      formRef,
      queryValue,
      loading,
      data,
      pagination: {
        pageSize: 10,
      },
      disablePreviousDate(ts: number) {
        return ts > Date.now();
      },
      getRowKeyId: (row: RecordTableItemInter) => row.driverWalletDealRecordId,

      openDrawer,
      onCloseAfter,
      searchHandle,
      reset,
    };
  },
});
</script>
