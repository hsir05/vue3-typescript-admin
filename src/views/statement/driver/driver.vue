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
      label-width="90"
      :model="queryForm"
    >
      <n-form-item label="运营企业" path="companyId">
        <n-select
          clearable
          style="width: 200px"
          v-model:value="queryForm.companyId"
          placeholder="选择运营企业"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item label="流量方" path="influxCode">
        <n-select
          clearable
          filterable
          v-model:value="queryForm.influxCode"
          placeholder="选择流量方"
          :options="influxData"
        />
      </n-form-item>

      <div class="flex-center">
        <n-form-item label="时间区间" path="section">
          <n-date-picker
            v-model:value="queryForm.section"
            style="width: 220px"
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

    <div class="bg-white p-10px" style="height: calc(100% - 95px)">
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 95px - 280px)"
        flex-height
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />

      <!-- 分页 -->
      <n-pagination
        v-if="itemCount"
        v-model:page="page"
        v-model:page-size="pageSize"
        v-model:item-count="itemCount"
        :page-slot="5"
        :show-size-picker="true"
        :show-quick-jumper="true"
        class="mt-10px justify-end mr-10px"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRaw, reactive, onMounted, toRefs } from "vue";
import { FormInst } from "naive-ui";
import { pageSizes, rangeShortcuts } from "@/config/table";
import { getAllOperateCompany, getInfluxList } from "@/api/common/common";
import { getStatementDriverPage } from "@/api/statement/statement";
import { tableDataItem } from "../type";
import dayjs from "dayjs";
export default defineComponent({
  name: "DriverStatement",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);

    interface QueryFomrInter {
      section: number[];
      companyId: string | null;
      influxCode: string | null;
    }
    const queryForm = ref<QueryFomrInter>({
      section: [new Date().getTime() - 6 * 60 * 60 * 1000 * 24, new Date().getTime()],
      companyId: "75e642e0096b4a41a2b2ecf933c92247",
      influxCode: null,
    });
    const itemCount = ref(null);
    const pagination = reactive({
      page: 0,
      pageSize: 10,
    });
    const companyData = ref();
    const influxData = ref();
    const data = ref([]);
    const columns = [
      {
        title: "司机姓名",
        key: "driverFullName",
        align: "center",
      },
      {
        title: "司机编号",
        key: "driverNo",
        align: "center",
      },
      {
        title: "总报价",
        key: "orderTotalCost",
        align: "center",
      },
      {
        title: "总抽成金额",
        key: "totalDivideAmount",
        align: "center",
      },
      {
        title: "司机抽成金额",
        key: "driverDivideAmount",
        align: "center",
      },
    ];

    onMounted(() => {
      getAllCompanyData();
      getInflux();
      getData({ page: 0, pageSize: 10 });
    });

    async function getInflux() {
      try {
        let res = await getInfluxList();
        influxData.value = res.data.map((item: { entryName: string; entryCode: string }) => {
          let obj = {
            label: item.entryName,
            value: item.entryCode,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    }

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
      } catch (err) {
        console.log(err);
      }
    };
    const getData = async (page: { page: number; pageSize: number }) => {
      try {
        loading.value = true;
        let search = {
          companyId: queryForm.value.companyId as string,
          influxCode: queryForm.value.influxCode as string,
          beginDate: dayjs(queryForm.value.section[0]).format("YYYY-MM-DD") as string,
          endDate: dayjs(queryForm.value.section[1]).format("YYYY-MM-DD") as string,
          ...page,
        };
        let res = await getStatementDriverPage(search);
        data.value = res.data.list;
        itemCount.value = res.data.count;
        loading.value = false;
        console.log(res.data.list);
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          getData({ page: 0, pageSize: 10 });
        } else {
          console.log(errors);
        }
      });
    }

    function handlePage(page: number) {
      pagination.page = page;
      getData(toRaw(pagination));
    }
    // 每页显示
    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
      getData(toRaw(pagination));
    }
    return {
      loading,
      queryForm,
      columns,
      data,
      itemCount,
      companyData,
      getRowKeyId: (row: tableDataItem) => row.id,
      pageSizes,
      influxData,
      ...toRefs(pagination),
      rangeShortcuts,

      query,
      handlePage,
      handlePageSize,
    };
  },
});
</script>
