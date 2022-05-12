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
        <n-form-item label="时间区间" path="section">
          <n-date-picker
            v-model:value="queryForm.section"
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
import { FormInst, useMessage } from "naive-ui";
import { FormInter, TableItemInter } from "./type";
import { getAllOperateCompany } from "@/api/common/common";
import { rangeShortcuts } from "@/config/table";
export default defineComponent({
  name: "WithdrawalStatistics",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const companyData = ref([]);

    const queryForm = ref<FormInter>({
      operationCompanyIdEq: null,
      section: null,
    });

    const message = useMessage();

    const totalData = ref([
      {
        id: "123123123",
        driverCount: 2,
        totalCount: 20,
        totalAmount: 200,
      },
    ]);

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

    const detailData = ref([
      {
        id: "123123123",
        name: 2,
        number: 20,
        amount: 200,
        balance: 200,
        create_time: "2022-02-02",
      },
    ]);

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
