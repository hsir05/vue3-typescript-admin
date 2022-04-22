<template>
  <div>
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
      <n-form-item label="开通城市" label-placement="left">
        <n-select
          v-model:value="queryForm.cityCode"
          clearable
          filterable
          placeholder="选择开通城市"
          style="width: 260px"
          :options="openCityList.result"
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
        <span>城市单量统计</span>
        <n-select
          clearable
          style="width: 100px"
          filterable
          v-model:value="status"
          @update:value="handleStatus"
          :options="option"
        />
      </div>
      <Order :data="data" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import openCityList from "@/config/openCityList.json";
import { tableDataItem } from "./type";
import Order from "./order.vue";
import { getCityOrder } from "@/api/operationStatistics/operationStatistics";
import { getInfluxList, getOpenCity } from "@/api/common/common";
import { rangeShortcuts } from "@/config/table";
export default defineComponent({
  name: "CityStatistics",
  components: {
    Order,
  },
  setup() {
    const loading = ref(false);
    const status = ref("finished");
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref({
      section: [new Date("2022-03-16"), new Date("2022-03-18")],
      cityCode: "allCity",
    });
    const message = useMessage();

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

    const data = ref([]);

    const columns = [
      {
        title: "流量方",
        key: "flowSquare",
        align: "center",
      },
      {
        title: "完成单量",
        key: "finishOrder",
        align: "center",
      },
      {
        title: "取消单量",
        key: "cancelOrder",
        align: "center",
      },
      {
        title: "无效单量",
        key: "invalidOrder",
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
      getCityOrderData();
    });

    const getData = async () => {
      loading.value = true;
      try {
        let openCity = await getOpenCity();
        console.log(openCity);

        let influx = await getInfluxList();
        console.log(influx);

        let res = await getCityOrder({
          cityCode: "allCity",
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

    const getCityOrderData = async () => {
      try {
        let res = await getCityOrder({ cityCode: "", beginDate: "", endDate: "" });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    function handleStatus(value: string) {
      console.log(value);
    }

    return {
      loading,
      openCityList,
      status,
      option: [
        {
          label: "完成",
          value: "finished",
        },
        {
          label: "取消",
          value: "cancelled",
        },
        {
          label: "无效",
          value: "invalid",
        },
      ],
      queryForm,
      columns,
      data,
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.id,
      rangeShortcuts,

      query,
      handleStatus,
    };
  },
});
</script>
<style lang="scss" scoped></style>
