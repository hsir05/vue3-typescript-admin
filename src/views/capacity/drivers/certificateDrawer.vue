<template>
  <BasicModal
    title="编辑司机身份证照片信息"
    width="800px"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="licenseRules"
      label-placement="left"
      label-width="160"
      require-mark-placement="right-hanging"
      :model="form"
    >
      <n-form-item label="网约车资格证号" path="driverNetworkVehicleCertificateNo">
        <n-input
          v-model:value="form.driverNetworkVehicleCertificateNo"
          style="width: 540px"
          clearable
          placeholder="输入网约车资格证号"
        />
      </n-form-item>

      <n-form-item label="身份证签发机关" path="driverNetworkVehicleCertificateIssueOrganization">
        <n-input
          style="width: 540px"
          v-model:value="form.driverNetworkVehicleCertificateIssueOrganization"
          clearable
          placeholder="输入身份证身份证签发机关"
        />
      </n-form-item>

      <n-form-item label="网约车资格证初领日期" path="driverNetworkVehicleCertificateGetDate">
        <n-date-picker
          style="width: 540px"
          v-model:value="form.driverNetworkVehicleCertificateGetDate"
          type="date"
          clearable
        />
      </n-form-item>

      <div class="flex-align-start">
        <n-form-item
          label="网约车资格证有效期始"
          path="driverNetworkVehicleCertificateEffectiveDateBegin"
        >
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverNetworkVehicleCertificateEffectiveDateBegin"
            type="date"
            clearable
          />
        </n-form-item>

        <n-form-item
          label="网约车资格证有效期止"
          path="driverNetworkVehicleCertificateEffectiveDateEnd"
        >
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverNetworkVehicleCertificateEffectiveDateEnd"
            type="date"
            clearable
          />
        </n-form-item>
      </div>

      <div class="flex-align-start">
        <n-form-item label="网约车资格证正页" path="driverNetworkVehicleCertificateFaceSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.CERTIFICATE }"
            name="file"
            :width="140"
            :height="120"
            @delete-upload="imageRemove"
            @upload-change="uploadChange"
            v-model:value="uploadList"
          />
        </n-form-item>

        <n-form-item label="网约车资格证副页" path="driverNetworkVehicleCertificateOtherSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.CERTIFICATE }"
            name="file"
            :width="120"
            :height="120"
            @delete-upload="imageRemove"
            @upload-change="uploadChange"
            v-model:value="uploadList"
          />
        </n-form-item>
      </div>

      <div class="text-center">
        <n-button
          attr-type="button"
          :loading="loading"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存
        </n-button>
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst } from "naive-ui";
import { UploadTypeEnum } from "@/enums/httpEnum";
import BasicModal from "@/components/Modal/Modal.vue";
import BasicUpload from "@/components/Upload/Upload.vue";
import { updateCertificate } from "@/api/capacity/capacity";
import { licenseRules } from "./data";
import { CertificateInter } from "./type";
export default defineComponent({
  name: "CertificateDrawer",
  components: { BasicModal, BasicUpload },
  setup() {
    const ModalRef = ref();
    const uploadType = ref("");
    const loading = ref(false);
    const uploadList = ref<string[]>([]);
    const form = ref<CertificateInter>({
      driverId: "",
      driverNetworkVehicleCertificateNo: "",
      driverNetworkVehicleCertificateIssueOrganization: "",
      driverNetworkVehicleCertificateGetDate: "",
      driverNetworkVehicleCertificateEffectiveDateBegin: "",
      driverNetworkVehicleCertificateEffectiveDateEnd: "",
      driverNetworkVehicleCertificateFaceSide: "",
      driverNetworkVehicleCertificateOtherSide: "",
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = () => {
      //   console.log(record);
      const { showModal } = ModalRef.value;
      showModal();
    };

    function imageRemove(file: string[]) {
      // form.value.filePath = file[0];
      uploadList.value = file;
    }
    function uploadChange(file: { filePath: string; fileId: string }) {
      // form.value.filePath = file.fileId;
      uploadList.value = [file.filePath];
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          loading.value = true;
          try {
            const {
              driverId,
              driverNetworkVehicleCertificateNo,
              driverNetworkVehicleCertificateIssueOrganization,
              driverNetworkVehicleCertificateGetDate,
              driverNetworkVehicleCertificateEffectiveDateBegin,
              driverNetworkVehicleCertificateEffectiveDateEnd,
              driverNetworkVehicleCertificateFaceSide,
              driverNetworkVehicleCertificateOtherSide,
            } = form.value;
            let res = await updateCertificate({
              driverId,
              driverNetworkVehicleCertificateNo,
              driverNetworkVehicleCertificateIssueOrganization,
              driverNetworkVehicleCertificateGetDate,
              driverNetworkVehicleCertificateEffectiveDateBegin,
              driverNetworkVehicleCertificateEffectiveDateEnd,
              driverNetworkVehicleCertificateOtherSide: {
                field: driverNetworkVehicleCertificateFaceSide,
              },
              driverNetworkVehicleCertificateFaceSide: {
                field: driverNetworkVehicleCertificateOtherSide,
              },
            });
            console.log(res);
            loading.value = false;
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        } else {
          console.log(errors);
        }
      });
    }
    function handleReset() {
      form.value = {
        driverId: "",
        driverNetworkVehicleCertificateNo: "",
        driverNetworkVehicleCertificateIssueOrganization: "",
        driverNetworkVehicleCertificateGetDate: "",
        driverNetworkVehicleCertificateEffectiveDateBegin: "",
        driverNetworkVehicleCertificateEffectiveDateEnd: "",
        driverNetworkVehicleCertificateFaceSide: "",
        driverNetworkVehicleCertificateOtherSide: "",
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
      imageRemove,
      handleModal,
      uploadChange,
      handleReset,
      handleValidate,
    };
  },
});
</script>
<style lang="scss" scoped>
.n-form-item-blank {
  margin: 0 auto;
}
</style>
