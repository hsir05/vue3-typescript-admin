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
      :style="{ maxWidth: '520px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-alert title="提示" type="warning" class="mb-10px">
        预留阈值为司机提现时钱包内至少预留的金额，请根据需要调整!
      </n-alert>

      <n-form-item label="预留阈值" path="threshold">
        <n-input-number
          v-model:value="form.threshold"
          style="width: 380px"
          :min="0"
          clearable
          placeholder="预留阈值"
        />
      </n-form-item>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import { formState } from "./type";
export default defineComponent({
  name: "ThresholdModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<formState>({
      threshold: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = () => {
      const { showModal } = ModalRef.value;
      showModal();
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
      form.value = { threshold: null };
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
        threshold: { required: true, trigger: ["blur", "change"], message: "请输入阈值" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
