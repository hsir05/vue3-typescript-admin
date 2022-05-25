<template>
  <div class="h-full flex-align-start">
    <div class="map">
      <Map ref="baiduMapRef" />
      <div class="examples">
        <n-tooltip trigger="hover" v-for="(item, index) in data" :key="index">
          <template #trigger>
            <img :src="item.img" class="icon-status" :alt="item.label" />
          </template>
          {{ item.label }}
        </n-tooltip>
      </div>
    </div>

    <div class="map-right">
      <n-form-item ref="formRef" label-width="70" label="运营企业" label-placement="top">
        <n-select
          clearable
          filterable
          @update:value="handleCompany"
          v-model:value="companyId"
          placeholder="选择运营企业"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item ref="formRef" label-width="70" label="司机工号" label-placement="top">
        <n-select
          clearable
          filterable
          v-model:value="dirverNum"
          @update:value="handleDriverNum"
          placeholder="选择司机工号"
          :options="options"
        />
      </n-form-item>

      <n-form-item ref="formRef" label-width="70" label="车辆类型" label-placement="top">
        <n-select
          clearable
          filterable
          v-model:value="vehicleType"
          @update:value="handleVehicleType"
          placeholder="选择车辆类型"
          :options="options"
        />
      </n-form-item>

      <n-divider title-placement="left">异常司机</n-divider>
      <n-empty description="暂无" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Map from "@/components/Map/BaiduMap.vue";
import { getAllOperateCompany } from "@/api/common/common";
import {
  getWorkingDriverList,
  getDriverDetail,
  driverPosition,
} from "@/api/realtimeDynamic/realtimeDynamic";
import idle from "@/assets/image/icon_driver_map_idle.png";
import busy from "@/assets/image/icon_driver_map_busy.png";
import offDuty from "@/assets/image/icon_driver_map_offDuty.png";
import rest from "@/assets/image/icon_driver_map_rest.png";

const companyId = ref();
const dirverNum = ref();
const vehicleType = ref();
const baiduMapRef = ref();
const companyData = ref([]);

onMounted(async () => {
  const { renderBaiduMap } = baiduMapRef.value;
  await renderBaiduMap(103.841521, 36.067212);

  getOperateCompanyData();
});

const data = [
  {
    label: "可接单",
    img: idle,
  },
  {
    label: "服务中",
    img: busy,
  },
  {
    label: "休息中",
    img: offDuty,
  },
  {
    label: "下班",
    img: rest,
  },
];
const options = [
  {
    label: "专车",
    value: "2",
  },
];

const getOperateCompanyData = async () => {
  try {
    let res = await getAllOperateCompany();
    companyData.value = res.data.map(
      (item: { operationCompanyName: string; operationCompanyId: string }) => {
        return { label: item.operationCompanyName, value: item.operationCompanyId };
      }
    );
    if (res.length > 0) {
      let id = res[0].operationCompanyId;
      getWorkingDriver(id);
    }
  } catch (err) {
    console.log(err);
  }
};

function handleDriverNum(value: string) {
  getWorkingDriver(value);
}

const getWorkingDriver = async (id: string) => {
  try {
    let res = await getWorkingDriverList({ operationCompanyId: id });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
function handleVehicleType(value: string) {
  getDetail(value);
}

const getDetail = async (id: string) => {
  try {
    let res = await getDriverDetail({ driverId: id });
    console.log(res);
    getDriverPosition();
  } catch (err) {
    console.log(err);
  }
};
const getDriverPosition = async () => {
  try {
    let res = await driverPosition({ operationCompanyId: "", driverId: "", vehicleType: "" });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
function handleCompany(value: string) {
  console.log(value);
}
</script>
<style lang="scss" scoped>
.map {
  width: calc(100% - 260px - 10px);
  height: 100%;
  overflow: scroll;
  background-color: $white;
  box-sizing: border-box;
  padding-top: 5px;
  padding-left: 5px;
  position: relative;

  .examples {
    position: absolute;
    right: 30px;
    bottom: 30px;
    left: auto;
    width: auto;
    height: 24px;
    padding: 0 10px;
    background-color: #ffffff;
    border-radius: 12px;
  }

  .icon-status {
    cursor: pointer;
    display: inline-block;
    margin: 5px;
  }
}

.map-right {
  // w-255px p-10px ml-10px bg-white h-full box-border
  width: 255px;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-left: 10px;
  background-color: $white;
}
</style>
