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
      <n-form-item label="开通城市" path="cityCode">
        <n-select
          clearable
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
import { defineComponent, VNodeChild, ref, unref, onMounted, toRaw } from "vue";
import BasicModal from "@/components/Modal/Modal.vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { tableDataItem } from "./type";
import { getOpenCity } from "@/api/common/common";
import { openCitySave } from "@/api/operate/operate";
export default defineComponent({
  name: "OpeningUrbanModal",
  components: { BasicModal },
  setup() {
    const ModalRef = ref();
    const message = useMessage();
    const loading = ref(false);
    const cityData = ref([]);

    const form = ref<tableDataItem>({
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
        let res = await getOpenCity();
        cityData.value = res || [];
      } catch (err) {
        console.log(err);
      }
    };

    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          console.log(unref(form));
          let option = {
            cityName: form.value.cityName as string,
            cityCode: form.value.cityCode as string,
            lng: form.value.lng as number,
            lat: form.value.lat as number,
          };
          try {
            await openCitySave(option);
          } catch (err) {
            console.log(err);
          }

          message.success("验证成功");
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

    function handleUpdateValue(_: string, option: SelectOption) {
      console.log(option);
      // console.log(toRaw(form.value));
      form.value = {
        ...toRaw(form.value),
        cityName: option.label as string,
        cityCode: option.value as string,
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
      renderLabel: (option: SelectOption): VNodeChild => {
        console.log(option);

        return option.cityName as string;
        // return [
        //   h(
        //     NIcon,
        //     {
        //       style: {
        //         verticalAlign: '-0.15em',
        //         marginRight: '4px'
        //       }
        //     },
        //     {
        //       default: () => h(MusicIcon)
        //     }
        //   ),
        //   option.label as string
        // ]
      },
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
