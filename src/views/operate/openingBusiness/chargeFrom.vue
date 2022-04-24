<template>
  <n-form
    ref="formRef"
    :rules="rules"
    label-placement="left"
    class="charge"
    require-mark-placement="right-hanging"
    label-width="130"
    :model="form"
  >
    <n-form-item label="基础计费" path="chargeRuleBaseId">
      <n-select
        clearable
        filterable
        v-model:value="form.chargeRuleBaseId"
        placeholder="选择基础计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="里程计费" path="chargeRuleMileageId">
      <n-select
        clearable
        filterable
        v-model:value="form.chargeRuleMileageId"
        placeholder="选择里程计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="时长计费" path="chargeRuleDurationId">
      <n-select
        clearable
        filterable
        v-model:value="form.chargeRuleDurationId"
        placeholder="选择时长计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="取消计费" path="chargeRuleCancelId">
      <n-select
        clearable
        filterable
        v-model:value="form.chargeRuleCancelId"
        placeholder="选择取消计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="等待计费" path="chargeRuleWaitId">
      <n-select
        clearable
        filterable
        v-model:value="form.chargeRuleWaitId"
        placeholder="选择等待计费"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>
    <n-form-item label="工作日浮动" path="chargeRuleFloatWorkdayId">
      <n-select
        clearable
        filterable
        v-model:value="form.chargeRuleFloatWorkdayId"
        placeholder="选择工作日浮动"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>

    <n-form-item label="节假日浮动" path="chargeRuleFloatHolidayId">
      <n-select
        clearable
        filterable
        v-model:value="form.chargeRuleFloatHolidayId"
        placeholder="选择节假日浮动"
        :options="option"
      /><n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
        <n-icon> <AddIcon /> </n-icon
      ></n-button>
    </n-form-item>

    <div class="text-center flex-center">
      <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
        >确认开通</n-button
      >
      <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
        >取消</n-button
      >
    </div>
  </n-form>
</template>
<script lang="ts">
import { defineComponent, ref, unref, toRefs, reactive, onMounted } from "vue";
import { formState } from "./type";
import { FormInst, useMessage } from "naive-ui";
import { Add as AddIcon } from "@vicons/ionicons5";
import { saveBusiness } from "@/api/operate/operate";
import {
  baseList,
  mileageList,
  durationList,
  waitList,
  cancelList,
  floatList,
} from "@/api/operate/chargeRule";
export default defineComponent({
  name: "ChargeForm",
  components: {
    AddIcon,
  },
  props: {
    openBusinessId: {
      type: String,
      require: true,
    },
    areaCode: {
      type: String,
      require: true,
    },
    orderType: {
      type: String,
      require: true,
    },
    vehicleTypeId: {
      type: String,
      require: true,
    },
  },
  setup() {
    const loading = ref(false);
    const formRef = ref<FormInst | null>(null);
    const form = ref<formState>({
      openBusinessId: null,
      areaCode: null,
      orderType: null,
      vehicleTypeId: null,

      chargeRuleBaseId: null,
      chargeRuleMileageId: null,
      chargeRuleDurationId: null,
      chargeRuleCancelId: null,
      chargeRuleWaitId: null,
      chargeRuleFloatHolidayId: null,
      chargeRuleFloatWorkdayId: null,
    });
    const state = reactive({
      baseList: [],
      mileageList: [],
      durationList: [],
      waitList: [],
      cancelList: [],
      floatList: [],
    });
    const message = useMessage();

    onMounted(() => {
      getData();
    });

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));
          save();
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    async function save() {
      try {
        loading.value = true;
        let res = await saveBusiness(form.value);
        console.log(res);
        loading.value = false;
        message.success("保存成功");
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    const getData = () => {
      let requestList = [
        baseList(),
        waitList(),
        mileageList(),
        durationList(),
        cancelList(),
        floatList(),
      ];
      Promise.all(requestList)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    function handleReset() {}

    function handleAdd() {}

    return {
      loading,
      formRef,
      form,
      option: [],
      rules: {},
      ...toRefs(state),

      handleValidate,
      handleAdd,
      handleReset,
    };
  },
});
</script>
<style lang="scss" scoped>
.charge {
  background-color: $white;
  margin-left: 10px;
  padding-top: 30px;
  min-width: 400px;
  padding-right: 40px;
  box-sizing: border-box;
}
</style>
