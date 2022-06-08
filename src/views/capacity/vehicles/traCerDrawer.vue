<template>
  <BasicDrawer v-model:show="isDrawer" title="编辑运输证照片信息" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="trcRules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '460px' }"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="运输证字号" path="vehicleTransportLicenseNo">
        <n-input
          v-model:value="form.vehicleTransportLicenseNo"
          clearable
          placeholder="请输入运输证字号，如X交运管许可XX字XXX号"
        />
      </n-form-item>
      <n-form-item label="运输证发证机关" path="vehicleTransportLicenseIssueOrganization">
        <n-input
          v-model:value="form.vehicleTransportLicenseIssueOrganization"
          clearable
          placeholder="请输入运输证发证机关，如XX交通运输管理处"
        />
      </n-form-item>

      <n-form-item label="运输证有效期始" path="vehicleTransportLicenseEffectiveBegin">
        <n-date-picker
          v-model:value="form.vehicleTransportLicenseEffectiveBegin"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="运输证有效期止" path="vehicleTransportLicenseEffectiveEnd">
        <n-date-picker
          v-model:value="form.vehicleTransportLicenseEffectiveEnd"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="运输证经营范围" path="vehicleTransportLicenseOperationScope">
        <n-input
          v-model:value="form.vehicleTransportLicenseOperationScope"
          clearable
          placeholder="请输入运输证发证机关，如XX交通运输管理处"
        />
      </n-form-item>

      <n-form-item label="车辆照片" path="vehiclePhotoId">
        <BasicUpload
          :data="{ uploadType: UploadTypeEnum.VEHICLEPHOTO }"
          name="file"
          :disabled="disabled"
          :width="310"
          :height="130"
          @delete-upload="vehiclePhotoRemove"
          @upload-change="vehiclePhotoChange"
          v-model:value="vehiclePhotoList"
        />
      </n-form-item>

      <n-form-item label="运输证" path="vehicleTransportLicenseId">
        <BasicUpload
          :data="{ uploadType: UploadTypeEnum.DRIVERLICENSE }"
          name="file"
          :disabled="disabled"
          :width="310"
          :height="130"
          @delete-upload="transportRemove"
          @upload-change="transportChange"
          v-model:value="transportList"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          :disabled="disabled"
          type="primary"
          @click="handleValidate"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          :disabled="disabled"
          class="ml-10px"
          @click="handleReset"
          >重置
        </n-button>
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { trcRules } from "./data";
import { TraCerInter } from "./type";
import { UploadTypeEnum } from "@/enums/httpEnum";
import BasicUpload from "@/components/Upload/Upload.vue";
export default defineComponent({
  name: "TraCerDrawer",
  components: { BasicUpload },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      openCityData: [],
    });
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<TraCerInter>({
      vehicleTransportLicenseNo: null,
      vehicleTransportLicenseIssueOrganization: null,
      vehicleTransportLicenseEffectiveBegin: null,
      vehicleTransportLicenseEffectiveEnd: null,
      vehicleTransportLicenseOperationScope: null,
      vehiclePhotoId: null,
      vehicleTransportLicenseId: null,
    });

    const uploadList = ref([]);

    const vehiclePhotoList = ref<string[]>([]);
    const transportList = ref<string[]>([]);

    function openDrawer(record: TraCerInter) {
      console.log(record);
      form.value = record;
      state.isDrawer = true;
    }

    function vehiclePhotoRemove(file: string[]) {
      form.value.vehiclePhotoId = file[0];
      vehiclePhotoList.value = file;
    }

    function vehiclePhotoChange(file: { filePath: string; fileId: string }) {
      form.value.vehiclePhotoId = file.fileId;
      vehiclePhotoList.value = [file.filePath];
    }

    function transportRemove(file: string[]) {
      form.value.vehicleTransportLicenseId = file[0];
      transportList.value = file;
    }

    function transportChange(file: { filePath: string; fileId: string }) {
      form.value.vehicleTransportLicenseId = file.fileId;
      transportList.value = [file.filePath];
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));

          handleSaveAfter();

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        vehicleTransportLicenseNo: null,
        vehicleTransportLicenseIssueOrganization: null,
        vehicleTransportLicenseEffectiveBegin: null,
        vehicleTransportLicenseEffectiveEnd: null,
        vehicleTransportLicenseOperationScope: null,
        vehiclePhotoId: null,
        vehicleTransportLicenseId: null,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      formRef,
      trcRules,
      uploadUrl: import.meta.env.VITE_GLOB_UPLOAD_URL,
      vehiclePhotoList,
      transportList,
      form,
      uploadList,
      UploadTypeEnum,
      openDrawer,
      transportRemove,
      transportChange,
      handleReset,
      handleValidate,
      onCloseAfter,
      vehiclePhotoChange,
      vehiclePhotoRemove,
    };
  },
});
</script>
