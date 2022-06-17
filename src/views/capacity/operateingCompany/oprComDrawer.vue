<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      size="large"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '440px' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="运营企业名称" path="operationCompanyName">
        <n-input
          v-model:value="form.operationCompanyName"
          clearable
          @blur="uniqueName"
          :maxlength="20"
          placeholder="输入运营企业名称"
        />
      </n-form-item>
      <n-form-item label="运营企业编号" path="operationCompanyCode">
        <n-input
          v-model:value="form.operationCompanyCode"
          clearable
          placeholder="输入运营企业编号"
        />
      </n-form-item>
      <n-form-item label="社会统一信用代码" path="unifiedSocialCreditCode">
        <n-input
          v-model:value="form.unifiedSocialCreditCode"
          clearable
          placeholder="输入社会统一信用代码"
        />
      </n-form-item>
      <n-form-item label="运营城市名称" path="operationCityName">
        <n-select
          clearable
          filterable
          v-model:value="form.operationCityName"
          placeholder="选择运营城市"
          @update:value="handleUpdateValue"
          :options="openCityData"
        />
      </n-form-item>

      <n-form-item label="运营城市编码" path="operationCityCode">
        <n-input
          v-model:value="form.operationCityCode"
          clearable
          :disabled="true"
          placeholder="输入运营城市编码"
        />
      </n-form-item>

      <n-form-item label="运营城市地址" path="operationCompanyAddress">
        <n-input
          v-model:value="form.operationCompanyAddress"
          clearable
          placeholder="输入运营城市编码"
        />
      </n-form-item>

      <n-form-item label="管理员姓名" path="operationCompanyManagerName">
        <n-input
          v-model:value="form.operationCompanyManagerName"
          clearable
          :minlength="2"
          :maxlength="4"
          placeholder="输入管理员姓名"
        />
      </n-form-item>
      <n-form-item label="管理员性别" path="operationCompanyManagerGender">
        <n-select
          v-model:value="form.operationCompanyManagerGender"
          placeholder="选择性别"
          :options="sexOptions"
        />
      </n-form-item>
      <n-form-item label="管理员电话号码" path="operationCompanyManagerPhone">
        <n-input
          v-model:value="form.operationCompanyManagerPhone"
          clearable
          placeholder="输入电话号码"
          :maxlength="11"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :disabled="disabled"
          :loading="loading"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存
        </n-button>
        <n-button
          attr-type="button"
          :disabled="disabled"
          type="warning"
          size="large"
          class="ml-10px"
          @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, unref, onMounted } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { rules } from "./data";
import { getAllOpenCity } from "@/api/common/common";
import { itemState } from "@/interface/common/common";
import { statusOptions, sexOptions } from "@/config/form";
import { tableDataItem } from "./type";
import { addCompany, editCompany, uniqueCompanyName } from "@/api/capacity/capacity";

export default defineComponent({
  name: "OprComDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      openCityData: [],
    });
    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      operationCompanyCode: null,
      operationCompanyName: null,
      operationCityCode: null,
      unifiedSocialCreditCode: null,
      operationCompanyAddress: null,
      operationCityName: null,
      operationCompanyManagerName: null,
      operationCompanyManagerGender: null,
      lng: null,
      lat: null,
      operationCompanyManagerPhone: null,
    });

    onMounted(() => {
      getOpenCity();
    });

    async function getOpenCity() {
      try {
        let res = await getAllOpenCity();
        state.openCityData = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
            lng: item.lng,
            lat: item.lat,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    }

    function openDrawer(t: string, record: tableDataItem, disabled: boolean) {
      console.log(record);
      if (record) {
        form.value = { ...form.value, ...record };
      }
      state.disabled = disabled;
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          let operationCompanyId = unref(form).operationCompanyId;
          if (operationCompanyId) {
            editData();
          } else {
            addData();
          }
        } else {
          console.log(errors);
        }
      });
    }

    const addData = async () => {
      try {
        state.loading = true;
        let res = await addCompany(form.value);
        console.log(res);
        message.success(window.$tips[res.code]);
        handleSaveAfter();
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };
    const editData = async () => {
      try {
        state.loading = true;
        let res = await editCompany(form.value);
        console.log(res);
        message.success(window.$tips[res.code]);
        handleSaveAfter();
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function handleUpdateValue(_: string, option: SelectOption) {
      form.value = {
        ...form.value,
        operationCityName: option.label as string,
        operationCityCode: option.value as string,
        lng: option.lng as number,
        lat: option.lat as number,
      };
    }

    const uniqueName = async () => {
      if (!form.value.operationCompanyName) {
        return false;
      }
      try {
        let res = await uniqueCompanyName({
          operationCompanyName: form.value.operationCompanyName as string,
        });
        if (res.data.UniqueBooleanResult) {
          form.value.operationCompanyName = null;
          message.warning(window.$tips[res.code]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      let operationCompanyId = form.value.operationCompanyId;
      form.value = {
        operationCompanyId,
        operationCompanyCode: null,
        operationCompanyName: null,
        operationCityCode: null,
        unifiedSocialCreditCode: null,
        operationCompanyAddress: null,
        operationCityName: null,
        operationCompanyManagerName: null,
        operationCompanyManagerGender: null,
        lng: null,
        lat: null,
        operationCompanyManagerPhone: null,
      };
      console.log(form.value);

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
      statusOptions,
      sexOptions,
      form,
      openDrawer,
      handleUpdateValue,
      uniqueName,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
