<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '460px' }"
      require-mark-placement="right-hanging"
      label-width="160"
      :model="form"
    >
      <n-form-item label="车牌号" path="plageNumber">
        <n-input v-model:value="form.plageNumber" clearable placeholder="输入车牌号" />
      </n-form-item>
      <n-form-item label="车牌颜色" path="color">
        <n-input v-model:value="form.color" clearable placeholder="输入车牌颜色" />
      </n-form-item>
      <n-form-item label="车辆品牌" path="brand">
        <n-input v-model:value="form.brand" clearable placeholder="输入车辆品牌" />
      </n-form-item>
      <n-form-item label="车系" path="carSeies">
        <n-input v-model:value="form.carSeies" clearable placeholder="输入车系" />
      </n-form-item>

      <n-form-item label="核定载客位(位)" path="plate">
        <n-input v-model:value="form.plate" clearable placeholder="输入核定载客位" />
      </n-form-item>
      <n-form-item label="发动机号" path="engineNumber">
        <n-input v-model:value="form.engineNumber" clearable placeholder="输入发动机号" />
      </n-form-item>
      <n-form-item label="车辆VIN码" path="vin">
        <n-input v-model:value="form.vin" clearable placeholder="输入车辆VIN码" />
      </n-form-item>
      <n-form-item label="燃料类型" path="fuelType">
        <n-input v-model:value="form.fuelType" clearable placeholder="输入燃料类型" />
      </n-form-item>

      <n-form-item label="发动机排量(毫升/千瓦)" path="engineDisplacement">
        <n-input
          v-model:value="form.engineDisplacement"
          clearable
          placeholder="输入发动机排量（毫升/千瓦）"
        />
      </n-form-item>
      <n-form-item label="行驶证类型" path="drivingPermitType">
        <n-input v-model:value="form.drivingPermitType" clearable placeholder="输入行驶证类型" />
      </n-form-item>
      <n-form-item label="车辆注册日期" path="vehiclesDate">
        <n-date-picker v-model:value="form.vehiclesDate" type="date" clearable />
      </n-form-item>

      <n-form-item label="车辆类型" path="operateCity">
        <n-select
          clearable
          filterable
          v-model:value="form.vehiclesType"
          placeholder="选择车辆类型"
          @update:value="handleUpdateValue"
          :options="cityData.result"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          size="large"
          class="ml-10px"
          @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { rules } from "./data";
import { tableDataItem } from "./type";
import cityData from "@/config/cityData.json";

export default defineComponent({
  name: "VehiclesDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("菜单");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      plageNumber: null,
      brand: null,
      carSeies: null,
      color: null,
      carType: null,
      companyName: null,
      create_time: null,
      distance: null,
      plate: null,
      vehiclesType: null,
      lock: 1,
      remark: null,
      fuelType: null,
      engineNumber: null,
      vin: null,
      engineDisplacement: null,
      drivingPermitType: null,
      vehiclesDate: null,
    });

    function openDrawer(t: string, record?: tableDataItem) {
      console.log(record);
      if (record) {
        form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));

          handleSaveAfter();

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleUpdateValue(_: string, option: SelectOption) {
      console.log(option);
      // console.log(toRaw(form.value));

      //    form.value.city = unref(option).label
      //    form.value.code = option.value
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        plageNumber: null,
        brand: null,
        carSeies: null,
        color: null,
        carType: null,
        companyName: null,
        create_time: null,
        distance: null,
        plate: null,
        vehiclesType: null,
        lock: 1,
        remark: null,
        fuelType: null,
        engineNumber: null,
        vin: null,
        engineDisplacement: null,
        drivingPermitType: null,
        vehiclesDate: null,
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
      cityData,
      form,
      openDrawer,
      handleUpdateValue,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
