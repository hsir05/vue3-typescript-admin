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
      <n-form-item label="代理商名称" path="operationCompanyAgencyName">
        <n-input
          v-model:value="form.operationCompanyAgencyName"
          :maxlength="20"
          clearable
          placeholder="输入代理商名称"
        />
      </n-form-item>
      <n-form-item label="登陆账号" path="loginCredential.loginAccount">
        <n-input
          v-model:value="form.loginCredential.loginAccount"
          clearable
          placeholder="输入登陆账号"
        />
      </n-form-item>
      <n-form-item label="联系人姓名" path="operationCompanyAgencyContactName">
        <n-input
          v-model:value="form.operationCompanyAgencyContactName"
          clearable
          placeholder="输入联系人姓名"
        />
      </n-form-item>

      <n-form-item label="联系人性别" path="operationCompanyAgencyContactGender">
        <n-select
          v-model:value="form.operationCompanyAgencyContactGender"
          :maxlength="10"
          placeholder="选择联系人性别"
          :options="sexOptions"
        />
      </n-form-item>
      <n-form-item label="联系人电话" path="operationCompanyAgencyContactPhone">
        <n-input
          v-model:value="form.operationCompanyAgencyContactPhone"
          clearable
          placeholder="输入联系人电话"
          :maxlength="11"
        />
      </n-form-item>

      <div class="mt-10px mb-30px ml-40px">
        <n-icon size="24" style="vertical-align: middle">
          <AlertIcon color="#f0a020" />
        </n-icon>
        运营企业的代理商抽成比率为零时，才可取消企业代理。
      </div>

      <n-form-item label="允许代理企业" path="operationCompanyIds">
        <n-checkbox-group
          v-model:value="form.operationCompanyIds"
          @on-update:value="handleCheckbox"
        >
          <n-space>
            <n-checkbox
              :value="item.operationCompanyId"
              v-for="item in allowAgentCompanyData"
              :key="item.operationCompanyId"
            >
              {{ item.operationCompanyName }}
            </n-checkbox>
          </n-space>
        </n-checkbox-group>
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
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { rules } from "./data";
import { statusOptions, sexOptions } from "@/config/form";
import { tableDataItem, allowCompanyState, formState } from "./type";
import { AlertCircle as AlertIcon } from "@vicons/ionicons5";
import { cloneDeep } from "lodash-es";
import { addAgency, editAgency, getRatio, getAllowAgencyCompany } from "@/api/capacity/capacity";
export default defineComponent({
  name: "AgentDrawer",
  components: { AlertIcon },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      openCityData: [],
    });

    const allowAgentCompanyData = ref<allowCompanyState[]>([]);
    const title = ref("菜单");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<formState>({
      operationCompanyAgencyName: null,
      loginCredential: {
        loginAccount: null,
        loginCredentialState: 1,
      },
      operationCompanyAgencyContactName: null,
      operationCompanyAgencyContactGender: null,
      operationCompanyAgencyContactPhone: null,
      operationCompanyIds: null,
    });

    onMounted(() => {});

    function openDrawer(t: string, record: tableDataItem) {
      console.log(record);
      allowAgentCompanyData.value = [];
      if (record) {
        form.value = { ...form.value, ...record };

        if (record.operationCompanyList) {
          let agentCompany: allowCompanyState[] = cloneDeep(record.operationCompanyList);
          let ids = agentCompany.map((item) => item.operationCompanyId);
          form.value.operationCompanyIds = ids;
          allowAgentCompanyData.value = [...agentCompany];
        }
      }
      title.value = t;
      getAllowCompanyData();
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          let res = null;
          if (form.value.operationCompanyAgencyId) {
            res = await editAgency(form.value);
          } else {
            res = await addAgency(form.value);
          }
          console.log(res);
          message.success(window.$tips[res.code]);
          handleSaveAfter();
          state.loading = false;
        } else {
          console.log(errors);
          state.loading = false;
        }
      });
    }

    const getAllowCompanyData = async () => {
      try {
        state.loading = true;
        let res = await getAllowAgencyCompany();
        console.log(res);
        allowAgentCompanyData.value = [...res.data, ...allowAgentCompanyData.value];
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    const handleCheckbox = (value: string) => {
      console.log(value);
      getRatioData(value);
    };

    const getRatioData = async (operationCompanyId: string) => {
      try {
        state.loading = true;
        let option = {
          operationCompanyAgencyId: form.value.operationCompanyAgencyId as string,
          operationCompanyId: operationCompanyId,
        };
        let res = await getRatio(option);
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
        operationCompanyAgencyName: null,
        loginCredential: {
          loginAccount: null,
          loginCredentialState: 1,
        },
        operationCompanyAgencyContactName: null,
        operationCompanyAgencyContactGender: null,
        operationCompanyAgencyContactPhone: null,
        operationCompanyIds: null,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      state.openCityData = [];
      allowAgentCompanyData.value = [];
      handleReset();
    }

    return {
      ...toRefs(state),
      allowAgentCompanyData,
      formRef,
      title,
      rules,
      statusOptions,
      sexOptions,
      form,
      openDrawer,
      handleReset,
      handleValidate,
      handleCheckbox,
      onCloseAfter,
    };
  },
});
</script>
