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
      <n-form-item label="运营企业" path="companyId">
        <n-select
          v-model:value="queryForm.companyId"
          clearable
          filterable
          placeholder="选择运营企业"
          style="width: 260px"
          :options="operateCompanyOptions"
        />
      </n-form-item>

      <n-form-item label="时间区间" path="section">
        <n-date-picker
          v-model:value="queryForm.section"
          style="width: 250px"
          type="daterange"
          :shortcuts="rangeShortcuts"
          :update-value-on-close="true"
        />
      </n-form-item>

      <n-button attr-type="button" :loading="loading" class="ml-10px" type="primary" @click="query"
        >查找</n-button
      >
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
        :pagination="pagination"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
import { rangeShortcuts } from "@/config/table";
export default defineComponent({
  name: "DriverStatistics",
  setup() {
    const loading = ref(false);

    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref({
      section: [new Date("2022-03-16"), new Date("2022-03-18")],
      companyId: "75e642e0096b4a41a2b2ecf933c92247",
    });
    const message = useMessage();

    const data = ref([]);

    const columns = [
      {
        title: "司机工号",
        key: "driverNo",
        align: "center",
      },
      {
        title: "司机姓名",
        key: "driverName",
        align: "center",
      },
      {
        title: "单量",
        key: "orderCount",
        align: "center",
      },
      {
        title: "去接乘客期间累计",
        key: "attrs",
        align: "center",
        children: [
          {
            title: "里程(km)",
            key: "receptionMileage",
            align: "center",
          },
          {
            title: "时长(分钟)",
            key: "receptionDuration",
            align: "center",
          },
        ],
      },
      {
        title: "等待服务期间累计",
        key: "attrs",
        align: "center",
        children: [
          {
            title: "里程(km)",
            key: "waitMileage",
            align: "center",
          },
          {
            title: "时长(分钟)",
            key: "waitDuration",
            align: "center",
          },
        ],
      },
      {
        title: "服务中累计",
        key: "attrs",
        align: "center",
        children: [
          {
            title: "里程(km)",
            key: "serviceMileage",
            align: "center",
          },
          {
            title: "时长(分钟)",
            key: "serviceDuration",
            align: "center",
          },
        ],
      },
      {
        title: "费用提交期间累计",
        key: "attrs",
        align: "center",
        children: [
          {
            title: "里程(km)",
            key: "submissionMileage",
            align: "center",
          },
          {
            title: "时长(分钟)",
            key: "submissionDuration",
            align: "center",
          },
        ],
      },
    ];

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(queryForm));
          //   let { companyId, beginDate: section[0], endDate: section[1] } = unref(queryForm)
          console.log({
            companyId: unref(queryForm).companyId,
            beginDate: unref(queryForm).section[0],
            endDate: unref(queryForm).section[0],
          });

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
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.id,
      operateCompanyOptions: [],
      rangeShortcuts,

      query,
    };
  },
});
</script>
