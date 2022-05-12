<template>
  <BasicModal
    width="650px"
    title="修改司机钱包预留阈值"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      class="mb-20px"
      :style="{ maxWidth: '520px' }"
      require-mark-placement="right-hanging"
      label-width="80"
      :model="form"
    >
      <n-alert title="提示" type="warning" class="mb-20px">
        预留阈值为司机提现时钱包内至少预留的金额，请根据需要调整!
      </n-alert>

      <n-form-item label="预留阈值" path="reserveBalanceLimit">
        <n-input-number
          v-model:value="form.reserveBalanceLimit"
          style="width: 380px"
          :min="0"
          clearable
          placeholder="预留阈值"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存
        </n-button>
        <n-button
          attr-type="button"
          :disabled="loading"
          type="warning"
          class="ml-10px"
          @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { updateBalanceLimit } from "@/api/driverFinance/driverFinance";
import { FormInter } from "./type";
export default defineComponent({
  name: "ReserveBalanceLimitModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<FormInter>({
      driverWalletId: null,
      reserveBalanceLimit: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (record: { driverWalletId: string; reserveBalanceLimit: number }) => {
      form.value.reserveBalanceLimit = record.reserveBalanceLimit;
      form.value.driverWalletId = record.driverWalletId;
      const { showModal } = ModalRef.value;
      showModal();
    };

    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          try {
            loading.value = true;
            let option = {
              driverWalletId: form.value.driverWalletId as string,
              reserveBalanceLimit: form.value.reserveBalanceLimit as number,
            };
            let res = await updateBalanceLimit(option);
            console.log(res);
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
      form.value = { driverWalletId: null, reserveBalanceLimit: null };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      form,
      options: [
        {
          label: "普通会员",
          value: "1",
        },
      ],
      loading,
      rules: {
        reserveBalanceLimit: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请输入阈值",
        },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
