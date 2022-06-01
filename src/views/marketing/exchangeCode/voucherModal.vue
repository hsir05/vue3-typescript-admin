<template>
  <BasicModal
    width="650px"
    title="添加代金券"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
      label-width="130"
      :model="form"
    >
      <n-form-item label="消费规则" path="rule">
        <n-select
          v-model:value="form.rule"
          clearable
          filterable
          placeholder="选择消费规则"
          style="width: 380px"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="代金券名称" path="name">
        <n-input
          v-model:value="form.name"
          clearable
          placeholder="输入代金券名称"
          style="width: 380px"
        />
      </n-form-item>

      <n-form-item label="代金券面值(元)" path="faceValue">
        <n-input-number
          v-model:value="form.faceValue"
          clearable
          placeholder="输入代金券面值(元)"
          style="width: 380px"
        />
      </n-form-item>

      <n-form-item label="有效天数" path="num">
        <n-input-number
          v-model:value="form.num"
          clearable
          placeholder="输入有效天数"
          style="width: 380px"
        />
      </n-form-item>

      <n-form-item label="数量" path="count">
        <n-input-number
          v-model:value="form.count"
          clearable
          placeholder="输入数量"
          style="width: 380px"
        />
      </n-form-item>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
export default defineComponent({
  name: "VoucherModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref({
      rule: null,
      name: null,
      faceValue: null,
      num: null,
      count: null,
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
      form.value = {
        name: null,
        rule: null,
        faceValue: null,
        num: null,
        count: null,
      };
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
        rule: { required: true, trigger: ["blur", "change"], message: "请选择消费规则" },
        name: { required: true, trigger: ["blur", "change"], message: "请输入代金券名称" },
        faceValue: { required: true, trigger: ["blur", "change"], message: "请输入代金券面值" },
        num: { required: true, trigger: ["blur", "change"], message: "请输入有效天数" },
        count: { required: true, trigger: ["blur", "change"], message: "请输入数量" },
      },

      handleModal,
      handleValidate,
      handleReset,
    };
  },
});
</script>
