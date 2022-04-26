<template>
  <div class="bg-white h-full ml-10px">
    <n-divider title-placement="left"> 开通业务分配基础计费规则 </n-divider>
    <n-form
      ref="busionessFormRef"
      :rules="businessRules"
      label-placement="left"
      :style="{ width: '395px', marginLeft: '10px', marginRight: '30px' }"
      require-mark-placement="right-hanging"
      label-width="90"
      :model="businessForm"
    >
      <n-form-item label="订单类型" path="orderType">
        <n-select
          clearable
          filterable
          v-model:value="businessForm.orderType"
          placeholder="选择订单类型"
          :options="orderTypeData"
        />
      </n-form-item>

      <n-form-item label="车辆类型" path="vehicleType">
        <n-select
          clearable
          filterable
          v-model:value="businessForm.vehicleType"
          placeholder="选择车辆类型"
          :options="vehicleTypeData"
        />
      </n-form-item>

      <n-form-item label="开通区域" path="openArea">
        <n-select
          clearable
          filterable
          v-model:value="businessForm.openArea"
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
import { tableDataItem } from "./type";
import { getDict } from "@/api/common/common";
import { getVehicleType } from "@/api/operate/operate";
import { distributionRule } from "@/api/operate/chargeRule";
export default defineComponent({
  name: "Distribution",
  emits: ["save-after"],
  setup(_, { emit }) {
    const loading = ref(false);
    const busionessFormRef = ref<FormInst | null>(null);
    const message = useMessage();
    const state = reactive({
      orderTypeData: [],
      vehicleTypeData: [],
      openAreaData: [],
    });
    const businessForm = ref<tableDataItem>({
      vehicleType: null,
      orderType: null,
      openArea: null,
    });
    const vehicleTypeData = ref([]);
    const orderTypeData = ref([]);
    onMounted(() => {
      getData();
    });

    const getData = () => {
      Promise.all([
        getVehicleType({ operationCompanyId: "" }),
        getDict({ parentEntryCode: "OT00000" }),
      ])
        .then((res) => {
          let dataArr = res.map((item) => item.data);
          console.log(dataArr);

          vehicleTypeData.value = dataArr[0].map(
            (item: { chargeRuleBaseDescription: string; chargeRuleBaseId: string }) => {
              let obj = {
                label: item.chargeRuleBaseDescription,
                value: item.chargeRuleBaseId,
              };
              return obj;
            }
          );

          orderTypeData.value = dataArr[1];
        })
        .catch((err) => {
          console.log(err);
        });
    };

    function handleSubmit(e: MouseEvent) {
      e.preventDefault();
      busionessFormRef.value?.validate(async (errors) => {
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
            emit("save-after");
            loading.value = false;
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }
    function handleReset() {}

    return {
      busionessFormRef,
      businessForm,
      loading,
      ...toRefs(state),
      businessRules: {
        vehicleType: { required: true, trigger: ["blur", "change"], message: "请选择车辆类型" },
        orderType: { required: true, trigger: ["blur", "change"], message: "请选择订单类型" },
        areaArea: { required: true, trigger: ["blur", "change"], message: "请选择开通区域" },
      },
      handleSubmit,
      handleReset,
    };
  },
});
</script>
