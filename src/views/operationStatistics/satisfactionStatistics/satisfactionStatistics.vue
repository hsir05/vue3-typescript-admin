<template>
  <div class="">
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
          v-model:value="queryForm.operationCompanyId"
          clearable
          filterable
          placeholder="选择运营企业"
          style="width: 260px"
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
import { getSatisfaction } from "@/api/operationStatistics/operationStatistics";
import { tableDataItem, QueryFormInter } from "./type";
import { getAllOperateCompany } from "@/api/common/common";
import { rangeShortcuts } from "@/config/table";
import dayjs from "dayjs";
export default defineComponent({
  name: "SatisfactionStatistics",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const companyData = ref([]);
    const queryForm = ref<QueryFormInter>({
      section: [new Date().getTime() - 6 * 60 * 60 * 1000 * 24, new Date().getTime()],
      operationCompanyId: null,
    });
    const data = ref([]);
    const openCityData = ref([]);

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
        title: "一星单量",
        key: "service1StarOrderCount",
        align: "center",
      },
      {
        title: "二星单量",
        key: "service2StarOrderCount",
        align: "center",
      },
      {
        title: "三星单量",
        key: "service3StarOrderCount",
        align: "center",
      },
      {
        title: "四星单量",
        key: "service4StarOrderCount",
        align: "center",
      },
      {
        title: "五星单量",
        key: "service5StarOrderCount",
        align: "center",
      },
      {
        title: "未评论单量",
        key: "noEvaluationOrderCount",
        align: "center",
      },
      {
        title: "服务满意度",
        key: "service3StarOrderCount",
        align: "center",
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
      loading.value = true;
      try {
        let option = {
          operationCompanyId: queryForm.value.operationCompanyId as string,
          beginDate: dayjs(queryForm.value.section[0]).format("YYYY-MM-DD") as string,
          endDate: dayjs(queryForm.value.section[1]).format("YYYY-MM-DD") as string,
        };
        let res = await getSatisfaction(option);
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
      openCityData,
      queryForm,
      queryFormRef,
      companyData,

      columns,
      data,
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.id,
      rangeShortcuts,

      query,
    };
  },
});
</script>
