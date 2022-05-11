<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="消费规则名称" path="customerCouponConsumeRuleName">
        <n-input
          v-model:value="form.customerCouponConsumeRuleName"
          clearable
          placeholder="输入消费规则名称"
        />
      </n-form-item>

      <n-form-item label="使用限制金额(元)" path="couponLimitedAmount">
        <n-input-number v-model:value="form.couponLimitedAmount" clearable />
      </n-form-item>

      <n-form-item label="可使用的城市" path="couponUsedCityCodes">
        <n-select
          clearable
          filterable
          v-model:value="form.couponUsedCityCodes"
          :multiple="true"
          placeholder="选择可使用的城市"
          @update:value="handleUpdateValue"
          :options="openCityData"
        />
      </n-form-item>

      <n-form-item label="可使用的订单类型" path="couponUsedOrderTypes">
        <n-select
          clearable
          filterable
          v-model:value="form.couponUsedOrderTypes"
          :multiple="true"
          placeholder="选择可使用的订单类型"
          @update:value="handleUpdateValue"
          :options="orderTypeData"
        />
      </n-form-item>

      <n-form-item label="可使用的车型" path="couponUsedVehicleTypeIds">
        <n-select
          clearable
          filterable
          v-model:value="form.couponUsedVehicleTypeIds"
          :multiple="true"
          placeholder="选择可使用的车型"
          @update:value="handleUpdateValue"
          :options="orderBusTypeData"
        />
      </n-form-item>

      <n-form-item label="可使用的时间" path="couponUsedDayTimeSection">
        <n-select
          clearable
          filterable
          v-model:value="form.couponUsedDayTimeSection"
          placeholder="选择可使用的时间"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="可使用的星期" path="couponUsedWeekSection">
        <n-select
          clearable
          filterable
          v-model:value="form.couponUsedWeekSection"
          placeholder="选择可使用的星期"
          @update:value="handleUpdateValue"
          :options="options"
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
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { getDict, getAllOpenCity } from "@/api/common/common";
import { getVehicleType } from "@/api/operate/operate";
import { FormInter, TableDataItemInter } from "./type";
import { itemState } from "@/interface/common/common";
import { addCoupon, editCoupon } from "@/api/marketing/marketing";
export default defineComponent({
  name: "VouchersRuleDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const openCityData = ref<SelectOption[]>([]);
    const orderBusTypeData = ref<SelectOption[]>([]);
    const orderTypeData = ref<SelectOption[]>([]);
    const form = ref<FormInter>({
      customerCouponConsumeRuleName: null,
      couponLimitedAmount: null,
      couponUsedCityCodes: null,
      couponUsedOrderTypes: null,
      couponUsedVehicleTypeIds: null,
      couponUsedDayTimeSection: null,
      couponUsedWeekSection: null,
    });

    onMounted(() => {
      getSquareData();
      getOpenCity();
    });

    async function getOpenCity() {
      try {
        let res = await getAllOpenCity();
        openCityData.value = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
          };
          return obj;
        });
        openCityData.value.unshift({ label: "不限", value: "all" });
      } catch (err) {
        console.log(err);
      }
    }

    const getSquareData = () => {
      Promise.all([
        getVehicleType({ operationCompanyId: "" }),
        getDict({ parentEntryCode: "OT00000" }),
      ])
        .then((res) => {
          let dataArr = res.map((item) => item.data);
          console.log(dataArr);

          orderBusTypeData.value = dataArr[0].map(
            (item: { vehicleTypeName: string; vehicleTypeId: string }) => {
              let obj = {
                label: item.vehicleTypeName,
                value: item.vehicleTypeId,
              };
              return obj;
            }
          );
          orderTypeData.value = dataArr[1].map((item: { entryCode: string; entryName: string }) => {
            let obj = {
              label: item.entryName,
              value: item.entryCode,
            };
            return obj;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    function openDrawer(t: string, record: TableDataItemInter) {
      title.value = t;
      if (record) {
        const {
          customerCouponConsumeRuleId,
          customerCouponConsumeRuleName,
          couponLimitedAmount,
          couponUsedCityCodes,
          couponUsedOrderTypes,
          couponUsedVehicleTypeIds,
          couponUsedDayTimeSection,
          couponUsedWeekSection,
        } = record;
        form.value = {
          customerCouponConsumeRuleId,
          customerCouponConsumeRuleName,
          couponLimitedAmount,
          couponUsedCityCodes: (couponUsedCityCodes as string).split("、"),
          couponUsedOrderTypes: (couponUsedOrderTypes as string).split("、"),
          couponUsedVehicleTypeIds: (couponUsedVehicleTypeIds as string).split("、"),
          couponUsedDayTimeSection,
          couponUsedWeekSection,
        };
      }
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res;
            const {
              customerCouponConsumeRuleId,
              customerCouponConsumeRuleName,
              couponLimitedAmount,
              couponUsedCityCodes,
              couponUsedOrderTypes,
              couponUsedVehicleTypeIds,
            } = form.value;

            if (!form.value.customerCouponConsumeRuleId) {
              res = await addCoupon({
                customerCouponConsumeRuleName,
                couponLimitedAmount,
                couponUsedCityCodes,
                couponUsedOrderTypes,
                couponUsedVehicleTypeIds,
              });
              console.log(res);
            } else {
              res = await editCoupon({
                customerCouponConsumeRuleId,
                customerCouponConsumeRuleName,
                couponLimitedAmount,
                couponUsedCityCodes,
                couponUsedOrderTypes,
                couponUsedVehicleTypeIds,
              });
            }
            state.loading = false;
            message.success(window.$tips[res.code]);
            handleSaveAfter();
          } catch (err) {
            console.log(err);
            state.loading = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    function handleUpdateValue() {}

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
      form.value.customerCouponConsumeRuleId = "";
    }

    function handleReset() {
      const customerCouponConsumeRuleId = form.value.customerCouponConsumeRuleId;
      form.value = {
        customerCouponConsumeRuleId,
        customerCouponConsumeRuleName: null,
        couponLimitedAmount: null,
        couponUsedCityCodes: null,
        couponUsedOrderTypes: null,
        couponUsedVehicleTypeIds: null,
        couponUsedDayTimeSection: null,
        couponUsedWeekSection: null,
      };
    }

    return {
      ...toRefs(state),
      openCityData,
      orderBusTypeData,
      orderTypeData,
      title,
      formRef,
      form,
      rules: {
        customerCouponConsumeRuleName: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入消费规则名称",
        },
        couponLimitedAmount: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请输入使用限制金额",
        },
        couponUsedCityCodes: {
          type: "array",
          required: true,
          trigger: ["blur", "change"],
          message: "请选择可使用的城市",
        },
        couponUsedOrderTypes: {
          required: true,
          type: "array",
          trigger: ["blur", "change"],
          message: "请选择可使用的订单类型",
        },
        couponUsedVehicleTypeIds: {
          required: true,
          type: "array",
          trigger: ["blur", "change"],
          message: "请选择可使用的车型",
        },
        // couponUsedDayTimeSection: {
        //     required: false,
        //     trigger: ["blur", "change"],
        //     message: "请选择可使用的时间",
        // },
        // couponUsedWeekSection: {
        //     required: false,
        //     trigger: ["blur", "change"],
        //     message: "请选择可使用的星期",
        // },
      },
      options: [],
      openDrawer,
      onCloseAfter,
      handleSaveAfter,
      handleValidate,
      handleReset,
      handleUpdateValue,
    };
  },
});
</script>
