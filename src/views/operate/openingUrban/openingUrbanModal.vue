<template>
  <BasicModal
    width="650px"
    title="添加开通城市"
    :loading="loading"
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
      <n-form-item label="开通城市" path="cityCode">
        <n-select
          clearable
          filterable
          v-model:value="form.cityCode"
          placeholder="选择开通城市"
          @update:value="handleUpdateValue"
          :options="cityData"
        />
      </n-form-item>
      <n-form-item label="城市编码">
        <n-input v-model:value="form.cityCode" disabled clearable placeholder="输入城市编码" />
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
import { defineComponent, ref, onMounted } from "vue";
import BasicModal from "@/components/Modal/Modal.vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { TableItemInter } from "./type";
import { getAllOpenCity } from "@/api/common/common";
import { itemState } from "@/interface/common/common";
import { openCitySave, uniqueCityName } from "@/api/operate/operate";
export default defineComponent({
  name: "OpeningUrbanModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);
    const cityData = ref<TableItemInter[]>([]);

    const form = ref<TableItemInter>({
      cityName: null,
      cityCode: null,
      lng: null,
      lat: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = () => {
      const { showModal } = ModalRef.value;
      showModal();
    };

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      try {
        let res = await getAllOpenCity();
        cityData.value = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
            lng: item.lng,
            lat: item.lat,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    };

    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          loading.value = true;
          let option = {
            cityName: form.value.cityName as string,
            cityCode: form.value.cityCode as string,
            lng: form.value.lng as number,
            lat: form.value.lat as number,
          };
          try {
            let res = await openCitySave(option);
            message.success(res.message);
            loading.value = false;
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleReset() {
      form.value = { cityName: null, cityCode: null, lng: null, lat: null };
      formRef.value?.restoreValidation();
    }

    async function handleUpdateValue(_: string, option: SelectOption) {
      try {
        let res = await uniqueCityName({ cityCode: option.value as string });

        if (res.data.UniqueBooleanResult) {
          form.value = {
            lat: option.lat as number,
            lng: option.lng as number,
            cityName: option.label as string,
            cityCode: option.value as string,
          };
          message.success(res.message);
        }
      } catch (err) {
        console.log(err);
        form.value.cityCode = null;
        form.value.cityName = null;
      }
    }

    return {
      ModalRef,
      formRef,
      form,
      loading,
      cityData,
      rules: {
        cityCode: { required: true, trigger: ["blur", "change"], message: "请选择开通城市" },
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
