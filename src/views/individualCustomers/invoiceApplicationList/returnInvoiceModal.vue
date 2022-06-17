<template>
  <BasicModal
    width="650px"
    title="发票申请退回"
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
      <n-form-item label="申请退回原因" path="invoiceApplicationReturnReason">
        <n-input
          v-model:value="form.invoiceApplicationReturnReason"
          maxlength="25"
          show-count
          style="width: 380px"
          type="textarea"
          placeholder="输入发票申请退回原因"
          round
          clearable
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >提交</n-button
        >
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { returnInvoice } from "@/api/individualCustomers/individualCustomers";
import { ReturnFormInter } from "./type";
export default defineComponent({
  name: "ReturnInvoiceModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<ReturnFormInter>({
      invoiceApplicationReturnReason: null,
      customerInvoiceApplicationId: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (customerInvoiceApplicationId: string) => {
      const { showModal } = ModalRef.value;
      form.value.customerInvoiceApplicationId = customerInvoiceApplicationId;
      showModal();
    };
    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          try {
            loading.value = true;
            let res = await returnInvoice(form.value);
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
      form.value = {
        invoiceApplicationReturnReason: null,
        customerInvoiceApplicationId: null,
      };
      loading.value = false;

      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      form,
      loading,
      rules: {
        invoiceApplicationReturnReason: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入申请退回理由",
        },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
