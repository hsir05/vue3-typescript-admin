<template>
  <div class="h-full box-border withdrawal-statistics">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      :show-feedback="false"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      label-width="130"
      :model="queryForm"
    >
      <n-form-item label="所在企业名称" path="operationCompanyIdEq">
        <n-select
          clearable
          filterable
          v-model:value="queryForm.operationCompanyIdEq"
          placeholder="选择所在企业名称"
          :options="companyData"
        />
      </n-form-item>

      <div class="flex-center">
        <n-form-item label="时间区间" path="timeRange">
          <n-date-picker
            v-model:value="queryForm.timeRange"
            style="width: 250px"
            type="daterange"
            :shortcuts="rangeShortcuts"
            :update-value-on-close="true"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="query"
          >查找
        </n-button>
      </div>
    </n-form>

    <div class="bg-white mt-10px p-10px" style="height: calc(100% - 105px)">
      <n-descriptions bordered label-align="center" content-style="text-align:center">
        <n-descriptions-item label="提现司机个数">{{
          withdrawal.totalWithdrawalDriver
        }}</n-descriptions-item>
        <n-descriptions-item label="提现总次数">{{
          withdrawal.totalWithdrawalCount
        }}</n-descriptions-item>
        <n-descriptions-item label="提现总金额(元)"
          >{{ withdrawal.totalWithdrawalAmount || "暂无" }}
        </n-descriptions-item>
      </n-descriptions>

      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border mt-20px"
        :row-key="getRowKeyId"
        :data="data"
        :pagination="pagination"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import { FormInst, SelectOption } from "naive-ui";
import { FormInter, TableItemInter } from "./type";
import { getAllOperateCompany } from "@/api/common/common";
import { rangeShortcuts } from "@/config/table";
import dayjs from "dayjs";
import { getDriverOverview, getDriverDrawalPage } from "@/api/driverFinance/driverFinance";
export default defineComponent({
  name: "WithdrawalStatistics",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const companyData = ref<SelectOption[]>([]);

    const queryForm = ref<FormInter>({
      operationCompanyIdEq: "all",
      timeRange: [new Date().getTime() - 60 * 1000 * 60 * 24 * 7, new Date().getTime()],
    });

    const withdrawal = ref({
      totalWithdrawalDriver: null,
      totalWithdrawalCount: null,
      totalWithdrawalAmount: null,
    });
    const totalColumns = [
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
        title: "提现司机个数",
        key: "driverCount",
        align: "center",
      },
      {
        title: "提现总次数",
        key: "totalCount",
        align: "center",
      },
      {
        title: "提现总金额",
        key: "totalAmount",
        width: 80,
        align: "center",
      },
    ];

    const data = ref([]);

    const columns = [
      {
        title: "司机姓名",
        key: "name",
        align: "center",
      },
      {
        title: "司机工号",
        key: "number",
        align: "center",
      },
      {
        title: "提现金额",
        key: "amount",
        align: "center",
      },
      {
        title: "提现后钱包余额",
        key: "balance",
        align: "center",
      },
      {
        title: "提现时间",
        key: "create_time",
        align: "center",
      },
    ];

    onMounted(() => {
      getAllCompanyData();
      getData();
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        companyData.value = res.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
        companyData.value.unshift({ label: "不限", value: "all" });
      } catch (err) {
        console.log(err);
      }
    };
    const getData = async () => {
      let search = {
        operationCompanyIdEq: queryForm.value.operationCompanyIdEq,
        dealTimeGe: dayjs(queryForm.value.timeRange[0]).format("YYYY-MM-DD"),
        dealTimeLe: dayjs(queryForm.value.timeRange[1]).format("YYYY-MM-DD"),
      };
      let option = {
        operationCompanyId: queryForm.value.operationCompanyIdEq,
        beginDate: dayjs(queryForm.value.timeRange[0]).format("YYYY-MM-DD"), //yyyy-MM-dd
        endDate: dayjs(queryForm.value.timeRange[1]).format("YYYY-MM-DD"),
      };
      loading.value = true;
      Promise.all([
        getDriverDrawalPage({
          page: { pageIndex: 1, pageSize: 10 },
          search: search,
        }),
        getDriverOverview(option),
      ])
        .then((res) => {
          console.log(res);
          data.value = res[0].data.content;
          withdrawal.value = res[1].data;
          loading.value = false;
        })
        .catch((err) => {
          console.log(err);
          loading.value = false;
        });
    };

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          getData();
        } else {
          console.log(errors);
        }
      });
    }

    return {
      loading,
      queryFormRef,
      queryForm,
      options: [],
      withdrawal,
      totalColumns,
      data,
      columns,
      companyData,
      pagination: {
        pageSize: 10,
      },
      rangeShortcuts,
      getRowKeyId: (row: TableItemInter) => row.id,
      query,
    };
  },
});
</script>
<style lang="scss" scoped>
.withdrawal-statistics {
  box-sizing: border-box;

  &-left {
    width: 400px;
  }

  &-right {
    width: calc(100% - 400px - 10px);
  }
}
</style>
