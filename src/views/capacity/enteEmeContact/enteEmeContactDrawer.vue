<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
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
          :options="companyData"
        />
      </n-form-item>

      <n-form-item label="紧急联系人姓名" path="operationCompanyEmergencyContactName">
        <n-input
          v-model:value="form.operationCompanyEmergencyContactName"
          clearable
          placeholder="输入紧急联系人姓名"
        />
      </n-form-item>
      <n-form-item label="紧急联系人手机号" path="operationCompanyEmergencyContactPhone">
        <n-input
          v-model:value="form.operationCompanyEmergencyContactPhone"
          :maxlength="11"
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
        <n-time-picker value-format="HH:mm:ss" v-model:formatted-value="form.dutyTimeBegin" />
      </n-form-item>
      <n-form-item label="值班结束时间" path="dutyTimeEnd">
        <n-time-picker value-format="HH:mm:ss" v-model:formatted-value="form.dutyTimeEnd" />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存
        </n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { FormInter } from "./type";
import { getAllOperateCompany } from "@/api/common/common";
import {
  editEmeContact,
  addEmeContact,
  uniqueContactPhone,
  uniqueContactEmail,
  getTimeRange,
  getConactDetail,
} from "@/api/capacity/capacity";
import loading from "naive-ui/lib/_internal/loading";
// import dayjs from 'dayjs'
export default defineComponent({
  name: "EnteEmeContactDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      companyData: [],
    });

    const title = ref("企业紧急联系人");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
      operationCompanyEmergencyContactName: null,
      operationCompanyEmergencyContactPhone: null,
      operationCompanyEmergencyContactEmail: null,
      operationCompanyId: null,
      dutyTimeBegin: null,
      dutyTimeEnd: null,
    });

    onMounted(() => {
      getAllCompanyData();
    });

    const getAllCompanyData = async () => {
      try {
        loading.value = true;
        let res = await getAllOperateCompany();
        console.log(res);
        state.companyData = res.data.map(
          (item: { operationCompanyId: string; operationCompanyName: string }) => {
            return {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
          }
        );
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function openDrawer(t: string, operationCompanyEmergencyContactId: string) {
      if (operationCompanyEmergencyContactId) {
        getData(operationCompanyEmergencyContactId);
      }
      title.value = t;
      state.isDrawer = true;
    }

    const getData = async (operationCompanyEmergencyContactId: string) => {
      try {
        let res = await getConactDetail({ operationCompanyEmergencyContactId });
        const {
          operationCompanyId,
          operationCompanyEmergencyContactName,
          operationCompanyEmergencyContactPhone,
          operationCompanyEmergencyContactEmail,
          dutyTimeBegin,
          dutyTimeEnd,
        } = res.data;

        form.value = {
          operationCompanyId,
          operationCompanyEmergencyContactName,
          operationCompanyEmergencyContactPhone,
          operationCompanyEmergencyContactEmail,
          dutyTimeBegin,
          dutyTimeEnd,
        };
      } catch (err) {
        console.log(err);
      }
    };

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          if (form.value.operationCompanyEmergencyContactId) {
            editData();
          } else {
            addData();
          }
        } else {
          console.log(errors);
        }
      });
    }

    const editData = async () => {
      try {
        state.loading = true;
        let res = await editEmeContact(form.value);
        console.log(res);
        message.success(window.$tips[res.code]);
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
        message.success(window.$tips[res.code]);
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
