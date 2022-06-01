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
      <n-form-item label="运营企业" path="operationCompanyId">
        <n-select
          v-model:value="queryForm.operationCompanyId"
          clearable
          filterable
          placeholder="选择运营企业"
          style="width: 260px"
          :options="companyData"
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
import { defineComponent, ref, onMounted } from "vue";
import { FormInst } from "naive-ui";
import { tableDataItem, QueryFormInter } from "./type";
import { getAllOperateCompany } from "@/api/common/common";
import { rangeShortcuts } from "@/config/table";
import dayjs from "dayjs";
import { getDriverOrder } from "@/api/operationStatistics/operationStatistics";
export default defineComponent({
  name: "DriverStatistics",
  setup() {
    const loading = ref(false);
    const companyData = ref([]);

    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref<QueryFormInter>({
      section: [new Date().getTime() - 6 * 60 * 60 * 1000 * 24, new Date().getTime()],
      operationCompanyId: null,
    });

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

    onMounted(() => {
      getAllCompanyData();
    });

    const getAllCompanyData = async () => {
      try {
        loading.value = true;
        let res = await getAllOperateCompany();
        queryForm.value.operationCompanyId = res.data[0].operationCompanyId;
        companyData.value = res.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
        getData();
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getData = async () => {
      try {
        let option = {
          operationCompanyId: queryForm.value.operationCompanyId as string,
          beginDate: dayjs(queryForm.value.section[0]).format("YYYY-MM-DD") as string,
          endDate: dayjs(queryForm.value.section[1]).format("YYYY-MM-DD") as string,
        };
        let res = await getDriverOrder(option);
        data.value = res.data;

        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
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
      columns,
      data,
      pagination: {
        pageSize: 10,
      },
      companyData,
      getRowKeyId: (row: tableDataItem) => row.id,
      rangeShortcuts,

      query,
    };
  },
});
</script>
