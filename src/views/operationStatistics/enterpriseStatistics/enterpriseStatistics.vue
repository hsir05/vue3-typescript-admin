<template>
  <div class="enterprise-statistics">
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
          v-model:value="queryForm.companyId"
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
      <div class="flex mb-20px">
        <span>企业单量统计</span>

        <div class="flex">
          <n-select
            style="width: 100px; margin-right: 10px"
            filterable
            v-model:value="orderType"
            @update:value="handleOrderType"
            :options="orderTypeOption"
          />
          <n-select
            style="width: 100px"
            filterable
            v-model:value="status"
            @update:value="handleStatus"
            :options="orderStateType"
          />
        </div>
      </div>
      <Order />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, onMounted } from "vue";
import { FormInst } from "naive-ui";
import { tableDataItem } from "./type";
import Order from "./order.vue";
import { orderStateType } from "@/config/form";
import { getCompanyOder } from "@/api/operationStatistics/operationStatistics";
import { getInfluxList, getAllOperateCompany } from "@/api/common/common";
import { rangeShortcuts } from "@/config/table";
export default defineComponent({
  name: "EnterpriseStatistics",
  components: {
    Order,
  },
  setup() {
    const loading = ref(false);
    const status = ref("finished");
    const orderType = ref("OT00001");
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref({
      section: [new Date().getTime() - 6 * 60 * 60 * 1000 * 24, new Date().getTime()],
      companyId: "allCompany",
    });

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(queryForm));
        } else {
          console.log(errors);
        }
      });
    }

    const data = ref([]);

    const columns = [
      {
        title: "立即",
        key: "flowSquare",
        align: "center",
      },
      {
        title: "预约",
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

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      loading.value = true;
      try {
        let operationCompany = await getAllOperateCompany();
        console.log(operationCompany);

        let influx = await getInfluxList();
        console.log(influx);

        let res = await getCompanyOder({
          companyId: "allCompany",
          beginDate: "2022-03-16",
          endDate: "2022-03-18",
        });
        console.log(res);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleStatus(value: string) {
      console.log(value);
    }

    function handleOrderType(value: string) {
      console.log(value);
    }

    return {
      loading,
      status,
      orderType,
      orderStateType,
      orderTypeOption: [
        {
          label: "订单类型",
          value: "OT00001",
        },
        {
          label: "车辆类型",
          value: "OT00002",
        },
      ],
      queryForm,
      columns,
      data,
      pagination: {
        pageSize: 10,
      },
      operateCompanyOptions: [],
      getRowKeyId: (row: tableDataItem) => row.id,
      rangeShortcuts,

      query,
      handleStatus,
      handleOrderType,
    };
  },
});
</script>
