<template>
  <BasicModal
    width="650px"
    title="个人客户开票"
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
      <n-form-item label="开票方式" path="invoiceWay">
        <n-select
          clearable
          filterable
          v-model:value="form.invoiceWay"
          placeholder="选择开票方式"
          :options="invoiceWayData"
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
import { invoiceOpen } from "@/api/individualCustomers/individualCustomers";
import { InvoiceOpenFormInter } from "./type";
export default defineComponent({
  name: "InvoiceModal",
  components: { BasicModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<InvoiceOpenFormInter>({
      invoiceWay: null,
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
            let res = await invoiceOpen(form.value);
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
        invoiceWay: null,
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
        invoiceWay: {
          type: "number",
          required: true,
          trigger: ["blur", "change"],
          message: "请选择开票方式",
        },
      },

      handleModal,
      handleValidate,
      handleReset,
      invoiceWayData: [
        {
          label: "电子发票",
          value: 0,
        },
        {
          label: "纸质发票",
          value: 1,
        },
      ],
    };
  },
});
</script>
