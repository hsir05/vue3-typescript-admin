<template>
  <BasicModal
    width="650px"
    title="添加代金券"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="130"
      :model="form"
    >
      <n-form-item label="消费规则" path="customerCouponConsumeRuleId">
        <n-select
          v-model:value="form.customerCouponConsumeRuleId"
          clearable
          filterable
          placeholder="选择消费规则"
          style="width: 380px"
          :loading="loading"
          :options="customerCouponConsumeRuleListData"
          :on-update:value="handleUpdateValue"
        />
      </n-form-item>

      <n-form-item label="代金券名称" path="couponName">
        <n-input
          v-model:value="form.couponName"
          clearable
          placeholder="输入代金券名称"
          style="width: 380px"
          maxlength="10"
        />
      </n-form-item>

      <n-form-item label="代金券面值(元)" path="couponDenomination">
        <n-input-number
          v-model:value="form.couponDenomination"
          clearable
          placeholder="输入代金券面值(元)"
          style="width: 380px"
          :min="1"
          :max="999"
        />
      </n-form-item>

      <n-form-item label="有效天数" path="couponEffectiveDays">
        <n-input-number
          v-model:value="form.couponEffectiveDays"
          clearable
          placeholder="输入有效天数"
          style="width: 380px"
          :min="1"
          :max="99999999"
        />
      </n-form-item>

      <n-form-item label="数量" path="couponCount">
        <n-input-number
          v-model:value="form.couponCount"
          clearable
          placeholder="输入数量"
          style="width: 380px"
          :min="1"
          :max="20"
        />
      </n-form-item>
      <div cass="text-center">
        <n-button attr-type="button" type="primary" @click="submit">保存</n-button>
      </div>
    </n-form>
    <BasicDrawer
      v-model:show="isShow"
      title="代金券消费规则"
      @on-close-after="onCloseAfter"
      style="width: 700px"
    >
      <n-descriptions v-if="isShow" label-placement="left" bordered :column="1">
        <n-descriptions-item label="消费规则名称">{{
          detail?.customerCouponConsumeRuleName
        }}</n-descriptions-item>
        <n-descriptions-item label="使用金额限制">{{
          detail?.couponLimitedAmount
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的城市" :span="2">{{
          detail?.couponUsedCityNames
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的订单类型" :span="2">{{
          detail?.couponUsedOrderTypeNames
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的车型">{{
          detail?.couponUsedVehicleTypeNames
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的时间">{{
          detail?.couponUsedDayTimeSectionDesc
        }}</n-descriptions-item>
        <n-descriptions-item label="可使用的星期">{{
          detail?.couponUsedWeekSectionDesc
        }}</n-descriptions-item>
      </n-descriptions>
    </BasicDrawer>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, unref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import {
  customerCouponConsumeRuleDetail,
  customerCouponConsumeRuleList,
} from "@/api/marketing/marketing";
import { CouponInter } from "@/views/marketing/exchangeCode/type";

export default defineComponent({
  name: "VoucherModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup: function (_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(true);

    const form = ref<CouponInter>({
      couponName: null,
      couponDenomination: null,
      couponEffectiveDays: null,
      customerCouponConsumeRuleId: null,
      couponCount: null,
    });
    const detail = ref();
    const isShow = ref(false);
    const formRef = ref<FormInst | null>(null);
    const customerCouponConsumeRuleListData = ref();
    const handleModal = (value: CouponInter) => {
      // form.value = value;
      console.log(value);
      const { showModal } = ModalRef.value;
      showModal();
    };

    const cancelModal = () => {
      const { cancel } = ModalRef.value;
      cancel();
    };

    function handleValidate() {
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleReset() {
      form.value = {
        couponName: null,
        couponDenomination: null,
        couponEffectiveDays: null,
        customerCouponConsumeRuleId: null,
        couponCount: null,
      };
      formRef.value?.restoreValidation();
    }

    function handleUpdateValue(value: string) {
      console.info(value);
      form.value.customerCouponConsumeRuleId = value;
      handleDetail(value);
    }

    const handleDetail = async (value: string) => {
      try {
        let data = await customerCouponConsumeRuleDetail({ customerCouponConsumeRuleId: value });
        detail.value = data.data;
      } catch (e) {
        console.log(e);
      }
      isShow.value = true;
    };

    const getData = async () => {
      loading.value = true;
      try {
        let list = await customerCouponConsumeRuleList();
        customerCouponConsumeRuleListData.value = list.data.map(
          (item: {
            customerCouponConsumeRuleId: string;
            customerCouponConsumeRuleName: string;
          }) => {
            return {
              label: item.customerCouponConsumeRuleName,
              value: item.customerCouponConsumeRuleId,
            };
          }
        );
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function onCloseAfter() {
      isShow.value = false;
      loading.value = false;
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          emit("on-save-after", form.value);
          cancelModal();
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    onMounted(() => {
      getData();
    });
    return {
      ModalRef,
      formRef,
      form,
      customerCouponConsumeRuleListData,
      loading,
      isShow,
      rules: {
        customerCouponConsumeRuleId: {
          required: true,
          trigger: ["blur", "change"],
          message: "请选择消费规则",
        },
        couponName: { required: true, trigger: ["blur", "change"], message: "请输入代金券名称" },
        couponDenomination: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请输入代金券面值",
        },
        couponEffectiveDays: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请输入有效天数",
        },
        couponCount: {
          required: true,
          type: "number",
          trigger: ["blur", "change"],
          message: "请输入数量",
        },
      },
      detail,
      handleUpdateValue,
      handleDetail,
      handleModal,
      handleValidate,
      handleReset,
      onCloseAfter,
      submit,
    };
  },
});
</script>
