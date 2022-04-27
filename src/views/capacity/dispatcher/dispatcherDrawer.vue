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
          :maxlengn="11"
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
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { addExpendContact, editExpendContact } from "@/api/capacity/capacity";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "DispatcherDrawer",
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
      operationCompanyId: null,
      operationCompanyExpendContactName: null,
      operationCompanyExpendContactPhone: null,
      operationCompanyExpendContactEmail: null,
      dutyTimeBegin: null,
      dutyTimeEnd: null,
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

          let operationCompanyExpendContactId = unref(form).operationCompanyExpendContactId;
          if (operationCompanyExpendContactId) {
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

    const addData = async () => {
      try {
        state.loading = true;
        let res = await addExpendContact(form.value);
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
        let res = await editExpendContact(form.value);
        console.log(res);
        message.success(window.$tips[res.code]);
        handleSaveAfter();
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
        enterpriseName: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入所在企业名称",
        },
        enterpriseNum: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入所在企业编号",
        },
        name: { required: true, trigger: ["blur", "input"], message: "请输入紧急联系人姓名" },
        email: { required: true, trigger: ["blur", "input"], message: "请输入紧急联系人邮箱" },
        time_start: { required: true, trigger: ["blur", "input"], message: "请选择值班开始时间" },
        time_end: { required: true, trigger: ["blur", "input"], message: "请选择值班结束时间" },
        phone: {
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
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
