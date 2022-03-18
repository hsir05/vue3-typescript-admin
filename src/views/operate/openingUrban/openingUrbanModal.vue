<template>
  <BasicModal
    width="650px"
    title="添加开通城市"
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
      <n-form-item label="开通城市" path="code">
        <n-select
          clearable
          v-model:value="form.code"
          placeholder="选择开通城市"
          @update:value="handleUpdateValue"
          :options="cityData.result"
        />
      </n-form-item>
      <n-form-item label="城市编码">
        <n-input v-model:value="form.code" disabled clearable placeholder="输入城市编码" />
      </n-form-item>
      <n-form-item label="经度" path="lng">
        <n-input-number v-model:value="form.lng" :disable="true" clearable placeholder="输入经度" />
      </n-form-item>

      <n-form-item label="纬度" path="lat">
        <n-input-number v-model:value="form.lat" clearable placeholder="输入纬度" />
      </n-form-item>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, unref, toRaw } from "vue";
import BasicModal from "@/components/Modal/Modal.vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { tableDataItem } from "./type";
import cityData from "@/config/cityData.json";
export default defineComponent({
  name: "OpeningUrbanModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);

    const form = ref<tableDataItem>({
      city: null,
      code: null,
      lng: null,
      lat: null,
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
      form.value = { city: null, code: null, lng: null, lat: null };
      formRef.value?.restoreValidation();
    }

    function handleUpdateValue(_: string, option: SelectOption) {
      console.log(option);
      // console.log(toRaw(form.value));
      form.value = {
        ...toRaw(form.value),
        city: option.label as string,
        code: option.value as string,
      };
      console.log(form.value);

      //    form.value.city = unref(option).label
      //    form.value.code = option.value
    }

    return {
      ModalRef,
      formRef,
      form,
      loading,
      cityData,
      rules: {
        code: { required: true, trigger: ["blur", "change"], message: "请选择开通城市" },
        lng: { required: true, type: "number", trigger: ["blur", "input"], message: "请输入经度" },
        lat: { required: true, type: "number", trigger: ["blur", "input"], message: "请输入纬度" },
      },

      handleModal,
      handleUpdateValue,
      handleValidate,
      handleReset,
    };
  },
});
</script>
