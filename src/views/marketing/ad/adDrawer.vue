<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '400px' }"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="广告标题" path="advertisementTitle">
        <n-input
          v-model:value="form.advertisementTitle"
          :maxlength="20"
          clearable
          placeholder="输入广告标题"
        />
      </n-form-item>
      <n-form-item label="广告开通城市" path="cityName">
        <n-select
          v-model:value="form.cityCode"
          clearable
          filterable
          :disabled="form.openCityAdvertisementId && form.cityCode ? true : false"
          placeholder="选择开通城市"
          :options="openCityData"
        />
      </n-form-item>

      <n-form-item label="广告H5url" path="advertisementH5Url">
        <n-input v-model:value="form.advertisementH5Url" clearable placeholder="输入广告H5url" />
      </n-form-item>

      <n-form-item label="广告生效时间" path="advertisementEffectiveTimeBegin">
        <n-date-picker
          v-model:value="form.advertisementEffectiveTimeBegin"
          type="datetime"
          clearable
        />
      </n-form-item>

      <n-form-item label="广告失效时间" path="advertisementEffectiveTimeEnd">
        <n-date-picker
          v-model:value="form.advertisementEffectiveTimeEnd"
          type="datetime"
          clearable
        />
      </n-form-item>

      <n-form-item label="广告照片" path="advertisementImageUrl">
        <BasicUpload
          :data="{ uploadType: UploadTypeEnum.CERTIFICATE }"
          name="file"
          :width="85"
          :height="100"
          @delete-upload="remove"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存</n-button
        >
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import BasicUpload from "@/components/Upload/Upload.vue";
import { uploadUrl } from "@/config/config";
import { UploadTypeEnum } from "@/enums/httpEnum";
import { getAllOpenCity } from "@/api/common/common";
import { itemState } from "@/interface/common/common";
import { FormInter } from "./type";
import dayjs from "dayjs";
import { getAdDetail, addAdvertisement, editAdvertisement } from "@/api/marketing/marketing";
export default defineComponent({
  name: "AdDrawer",
  components: {
    BasicUpload,
  },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref();
    const openCityData = ref<SelectOption[]>([]);

    const uploadList = ref<string[]>([]);

    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<FormInter>({
      advertisementTitle: null,
      advertisementImageUrl: null,
      cityName: null,
      cityCode: null,
      advertisementEffectiveTimeBegin: null,
      advertisementEffectiveTimeEnd: null,
      advertisementH5Url: null,
      advertisementSeq: null,
    });

    onMounted(() => {
      getOpenCity();
    });

    async function getOpenCity() {
      try {
        let res = await getAllOpenCity();
        openCityData.value = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
          };
          return obj;
        });
        openCityData.value.unshift({ label: "不限", value: "all" });
      } catch (err) {
        console.log(err);
      }
    }

    function openDrawer(t: string, openCityAdvertisementId: string) {
      title.value = t;
      uploadList.value = [];
      if (openCityAdvertisementId) {
        getDetail(openCityAdvertisementId);
      }
      state.isDrawer = true;
    }

    const getDetail = async (id: string) => {
      try {
        let res = await getAdDetail({ openCityAdvertisementId: id });
        console.log(res);
        const {
          openCityAdvertisementId,
          advertisementTitle,
          advertisementImageUrl,
          cityName,
          cityCode,
          advertisementEffectiveTimeBegin,
          advertisementEffectiveTimeEnd,
          advertisementH5Url,
          advertisementSeq,
        } = res.data;

        form.value = {
          openCityAdvertisementId,
          advertisementTitle,
          advertisementImageUrl,
          cityName,
          cityCode,
          advertisementEffectiveTimeBegin,
          advertisementEffectiveTimeEnd,
          advertisementH5Url,
          advertisementSeq,
        };
        uploadList.value = [advertisementImageUrl];
      } catch (err) {
        console.log(err);
      }
    };

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res;
            const {
              openCityAdvertisementId,
              cityCode,
              advertisementTitle,
              advertisementImageUrl,
              advertisementH5Url,
              advertisementEffectiveTimeBegin,
              advertisementEffectiveTimeEnd,
            } = form.value;
            let option = {
              cityCode,
              advertisementTitle,
              advertisementImageUrl,
              advertisementH5Url,
              advertisementEffectiveTimeBegin: dayjs(advertisementEffectiveTimeBegin).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              advertisementEffectiveTimeEnd: dayjs(advertisementEffectiveTimeEnd).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            };
            if (!form.value.openCityAdvertisementId) {
              res = await addAdvertisement(option);
              console.log(res);
            } else {
              res = await editAdvertisement({ openCityAdvertisementId, ...option });
            }
            state.loading = false;
            message.success(window.$tips[res.code]);
            handleSaveAfter();
          } catch (err) {
            console.log(err);
            state.loading = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      const openCityAdvertisementId = form.value.openCityAdvertisementId;
      form.value = {
        openCityAdvertisementId,
        advertisementTitle: null,
        advertisementImageUrl: null,
        cityName: null,
        cityCode: null,
        advertisementEffectiveTimeBegin: null,
        advertisementEffectiveTimeEnd: null,
        advertisementH5Url: null,
        advertisementSeq: null,
      };
      uploadList.value = [];
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      form.value.openCityAdvertisementId = "";
      handleReset();
    }

    function uploadChange(file: { filePath: string; fileId: string }) {
      form.value.advertisementImageUrl = file.filePath;
      uploadList.value = [file.filePath];
    }

    function remove(file: string[]) {
      console.log(file);
      form.value.advertisementImageUrl = null;
      uploadList.value = [];
    }

    return {
      ...toRefs(state),
      formRef,
      openCityData,
      form,
      uploadUrl,
      UploadTypeEnum,
      rules: {
        advertisementEffectiveTimeBegin: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请选择广告生效时间",
        },
        advertisementEffectiveTimeEnd: {
          type: "number",
          required: true,
          trigger: ["blur", "input"],
          message: "请选择广告失效时间",
        },
        advertisementImageUrl: {
          required: true,
          trigger: ["blur", "input"],
          message: "请上传广告图片",
        },
        advertisementTitle: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入广告标题",
        },
        advertisementH5Url: {
          required: false,
          trigger: ["blur", "input"],
          message: "请输入广告H5url",
        },
      },
      uploadList,
      title,
      remove,

      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
      uploadChange,
    };
  },
});
</script>
