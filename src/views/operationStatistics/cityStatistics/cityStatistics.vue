<template>
  <div>
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-10px mb-5px bg-white"
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
          :options="openCityData"
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

    <n-data-table
      :loading="loading"
      ref="table"
      striped
      :columns="columns"
      class="box-border mt-10px p-10px mb-15px bg-white"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="false"
    />
    <div class="flex p-10px bg-white">
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
    <n-spin :show="loading" class="bg-white">
      <Order :data="lineData" :xAxisData="dateData" :legendData="legendData" />
    </n-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { SelectOption } from "naive-ui";
import { TableDataItemInter, ItemInter, ArrItemInter } from "./type";
import Order from "./order.vue";
import { getCityOrder } from "@/api/operationStatistics/operationStatistics";
import { getInfluxList, getAllOpenCity } from "@/api/common/common";
import { rangeShortcuts } from "@/config/table";
import dayjs from "dayjs";
export default defineComponent({
  name: "CityStatistics",
  components: {
    Order,
  },
  setup() {
    const loading = ref(false);
    const status = ref("finished");
    const openCityData = ref<SelectOption[]>([]);
    const queryForm = ref({
      section: [new Date().getTime() - 6 * 60 * 60 * 1000 * 24, new Date().getTime()],
      cityCode: "allCity",
    });
    const influxData = ref([]);
    const allData = ref<ItemInter[]>([]);
    const data = ref<TableDataItemInter[]>([]);

    const legendData = ref<string[]>([]);

    const lineData = ref<ArrItemInter[]>([]);
    const dateData = ref<string[]>([]);

    const columns = [
      {
        title: "流量方",
        key: "influxName",
        align: "center",
      },
      {
        title: "完成单量",
        key: "finished",
        align: "center",
      },
      {
        title: "取消单量",
        key: "cancelled",
        align: "center",
      },
      {
        title: "无效单量",
        key: "invalid",
        align: "center",
      },
      {
        title: "总计",
        key: "orderCount",
        align: "center",
      },
    ];

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      loading.value = true;
      try {
        let result = await getAllOpenCity();
        openCityData.value = result.data.map((item: { cityCode: string; cityName: string }) => {
          return { label: item.cityName, value: item.cityCode };
        });
        openCityData.value.unshift({ label: "全部", value: "allCity" });
        influxData.value = await getInfluxList();
        getCityOrderData();
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getCityOrderData = async () => {
      try {
        loading.value = true;
        legendData.value = [];
        allData.value = [];
        data.value = [];
        dateData.value = [];
        let res = await getCityOrder({
          cityCode: queryForm.value.cityCode,
          beginDate: dayjs(queryForm.value.section[0]).format("YYYY-MM-DD") as string,
          endDate: dayjs(queryForm.value.section[1]).format("YYYY-MM-DD") as string,
        });

        allData.value = res.data;

        const yimin = res.data.filter((item: ItemInter) => item.influxCode === "IFT0001");
        const xiecheng = res.data.filter((item: ItemInter) => item.influxCode === "IFT0002");
        const zhangshanggaotie = res.data.filter(
          (item: ItemInter) => item.influxCode === "IFT0003"
        );
        const rongheyueche = res.data.filter((item: ItemInter) => item.influxCode === "IFT0004");
        const meituanyueche = res.data.filter((item: ItemInter) => item.influxCode === "IFT0005");
        const goupuchuxing = res.data.filter((item: ItemInter) => item.influxCode === "IFT0006");
        const caocaochuxing = res.data.filter((item: ItemInter) => item.influxCode === "IFT0007");
        const feizhuyongche = res.data.filter((item: ItemInter) => item.influxCode === "IFT0008");
        const haluochexing = res.data.filter((item: ItemInter) => item.influxCode === "IFT0009");
        const yueche365 = res.data.filter((item: ItemInter) => item.influxCode === "IFT0010");

        legendData.value.push(yimin[0].influxName);
        legendData.value.push(xiecheng[0].influxName);
        legendData.value.push(zhangshanggaotie[0].influxName);
        legendData.value.push(rongheyueche[0].influxName);
        legendData.value.push(meituanyueche[0].influxName);
        legendData.value.push(goupuchuxing[0].influxName);
        legendData.value.push(caocaochuxing[0].influxName);
        legendData.value.push(feizhuyongche[0].influxName);
        legendData.value.push(haluochexing[0].influxName);
        legendData.value.push(yueche365[0].influxName);

        handleTableData(yimin, yimin[0].influxCode, yimin[0].influxName);
        handleTableData(xiecheng, xiecheng[0].influxCode, xiecheng[0].influxName);
        handleTableData(
          zhangshanggaotie,
          zhangshanggaotie[0].influxCode,
          zhangshanggaotie[0].influxName
        );
        handleTableData(rongheyueche, rongheyueche[0].influxCode, rongheyueche[0].influxName);
        handleTableData(meituanyueche, meituanyueche[0].influxCode, meituanyueche[0].influxName);
        handleTableData(goupuchuxing, goupuchuxing[0].influxCode, goupuchuxing[0].influxName);
        handleTableData(caocaochuxing, caocaochuxing[0].influxCode, caocaochuxing[0].influxName);
        handleTableData(feizhuyongche, feizhuyongche[0].influxCode, feizhuyongche[0].influxName);
        handleTableData(haluochexing, haluochexing[0].influxCode, haluochexing[0].influxName);
        handleTableData(yueche365, yueche365[0].influxCode, yueche365[0].influxName);

        // 获取折线图数据
        await getLineData(status.value);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const handleTableData = (arr: ItemInter[], influxCode: string, influxName: string) => {
      let finished = 0;
      let cancelled = 0;
      let invalid = 0;
      let orderCount = 0;
      for (let i = 0; i < arr.length; i++) {
        orderCount += arr[i].orderCount;
        if (arr[i].orderBelong === "finished") {
          finished += arr[i].orderCount;
        } else if (arr[i].orderBelong === "cancelled") {
          cancelled += arr[i].orderCount;
        } else if (arr[i].orderBelong === "invalid") {
          invalid += arr[i].orderCount;
        }
      }
      let item = { influxName, finished, cancelled, influxCode, invalid, orderCount };
      data.value.push(item);
    };

    const getLineData = (type = "finished") => {
      return new Promise((resolve) => {
        lineData.value = [[], [], [], [], [], [], [], [], [], []];
        let data = allData.value.filter((item: ItemInter) => item.orderBelong === type);
        let arr: ArrItemInter[] = [[], [], [], [], [], [], [], [], [], []];
        for (let key of data) {
          if (key.influxCode === "IFT0001") {
            dateData.value.push(key.date);
            arr[0].push(key.orderCount);
          } else if (key.influxCode === "IFT0002") {
            arr[1].push(key.orderCount);
          } else if (key.influxCode === "IFT0003") {
            arr[2].push(key.orderCount);
          } else if (key.influxCode === "IFT0004") {
            arr[3].push(key.orderCount);
          } else if (key.influxCode === "IFT0005") {
            arr[4].push(key.orderCount);
          } else if (key.influxCode === "IFT0006") {
            arr[5].push(key.orderCount);
          } else if (key.influxCode === "IFT0007") {
            arr[6].push(key.orderCount);
          } else if (key.influxCode === "IFT0008") {
            arr[7].push(key.orderCount);
          } else if (key.influxCode === "IFT0009") {
            arr[8].push(key.orderCount);
          } else if (key.influxCode === "IFT0010") {
            arr[9].push(key.orderCount);
          }
        }
        lineData.value = arr;
        resolve(true);
      });
    };

    function query() {
      getCityOrderData();
    }

    async function handleStatus(value: string) {
      loading.value = true;
      status.value = value;
      await getLineData(value);
      loading.value = false;
    }

    return {
      loading,
      lineData,
      openCityData,
      status,
      dateData,
      legendData,
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
      getRowKeyId: (row: TableDataItemInter) => row.influxCode,
      rangeShortcuts,

      query,
      handleStatus,
    };
  },
});
</script>
<style lang="scss" scoped></style>
