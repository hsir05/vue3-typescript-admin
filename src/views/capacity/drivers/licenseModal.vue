<template>
  <BasicModal
    title="编辑司机驾驶证照片信息"
    width="750px"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="licenseRules"
      label-placement="left"
      label-width="140"
      require-mark-placement="right-hanging"
      :model="form"
    >
      <n-form-item label="驾驶证号" path="driverLicenseNo">
        <n-input
          v-model:value="form.driverLicenseNo"
          style="width: 480px"
          clearable
          placeholder="输入驾驶证号"
        />
      </n-form-item>

      <n-form-item label="驾驶证档案编号" path="driverLicenseArchivesNo">
        <n-input
          style="width: 480px"
          v-model:value="form.driverLicenseArchivesNo"
          clearable
          placeholder="输入身份证驾驶证档案编号"
        />
      </n-form-item>

      <div class="flex-align-start">
        <n-form-item label="准驾车型" path="driverPermitVehicleModel">
          <n-select
            style="width: 170px"
            v-model:value="form.driverPermitVehicleModel"
            placeholder="选择准驾车型"
            :options="drivingLicense"
          />
        </n-form-item>

        <n-form-item label="驾驶证初领日期" path="driverLicenseGetDate">
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverLicenseGetDate"
            type="date"
            clearable
          />
        </n-form-item>
      </div>

      <div class="flex-align-start">
        <n-form-item label="驾驶证有效期始" path="driverLicenseEffectiveDateBegin">
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverLicenseEffectiveDateBegin"
            type="date"
            clearable
          />
        </n-form-item>

        <n-form-item label="驾驶证有效期止" path="driverLicenseEffectiveDateEnd">
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverLicenseEffectiveDateEnd"
            type="date"
            clearable
          />
        </n-form-item>
      </div>

      <div class="flex-align-start">
        <n-form-item label="驾驶证正页" path="driverLicenseFaceSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.DRIVERLICENSE }"
            name="file"
            :width="150"
            :height="100"
            @delete-upload="remove"
            @upload-change="change"
            v-model:value="uploadList"
          />
        </n-form-item>

        <n-form-item label="驾驶证副页" path="driverLicenseOtherSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.DRIVERLICENSE }"
            name="file"
            :width="150"
            :height="100"
            @delete-upload="otherRemove"
            @upload-change="otherChange"
            v-model:value="otherUploadList"
          />
        </n-form-item>
      </div>

      <div class="text-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存
        </n-button>
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { UploadTypeEnum } from "@/enums/httpEnum";
import BasicModal from "@/components/Modal/Modal.vue";
import BasicUpload from "@/components/Upload/Upload.vue";
import { updateDriverLicense } from "@/api/capacity/capacity";
import { drivingLicense } from "@/config/form";
import { licenseRules } from "./data";
import { LienceFormInter, LienceRecordInter } from "./type";
import dayjs from "dayjs";
export default defineComponent({
  name: "LicenseModal",
  components: { BasicModal, BasicUpload },
  setup() {
    const ModalRef = ref();
    const uploadType = ref("");
    const loading = ref(false);
    const message = useMessage();
    const form = ref<LienceFormInter>({
      driverId: " ",
      driverLicenseNo: " ",
      driverLicenseArchivesNo: " ",
      driverPermitVehicleModel: " ",
      driverLicenseGetDate: 0,
      driverLicenseEffectiveDateBegin: 0,
      driverLicenseEffectiveDateEnd: 0,
      driverLicenseFaceSide: " ",
      driverLicenseOtherSide: " ",
    });
    const uploadList = ref<string[]>([]);
    const otherUploadList = ref<string[]>([]);
    const formRef = ref<FormInst | null>(null);

    const handleModal = (record: LienceRecordInter) => {
      const {
        driverId,
        driverLicenseNo,
        driverLicenseArchivesNo,
        driverPermitVehicleModel,
        driverLicenseGetDate,
        driverLicenseEffectiveDateBegin,
        driverLicenseEffectiveDateEnd,
        driverLicenseFaceSide,
        driverLicenseOtherSide,
      } = record;

      form.value = {
        driverId,
        driverLicenseNo,
        driverLicenseArchivesNo,
        driverPermitVehicleModel,
        driverLicenseGetDate: new Date(driverLicenseGetDate).getTime(),
        driverLicenseEffectiveDateBegin: new Date(driverLicenseEffectiveDateBegin).getTime(),
        driverLicenseEffectiveDateEnd: new Date(driverLicenseEffectiveDateEnd).getTime(),
        driverLicenseFaceSide: driverLicenseFaceSide.fileId,
        driverLicenseOtherSide: driverLicenseOtherSide.fileId,
      };

      uploadList.value = [driverLicenseFaceSide.filePath];
      otherUploadList.value = [driverLicenseOtherSide.filePath];

      const { showModal } = ModalRef.value;
      showModal(record);
    };

    function remove(file: string[]) {
      console.log(file);
      form.value.driverLicenseFaceSide = "";
      uploadList.value = [];
    }
    function change(file: { filePath: string; fileId: string }) {
      form.value.driverLicenseFaceSide = file.fileId;
      uploadList.value = [file.filePath];
    }

    function otherRemove(file: string[]) {
      console.log(file);
      form.value.driverLicenseOtherSide = "";
      otherUploadList.value = [];
    }
    function otherChange(file: { filePath: string; fileId: string }) {
      form.value.driverLicenseOtherSide = file.fileId;
      otherUploadList.value = [file.filePath];
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          loading.value = true;
          try {
            const {
              driverId,
              driverLicenseNo,
              driverLicenseArchivesNo,
              driverPermitVehicleModel,
              driverLicenseGetDate,
              driverLicenseEffectiveDateBegin,
              driverLicenseEffectiveDateEnd,
              driverLicenseFaceSide,
              driverLicenseOtherSide,
            } = form.value;
            let res = await updateDriverLicense({
              driverId,
              driverLicenseNo,
              driverLicenseArchivesNo,
              driverPermitVehicleModel,
              driverLicenseGetDate: dayjs(driverLicenseGetDate).format("YYYY-MM-DD"),
              driverLicenseEffectiveDateBegin: dayjs(driverLicenseEffectiveDateBegin).format(
                "YYYY-MM-DD"
              ),
              driverLicenseEffectiveDateEnd: dayjs(driverLicenseEffectiveDateEnd).format(
                "YYYY-MM-DD"
              ),
              driverLicenseFaceSide: {
                fileId: driverLicenseFaceSide as string,
              },
              driverLicenseOtherSide: {
                fileId: driverLicenseOtherSide as string,
              },
            });
            console.log(res);
            message.success(window.$tips[res.code]);
            loading.value = false;
          } catch (err) {
            console.log(err);
            message.error("保存失败,请稍候重试!");
            loading.value = false;
          }
        } else {
          console.log(errors);
        }
      });
    }
    function handleReset() {
      form.value = {
        driverId: " ",
        driverLicenseNo: " ",
        driverLicenseArchivesNo: " ",
        driverPermitVehicleModel: " ",
        driverLicenseGetDate: 0,
        driverLicenseEffectiveDateBegin: 0,
        driverLicenseEffectiveDateEnd: 0,
        driverLicenseFaceSide: " ",
        driverLicenseOtherSide: " ",
      };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      uploadType,
      UploadTypeEnum,
      form,
      loading,
      uploadList,
      licenseRules,
      drivingLicense,
      remove,
      change,
      otherRemove,
      otherChange,
      handleModal,
      otherUploadList,
      handleReset,
      handleValidate,
    };
  },
});
</script>
