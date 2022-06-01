<template>
  <div class="bg-white h-full ml-10px" v-if="isShow">
    <n-divider title-placement="left"> 开通业务分配基础计费规则 </n-divider>
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      :style="{ width: '395px', marginLeft: '10px', marginRight: '30px' }"
      require-mark-placement="right-hanging"
      label-width="90"
      :model="form"
    >
      <n-form-item label="订单类型" path="orderType">
        <n-select
          clearable
          filterable
          v-model:value="form.orderType"
          placeholder="选择订单类型"
          :options="orderTypeData"
        />
      </n-form-item>

      <n-form-item label="车辆类型" path="vehicleType">
        <n-select
          clearable
          filterable
          v-model:value="form.vehicleType"
          placeholder="选择车辆类型"
          :options="vehicleTypeData"
        />
      </n-form-item>

      <n-form-item label="开通区域" path="openArea">
        <n-select
          clearable
          filterable
          v-model:value="form.openArea"
          placeholder="选择开通区域"
          :options="openAreaData"
        />
      </n-form-item>
      <div class="flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleSubmit"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          class="ml-10px"
          :loading="loading"
          type="warning"
          @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, reactive } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { DistributionInter } from "./type";
import { getDict } from "@/api/common/common";
import { getVehicleType, getOpenAreaList } from "@/api/operate/operate";
import { distributionRule } from "@/api/operate/chargeRule";
export default defineComponent({
  name: "Distribution",
  emits: ["save-after"],
  setup(_, { emit }) {
    const loading = ref(false);
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const state = reactive({
      isShow: false,
    });
    const form = ref<DistributionInter>({
      ruleId: null,
      ruleType: null,
      orderType: null,
      vehicleType: null,
      openArea: null,
    });
    const vehicleTypeData = ref([]);
    const orderTypeData = ref([]);
    const openAreaData = ref([]);
    onMounted(async () => {
      getData();
    });

    function openModal(ruleId: string, ruleType: string) {
      form.value.ruleId = ruleId;
      form.value.ruleType = ruleType;
      state.isShow = true;
    }

    const getData = () => {
      Promise.all([
        getVehicleType({ operationCompanyId: "" }),
        getDict({ parentEntryCode: "OT00000" }),
        getOpenAreaList(),
      ])
        .then((res) => {
          let dataArr = res.map((item) => item.data);
          console.log(dataArr);
          vehicleTypeData.value = dataArr[0].map(
            (item: { vehicleTypeName: string; vehicleTypeId: string }) => {
              let obj = {
                label: item.vehicleTypeName,
                value: item.vehicleTypeId,
              };
              return obj;
            }
          );

          orderTypeData.value = dataArr[1].map((item: { entryName: string; entryCode: string }) => {
            return { label: item.entryName, value: item.entryCode };
          });
          openAreaData.value = dataArr[2].map((item: { areaName: string; areaCode: string }) => {
            return { label: item.areaName, value: item.areaCode };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    function handleSubmit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          loading.value = true;
          try {
            let option = {
              ruleId: null,
              ruleType: null,
              orderType: null,
              vehicleType: null,
              openArea: null,
            };
            let res = await distributionRule(option);
            console.log(res);
            message.success(window.$tips[res.code]);
            emit("save-after");
            loading.value = false;
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        } else {
          console.log(errors);
        }
      });
    }
    function handleReset() {}

    return {
      formRef,
      openModal,
      form,
      loading,
      vehicleTypeData,
      orderTypeData,
      openAreaData,
      ...toRefs(state),
      rules: {
        vehicleType: { required: true, trigger: ["blur", "change"], message: "请选择车辆类型" },
        orderType: { required: true, trigger: ["blur", "change"], message: "请选择订单类型" },
        openArea: { required: true, trigger: ["blur", "change"], message: "请选择开通区域" },
      },
      handleSubmit,
      handleReset,
    };
  },
});
</script>
