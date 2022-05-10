<template>
  <BasicDrawer v-model:show="isDrawer" title="车辆分配" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" :column="1" bordered title="车辆信息">
      <n-descriptions-item label="运营企业">{{
        vehicleData.operationCompanyName
      }}</n-descriptions-item>
    </n-descriptions>
    <n-descriptions label-placement="left" :column="2" bordered style="margin-top: -1px">
      <n-descriptions-item label="车牌号">{{ vehicleData.plateNumber }}</n-descriptions-item>
      <n-descriptions-item label="车辆品牌">{{ vehicleData.vehicleBrand }}</n-descriptions-item>
      <n-descriptions-item label="车系">{{ vehicleData.vehicleSeries }}</n-descriptions-item>
      <n-descriptions-item label="车辆型号">{{ vehicleData.vehicleModel }}</n-descriptions-item>
      <n-descriptions-item label="车辆颜色">{{ vehicleData.vehicleColor }}</n-descriptions-item>
      <n-descriptions-item label="车辆类型">{{ vehicleData.vehicleTypeName }}</n-descriptions-item>
      <n-descriptions-item label="添加时间">{{ vehicleData.createTime }}</n-descriptions-item>
    </n-descriptions>
    <!-- 搜索司机 -->
    <div class="m-10px flex-align-start mt-30px">
      <n-form-item
        ref="formRef"
        :loading="selectLoading"
        path="driverNo"
        label-width="70"
        label="搜索司机"
        label-placement="left"
        :rule="rule"
      >
        <n-select
          v-model:value="driverId"
          remote
          clearable
          filterable
          placeholder="选择司机"
          style="width: 320px"
          @search="handleSearch"
          :options="options"
        />
      </n-form-item>
      <n-button
        attr-type="button"
        :loading="loading"
        class="ml-10px"
        type="primary"
        @click="handleValidate"
        >搜索
      </n-button>
    </div>

    <DirverCard
      :driverInfo="queryDriverData"
      v-if="queryDriverData"
      :isBind="false"
      @on-update="handleBindDriver"
    />

    <n-divider title-placement="left" style="margin-top: 10px">已分配司机</n-divider>
    <div class="driver-show">
      <DirverCard
        :driverInfo="item"
        :isBind="true"
        v-for="item in bindDriverData"
        :key="item.operationCompanyDriverId"
        @on-update="handleUnbindDriver"
      />
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { tableDataItem, DriverInfoInter } from "./type";
import { ApiFilled as ApiOutIcon } from "@vicons/antd";
import DirverCard from "./dirverCard.vue";
import {
  bindDriverList,
  bindDriver,
  findNoDriver,
  getDriverSimple,
  unbindDriver,
} from "@/api/capacity/capacity";
import dayjs from "dayjs";
export default defineComponent({
  name: "VehicleAllDrawer",
  components: { DirverCard },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const operationCompanyDriverId = ref();
    const driverId = ref();

    const vehicleData = ref();
    const selectLoading = ref(false);
    const options = ref<SelectOption[]>([]);

    const bindDriverData = ref();
    const queryDriverData = ref<DriverInfoInter | null>(null);

    function openDrawer(record: tableDataItem) {
      const {
        operationCompanyName,
        operationCompanyId,
        plateNumber,
        operationCompanyVehicleId,
        vehicleTypeName,
        vehicleColor,
        vehicleBrand,
        vehicleSeries,
        vehicleModel,
        createTime,
      } = record;

      vehicleData.value = {
        operationCompanyName,
        plateNumber,
        operationCompanyId,
        vehicleTypeName,
        operationCompanyVehicleId,
        vehicleColor,
        vehicleBrand,
        vehicleSeries,
        vehicleModel,
        createTime: dayjs(createTime).format("YYYY-MM-DD HH:mm"),
      };
      getData();
      state.isDrawer = true;
    }

    const getData = async () => {
      try {
        state.loading = true;
        let res = await bindDriverList({
          operationCompanyVehicleId: vehicleData.value.operationCompanyVehicleId,
        });
        console.log(res);
        bindDriverData.value = res.data;

        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    const handleSearch = async (query: string) => {
      if (!query.length) {
        options.value = [];
        return;
      }
      selectLoading.value = true;
      try {
        let res = await findNoDriver({
          driverNoHeader: query,
          operationCompanyId: vehicleData.value.operationCompanyId,
        });
        options.value = res.data.map((item: { driverId: string; driverNo: string }) => {
          return {
            label: item.driverNo,
            value: item.driverId,
          };
        });
        selectLoading.value = false;
      } catch (err) {
        console.log(err);
        selectLoading.value = false;
      }
    };

    async function handleValidate() {
      try {
        await formRef.value?.validate(driverId.value);
        formRef.value?.restoreValidation();
        getDriverSimple;
        let res = await getDriverSimple({ driverId: driverId.value });
        queryDriverData.value = res.data;
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    const handleBindDriver = async (operationCompanyDriverId: string) => {
      try {
        state.loading = true;
        let res = await bindDriver({
          operationCompanyVehicleId: vehicleData.value.operationCompanyVehicleId,
          operationCompanyDriverId: operationCompanyDriverId,
        });
        console.log(res);

        options.value = [];
        driverId.value = null;
        queryDriverData.value = null;
        getData();
        message.success(window.$tips[res.code]);
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };
    async function handleUnbindDriver(operationCompanyDriverId: string) {
      try {
        state.loading = true;
        let res = await unbindDriver({
          operationCompanyVehicleId: vehicleData.value.operationCompanyVehicleId,
          operationCompanyDriverId: operationCompanyDriverId,
        });
        getData();
        message.success(window.$tips[res.code]);
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    }
    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      bindDriverData.value = [];
      options.value = [];
      driverId.value = null;
      queryDriverData.value = null;
      operationCompanyDriverId.value = null;
      formRef.value?.restoreValidation();
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;

      handleReset();
    }

    return {
      ...toRefs(state),
      bindDriverData,
      operationCompanyDriverId,
      driverId,
      formRef,
      options,
      vehicleData,
      queryDriverData,
      selectLoading,
      rule: { required: true, trigger: ["blur", "change"], message: "请选择司机" },
      onCloseAfter,
      handleSearch,
      handleBindDriver,
      openDrawer,
      handleUnbindDriver,
      ApiOutIcon,
      handleValidate,
      handleSaveAfter,
    };
  },
});
</script>
<style lang="scss" scoped>
.driver-show {
  display: flex;
  align-content: flex-start;

  .driver-item {
    padding: 5px;
    width: 50%;
    border: 1px solid #efeff5;

    .lable {
      font-weight: 500;
    }
  }

  .img-box {
    width: 100px;
    border-radius: 4px;
  }
}
</style>
