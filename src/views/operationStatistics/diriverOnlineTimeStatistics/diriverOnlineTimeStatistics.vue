<template>
  <div class="diriver-online-time-statistics">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px online-time"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="queryForm"
      :rules="rules"
    >
      <n-form-item label="运营企业" path="operationCompanyId">
        <n-select
          v-model:value="queryForm.operationCompanyId"
          @update:value="handleOperationCompanyId"
          clearable
          filterable
          placeholder="选择运营企业"
          style="width: 360px"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item label="统计时段" path="type">
        <n-radio-group v-model:value="type" @update:value="handleType">
          <n-radio value="1">按日统计</n-radio>
          <n-radio value="0">按月统计</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="统计时段" path="day">
        <n-date-picker
          v-model:value="queryForm.day"
          :type="type === '1' ? 'date' : 'month'"
          clearable
          style="width: 180px"
        />
      </n-form-item>

      <n-form-item label="查找方式" path="mode">
        <n-radio-group v-model:value="mode" @update:value="handleMode">
          <n-radio value="driverClazzId">按班组查找</n-radio>
          <n-radio value="driverId">按工号查找</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item
        :label="mode === 'driverClazzId' ? '司机班组' : '司机工号'"
        :path="mode === 'driverClazzId' ? 'driverClazzId' : 'driverId'"
      >
        <n-select
          v-if="mode === 'driverClazzId'"
          v-model:value="queryForm.driverClazzId"
          clearable
          filterable
          :placeholder="'司机班组'"
          style="width: 260px"
          :options="clazzs"
        />

        <n-select
          v-if="mode === 'driverId'"
          v-model:value="queryForm.driverId"
          remote
          clearable
          filterable
          :placeholder="'司机工号'"
          style="width: 260px"
          @search="handleSearch"
          :options="driverData"
        />
      </n-form-item>

      <n-button attr-type="button" :loading="loading" class="ml-10px" type="primary" @click="query"
        >查找
      </n-button>
    </n-form>
    <n-empty v-if="!result" />
    <div v-if="result" class="diriver-online-time-line pl-10px pr-10px mt-10px pt-10px pb-10px">
      <n-grid :x-gap="12" :y-gap="8" :cols="4">
        <template v-for="(item, index) in resultData" :key="index">
          <n-grid-item>
            <dayOrder
              :dayData="item"
              v-if="type === '1'"
              :key="item.operation_company_driver_id"
              @get-is-show="getIsShow"
              @show-model="showModel"
            />
            <monthOrder
              v-if="type === '0'"
              :month="month"
              :dayData="item"
              :key="item.operation_company_driver_id"
              @get-is-show="getIsShow"
            />
          </n-grid-item>
        </template>
      </n-grid>
    </div>
  </div>
  <n-modal v-model:show="isShowModal">
    <n-grid
      x-gap="12"
      :cols="2"
      class="p-30px mt-10px bg-white step"
      style="width: 800px; height: 600px"
    >
      <n-gi class="left">
        <div class="step pb-10px">
          <div class="date mb-10px" v-if="queryForm.day != null">
            <span>{{ dayjs(queryForm.day).format("YYYY-MM-DD") }}</span>
          </div>
          <div
            class="step-content"
            @click="handleEvent(item.driverWorkRestRecordId)"
            v-for="(item, index) in step"
            :key="index"
          >
            <div :class="['step-icon-box', isActive === index ? 'active' : '']">
              <n-icon v-if="item.type === '司机上班'" size="20">
                <CarSharp />
              </n-icon>
              <n-icon v-if="item.type === '司机下班'" size="20">
                <CarSharp />
              </n-icon>
              <n-icon v-if="item.type === '开始小休'" size="20">
                <Cafe />
              </n-icon>
              <n-icon v-if="item.type === '结束小休'" size="20">
                <Cafe />
              </n-icon>
            </div>
            <div class="step-item-text pl-15px">
              <p class="step-text mt-5px">{{ item.type }}</p>
              <span class="time">
                <n-icon size="14" class="icon-item mr-5px"> <TimeIcon /> </n-icon>{{ item.date }}
              </span>
            </div>
          </div>

          <div class="step-content-end">
            <div class="step-icon-box step-end">
              <n-icon size="20">
                <TimeOutline />
              </n-icon>
            </div>
          </div>
        </div>
      </n-gi>
      <n-gi>
        <Map ref="baiduMapRef" class="map" />
      </n-gi>
    </n-grid>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import dayjs from "dayjs";
import { getAllOperateCompany } from "@/api/common/common";
import {
  getDriverClazzs,
  findDriverDayOnlineTimeInfo,
  findDriverMonthOnlineTimeInfo,
  getDriverWorkRestRecord,
} from "@/api/operationStatistics/operationStatistics";
import dayOrder from "./dayOrder.vue";
import monthOrder from "./monthOrder.vue";
import { SelectOption, FormRules, FormInst, useMessage } from "naive-ui";
import { ItemInter } from "../enterpriseStatistics/type";
import { findNoDriver } from "@/api/capacity/capacity";
import { QueryFormInter } from "./type";
import Map from "@/components/Map/BaiduMap.vue";
import { TableDataItemInter } from "@/views/operateOrder/orderDetail/type";
import { TimeOutline as TimeIcon, TimeOutline, Cafe, CarSharp } from "@vicons/ionicons5";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";

export default defineComponent({
  name: "DriverOnlineTimeStatistics",
  components: {
    dayOrder,
    monthOrder,
    Map,
    TimeIcon,
    TimeOutline,
    Cafe,
    CarSharp,
  },
  setup: function () {
    const baiduMapRef = ref();
    const message = useMessage();
    const queryFormRef = ref<FormInst | null>(null);
    const loading = ref(false);
    const type = ref<string>("1");
    const mode = ref("driverClazzId");
    const queryForm = ref<QueryFormInter>({
      day: new Date().getTime(),
      operationCompanyId: null,
      checkType: mode.value,
      driverClazzId: null,
      driverId: null,
    });
    const isActive = ref(0);
    const isShowModal = ref(false);
    const clazzs = ref([]);
    const companyData = ref<ItemInter[]>([]);
    const result = ref(false);
    const resultData = ref();
    const driverData = ref<SelectOption[]>([]);
    const selectLoading = ref(false);
    const month = ref<string>();
    const { appTheme } = useProjectSetting();
    interface StepInter {
      driverWorkRestRecordId: string;
      type: string;
      date?: string | null;
      lng: number;
      lat: number;
    }

    const step = ref<StepInter[]>([]);
    const rules: FormRules = {
      operationCompanyId: [
        {
          required: true,
          message: "请选择企业",
        },
      ],
      day: [
        {
          required: true,
          message: "请选择时间",
        },
      ],
      driverClazzId: [
        {
          required: true,
          message: "请选择司机班组",
        },
      ],
      driverId: [
        {
          required: true,
          message: "请选择司机",
        },
      ],
    };

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      loading.value = true;
      try {
        let company = await getAllOperateCompany();
        companyData.value = company.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getClazzs = async () => {
      clazzs.value = [];
      try {
        if (queryForm.value.operationCompanyId !== null) {
          let res = await getDriverClazzs({
            operationCompanyId: queryForm.value.operationCompanyId,
          });
          clazzs.value = res.data.map((item: { id: string; name: string }) => {
            return { label: item.name, value: item.id };
          });
        }
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getResult = async () => {
      loading.value = true;
      resultData.value = null;
      try {
        let res;
        let option;
        if (type.value === "1") {
          if (mode.value != "driverId") {
            option = {
              operationCompanyId: queryForm.value.operationCompanyId,
              day: dayjs(queryForm.value.day).format("YYYY-MM-DD") as string,
              checkType: queryForm.value.checkType,
              driverClazzId: queryForm.value.driverClazzId,
              driverId: null,
            };
          } else {
            option = {
              operationCompanyId: queryForm.value.operationCompanyId,
              day: dayjs(queryForm.value.day).format("YYYY-MM-DD") as string,
              checkType: queryForm.value.checkType,
              driverId: queryForm.value.driverId,
              driverClazzId: null,
            };
          }

          res = await findDriverDayOnlineTimeInfo(option);
        } else {
          if (mode.value != "driverId") {
            option = {
              operationCompanyId: queryForm.value.operationCompanyId,
              month: dayjs(queryForm.value.day).format("YYYY-MM") as string,
              checkType: queryForm.value.checkType,
              driverClazzId: queryForm.value.driverClazzId,
              driverId: null,
            };
          } else {
            option = {
              operationCompanyId: queryForm.value.operationCompanyId,
              month: dayjs(queryForm.value.day).format("YYYY-MM") as string,
              checkType: queryForm.value.checkType,
              driverId: queryForm.value.driverId,
              driverClazzId: null,
            };
          }
          res = await findDriverMonthOnlineTimeInfo(option);
        }
        if (res.success) {
          month.value = dayjs(queryForm.value.day).format("YYYY-MM") as string;
          result.value = true;
          resultData.value = res.data;
        }
        //console.log(resultData.value);
        loading.value = false;
      } catch (err) {
        loading.value = false;
      }
    };

    const handleSearch = async (query: string) => {
      selectLoading.value = true;
      if (!query.length) {
        driverData.value = [];
        return;
      }
      try {
        if (queryForm.value.operationCompanyId !== null) {
          let res = await findNoDriver({
            driverNoHeader: query,
            operationCompanyId: queryForm.value.operationCompanyId,
          });
          driverData.value = res.data.map((item: { driverId: string; driverNo: string }) => {
            return {
              label: item.driverNo,
              value: item.driverId,
            };
          });
        }
        selectLoading.value = false;
      } catch (err) {
        console.log(err);
        selectLoading.value = false;
      }
    };

    function handleType() {
      queryForm.value.day = null;
    }

    function handleMode(value: string) {
      console.log(value);
      mode.value = value;
      queryForm.value.checkType = value;
    }

    function handleOperationCompanyId(value: string) {
      queryForm.value.operationCompanyId = value;
      queryForm.value.driverClazzId = null;
      queryForm.value.driverId = null;
      driverData.value = [];
      getClazzs();
    }

    function disablePreviousDate(ts: number) {
      return ts > Date.now();
    }

    function query() {
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          getResult();
        } else {
          message.error("请选择查询参数");
        }
      });
    }

    function getIsShow(value: string) {
      const index = resultData.value?.findIndex(
        (item: { driver_no: string }) => item.driver_no === value
      );
      if (index !== undefined && index >= 0) {
        resultData.value?.splice(index, 1);
      }
    }

    function showModel(value: string) {
      const index = resultData.value?.findIndex(
        (item: { operation_company_driver_id: string }) =>
          item.operation_company_driver_id === value
      );
      if (index !== undefined && index >= 0) {
        getDriverWorkRestRecordDateData(value);
      }
    }

    const getDriverWorkRestRecordDateData = async (driverId: string) => {
      let option = {
        operationCompanyId: queryForm.value.operationCompanyId,
        day: dayjs(queryForm.value.day).format("YYYY-MM-DD") as string,
        driverId: driverId,
      };
      try {
        step.value = [];
        let res = await getDriverWorkRestRecord(option);
        res.data;
        console.log(res.message);
        if (res.success) {
          res.data.forEach(function (item: any) {
            step.value.push({
              driverWorkRestRecordId: item.driverWorkRestRecordId,
              type: item.workRestType,
              date: dayjs(item.recordTime).format("hh:mm:ss") as string,
              lng: item.driverOperationLongitude * 1e-6,
              lat: item.driverOperationLatitude * 1e-6,
            });
          });
          isShowModal.value = true;
          console.log(baiduMapRef.value);
          setTimeout(() => {
            initMap(step.value[0].lng, step.value[0].lat);
            handleEvent(step.value[0].driverWorkRestRecordId);
          }, 500);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const handleEvent = (driverWorkRestRecordId: string) => {
      console.log(baiduMapRef.value);
      const index = step.value.findIndex(
        (item) => item.driverWorkRestRecordId === driverWorkRestRecordId
      );
      if (undefined !== index && index >= 0) {
        isActive.value = index;
        handleMap(step.value[index].lng, step.value[index].lat);
      }
    };

    const initMap = (lng: number, lat: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const beginLng = lng;
        const beginEnd = lat;

        const { renderBaiduMap } = baiduMapRef.value;
        renderBaiduMap(beginLng, beginEnd);
        resolve(true);
      });
    };

    const handleMap = (lng: number, lat: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const beginLng = lng;
        const beginEnd = lat;

        const { addMarker, clearOverlays, resetCenter } = baiduMapRef.value;
        clearOverlays();
        resetCenter(beginLng, beginEnd);
        addMarker(beginLng, beginEnd);
        resolve(true);
      });
    };

    return {
      loading,
      type,
      mode,
      queryForm,
      companyData,
      clazzs,
      result,
      driverData,
      rules,
      queryFormRef,
      resultData,
      month,
      isShowModal,
      baiduMapRef,
      step,
      isActive,
      appTheme,
      getRowKeyId: (row: TableDataItemInter) => row.dealSerialNumber,
      query,
      handleType,
      handleMode,
      handleSearch,
      disablePreviousDate,
      handleOperationCompanyId,
      getIsShow,
      showModel,
      handleEvent,
      handleMap,
      dayjs,
    };
  },
});
</script>
<style lang="scss" scoped>
.online-time {
  flex-wrap: wrap;
}

.diriver-online-time-line {
  height: 725px;
  background-color: $white;
}

.left {
  overflow-y: scroll;
}

.right {
  width: calc(100% - 500px - 15px);
  height: 100%;
  padding: 5px;
  background-color: $white;
  margin-left: 10px;
  box-sizing: border-box;
  overflow-y: scroll;
}

.step {
  .date {
    font-size: 14px;
  }
  .date > span {
    padding: 5px;
    border-radius: 4px;
    font-weight: 600;
    color: white;
    background-color: #0073b7 !important;
  }

  .step-content {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    @mixin line {
      content: " ";
      width: 4px;
      height: 16px;
      background-color: #e5e5e5;
      position: absolute;
      left: 22px;
    }

    &::before {
      @include line;
      top: -13px;
    }

    &::after {
      @include line;
      bottom: -14px;
    }
  }

  .step-icon-box {
    width: 45px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border: 1px solid #b4b2b2;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .step-content-end {
    @extend .step-content;

    &::after {
      display: none;
    }
  }

  .step-end {
    width: 30px;
    height: 30px;
    margin-left: 8px;
    margin-top: 3px;
  }

  .step-item-text {
    width: 70%;
  }

  .step-text {
    font-weight: 600;
  }

  .time {
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .active {
    background-color: v-bind(appTheme);
    border-color: #0073b7;

    .n-icon {
      color: #0073b7;
    }
  }
}
</style>
