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
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<FormInter>({
      dealResult: null,
      customerWalletRefundApplicationId: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = () => {
      const { showModal } = ModalRef.value;
      showModal();
    };

    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          console.log(unref(form));

          try {
            let res = await changeDealState(form.value);
            console.log(res);
          } catch (err) {
            loading.value = false;
          }
        } else {
          console.log(errors);
          message.error("验证失败");
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
        result: { required: true, trigger: ["blur", "change"], message: "请输入处理结果" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
