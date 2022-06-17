<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" width="1000" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="司机姓氏" path="driverFirstName">
        <n-input v-model:value="form.driverFirstName" clearable placeholder="输入司机姓氏" />
      </n-form-item>
      <n-form-item label="司机名" path="driverLastName">
        <n-input v-model:value="form.driverLastName" clearable placeholder="输入司机名" />
      </n-form-item>
      <n-form-item label="司机性别" path="driverGender">
        <n-select
          v-model:value="form.driverGender"
          clearable
          filterable
          placeholder="司机性别"
          :options="sexOptions"
        />
      </n-form-item>
      <n-form-item label="司机手机号" path="driverPhone">
        <n-input v-model:value="form.driverPhone" clearable placeholder="输入司机手机号" />
      </n-form-item>
      <n-form-item label="司机民族" path="driverNation">
        <n-select
          clearable
          filterable
          v-model:value="form.driverNation"
          placeholder="司机民族"
          :options="nationData"
        />
      </n-form-item>

      <n-form-item label="司机学历" path="driverEducation">
        <n-select
          clearable
          filterable
          v-model:value="form.driverEducation"
          placeholder="司机民族"
          :options="educationData"
        />
      </n-form-item>

      <n-form-item label="司机婚姻状况" path="driverMaritalStatus">
        <n-select
          clearable
          filterable
          v-model:value="form.driverMaritalStatus"
          placeholder="选择司机婚姻状况"
          :options="maritalStatusOptions"
        />
      </n-form-item>

      <n-form-item label="司机生日" path="driverBirth">
        <n-date-picker v-model:value="form.driverBirth" type="date" clearable />
      </n-form-item>

      <n-form-item label="司机户口地址" path="driverRegisteredResidence">
        <n-input
          v-model:value="form.driverRegisteredResidence"
          clearable
          placeholder="输入司机户口地址"
        />
      </n-form-item>
      <n-form-item label="联系人姓名" path="driverEmergencyContactName">
        <n-input
          v-model:value="form.driverEmergencyContactName"
          clearable
          placeholder="选择联系人姓名"
        />
      </n-form-item>
      <n-form-item label="联系人手机号" path="driverEmergencyContactPhone">
        <n-input
          v-model:value="form.driverEmergencyContactPhone"
          clearable
          placeholder="输入联系人手机号"
          :maxlength="11"
        />
      </n-form-item>

      <n-form-item label="是否锁定" path="driverLock">
        <n-radio-group v-model:value="form.driverLock">
          <n-space>
            <n-radio :value="0">正常</n-radio>
            <n-radio :value="1">锁定</n-radio>
          </n-space>
        </n-radio-group>
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
          :disabled="loading"
          class="ml-10px"
          @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, toRefs, ref, reactive } from "vue";
import { FormInst, useMessage } from "naive-ui";
import {
  sexOptions,
  statusOptions,
  maritalStatusOptions,
  nationData,
  educationData,
} from "@/config/form";
import { tableDataItem } from "./type";
import { rules } from "./data";
import { editDriver } from "@/api/capacity/capacity";
export default defineComponent({
  name: "DriversDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("司机信息");
    const message = useMessage();

    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      driverId: null,
      driverLastName: null,
      driverFirstName: null,
      driverGender: null,
      driverPhone: null,
      driverNation: null,
      driverEducation: null,
      driverMaritalStatus: null,
      driverBirth: null,
      driverRegisteredResidence: null,
      driverEmergencyContactName: null,
      driverEmergencyContactPhone: null,
      driverLock: 0,
    });

    function openDrawer(t: string, record: tableDataItem, bool: boolean) {
      console.log(record);
      state.disabled = bool;

      const {
        driverId,
        driverLastName,
        driverFirstName,
        driverGender,
        driverPhone,
        driverNation,
        driverEducation,
        driverMaritalStatus,
        driverBirth,
        driverRegisteredResidence,
        driverEmergencyContactName,
        driverEmergencyContactPhone,
        driverLock,
      } = record;
      form.value = {
        driverId,
        driverLastName,
        driverFirstName,
        driverGender,
        driverPhone,
        driverNation,
        driverEducation,
        driverMaritalStatus,
        driverBirth,
        driverRegisteredResidence,
        driverEmergencyContactName,
        driverEmergencyContactPhone,
        driverLock,
      };
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res = await editDriver(form.value);
            console.log(res);
            message.success(window.$tips[res.code]);
            handleSaveAfter();
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

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
    }

    function handleReset() {}

    return {
      ...toRefs(state),
      title,
      formRef,
      form,
      rules,
      sexOptions,
      nationData,
      statusOptions,
      maritalStatusOptions,
      educationData,

      onCloseAfter,
      handleReset,
      openDrawer,
      handleValidate,
    };
  },
});
</script>
