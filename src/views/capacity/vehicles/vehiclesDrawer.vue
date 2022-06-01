<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '440px' }"
      require-mark-placement="right-hanging"
      label-width="160"
      :model="form"
    >
      <n-form-item label="车牌号" path="plateNumber">
        <n-input v-model:value="form.plateNumber" clearable placeholder="输入车牌号" />
      </n-form-item>
      <n-form-item label="车牌颜色" path="plateColor">
        <n-input v-model:value="form.plateColor" clearable placeholder="输入车牌颜色" />
      </n-form-item>
      <n-form-item label="车辆品牌" path="vehicleBrand">
        <n-input v-model:value="form.vehicleBrand" clearable placeholder="输入车辆品牌" />
      </n-form-item>
      <n-form-item label="车系" path="vehicleSeries">
        <n-input v-model:value="form.vehicleSeries" clearable placeholder="输入车系" />
      </n-form-item>

      <n-form-item label="核定载客位(位)" path="vehicleSeats">
        <n-input-number
          v-model:value="form.vehicleSeats"
          :min="1"
          :max="20"
          clearable
          placeholder="输入核定载客位"
        />
      </n-form-item>
      <n-form-item label="发动机号" path="vehilceEngineId">
        <n-input v-model:value="form.vehilceEngineId" clearable placeholder="输入发动机号" />
      </n-form-item>
      <n-form-item label="车辆VIN码" path="vehicleVin">
        <n-input v-model:value="form.vehicleVin" clearable placeholder="输入车辆VIN码" />
      </n-form-item>
      <n-form-item label="燃料类型" path="vehicleFuelType">
        <n-input v-model:value="form.vehicleFuelType" clearable placeholder="输入燃料类型" />
      </n-form-item>

      <n-form-item label="发动机排量(毫升/千瓦)" path="vehicleEngineDisplace">
        <n-input
          v-model:value="form.vehicleEngineDisplace"
          clearable
          placeholder="输入发动机排量（毫升/千瓦）"
        />
      </n-form-item>
      <n-form-item label="行驶证类型" path="vehicleDrivingPermitType">
        <n-input
          v-model:value="form.vehicleDrivingPermitType"
          clearable
          placeholder="输入行驶证类型"
        />
      </n-form-item>
      <n-form-item label="车辆型号" path="vehicleModel">
        <n-input v-model:value="form.vehicleModel" clearable placeholder="输入车辆型号" />
      </n-form-item>

      <n-form-item label="车辆类型" path="vehicleTypeId">
        <n-select
          clearable
          filterable
          v-model:value="form.vehicleTypeId"
          placeholder="选择车辆类型"
          :options="vehicleTypeData"
        />
      </n-form-item>
      <n-form-item label="车辆注册日期" path="vehicleCertifyDate">
        <n-date-picker
          v-model:value="form.vehicleCertifyDate"
          :is-date-disabled="disablePreviousDate"
          style="width: 280px"
          type="date"
          clearable
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          :disabled="disabled"
          type="primary"
          @click="handleValidate"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          :disabled="disabled"
          class="ml-10px"
          @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { rules } from "./data";
import { tableDataItem } from "./type";
import { vehicleEdit } from "@/api/capacity/capacity";
import { getVehicleType } from "@/api/operate/operate";
export default defineComponent({
  name: "VehiclesDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      vehicleTypeData: [],
    });
    const title = ref("车辆管理");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      operationCompanyVehicleId: null,
      plateColor: null,
      plateNumber: null,
      vehicleBrand: null,
      vehicleCertifyDate: null,
      vehicleColor: null,
      vehicleDrivingPermitType: null,
      vehicleEngineDisplace: null,
      vehicleFuelType: null,
      vehicleModel: null,
      vehicleNote: null,
      vehicleSeats: null,
      vehicleSeries: null,
      vehicleState: null,
      vehicleTypeId: null,
      vehicleVin: null,
      vehilceEngineId: null,
    });

    onMounted(() => {
      getAllVehicleTypeData();
    });

    const getAllVehicleTypeData = async () => {
      try {
        let res = await getVehicleType({ operationCompanyId: "" });
        state.vehicleTypeData = res.data.map(
          (item: { vehicleTypeName: string; vehicleTypeId: string }) => {
            let obj = {
              label: item.vehicleTypeName,
              value: item.vehicleTypeId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    function openDrawer(t: string, item: tableDataItem, status: string) {
      console.log(item);
      if (status === "see") {
        state.disabled = true;
      } else if (item) {
        state.disabled = false;
      }
      title.value = t;
      form.value = item;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          console.log(unref(form));
          try {
            let res = await vehicleEdit(form.value);
            console.log(res);
            handleSaveAfter();
            message.success(window.$tips[res.code]);
            state.loading = false;
          } catch (err) {
            console.log(err);
            state.loading = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      let operationCompanyVehicleId = form.value.operationCompanyVehicleId;
      form.value = {
        operationCompanyVehicleId: operationCompanyVehicleId,
        plateColor: null,
        plateNumber: null,
        vehicleBrand: null,
        vehicleCertifyDate: null,
        vehicleColor: null,
        vehicleDrivingPermitType: null,
        vehicleEngineDisplace: null,
        vehicleFuelType: null,
        vehicleModel: null,
        vehicleNote: null,
        vehicleSeats: null,
        vehicleSeries: null,
        vehicleState: null,
        vehicleTypeId: null,
        vehicleVin: null,
        vehilceEngineId: null,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      formRef,
      title,
      rules,
      form,
      disablePreviousDate(ts: number) {
        return ts > Date.now();
      },
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
