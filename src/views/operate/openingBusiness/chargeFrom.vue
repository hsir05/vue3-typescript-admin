<template>
  <BasicDrawer v-model:show="isDrawer" title="计费规则" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      class="charge"
      require-mark-placement="right-hanging"
      label-width="110"
      :model="form"
    >
      <n-form-item label="基础计费" path="chargeRuleBaseId">
        <n-select
          clearable
          filterable
          v-model:value="form.chargeRuleBaseId"
          placeholder="选择基础计费"
          :options="baseList"
        />
        <!-- <n-button attr-type="button" type="warning" class="ml-10px" @click="handleAdd()">
          <n-icon> <AddIcon /> </n-icon
        ></n-button> -->
      </n-form-item>
      <n-form-item label="里程计费" path="chargeRuleMileageId">
        <n-select
          clearable
          filterable
          v-model:value="form.chargeRuleMileageId"
          placeholder="选择里程计费"
          :options="mileageList"
        />
      </n-form-item>
      <n-form-item label="时长计费" path="chargeRuleDurationId">
        <n-select
          clearable
          filterable
          v-model:value="form.chargeRuleDurationId"
          placeholder="选择时长计费"
          :options="durationList"
        />
      </n-form-item>
      <n-form-item label="取消计费" path="chargeRuleCancelId">
        <n-select
          clearable
          filterable
          v-model:value="form.chargeRuleCancelId"
          placeholder="选择取消计费"
          :options="cancelList"
        />
      </n-form-item>
      <n-form-item label="等待计费" path="chargeRuleWaitId">
        <n-select
          clearable
          filterable
          v-model:value="form.chargeRuleWaitId"
          placeholder="选择等待计费"
          :options="waitList"
        />
      </n-form-item>
      <n-form-item label="工作日浮动" path="chargeRuleFloatWorkdayId">
        <n-select
          clearable
          filterable
          v-model:value="form.chargeRuleFloatWorkdayId"
          placeholder="选择工作日浮动"
          :options="floatList"
        />
      </n-form-item>

      <n-form-item label="节假日浮动" path="chargeRuleFloatHolidayId">
        <n-select
          clearable
          filterable
          v-model:value="form.chargeRuleFloatHolidayId"
          placeholder="选择节假日浮动"
          :options="floatList"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >确认开通</n-button
        >
        <n-button
          attr-type="button"
          :loading="loading"
          type="warning"
          v-if="form.openBusinessId"
          class="ml-10px"
          @click="remove"
          >关闭业务</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, unref, toRefs, reactive, onMounted } from "vue";
import { FormInter } from "./type";
import { FormInst, useMessage } from "naive-ui";
import { saveBusiness } from "@/api/operate/operate";
import { removeBusiness } from "@/api/operate/operate";
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
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
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
    const stateDrawer = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const state = reactive({
      baseList: [],
      waitList: [],
      mileageList: [],
      durationList: [],
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
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    async function save() {
      try {
        stateDrawer.loading = true;
        let res = await saveBusiness(form.value);
        console.log(res);
        message.success(res.message);
        stateDrawer.loading = false;

        onCloseAfter();
      } catch (err) {
        console.log(err);
        stateDrawer.loading = false;
      }
    }
    async function remove() {
      try {
        stateDrawer.loading = true;
        let res = await removeBusiness({ openBusinessId: form.value.openBusinessId as string });
        console.log(res);
        message.success(res.message);
        stateDrawer.loading = false;

        onCloseAfter();
      } catch (err) {
        console.log(err);
        stateDrawer.loading = false;
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
          state.baseList = res[0].data.map(
            (item: { chargeRuleBaseDescription: string; chargeRuleBaseId: string }) => {
              let obj = {
                label: item.chargeRuleBaseDescription,
                value: item.chargeRuleBaseId,
              };
              return obj;
            }
          );
          state.waitList = res[1].data.map(
            (item: { chargeRuleWaitDesc: string; chargeRuleWaitId: string }) => {
              let obj = {
                label: item.chargeRuleWaitDesc,
                value: item.chargeRuleWaitId,
              };
              return obj;
            }
          );
          state.mileageList = res[2].data.map(
            (item: { chargeRuleMileageDesc: string; chargeRuleMileageId: string }) => {
              let obj = {
                label: item.chargeRuleMileageDesc,
                value: item.chargeRuleMileageId,
              };
              return obj;
            }
          );
          state.durationList = res[3].data.map(
            (item: { chargeRuleDurationDesc: string; chargeRuleDurationId: string }) => {
              let obj = {
                label: item.chargeRuleDurationDesc,
                value: item.chargeRuleDurationId,
              };
              return obj;
            }
          );
          state.cancelList = res[4].data.map(
            (item: { chargeRuleCancelDesc: string; chargeRuleCancelId: string }) => {
              let obj = {
                label: item.chargeRuleCancelDesc,
                value: item.chargeRuleCancelId,
              };
              return obj;
            }
          );
          state.floatList = res[5].data.map(
            (item: { chargeRuleFloatDesc: string; chargeRuleFloatId: string }) => {
              let obj = {
                label: item.chargeRuleFloatDesc,
                value: item.chargeRuleFloatId,
              };
              return obj;
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };

    function openDrawer(data: FormInter) {
      form.value = data;
      stateDrawer.isDrawer = true;
    }

    function onCloseAfter() {
      stateDrawer.isDrawer = false;
      stateDrawer.loading = false;
      stateDrawer.disabled = false;
      handleSaveAfter();
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    return {
      formRef,

      form,
      option: [],
      rules: {},
      ...toRefs(stateDrawer),
      ...toRefs(state),

      handleValidate,
      remove,
      openDrawer,
      handleSaveAfter,
      onCloseAfter,
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
