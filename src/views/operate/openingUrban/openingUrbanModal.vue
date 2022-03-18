<template>
  <BasicModal title="添加开通城市" ref="ModalRef">
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      :style="{ maxWidth: '560px' }"
      require-mark-placement="right-hanging"
      label-width="150"
      :model="form"
    >
      <n-form-item label="开通城市" path="city">
        <!-- <n-input v-model:value="form.city" clearable placeholder="输入开通城市" /> -->
        <n-select
          v-model:value="form.city"
          value="cityCode"
          :render-label="renderLabel"
          clearable
          placeholder="选择性别"
          @update:value="handleUpdateValue"
          :options="cityData.result"
        />
      </n-form-item>
      <n-form-item label="城市编码" path="code">
        <n-input v-model:value="form.code" clearable placeholder="输入城市编码" />
      </n-form-item>
      <n-form-item label="经度" path="lng">
        <n-input-number
          v-model:value="form.lng"
          :disable="true"
          clearable
          placeholder="输入词条排序"
        />
      </n-form-item>

      <n-form-item label="纬度" path="sort">
        <n-input-number v-model:value="form.lat" clearable placeholder="输入词条排序" />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          size="large"
          class="ml-10px"
          @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref } from "vue";
import BasicModal from "@/components/Modal/Modal.vue";
import { FormInst, useMessage, SelectOption, SelectRenderLabel } from "naive-ui";
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

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
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

    function handleUpdateValue(value: string, option: SelectOption) {
      message.info("value: " + JSON.stringify(value));
      message.info("option: " + JSON.stringify(option));
      //  form.value.code =
    }

    const renderLabel: SelectRenderLabel = (option) => {
      return h(
        "span",
        {
          value: `${option.cityCode}`,
        },
        `${option.cityName}`
      );
    };

    return {
      ModalRef,
      form,
      loading,
      cityData,
      rules: {
        city: { required: true, trigger: ["blur", "change"], message: "请选择开通城市" },
        lng: { required: true, type: "number", trigger: ["blur", "input"], message: "请输入经度" },
        lat: { required: true, type: "number", trigger: ["blur", "input"], message: "请输入纬度" },
      },

      handleModal,
      handleUpdateValue,
      renderLabel,
      handleValidate,
      handleReset,
    };
  },
});
</script>
