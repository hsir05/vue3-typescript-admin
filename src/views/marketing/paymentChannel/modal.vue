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
      <n-form-item label="支付渠道" path="channel">
        <n-select
          v-model:value="form.channel"
          clearable
          filterable
          placeholder="选择支付渠道"
          style="width: 260px"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="显示名称" path="name">
        <n-input v-model:value="form.name" clearable placeholder="输入显示名称" />
      </n-form-item>

      <n-form-item label="显示名称描述" path="descript">
        <n-input v-model:value="form.descript" clearable placeholder="输入显示名称描述" />
      </n-form-item>

      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="form.status">
          <n-space>
            <n-radio value="1">正常</n-radio>
            <n-radio :value="0">锁定</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
export default defineComponent({
  name: "ThresholdModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref({
      channel: null,
      name: null,
      descript: null,
      status: 1,
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
      form.value = { channel: null, name: null, descript: null, status: 1 };
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
        channel: { required: true, trigger: ["blur", "change"], message: "请输入支付渠道" },
        name: { required: true, trigger: ["blur", "change"], message: "请输入名称" },
        descript: { required: true, trigger: ["blur", "change"], message: "请输入名称描述" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
