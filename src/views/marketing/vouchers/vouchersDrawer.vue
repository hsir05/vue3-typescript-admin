<template>
  <BasicDrawer v-model:show="isDrawer" title="赠送代金券" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '440px' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="客户手机号" path="customerId">
        <n-select
          clearable
          filterable
          v-model:value="form.customerId"
          style="width: 280px"
          placeholder="选择客户手机号"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="代金券名称" path="couponName">
        <n-input
          v-model:value="form.couponName"
          clearable
          placeholder="输入代金券名称"
          style="width: 280px"
        />
      </n-form-item>
      <n-form-item label="代金券面值(元)" path="couponDenomination">
        <n-input-number v-model:value="form.couponDenomination" clearable style="width: 280px" />
      </n-form-item>

      <n-form-item label="赠送数量" path="couponCount">
        <n-input-number v-model:value="form.couponCount" clearable style="width: 280px" />
      </n-form-item>

      <n-form-item label="消费规则" path="customerCouponConsumeRuleId">
        <n-select
          clearable
          filterable
          v-model:value="form.customerCouponConsumeRuleId"
          placeholder="选择消费规则"
          :options="options"
          style="width: 280px"
        />
      </n-form-item>

      <n-form-item label="生效时间" path="couponEffectiveTimeBegin">
        <n-date-picker
          v-model:value="form.couponEffectiveTimeBegin"
          type="date"
          clearable
          style="width: 280px"
        />
      </n-form-item>

      <n-form-item label="失效时间" path="couponEffectiveTimeEnd">
        <n-date-picker
          v-model:value="form.couponEffectiveTimeEnd"
          type="date"
          clearable
          style="width: 280px"
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
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { giftCoupon } from "@/api/marketing/marketing";
export default defineComponent({
  name: "VouchersDrawer",
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref({
      customerId: null,
      couponName: null,
      customerCouponConsumeRuleId: null,
      couponDenomination: null,
      couponEffectiveTimeBegin: null,
      couponEffectiveTimeEnd: null,
      couponCount: null,
    });

    function openDrawer() {
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res = await giftCoupon(form.value);
            message.success(window.$tips[res.code]);
            state.loading = false;
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

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    function handleReset() {
      form.value = {
        customerId: null,
        couponName: null,
        customerCouponConsumeRuleId: null,
        couponDenomination: null,
        couponEffectiveTimeBegin: null,
        couponEffectiveTimeEnd: null,
        couponCount: null,
      };
    }

    return {
      ...toRefs(state),
      title,
      formRef,
      form,
      rules: {
        customerId: {
          required: true,
          trigger: ["blur", "change"],
          message: "请选择客户手机号",
        },
        couponName: {
          required: true,
          type: "number",
          trigger: ["blur", "input"],
          message: "请输入代金券名称",
        },
        couponDenomination: {
          required: true,
          type: "number",
          trigger: ["blur", "input"],
          message: "请输入代金券面值",
        },
        couponCount: {
          required: true,
          type: "number",
          trigger: ["blur", "input"],
          message: "请输入赠送数量",
        },
        customerCouponConsumeRuleId: {
          required: true,
          trigger: ["blur", "change"],
          message: "请选择消费规则",
        },
        couponEffectiveTimeBegin: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请选择生效时间",
        },
        couponEffectiveTimeEnd: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请选择失效时间",
        },
      },
      options: [],
      openDrawer,
      onCloseAfter,
      handleSaveAfter,
      handleValidate,
      handleReset,
    };
  },
});
</script>
