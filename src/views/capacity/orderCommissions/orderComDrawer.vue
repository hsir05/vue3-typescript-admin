<template>
  <BasicDrawer v-model:show="isDrawer" title="编辑订单抽成比率" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '440px' }"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="流量方比率" path="influxDivideRate">
        <n-input-number
          v-model:value="form.influxDivideRate"
          clearable
          :min="0"
          :max="1"
          placeholder="输入流量方比率"
        />
      </n-form-item>
      <n-form-item label="平台比率" path="platformDivideRate">
        <n-input-number
          v-model:value="form.platformDivideRate"
          clearable
          :min="0"
          :max="1"
          placeholder="输入平台比率"
        />
      </n-form-item>
      <n-form-item label="代理商比率" path="agencyDivideRate">
        <n-input-number
          v-model:value="form.agencyDivideRate"
          clearable
          :min="0"
          :max="1"
          placeholder="输入代理商比率"
        />
      </n-form-item>

      <n-form-item label="企业比率" path="companyDivideRate">
        <n-input-number
          v-model:value="form.companyDivideRate"
          clearable
          :min="0"
          :max="1"
          placeholder="输入企业比率"
        />
      </n-form-item>

      <n-form-item label="司机比率" path="driverDivideRate">
        <n-input-number
          v-model:value="form.driverDivideRate"
          clearable
          :min="0"
          :max="1"
          placeholder="输入企业比率"
        />
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
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { rules } from "./data";
import { FormInter, TableDataInter, OperationCompanyInter } from "./type";
import { updateRate } from "@/api/capacity/capacity";
import loading from "naive-ui/lib/_internal/loading";
export default defineComponent({
  name: "OrderComDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const orderIncomeDivideRatePDTOList = ref<OperationCompanyInter[]>([]);
    const idsData = ref<OperationCompanyInter[]>([]);
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
      orderIncomeDivideRateId: null,
      operationCompanyId: null,
      areaCode: null,
      orderBusinessType: null,
      orderType: null,
      influxCode: null,
      influxDivideRate: null,
      companyDivideRate: null,
      platformDivideRate: null,
      agencyDivideRate: null,
      driverDivideRate: null,
    });

    function openDrawer(record: TableDataInter, isBatch: boolean, ids?: OperationCompanyInter[]) {
      console.log(record);
      if (!isBatch) {
        form.value = { ...form.value, ...record };
        form.value.operationCompanyId = record.operationCompany.operationCompanyId;
      } else if (ids && ids.length > 0) {
        console.log(ids);
        form.value.operationCompanyId = record.operationCompany.operationCompanyId;
        idsData.value = ids;
      }
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));
          updateData();
        } else {
          console.log(errors);
        }
      });
    }

    const updateData = async () => {
      try {
        loading.value = true;

        const {
          orderIncomeDivideRateId,
          areaCode,
          orderBusinessType,
          orderType,
          influxCode,
          influxDivideRate,
          companyDivideRate,
          platformDivideRate,
          agencyDivideRate,
          driverDivideRate,
        } = form.value;
        if (idsData.value.length > 0) {
          for (let key of idsData.value) {
            orderIncomeDivideRatePDTOList.value.push({
              orderIncomeDivideRateId: key.orderIncomeDivideRateId,
              areaCode: key.areaCode,
              orderBusinessType: key.orderBusinessType,
              orderType: key.orderType,
              influxCode: key.influxCode,
              influxDivideRate,
              companyDivideRate,
              platformDivideRate,
              agencyDivideRate,
              driverDivideRate,
            });
          }
        } else {
          orderIncomeDivideRatePDTOList.value.push({
            orderIncomeDivideRateId,
            areaCode,
            orderBusinessType,
            orderType,
            influxCode,
            influxDivideRate,
            companyDivideRate,
            platformDivideRate,
            agencyDivideRate,
            driverDivideRate,
          });
        }

        let option = {
          operationCompanyId: form.value.operationCompanyId as string,
          orderIncomeDivideRatePDTOList: orderIncomeDivideRatePDTOList.value,
        };
        console.log(option);
        let res = await updateRate(option);
        console.log(res);
        message.success(window.$tips(res.code));
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
      orderIncomeDivideRatePDTOList.value = [];
      let orderIncomeDivideRateId = form.value.orderIncomeDivideRateId;
      let operationCompanyId = form.value.operationCompanyId;
      form.value = {
        orderIncomeDivideRateId: orderIncomeDivideRateId,
        operationCompanyId: operationCompanyId,
        areaCode: null,
        orderBusinessType: null,
        orderType: null,
        influxCode: null,
        influxDivideRate: null,
        companyDivideRate: null,
        platformDivideRate: null,
        agencyDivideRate: null,
        driverDivideRate: null,
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
      rules,
      form,
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
