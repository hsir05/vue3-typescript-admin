<template>
  <div class="h-full box-border withdrawal-statistics">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      :rules="queryRules"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="queryForm"
    >
      <n-form-item label="运营企业" path="operatingEnterprise">
        <n-select
          clearable
          filterable
          v-model:value="queryForm.operatingEnterprise"
          placeholder="选择运营企业"
          :options="options"
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
          >查找</n-button
        >
      </div>
    </n-form>

    <div class="bg-white mt-10px p-10px" style="height: calc(100% - 95px)">
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
import { defineComponent, ref, h, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { queryFormState, tableDataItem } from "./type";
export default defineComponent({
  name: "WithdrawalStatistics",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref<queryFormState>({
      operatingEnterprise: null,
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
        render(_: tableDataItem, rowIndex: number) {
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
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.id,
      rangeShortcuts: {
        今天: [1629216000000, 1631203200000],
        过去3天: () => {
          const cur = new Date().getTime();
          return [cur - 2 * 60 * 60 * 1000, cur];
        },
        过去7天: () => {
          const cur = new Date().getTime();
          return [cur - 2 * 60 * 60 * 1000, cur];
        },
        过去15天: () => {
          const cur = new Date().getTime();
          return [cur - 2 * 60 * 60 * 1000, cur];
        },
        本月: () => {
          const cur = new Date().getTime();
          return [cur - 2 * 60 * 60 * 1000, cur];
        },
        上月: () => {
          const cur = new Date().getTime();
          return [cur - 2 * 60 * 60 * 1000, cur];
        },
      },
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
