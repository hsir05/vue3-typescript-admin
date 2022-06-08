<template>
  <BasicDrawer v-model:show="isDrawer" title="添加金额兑换码" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="120"
      style="flex-wrap: wrap"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="form"
      :rules="rules"
    >
      <n-form-item label="兑换码" path="exchangeCode">
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
          :maxLength=9999999999
        />
      </n-form-item>

      <n-form-item label="兑换实充金额" path="walletAmount.exchangeRechargeAmount">
        <n-input-number
          v-model:value="form.walletAmount.exchangeRechargeAmount"
          style="width: 260px"
          :min=0.01
          clearable
          placeholder="兑换实充金额"
          :maxLength=99999999.99
        />
      </n-form-item>

      <n-form-item label="兑换赠送金额" path="walletAmount.exchangeGiftAmount">
        <n-input-number
          v-model:value="form.walletAmount.exchangeGiftAmount"
          style="width: 260px"
          :min="0"
          clearable
          placeholder="兑换赠送金额"
        />
      </n-form-item>

      <div cass="text-center">
        <n-button attr-type="button" type="primary" @click="submit">提交</n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from "vue";
import {FormInst, useMessage} from "naive-ui";
import {QueryFormInter, TableDataItemInter} from "./type";
import { rules } from "./data";
import {addExchangeCodeWalletAmount,uniqueExchangeCode} from "@/api/marketing/marketing";
import dayjs from "dayjs";
export default defineComponent({
  name: "AmountDrawer",
  setup: function () {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const title = ref("");
    const message = useMessage();

    const formRef = ref<FormInst | null>(null);
    const form = ref<QueryFormInter>({
      exchangeCode: null,
      exchangeCodeEffectiveTimeBegin: Date.now(),
      exchangeCodeEffectiveTimeEnd: null,
      exchangeCodeUsableCount: null,
      walletAmount: {
        exchangeRechargeAmount:null,
        exchangeGiftAmount:null
      }
    });

    function openDrawer(t: string, record?: TableDataItemInter) {
      if (record) {
        console.log(record);
        message.success("验证成功");
      }
      title.value = t;
      state.isDrawer = true;
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
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

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
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
          exchangeCodeId: form.value.exchangeCode,
        });
        if (res.data.UniqueBooleanResult) {
          form.value.exchangeCode = null;
          message.warning(window.$tips[res.code]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    return {
      form,
      formRef,
      rules,
      submit,
      ...toRefs(state),
      title,
      openDrawer,
      onCloseAfter,
      randomWord,
      disablePreviousDate,
      uniqueExchangeCodeValue
    };
  },
});
</script>
