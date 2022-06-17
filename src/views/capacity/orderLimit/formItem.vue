<template>
  <n-form
    ref="formItemRef"
    inline
    :rules="rules"
    label-placement="left"
    style="width: 300px"
    require-mark-placement="right-hanging"
    label-width="60"
    :model="formItem"
  >
    <n-form-item path="vehicleType">
      <n-select
        clearable
        filterable
        style="width: 140px"
        v-model:value="formItem.vehicleType"
        placeholder="选择车型"
        :options="vehicleTypeData"
      />
    </n-form-item>
    <n-form-item path="orderLimit">
      <n-input
        v-model:value="formItem.orderLimit"
        clearable
        placeholder="输入单量上限"
        style="width: 140px"
      />
    </n-form-item>
  </n-form>
</template>
<script lang="ts">
import { defineComponent, ref, unref, onMounted } from "vue";
import { FormInst } from "naive-ui";
import { LimitItemInter } from "./type";
import { getVehicleType } from "@/api/operate/operate";
export default defineComponent({
  name: "FormItem",
  props: {
    item: {
      type: Object as PropType<LimitItemInter>,
    },
  },
  setup() {
    const formItemRef = ref<FormInst | null>(null);
    const formItem = ref<LimitItemInter>({
      beforeUseVehicleMinute: null,
      afterUseVehicleMinute: null,
      vehicleType: null,
      orderTopLimit: null,
    });
    const vehicleTypeData = ref([]);

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      try {
        let result = await getVehicleType({ operationCompanyId: "" });
        vehicleTypeData.value = result.data.map(
          (item: { vehicleTypeName: string; vehicleTypeId: string }) => {
            return {
              label: item.vehicleTypeName,
              value: item.vehicleTypeId,
            };
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    function formItemSubmit() {
      formItemRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(formItem));
        } else {
          console.log(errors);
        }
      });
    }

    return {
      formItemRef,
      formItem,
      formItemSubmit,
      vehicleTypeData,
      rules: {
        vehicleType: { required: true, trigger: ["blur", "input"], message: "请选择车型" },
        orderLimit: { required: true, trigger: ["blur", "input"], message: "请输入单量上限" },
      },
    };
  },
});
</script>
