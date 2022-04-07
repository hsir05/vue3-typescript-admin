<template>
  <div class="driver-statistics">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      :show-feedback="false"
      label-width="100"
      :model="queryForm"
    >
      <n-form-item label="运营企业" label-placement="left">
        <n-select
          v-model:value="queryForm.cityCode"
          clearable
          filterable
          placeholder="选择运营企业"
          style="width: 260px"
          :options="operateCompanyOptions"
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
        :columns="columns"
        class="box-border mb-15px"
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "DriverStatistics",
  setup() {
    const loading = ref(false);

    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref({
      section: [new Date("2022-03-16"), new Date("2022-03-18")],
      cityCode: "allCity",
    });
    const message = useMessage();

    const data = ref([]);

    const columns = [
      {
        title: "司机工号",
        key: "flowSquare",
        align: "center",
      },
      {
        title: "司机姓名",
        key: "finishOrder",
        align: "center",
      },
      {
        title: "接机",
        key: "cancelOrder",
        align: "center",
      },
      {
        title: "送机",
        key: "invalidOrder",
        align: "center",
      },
      {
        title: "半日租",
        key: "total",
        align: "center",
      },
      {
        title: "全日租",
        key: "total",
        align: "center",
      },
      {
        title: "总计",
        key: "total",
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
      columns,
      data,
      getRowKeyId: (row: tableDataItem) => row.id,
      operateCompanyOptions: [],
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

      query,
    };
  },
});
</script>
