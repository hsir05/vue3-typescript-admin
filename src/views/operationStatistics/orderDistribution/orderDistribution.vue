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
          :options="openCityData"
        />
      </n-form-item>

      <div class="flex-center">
        <n-form-item label="日期" path="section">
          <n-date-picker
            v-model:value="queryForm.date"
            style="width: 250px"
            type="date"
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
      class="box-border p-10px mt-15px bg-white"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="false"
    />
    <div class="flex mt-10px p-10px bg-white">
      <span>单量每小时分布</span>
      <n-select
        style="width: 100px"
        filterable
        v-model:value="status"
        @update:value="handleStatus"
        :options="option"
      />
    </div>
    <n-spin :show="loading" class="bg-white">
      <Order :data="lineData" :xAxisData="dateData" />
    </n-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { TableDataItemInter, ItemInter } from "./type";
import Order from "./order.vue";
import dayjs from "dayjs";

import { getOrderTimeIntervalDistributed } from "@/api/operationStatistics/operationStatistics";
import { getAllOpenCity } from "@/api/common/common";
export default defineComponent({
  name: "OrderDistribution",
  components: {
    Order,
  },
  setup() {
    const loading = ref(false);
    const status = ref("finished");
    const openCityData = ref([]);

    const lineData = ref<number[]>([]);
    const dateData = ref<number[]>([]);

    interface QueryFormInter {
      date: string | number;
      cityCode: string;
    }
    const queryForm = ref<QueryFormInter>({
      date: new Date().getTime(),
      cityCode: "110000",
    });
    interface DataInter {
      hour06: number;
      hour68: number;
      hour810: number;
      hour1012: number;
      hour1214: number;
      hour1416: number;
      hour1618: number;
      hour1820: number;
      hour2022: number;
      hour2224: number;
      orderBelong: string;
    }
    const data = ref<DataInter[]>([]);
    const allData = ref<ItemInter[]>([]);

    const columns = [
      {
        title: "类型",
        key: "orderBelong",
        align: "center",
      },
      {
        title: "0至6时",
        key: "hour06",
        align: "center",
      },
      {
        title: "6至8时",
        key: "hour68",
        align: "center",
      },
      {
        title: "8至10时",
        key: "hour810",
        align: "center",
      },
      {
        title: "10至12时",
        key: "hour1012",
        align: "center",
      },
      {
        title: "12至14时",
        key: "hour1214",
        align: "center",
      },
      {
        title: "14至16时",
        key: "hour1416",
        align: "center",
      },
      {
        title: "16至18时",
        key: "hour1618",
        align: "center",
      },
      {
        title: "18至20时",
        key: "hour1820",
        align: "center",
      },
      {
        title: "20至22时",
        key: "hour2022",
        align: "center",
      },
      {
        title: "22至24时",
        key: "hour2224",
        align: "center",
      },
    ];

    onMounted(() => {
      getAllOpenData();
      getData();
    });

    const getAllOpenData = async () => {
      try {
        let res = await getAllOpenCity();
        openCityData.value = res.data.map((item: { cityName: string; cityCode: string }) => {
          return { label: item.cityName, value: item.cityCode };
        });
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async () => {
      try {
        loading.value = true;
        data.value = [];
        let option = {
          cityCode: queryForm.value.cityCode,
          date: dayjs(queryForm.value.date).format("YYYY-MM-DD"),
        };
        let res = await getOrderTimeIntervalDistributed(option);
        allData.value = res.data;

        let finished = await getHourData("finished", "完成订单");
        let cancelled = await getHourData("cancelled", "取消订单");
        let invalid = await getHourData("invalid", "无效订单");
        data.value.push(finished);
        data.value.push(cancelled);
        data.value.push(invalid);

        await getLineData(status.value);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getHourData = (type: string, typeName: string): Promise<DataInter> => {
      return new Promise((resolve) => {
        let obj = {
          hour06: 0,
          hour68: 0,
          hour810: 0,
          hour1012: 0,
          hour1214: 0,
          hour1416: 0,
          hour1618: 0,
          hour1820: 0,
          hour2022: 0,
          hour2224: 0,
          orderBelong: typeName,
        };
        let arr = allData.value.filter((item: ItemInter) => item.orderBelong === type);
        for (let key of arr) {
          if (key.orderBelong === type) {
            switch (key.hour) {
              case 0:
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                obj.hour06 += key.orderCount;
                break;
              case 6:
              case 7:
                obj.hour68 += key.orderCount;
                break;
              case 8:
              case 9:
                obj.hour810 += key.orderCount;
                break;
              case 10:
              case 11:
                obj.hour1012 += key.orderCount;
                break;
              case 12:
              case 13:
                obj.hour1214 += key.orderCount;
                break;
              case 14:
              case 15:
                obj.hour1416 += key.orderCount;
                break;
              case 16:
              case 17:
                obj.hour1618 += key.orderCount;
                break;
              case 18:
              case 19:
                obj.hour1820 += key.orderCount;
                break;
              case 20:
              case 21:
                obj.hour2022 += key.orderCount;
                break;
              case 22:
              case 23:
                obj.hour2224 += key.orderCount;
                break;
            }
          }
        }
        resolve(obj);
      });
    };

    const getLineData = (type = "finished"): Promise<boolean> => {
      loading.value = true;
      return new Promise((resolve) => {
        dateData.value = [];
        lineData.value = [];
        let arr = allData.value.filter((item: ItemInter) => item.orderBelong === type);
        dateData.value = arr.map((item: ItemInter) => item.hour);
        lineData.value = arr.map((item: ItemInter) => item.orderCount);
        loading.value = false;
        resolve(true);
      });
    };

    function query() {
      getData();
    }

    function handleStatus(value: string) {
      getLineData(value);
    }

    return {
      loading,
      openCityData,
      status,
      lineData,
      dateData,
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

      query,
      handleStatus,
    };
  },
});
</script>
<style lang="scss" scoped></style>
