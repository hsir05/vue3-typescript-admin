<template>
  <BasicModal
    width="650px"
    title="重发电子发票"
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
      <n-form-item label="电子邮箱" path="contactMail">
        <n-input v-model:value="form.contactMail" placeholder="输入电子邮箱" clearable />
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
import { repeatSendMail } from "@/api/individualCustomers/individualCustomers";
import { FormInter } from "./type";
export default defineComponent({
  name: "ConfirmInvoiceModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<FormInter>({
      contactMail: null,
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
            let res = await repeatSendMail(form.value);
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
      loading.value = false;

      form.value = { contactMail: null, customerInvoiceApplicationId: null };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      form,
      loading,
      rules: {
        contactMail: { required: true, trigger: ["blur", "input"], message: "请输入处理结果" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
