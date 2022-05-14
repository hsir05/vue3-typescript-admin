<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      size="large"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '440px' }"
      require-mark-placement="right-hanging"
      label-width="140"
      :model="form"
    >
      <n-form-item label="产品名称" path="goodsName">
        <n-input v-model:value="form.goodsName" clearable placeholder="输入产品名称" />
      </n-form-item>
      <n-form-item label="产品类型" path="goodsType">
        <n-input v-model:value="form.goodsType" clearable placeholder="输入产品类型" />
      </n-form-item>
      <n-form-item label="产品到期时间" path="memberEndTime">
        <n-date-picker
          style="width: 520px"
          v-model:value="form.memberEndTime"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="产品原价" path="goodsTagPrice">
        <n-input-number v-model:value="form.goodsTagPrice" clearable placeholder="输入产品原价" />
      </n-form-item>

      <n-form-item label="产品售价" path="goodsSellingPrice">
        <n-input-number
          v-model:value="form.goodsSellingPrice"
          clearable
          placeholder="输入产品售价"
        />
      </n-form-item>

      <n-form-item label="产品生效时间" path="effectBeginTime">
        <n-date-picker
          style="width: 520px"
          v-model:value="form.effectBeginTime"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="产品失效时间" path="effectEndTime">
        <n-date-picker
          style="width: 520px"
          v-model:value="form.effectEndTime"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="到期前开放购买天数" path="purchasableDaysBeforeMemberExpire">
        <n-input-number
          v-model:value="form.purchasableDaysBeforeMemberExpire"
          clearable
          placeholder="输入到期前开放购买天数"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存
        </n-button>
        <n-button
          attr-type="button"
          type="warning"
          size="large"
          class="ml-10px"
          @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { rules } from "./data";
import { statusOptions, sexOptions } from "@/config/form";
import { FormInter } from "./type";

export default defineComponent({
  name: "DriMemDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      openCityData: [],
    });
    const title = ref("司机会员产品");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
      goodsName: null,
      companyIds: [],
      goodsTagPrice: null,
      goodsSellingPrice: null,
      goodsType: null,
      memberEndTime: null,
      memberRenewalTimeUnit: null,
      memberRenewalCount: null,
      purchasableDaysBeforeMemberExpire: null,
      effectBeginTime: null,
      effectEndTime: null,
      goodsRemark: null,
      createUser: null,
    });

    function openDrawer(t: string, record?: FormInter) {
      console.log(record);
      if (record) {
        form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isDrawer = true;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));

          handleSaveAfter();

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleUpdateValue(_: string, option: SelectOption) {
      console.log(option);
      // console.log(toRaw(form.value));

      //    form.value.city = unref(option).label
      //    form.value.code = option.value
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        goodsName: null,
        companyIds: [],
        goodsTagPrice: null,
        goodsSellingPrice: null,
        goodsType: null,
        memberEndTime: null,
        memberRenewalTimeUnit: null,
        memberRenewalCount: null,
        purchasableDaysBeforeMemberExpire: null,
        effectBeginTime: null,
        effectEndTime: null,
        goodsRemark: null,
        createUser: null,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      formRef,
      title,
      rules,
      statusOptions,
      sexOptions,
      form,
      openDrawer,
      handleUpdateValue,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
