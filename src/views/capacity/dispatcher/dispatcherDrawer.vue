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
          @@update:value="handleCompany"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item label="值班调度人姓名" path="operationCompanyExpendContactName">
        <n-input
          v-model:value="form.operationCompanyExpendContactName"
          clearable
          placeholder="输入紧急联系人姓名"
        />
      </n-form-item>
      <n-form-item label="值班调度人手机号" path="operationCompanyExpendContactPhone">
        <n-input
          v-model:value="form.operationCompanyExpendContactPhone"
          :maxlength="11"
          clearable
          placeholder="输入紧急联系人手机号"
        />
      </n-form-item>

      <n-form-item label="值班调度人邮箱" path="operationCompanyExpendContactEmail">
        <n-input
          v-model:value="form.operationCompanyExpendContactEmail"
          clearable
          placeholder="输入值班调度人邮箱"
        />
      </n-form-item>

      <div class="mt-10px mb-30px ml-40px" v-if="timeRangeTips">
        <n-icon size="24" style="vertical-align: middle">
          <AlertIcon color="#f0a020" />
        </n-icon>
        {{ timeRangeTips }}
      </div>

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
          >保存
        </n-button>
        <n-button
          attr-type="button"
          :disabled="loading"
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
import { defineComponent, reactive, toRefs, onMounted, ref, unref } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { getAllOperateCompany } from "@/api/common/common";
import { addExpendContact, editExpendContact, getCompanyRangeTime } from "@/api/capacity/capacity";
import { verifyPhone, verifyEmail, verifyCNName } from "@/utils/verify";
import { AlertCircle as AlertIcon } from "@vicons/ionicons5";
import { tableDataItem } from "./type";
import dayjs from "dayjs";
export default defineComponent({
  name: "DispatcherDrawer",
  components: { AlertIcon },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      companyData: [],
    });

    const title = ref("企业值班调度人");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const timeRangeTips = ref();
    const form = ref<tableDataItem>({
      operationCompanyId: null,
      operationCompanyExpendContactName: null,
      operationCompanyExpendContactPhone: null,
      operationCompanyExpendContactEmail: null,
      dutyTimeBegin: null,
      dutyTimeEnd: null,
    });

    onMounted(() => {
      getAllCompanyData();
    });

    const getAllCompanyData = async () => {
      try {
        state.loading = true;
        let res = await getAllOperateCompany();
        console.log(res);
        state.companyData = res.data.map(
          (item: { operationCityName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCityName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function openDrawer(t: string, record: tableDataItem) {
      console.log(record);
      if (record) {
        form.value = { ...form.value, ...record };
        form.value.dutyTimeBegin = parseInt(record.dutyTimeBegin as number);
        form.value.dutyTimeEnd = parseInt(record.dutyTimeEnd as number);
      }
      handleCompany();
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          let operationCompanyExpendContactId = unref(form).operationCompanyExpendContactId;
          let option = { ...form.value };
          option.dutyTimeBegin = `${dayjs(option.dutyTimeBegin).format("HH:mm:ss")}`;
          option.dutyTimeEnd = `${dayjs(option.dutyTimeEnd).format("HH:mm:ss")}`;
          let res = null;
          if (operationCompanyExpendContactId) {
            res = await editExpendContact(option);
          } else {
            res = await addExpendContact(option);
          }
          console.log(res);
          message.success(window.$tips[res.code]);
          handleSaveAfter();
        } else {
          console.log(errors);
        }
      });
    }

    const handleCompany = async () => {
      try {
        let option = {
          operationCompanyId: form.value.operationCompanyId as string,
          operationCompanyExpendContactId: form.value.operationCompanyId,
        };
        let res = await getCompanyRangeTime(option);
        console.log(res);
        timeRangeTips.value = res.data;
      } catch (err) {
        console.log(err);
      }
    };

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        operationCompanyId: null,
        operationCompanyExpendContactName: null,
        operationCompanyExpendContactPhone: null,
        operationCompanyExpendContactEmail: null,
        dutyTimeBegin: null,
        dutyTimeEnd: null,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      title,
      form,
      formRef,
      timeRangeTips,
      rules: {
        operationCompanyId: {
          required: true,
          trigger: ["blur", "input"],
          message: "请选择所在企业",
        },
        operationCompanyExpendContactName: {
          required: true,
          trigger: ["blur", "input"],
          validator: (rule: FormItemRule, value: string) => {
            return verifyCNName(rule, value);
          },
          message: "请输入紧急联系人姓名",
        },
        operationCompanyExpendContactEmail: {
          required: true,
          trigger: ["blur", "input"],
          validator: (rule: FormItemRule, value: string) => {
            return verifyEmail(rule, value);
          },
          message: "请输入紧急联系人邮箱",
        },
        dutyTimeBegin: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请选择值班开始时间",
        },
        dutyTimeEnd: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请选择值班结束时间",
        },
        operationCompanyExpendContactPhone: {
          required: true,
          trigger: ["input"],
          validator: (rule: FormItemRule, value: string) => {
            return verifyPhone(rule, value);
          },
          message: "请输入正确格式的电话号码",
        },
      },
      openDrawer,
      handleReset,
      handleCompany,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
