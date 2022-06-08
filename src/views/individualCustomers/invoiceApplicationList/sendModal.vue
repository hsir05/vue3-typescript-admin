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
      <n-form-item label="快递名称" path="expressName">
        <n-input
          v-model:value="form.expressName"
          placeholder="输入快递名称"
          :maxlength="20"
          clearable
        />
      </n-form-item>
      <n-form-item label="快递单号" path="expressNum">
        <n-input
          v-model:value="form.expressNum"
          placeholder="输入快递单号"
          :maxlength="50"
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
import { sendMail } from "@/api/individualCustomers/individualCustomers";
import { MailFormInter } from "./type";
export default defineComponent({
  name: "SendModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<MailFormInter>({
      expressName: null,
      expressNum: null,
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
            let res = await sendMail(form.value);
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
        expressName: null,
        expressNum: null,
        customerInvoiceApplicationId: null,
      };
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
