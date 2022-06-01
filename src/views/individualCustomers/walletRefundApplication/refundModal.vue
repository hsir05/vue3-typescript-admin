<template>
  <BasicModal
    width="650px"
    title="退款申请处理"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      :style="{ maxWidth: '520px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="处理结果" path="dealResult">
        <n-input
          v-model:value="form.dealResult"
          type="textarea"
          placeholder="输入处理结果"
          round
          clearable
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" type="primary" @click="handleValidate">提交</n-button>
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { changeDealState } from "@/api/individualCustomers/individualCustomers";
import { FormInter } from "./type";
export default defineComponent({
  name: "RefundModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<FormInter>({
      dealResult: null,
      customerWalletRefundApplicationId: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (customerWalletRefundApplicationId: string) => {
      const { showModal } = ModalRef.value;
      form.value.customerWalletRefundApplicationId = customerWalletRefundApplicationId;
      showModal();
    };
    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          console.log(unref(form));
          try {
            loading.value = true;
            let res = await changeDealState(form.value);
            emit("on-save-after");
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
      form.value = { dealResult: null, customerWalletRefundApplicationId: null };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      form,
      loading,
      rules: {
        dealResult: { required: true, trigger: ["blur", "input"], message: "请输入处理结果" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
