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
      <n-form-item label="所在企业名称" path="operationCompanyId">
        <n-select
          clearable
          filterable
          v-model:value="form.operationCompanyId"
          placeholder="选择所在企业名称"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="紧急联系人姓名" path="operationCompanyEmergencyContactName">
        <n-input
          v-model:value="form.operationCompanyEmergencyContactName"
          clearable
          placeholder="输入紧急联系人姓名"
        />
      </n-form-item>
      <!-- <n-form-item label="运营企业编号" path="enterpriseNum">
        <n-input v-model:value="form.enterpriseNum" clearable placeholder="输入运营企业编号" />
      </n-form-item> -->
      <n-form-item label="紧急联系人手机号" path="operationCompanyEmergencyContactPhone">
        <n-input
          v-model:value="form.operationCompanyEmergencyContactPhone"
          :maxlengn="11"
          clearable
          placeholder="输入紧急联系人手机号"
        />
      </n-form-item>

      <n-form-item label="紧急联系人邮箱" path="operationCompanyEmergencyContactEmail">
        <n-input
          v-model:value="form.operationCompanyEmergencyContactEmail"
          clearable
          placeholder="输入紧急联系人邮箱"
        />
      </n-form-item>

      <n-form-item label="值班开始时间" path="dutyTimeBegin">
        <n-time-picker v-model:value="form.dutyTimeBegin" />
      </n-form-item>
      <n-form-item label="值班结束时间" path="dutyTimeEnd">
        <n-time-picker v-model:value="form.dutyTimeEnd" />
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
import { FormInst, useMessage } from "naive-ui";
import { FormItemRule } from "naive-ui";
import { tableDataItem } from "./type";
import {
  editEmeContact,
  addEmeContact,
  uniqueContactPhone,
  uniqueContactEmail,
  getTimeRange,
} from "@/api/capacity/capacity";
// import dayjs from 'dayjs'
export default defineComponent({
  name: "EnteEmeContactDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const title = ref("企业紧急联系人");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      operationCompanyEmergencyContactName: null,
      operationCompanyEmergencyContactPhone: null,
      operationCompanyEmergencyContactEmail: null,
      operationCompanyId: null,
      dutyTimeBegin: null,
      dutyTimeEnd: null,
    });

    function openDrawer(t: string, record?: tableDataItem) {
      console.log(record);
      if (record) {
        // form.value = { ...record };
        console.log(record.dutyTimeBegin);
        // console.log(new Date(record.dutyTimeBegin).getTime());

        // form.value.dutyTimeBegin = 1183135260000
        // form.value.dutyTimeBegin = new Date(record.dutyTimeBegin).getTime() ;
        // form.value.dutyTimeEnd = dayjs(record.dutyTimeEnd).format('MM-DD:ss') ;
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
          if (form.value.operationCompanyEmergencyContactId) {
            editData();
          } else {
            addData();
          }
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    const editData = async () => {
      try {
        state.loading = true;
        let res = await editEmeContact(form.value);
        console.log(res);
        handleSaveAfter();
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };
    const addData = async () => {
      try {
        state.loading = true;
        let res = await addEmeContact(form.value);
        console.log(res);
        handleSaveAfter();
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    const uniquePhone = async () => {
      try {
        state.loading = true;
        let option = {
          operationCompanyId: form.value.operationCompanyId,
          operationCompanyEmergencyContactPhone: form.value.operationCompanyEmergencyContactPhone,
        };
        let res = await uniqueContactPhone(option);
        console.log(res);
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };
    const uniqueEmail = async () => {
      try {
        state.loading = true;
        let option = {
          operationCompanyId: form.value.operationCompanyId,
          operationCompanyEmergencyContactEmail: form.value.operationCompanyEmergencyContactEmail,
        };
        let res = await uniqueContactEmail(option);
        console.log(res);
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };
    const getTimeRangeData = async () => {
      try {
        state.loading = true;
        let option = {
          operationCompanyId: form.value.operationCompanyId,
          operationCompanyEmergencyContactId: form.value
            .operationCompanyEmergencyContactId as string,
        };
        let res = await getTimeRange(option);
        console.log(res);
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        operationCompanyEmergencyContactName: null,
        operationCompanyEmergencyContactPhone: null,
        operationCompanyEmergencyContactEmail: null,
        operationCompanyId: null,
        dutyTimeBegin: null,
        dutyTimeEnd: null,
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
      title,
      form,
      formRef,
      options: [],
      rules: {
        operationCompanyId: {
          required: true,
          trigger: ["blur", "input"],
          message: "请选择所在企业名称",
        },
        operationCompanyEmergencyContactName: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入紧急联系人姓名",
        },
        operationCompanyEmergencyContactEmail: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入紧急联系人邮箱",
        },
        dutyTimeBegin: {
          required: true,
          trigger: ["blur", "input"],
          message: "请选择值班开始时间",
        },
        dutyTimeEnd: { required: true, trigger: ["blur", "input"], message: "请选择值班结束时间" },
        operationCompanyEmergencyContactPhone: {
          required: true,
          trigger: ["input"],
          validator: (rule: FormItemRule, value: string) => {
            console.log(rule);
            return /^1\d{10}$/.test(value);
          },
          message: "请输入正确格式的电话号码",
        },
      },
      openDrawer,
      uniqueEmail,
      uniquePhone,
      handleReset,
      handleValidate,
      getTimeRangeData,
      onCloseAfter,
    };
  },
});
</script>
