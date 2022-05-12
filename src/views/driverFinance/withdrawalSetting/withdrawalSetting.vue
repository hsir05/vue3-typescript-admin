<template>
  <div class="h-full overflow-hidden box-border bg-white">
    <n-form
      ref="formRef"
      class="pt-20px"
      :rules="rules"
      label-placement="left"
      :style="{ maxWidth: '500px', margin: '20px auto' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="可提现的星期" path="withdrawalWeek">
        <n-select
          clearable
          filterable
          style="width: 380px"
          :multiple="true"
          v-model:value="form.withdrawalWeek"
          placeholder="选择可提现的星期"
          :options="withdrawalWeekData"
        />
      </n-form-item>

      <n-form-item label="可提现开始时间" path="effectiveTimeBegin">
        <n-time-picker v-model:formatted-value="form.effectiveTimeBegin" style="width: 380px" />
      </n-form-item>
      <n-form-item label="可提现开始时间" path="effectiveTimeEnd">
        <n-time-picker v-model:formatted-value="form.effectiveTimeEnd" style="width: 380px" />
      </n-form-item>

      <n-form-item label="时段内可提现次数" path="withdrawalCount">
        <n-input-number
          v-model:value="form.withdrawalCount"
          style="width: 380px"
          :min="0"
          clearable
          placeholder="时段内可提现次数"
        />
      </n-form-item>

      <n-form-item label="单次提现金额上限" path="withdrawalUpperLimit">
        <n-input-number
          v-model:value="form.withdrawalUpperLimit"
          style="width: 380px"
          :min="0"
          clearable
          placeholder="单次提现金额上限"
        />
      </n-form-item>

      <n-form-item label="会员描述" path="withdrawalDisableDescribe">
        <n-input
          v-model:value="form.withdrawalDisableDescribe"
          style="width: 380px"
          type="textarea"
          placeholder="输入会员描述"
          round
          clearable
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
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { getWithdrawalRule } from "@/api/driverFinance/driverFinance";
import { FormInter } from "./type";
import { editRule } from "@/api/driverFinance/driverFinance";
export default defineComponent({
  name: "WithdrawalSetting",
  setup() {
    const formRef = ref<FormInst | null>(null);
    const loading = ref(false);
    const message = useMessage();
    const withdrawalWeekData = ref([
      {
        label: "周一",
        value: 0,
      },
      {
        label: "周二",
        value: 1,
      },
      {
        label: "周三",
        value: 2,
      },
      {
        label: "周四",
        value: 3,
      },
      {
        label: "周五",
        value: 4,
      },
      {
        label: "周六",
        value: 5,
      },
      {
        label: "周日",
        value: 6,
      },
    ]);

    const form = ref<FormInter>({
      driverWalletWithdrawalRuleId: null,
      withdrawalWeek: [],
      effectiveTimeBegin: "10:00:00",
      effectiveTimeEnd: null,
      withdrawalCount: null,
      withdrawalUpperLimit: null,
      withdrawalDisableDescribe: null,
    });

    onMounted(() => {
      getRuleData();
    });

    const getRuleData = async () => {
      try {
        let res = await getWithdrawalRule();
        console.log(res);
        const week = res.data.withdrawalWeek;
        let weekArr: number[] = [];
        for (let key = 1; key <= week.length; key++) {
          if (week[key] === "1") {
            weekArr.push(key);
          }
        }
        form.value = res.data;
        form.value.withdrawalWeek = weekArr;
      } catch (err) {
        console.log(err);
      }
    };

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          loading.value = true;
          try {
            const {
              driverWalletWithdrawalRuleId,
              effectiveTimeBegin,
              effectiveTimeEnd,
              withdrawalCount,
              withdrawalUpperLimit,
              withdrawalDisableDescribe,
            } = form.value;

            let arr = [0, 0, 0, 0, 0, 0, 0];
            let weekArr = form.value.withdrawalWeek || [];
            for (let i = 0; i < weekArr.length; i++) {
              arr[weekArr[i]] = 1;
            }

            let option = {
              driverWalletWithdrawalRuleId,
              withdrawalWeek: arr.reduce((a, b) => a + b, ""),
              effectiveTimeBegin,
              effectiveTimeEnd,
              withdrawalCount,
              withdrawalUpperLimit,
              withdrawalDisableDescribe,
            };
            let res = await editRule(option);
            console.log(res);
            message.success(window.$tips[res.code]);
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

    function handleReset() {
      const driverWalletWithdrawalRuleId = form.value.driverWalletWithdrawalRuleId;
      form.value = {
        driverWalletWithdrawalRuleId: driverWalletWithdrawalRuleId,
        withdrawalWeek: [],
        effectiveTimeBegin: null,
        effectiveTimeEnd: null,
        withdrawalCount: null,
        withdrawalUpperLimit: null,
        withdrawalDisableDescribe: null,
      };
      formRef.value?.restoreValidation();
    }

    return {
      form,
      loading,
      formRef,
      withdrawalWeekData,
      rules: {
        withdrawalWeek: {
          type: "array",
          required: true,
          trigger: ["blur", "change"],
          message: "请选择可提现的星期",
        },
        effectiveTimeEnd: {
          required: true,
          trigger: ["blur", "input"],
          message: "请选择可提现开始时间",
        },
        effectiveTimeBegin: {
          required: true,
          trigger: ["blur", "input"],
          message: "请选择可提现开始时间",
        },
        withdrawalCount: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请输入时段内可提现次数",
        },
        withdrawalUpperLimit: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请输入单次提现金额上限",
        },
      },
      options: [],

      handleValidate,
      handleReset,
    };
  },
});
</script>
