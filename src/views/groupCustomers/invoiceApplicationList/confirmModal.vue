<template>
  <BasicModal
    width="650px"
    title="集团客户发票确认开票成功"
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
      <n-form-item label="开票成功备注" path="note">
        <n-input
          v-model:value="form.note"
          type="textarea"
          placeholder="输入开票成功备注"
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
import { defineComponent, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { confirmInvoice } from "@/api/groupCustomers/groupCustomers";
import { ConfirmFormInter } from "./type";
export default defineComponent({
  name: "ConfirmModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<ConfirmFormInter>({
      note: null,
      groupCustomerInvoiceApplicationId: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (groupCustomerInvoiceApplicationId: string) => {
      const { showModal } = ModalRef.value;
      form.value.groupCustomerInvoiceApplicationId = groupCustomerInvoiceApplicationId;
      showModal();
    };
    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          try {
            loading.value = true;
            let res = await confirmInvoice(form.value);
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
      form.value = { note: null, groupCustomerInvoiceApplicationId: null };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      form,
      loading,
      rules: {
        note: { required: true, trigger: ["blur", "input"], message: "请输入开票成功备注" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
