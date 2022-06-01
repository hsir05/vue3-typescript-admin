<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '460px' }"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="支付渠道" path="paymentChannelType">
        <n-select
          clearable
          filterable
          v-model:value="form.paymentChannelType"
          style="width: 280px"
          placeholder="选择支付渠道"
          :options="payChannelData"
        />
      </n-form-item>

      <n-form-item label="充值比率" path="rechargeRate">
        <n-input-number v-model:value="form.rechargeRate" :min="0" clearable style="width: 280px" />
      </n-form-item>

      <n-form-item label="最低起充金额" path="minimumRechargeAmount">
        <n-input-number v-model:value="form.minimumRechargeAmount" clearable style="width: 280px" />
      </n-form-item>

      <n-form-item label="累计实充额度" path="cumulativeRechargeAmount">
        <n-input-number
          v-model:value="form.cumulativeRechargeAmount"
          clearable
          style="width: 280px"
        />
      </n-form-item>

      <n-form-item label="开始时间" path="activityBeginTime">
        <n-date-picker
          v-model:value="form.activityBeginTime"
          type="datetime"
          clearable
          style="width: 280px"
        />
      </n-form-item>

      <n-form-item label="结束时间" path="activityEndTime">
        <n-date-picker
          v-model:value="form.activityEndTime"
          type="datetime"
          clearable
          style="width: 280px"
        />
      </n-form-item>

      <n-form-item label="活动描述" path="activityDesc">
        <n-input
          v-model:value="form.activityDesc"
          type="textarea"
          clearable
          placeholder="输入活动描述"
          style="width: 280px"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存</n-button
        >
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, toRefs, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { getDict } from "@/api/common/common";
import {
  getRechargeDetail,
  addRechargeActivity,
  editRechargeActivity,
} from "@/api/marketing/marketing";
import { FormInter } from "./type";
import dayjs from "dayjs";
export default defineComponent({
  name: "RechargeActivity",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
      paymentChannelType: null,
      rechargeRate: null,
      minimumRechargeAmount: null,
      cumulativeRechargeAmount: null,
      activityBeginTime: null,
      activityEndTime: null,
      activityDesc: null,
    });
    const payChannelData = ref([]);

    function openDrawer(t: string, customerWalletRechargeActivityId: string) {
      if (customerWalletRechargeActivityId) {
        getDetail(customerWalletRechargeActivityId);
      }
      title.value = t;
      state.isDrawer = true;
    }

    onMounted(() => {
      getAllPayChannelData();
    });

    const getAllPayChannelData = async () => {
      try {
        let res = await getDict({ parentEntryCode: "PCT0000" });
        console.log(res);
        payChannelData.value = res.data.map((item: { entryCode: string; entryName: string }) => {
          return { label: item.entryName, value: item.entryCode };
        });
      } catch (err) {
        console.log(err);
      }
    };

    const getDetail = async (customerWalletRechargeActivityId: string) => {
      try {
        let res = await getRechargeDetail({ customerWalletRechargeActivityId });
        console.log(res.data);
        const {
          paymentChannelType,
          rechargeRate,
          minimumRechargeAmount,
          cumulativeRechargeAmount,
          activityBeginTime,
          activityEndTime,
          activityDesc,
        } = res.data;

        form.value = {
          customerWalletRechargeActivityId,
          paymentChannelType,
          rechargeRate,
          minimumRechargeAmount,
          cumulativeRechargeAmount,
          activityBeginTime,
          activityEndTime,
          activityDesc,
        };
      } catch (err) {
        state.loading = false;
      }
    };

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res;
            const {
              paymentChannelType,
              rechargeRate,
              minimumRechargeAmount,
              cumulativeRechargeAmount,
              activityBeginTime,
              activityEndTime,
              activityDesc,
              customerWalletRechargeActivityId,
            } = form.value;
            let option = {
              paymentChannelType,
              rechargeRate,
              minimumRechargeAmount,
              cumulativeRechargeAmount,
              activityDesc,
              activityBeginTime: dayjs(activityBeginTime).format("YYYY-MM-DD HH:mm:ss"),
              activityEndTime: dayjs(activityEndTime).format("YYYY-MM-DD HH:mm:ss"),
            };
            if (!form.value.customerWalletRechargeActivityId) {
              res = await addRechargeActivity(option);
              console.log(res);
            } else {
              res = await editRechargeActivity({ customerWalletRechargeActivityId, ...option });
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

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      const customerWalletRechargeActivityId = form.value.customerWalletRechargeActivityId;
      form.value = {
        customerWalletRechargeActivityId,
        paymentChannelType: null,
        rechargeRate: null,
        minimumRechargeAmount: null,
        cumulativeRechargeAmount: null,
        activityBeginTime: null,
        activityEndTime: null,
        activityDesc: null,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      form.value.customerWalletRechargeActivityId = null;
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      title,
      formRef,
      form,
      payChannelData,
      rules: {
        paymentChannelType: {
          required: true,
          trigger: ["blur", "change"],
          message: "请选择支付渠道",
        },
        rechargeRate: {
          required: true,
          type: "number",
          trigger: ["blur", "input"],
          message: "请输入充值比率",
        },
        minimumRechargeAmount: {
          required: true,
          type: "number",
          trigger: ["blur", "input"],
          message: "请输入最低起充金额",
        },
        cumulativeRechargeAmount: {
          required: true,
          type: "number",
          trigger: ["blur", "input"],
          message: "请输入累计实充额度",
        },
        activityBeginTime: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请选择广告生效时间",
        },
        activityEndTime: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请选择广告失效时间",
        },
        adUrl: { required: true, trigger: ["blur", "input"], message: "请上传广告" },
      },

      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
