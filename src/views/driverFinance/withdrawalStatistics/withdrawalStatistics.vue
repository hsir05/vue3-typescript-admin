<template>
  <div class="h-full box-border withdrawal-statistics">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      :rules="queryRules"
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
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="totalColumns"
        class="box-border"
        :row-key="getRowKeyId"
        :data="totalData"
        :pagination="false"
      />

      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="detailColumns"
        class="box-border mt-10px"
        :row-key="getRowKeyId"
        :data="detailData"
        :pagination="pagination"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref, onMounted } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
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
      timeRange: [new Date().getTime(), new Date().getTime() + 60 * 1000 * 60 * 24 * 7],
    });

    const message = useMessage();
    const totalData = ref([]);
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

    const detailData = ref([]);

    const detailColumns = [
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
      getOvererData();
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        console.log(res);
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
      try {
        let search = {
          operationCompanyIdEq: queryForm.value.operationCompanyIdEq,
          dealTimeGe: dayjs(queryForm.value.timeRange[0]).format("YYYY-MM-DD"),
          dealTimeLe: dayjs(queryForm.value.timeRange[1]).format("YYYY-MM-DD"),
        };
        let res = await getDriverDrawalPage({
          page: { pageIndex: 1, pageSize: 10 },
          search: search,
        });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    const getOvererData = async () => {
      try {
        let option = {
          operationCompanyId: queryForm.value.operationCompanyIdEq,
          beginDate: dayjs(queryForm.value.timeRange[0]).format("YYYY-MM-DD"), //yyyy-MM-dd
          endDate: dayjs(queryForm.value.timeRange[1]).format("YYYY-MM-DD"),
        };
        let res = await getDriverOverview(option);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(queryForm));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    return {
      loading,
      queryFormRef,
      queryForm,
      options: [],
      totalData,
      totalColumns,
      detailData,
      detailColumns,
      companyData,
      pagination: {
        pageSize: 10,
      },
      rangeShortcuts,
      getRowKeyId: (row: TableItemInter) => row.id,
      queryRules: {
        operatingEnterprise: {
          required: true,
          trigger: ["blur", "change"],
          message: "请选择流量方",
        },
        section: { required: true, trigger: ["blur", "change"], message: "请选择开通城市" },
      },

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
