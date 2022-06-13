<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="180"
      style="flex-wrap: wrap"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="form"
      :rules="amountRules"
    >

      <n-form-item v-if="isBatch" label="兑换码" path="exchangeCode">
        <n-input-group style="width: 260px">
          <n-input
            v-model:value="form.exchangeCode"
            clearable
            :maxlength="10"
            @blur="uniqueExchangeCodeValue"
            placeholder="请输入10位字符数字"
            :style="{ width: '80%' }"
          />
          <n-button type="primary" @click="randomWord(10)" ghost> 快速生成</n-button>
        </n-input-group>
      </n-form-item>

      <n-form-item v-if="!isBatch" label="批量生成兑换码任务名称" path="taskName">
        <n-input-group style="width: 260px">
          <n-input
            v-model:value="form.taskName"
            clearable
            :maxlength="50"
            @blur="uniqueTaskNameValue"
            placeholder="请输入任务名称"
            :style="{ width: '80%' }"
          />
        </n-input-group>
      </n-form-item>

      <n-form-item v-if="!isBatch" label="批量生成兑换码个数" path="exchangeCodeCount">
        <n-input-group style="width: 260px">
          <n-input-number
            v-model:value="form.exchangeCodeCount"
            clearable
            :min=1
            :max=99999
            placeholder="请输入兑换码个数"
            :style="{ width: '80%' }"
          />
        </n-input-group>
      </n-form-item>

      <n-form-item label="生效时间" path="exchangeCodeEffectiveTimeBegin">
        <n-date-picker
          v-model:value="form.exchangeCodeEffectiveTimeBegin"
          style="width: 260px" type="datetime" clearable
          :is-date-disabled="disablePreviousDate"/>
      </n-form-item>

      <n-form-item label="失效时间" path="exchangeCodeEffectiveTimeEnd">
        <n-date-picker v-model:value="form.exchangeCodeEffectiveTimeEnd" type="datetime" style="width: 260px" clearable
                       :is-date-disabled="disablePreviousDate"/>
      </n-form-item>

      <n-form-item label="可兑换次数" path="exchangeCodeUsableCount">
        <n-input-number
          v-model:value="form.exchangeCodeUsableCount"
          style="width: 260px"
          :min=1
          clearable
          placeholder="可兑换次数"
          :max=9999999999
        />
      </n-form-item>

      <n-form-item label="兑换实充金额" path="walletAmount.exchangeRechargeAmount">
        <n-input-number
          v-model:value="form.walletAmount.exchangeRechargeAmount"
          style="width: 260px"
          clearable
          placeholder="兑换实充金额"
          :min=0.01
          :max=99999999.99
        />
      </n-form-item>

      <n-form-item label="兑换赠送金额" path="walletAmount.exchangeGiftAmount">
        <n-input-number
          v-model:value="form.walletAmount.exchangeGiftAmount"
          style="width: 260px"
          :min=0.01
          :max=99999999.99
          clearable
          placeholder="兑换赠送金额"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" type="primary" @click="submit">保存</n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from "vue";
import {FormInst, useMessage} from "naive-ui";
import {QueryFormInter} from "./type";
import { amountRules } from "./data";
import {
  addExchangeCodeWalletAmount,
  addExchangeCodeWalletAmountBatch,
  uniqueExchangeCode
} from "@/api/marketing/marketing";
import dayjs from "dayjs";
import {uniqueTaskName} from "@/api/common/common";
export default defineComponent({
  name: "AmountDrawer",
  emits: ["on-save-after"],
  setup: function (_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      isBatch:true
    });

    const title = ref("");
    const message = useMessage();

    const formRef = ref<FormInst | null>(null);
    const form = ref<QueryFormInter>({
      taskName:null,
      exchangeCodeCount:null,
      exchangeCode: null,
      exchangeCodeEffectiveTimeBegin: Date.now(),
      exchangeCodeEffectiveTimeEnd: null,
      exchangeCodeUsableCount: null,
      walletAmount: {
        exchangeRechargeAmount:null,
        exchangeGiftAmount:null
      }
    });

    function openDrawer(t: string,batch:boolean) {
      title.value = t;
      state.isBatch = batch
      state.isDrawer = true;
      console.log(state.isBatch)
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            if (state.isBatch){
              let option = {
                exchangeCode: form.value.exchangeCode,
                exchangeCodeEffectiveTimeBegin: dayjs(form.value.exchangeCodeEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss") as string,
                exchangeCodeEffectiveTimeEnd: dayjs(form.value.exchangeCodeEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss") as string,
                exchangeCodeUsableCount: form.value.exchangeCodeUsableCount,
                walletAmount: {
                  exchangeRechargeAmount: form.value.walletAmount.exchangeRechargeAmount,
                  exchangeGiftAmount: form.value.walletAmount.exchangeGiftAmount
                }
              }
              let res = await addExchangeCodeWalletAmount(option);
              console.log(res);
              message.success(window.$tips[res.code]);
            }else {
              let option = {
                taskName:form.value.taskName,
                exchangeCodeCount:form.value.exchangeCodeCount,
                exchangeCode: form.value.exchangeCode,
                exchangeCodeEffectiveTimeBegin: dayjs(form.value.exchangeCodeEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss") as string,
                exchangeCodeEffectiveTimeEnd: dayjs(form.value.exchangeCodeEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss") as string,
                exchangeCodeUsableCount: form.value.exchangeCodeUsableCount,
                walletAmount: {
                  exchangeRechargeAmount: form.value.walletAmount.exchangeRechargeAmount,
                  exchangeGiftAmount: form.value.walletAmount.exchangeGiftAmount
                }
              }
              let res = await addExchangeCodeWalletAmountBatch(option);
              console.log(res);
              message.success(window.$tips[res.code]);
            }

            handleSaveAfter();
          } catch (err) {
            console.log(err);
          }
          state.loading = false;
        } else {
          //console.log(errors);
          state.loading = false;
        }
      });
    }
    function handleSaveAfter() {
      state.isDrawer = false
      emit("on-save-after");
    }

    //生成随机数字字符（不包含0,1,o,O,i,I,l,L不容易区分字符）
    const randomWord = (range: number) => {
      let str = "",
        arr = ['2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      form.value.exchangeCode = str;
    };

    function disablePreviousDate(ts: number) {
      return ts < Date.now() - 86400000;
    }

    const uniqueExchangeCodeValue = async () => {
      if (!form.value.exchangeCode) {
        return false;
      }
      try {
        let res = await uniqueExchangeCode({
          exchangeCode: form.value.exchangeCode,
        });
        if (res.data.UniqueBooleanResult) {
          form.value.exchangeCode = null;
          message.warning(window.$tips[res.code]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const uniqueTaskNameValue = async () => {
      if (!form.value.taskName) {
        return false;
      }
      try {
        let res = await uniqueTaskName({
          importTaskName:form.value.taskName,
          importType: "",
        });
        if (res.data.UniqueBooleanResult) {
          form.value.exchangeCode = null;
          message.warning(window.$tips[res.code]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    function handleReset() {
      form.value = {
        taskName:null,
        exchangeCodeCount:null,
        exchangeCode: null,
        exchangeCodeEffectiveTimeBegin: Date.now(),
        exchangeCodeEffectiveTimeEnd: null,
        exchangeCodeUsableCount: null,
        walletAmount: {
          exchangeRechargeAmount: null,
          exchangeGiftAmount: null
        }
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      handleReset();
    }

    return {
      form,
      formRef,
      amountRules,
      submit,
      ...toRefs(state),
      title,
      openDrawer,
      onCloseAfter,
      randomWord,
      disablePreviousDate,
      uniqueExchangeCodeValue,
      uniqueTaskNameValue
    };
  },
});
</script>
