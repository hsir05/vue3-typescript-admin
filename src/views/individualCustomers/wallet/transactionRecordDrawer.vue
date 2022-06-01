<template>
  <BasicDrawer v-model:show="isDrawer" title="交易记录" @on-close-after="onCloseAfter">
    <n-spin :show="loading">
      <n-descriptions label-placement="left" title="个人客户钱包信息" bordered :column="3">
        <n-descriptions-item label="客户昵称">{{
          walletInfo?.customerNickname || "匿名"
        }}</n-descriptions-item>
        <n-descriptions-item label="客户姓名">{{
          walletInfo?.customerName || "匿名"
        }}</n-descriptions-item>
        <n-descriptions-item label="客户手机号">{{
          walletInfo?.customerPhone
        }}</n-descriptions-item>
        <n-descriptions-item label="实充余额(元)">{{
          walletInfo?.rechargeAmountBalance
        }}</n-descriptions-item>
        <n-descriptions-item label="赠送余额(元)">{{
          walletInfo?.giftAmountBalance
        }}</n-descriptions-item>
        <n-descriptions-item label="冻结金额(元)">{{
          walletInfo?.frozenAmount
        }}</n-descriptions-item>
        <n-descriptions-item label="可用余额(元)">{{
          walletInfo?.availableBalance
        }}</n-descriptions-item>
        <n-descriptions-item label="总余额(元)">{{ walletInfo?.totalBalance }}</n-descriptions-item>
        <n-descriptions-item label="钱包创建时间"
          >{{ dayjs(walletInfo?.customerWalletCreateTime).format("YYYY-MM-DD HH:mm") }}
        </n-descriptions-item>
      </n-descriptions>

      <n-divider title-placement="left"> 个人客户钱包交易记录</n-divider>
      <!-- 搜索 -->
      <n-form
        ref="formRef"
        inline
        label-placement="top"
        label-width="120"
        class="mb-10px"
        :show-feedback="false"
        :model="queryValue"
      >
        <n-form-item label="交易时间(起始)" path="dealTimeGE">
          <n-date-picker
            v-model:value="queryValue.dealTimeGE"
            type="datetime"
            style="width: 190px"
            clearable
          />
        </n-form-item>

        <n-form-item label="交易时间(结束)" path="dealTimeLE">
          <n-date-picker
            v-model:value="queryValue.dealTimeLE"
            type="datetime"
            style="width: 190px"
            clearable
          />
        </n-form-item>

        <n-form-item label="会员状态" path="dealTypeEQ">
          <n-radio-group v-model:value="queryValue.dealTypeEQ">
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
    </n-spin>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, h, ref } from "vue";
import { PaginationInter } from "@/api/type";
import { RecordTableInter, RecordFormInter } from "./type";
import { getWalletDealRecordPage } from "@/api/individualCustomers/individualCustomers";
import { FormInst } from "naive-ui";
import dayjs from "dayjs";
export default defineComponent({
  name: "TransactionRecord",
  setup() {
    const formRef = ref<FormInst | null>(null);
    const itemCount = ref(null);
    const queryValue = ref<RecordFormInter>({
      customerWalletIdEQ: null,
      dealTypeEQ: null,
      dealTimeGE: null,
      dealTimeLE: null,
    });
    const loading = ref(false);
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const walletInfo = ref();

    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: RecordTableInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "交易流水号",
        key: "dealSerialNumber",
        align: "center",
      },
      {
        title: "交易类型",
        key: "dealType",
        align: "center",
      },
      {
        title: "实充交易金额(元)",
        key: "rechargeDealAmount",
        align: "center",
      },
      {
        title: "赠送交易金额(元)",
        key: "giftDealAmount",
        align: "center",
      },
      {
        title: "交易总金额(元)",
        key: "totalDealAmount",
        align: "center",
      },
      {
        title: "钱包余额(元)",
        key: "customerWalletBalance",
        align: "center",
      },
      {
        title: "交易时间",
        key: "dealTime",
        align: "center",
        render(record: RecordTableInter) {
          return h("span", dayjs(record.dealTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "交易备注",
        key: "dealNote",
        align: "center",
      },
    ];

    const data = ref([]);

    function openDrawer(customerWalletId: string) {
      if (customerWalletId) {
        queryValue.value.customerWalletIdEQ = customerWalletId;
        getData({ pageIndex: 1, pageSize: 10 });
      }
      state.isDrawer = true;
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      getData({ pageIndex: 1, pageSize: 10 });
    };

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getWalletDealRecordPage({ page, search: search });
        console.log(res.data);
        walletInfo.value = {
          ...res.data.originalCustomerWallet,
          ...res.data.originalCustomerWallet.customer,
        };
        data.value = res.data.page.content;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const reset = () => {
      let customerWalletIdEQ = queryValue.value.customerWalletIdEQ;
      queryValue.value = {
        customerWalletIdEQ: customerWalletIdEQ,
        dealTypeEQ: null,
        dealTimeGE: null,
        dealTimeLE: null,
      };
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      queryValue.value = {
        customerWalletIdEQ: null,
        dealTypeEQ: null,
        dealTimeGE: null,
        dealTimeLE: null,
      };
    }

    return {
      ...toRefs(state),
      columns,
      formRef,
      queryValue,
      loading,
      data,
      pagination: {
        pageSize: 10,
      },
      itemCount,
      walletInfo,
      // summary: (pageData) => {
      //     console.log(pageData);

      //     return {
      //         name: {
      //             value: h(
      //             'span',
      //             { style: { color: 'red' } },
      //             pageData.reduce((prevValue, row) => prevValue + row.age, 0)
      //             ),
      //             colSpan: 3
      //         }
      //     }
      // },
      dayjs,
      getRowKeyId: (row: RecordTableInter) => row.customerWalletDealRecordId,

      openDrawer,
      onCloseAfter,
      searchHandle,
      reset,
    };
  },
});
</script>
