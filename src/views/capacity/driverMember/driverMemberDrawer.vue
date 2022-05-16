<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="driverMemberRules"
      :disabled="disabled"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="150"
      :model="form"
    >
      <n-form-item label="产品名称" path="goodsName">
        <n-input
          v-model:value="form.goodsName"
          clearable
          placeholder="输入产品名称"
          style="width: 280px"
        />
      </n-form-item>
      <n-form-item label="产品类型" path="goodsType">
        <n-select
          clearable
          style="width: 280px"
          v-model:value="form.goodsType"
          placeholder="选择产品类型"
          :options="goodsTypeOptions"
        />
      </n-form-item>
      <n-form-item label="产品到期时间" path="memberEndTime">
        <n-date-picker
          style="width: 280px"
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
          style="width: 280px"
          v-model:value="form.effectBeginTime"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="产品失效时间" path="effectEndTime">
        <n-date-picker
          style="width: 280px"
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

      <n-form-item label="产品名称" path="goodsRemark">
        <n-input
          v-model:value="form.goodsRemark"
          style="width: 280px"
          type="textarea"
          placeholder="输入产品备注"
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
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { driverMemberRules } from "./data";
import { goodsTypeOptions } from "@/config/form";
import { useAppUserStore } from "@/store/modules/useUserStore";
import { FormInter } from "./type";
import dayjs from "dayjs";
import {
  getDriverMemberDetail,
  addDriverMemberGoods,
  editDriverMemberGoods,
} from "@/api/capacity/capacity";
export default defineComponent({
  name: "DriverMemberDrawer",
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      openCityData: [],
    });
    const title = ref("司机会员产品");
    const userStore = useAppUserStore();
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

    function openDrawer(t: string, operationCompanyId: string, driverMemberGoodsId: string) {
      form.value.companyIds = [operationCompanyId];
      if (driverMemberGoodsId) {
        getDetail(driverMemberGoodsId);
      }
      title.value = t;
      state.isDrawer = true;
    }
    const getDetail = async (driverMemberGoodsId: string) => {
      try {
        state.loading = true;
        let res = await getDriverMemberDetail({ driverMemberGoodsId });
        console.log(res);
        form.value = res.data;
        state.loading = false;
      } catch (err) {
        console.log(err);
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
              driverMemberGoodsId,
              goodsName,
              companyIds,
              goodsTagPrice,
              goodsSellingPrice,
              goodsType,
              memberEndTime,
              memberRenewalTimeUnit,
              memberRenewalCount,
              purchasableDaysBeforeMemberExpire,
              effectBeginTime,
              effectEndTime,
              goodsRemark,
            } = form.value;
            let option = {
              driverMemberGoodsId,
              goodsName,
              companyIds,
              goodsTagPrice,
              goodsSellingPrice,
              goodsType,
              memberEndTime: dayjs(memberEndTime).format("YYYY-MM-DD HH:mm:ss"),
              memberRenewalTimeUnit,
              memberRenewalCount,
              purchasableDaysBeforeMemberExpire,
              effectBeginTime: dayjs(effectBeginTime).format("YYYY-MM-DD HH:mm:ss"),
              effectEndTime: dayjs(effectEndTime).format("YYYY-MM-DD HH:mm:ss"),
              goodsRemark,
              createUser: userStore.getAdminId,
            };
            if (form.value.driverMemberGoodsId) {
              res = await editDriverMemberGoods(option);
            } else {
              res = await addDriverMemberGoods(option);
            }
            message.success(window.$tips[res.code]);
            handleSaveAfter();
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

    function handleReset() {
      form.value = {
        goodsName: null,
        companyIds: null,
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
      driverMemberRules,
      goodsTypeOptions,
      form,
      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
