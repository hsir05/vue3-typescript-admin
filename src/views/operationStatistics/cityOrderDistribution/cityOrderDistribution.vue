<template>
  <div class="h-full box-border">
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
          @update:value="handleCity"
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

    <div class="map">
      <n-select
        class="status-select"
        filterable
        v-model:value="status"
        @update:value="handleStatus"
        :options="orderStateType"
      />
      <Map ref="baiduMapRef" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { FormInst } from "naive-ui";
import { getAllOpenCity } from "@/api/common/common";
import { orderStateType } from "@/config/form";
import { rangeShortcuts } from "@/config/table";
import Map from "@/components/Map/BaiduMap.vue";
import { objInter } from "@/interface/common/common";
import dayjs from "dayjs";
import { ItemInter } from "./type";
import { findOrderLocations } from "@/api/operationStatistics/operationStatistics";
export default defineComponent({
  name: "CityOrderDistribution",
  components: { Map },
  setup() {
    const loading = ref(false);
    const openCityData = ref<ItemInter[]>([]);
    const status = ref("finished");
    const baiduMapRef = ref();
    const queryFormRef = ref<FormInst | null>(null);
    const allData = ref<objInter>({});
    let obj: objInter = {
      finished: "finishedList",
      cancelled: "cancelledList",
      invalid: "invalidList",
    };

    const queryForm = ref({
      section: [new Date().getTime() - 6 * 60 * 60 * 1000 * 24, new Date().getTime()],
      cityCode: "110000",
      lat: 39.957932,
      lng: 116.381003,
    });

    onMounted(async () => {
      getAllCityData();
    });

    const getAllCityData = async () => {
      loading.value = true;
      try {
        let result = await getAllOpenCity();
        openCityData.value = result.data.map(
          (item: { cityCode: string; cityName: string; lng: number; lat: number }) => {
            return { label: item.cityName, value: item.cityCode, lng: item.lng, lat: item.lat };
          }
        );

        getData();

        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getData = async () => {
      loading.value = true;
      try {
        let option = {
          cityCode: queryForm.value.cityCode,
          beginDate: dayjs(queryForm.value.section[0]).format("YYYY-MM-DD") as string,
          endDate: dayjs(queryForm.value.section[1]).format("YYYY-MM-DD") as string,
        };
        let res = await findOrderLocations(option);

        allData.value = res.data;

        const { renderBaiduMap, addHeartMap, refreshHeatMap } = baiduMapRef.value;
        renderBaiduMap(queryForm.value.lng, queryForm.value.lat);
        addHeartMap();

        refreshHeatMap(allData.value[obj[status.value]]);

        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleCity(cityCode: string) {
      let item: ItemInter | undefined = openCityData.value.find(
        (item: ItemInter) => item.value === cityCode
      );
      if (item) {
        queryForm.value.lng = item.lng;
        queryForm.value.lat = item.lat;
        queryForm.value.cityCode = cityCode;
        const { renderBaiduMap } = baiduMapRef.value;
        renderBaiduMap(item.lng, item.lat);
      }
    }

    function handleStatus(value: string) {
      loading.value = true;

      const { refreshHeatMap } = baiduMapRef.value;
      refreshHeatMap(allData.value[obj[value]]);

      setTimeout(() => {
        loading.value = false;
      }, 500);
    }

    function query() {
      getData();
    }

    return {
      loading,
      baiduMapRef,
      queryFormRef,
      status,
      queryForm,
      openCityData,
      rangeShortcuts,
      orderStateType,

      handleStatus,
      handleCity,
      query,
    };
  },
});
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: calc(100% - 90px);
  position: relative;
}

.status-select {
  width: 100px;
  position: absolute;
  top: 5px;
  right: 40px;
  z-index: 900;
}
</style>
