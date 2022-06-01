<template>
  <BasicModal
    title="编辑网约车资格证照片信息"
    width="860px"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="certRules"
      label-placement="left"
      label-width="180"
      require-mark-placement="right-hanging"
      :model="form"
    >
      <n-form-item label="网约车资格证号" path="driverNetworkVehicleCertificateNo">
        <n-input
          v-model:value="form.driverNetworkVehicleCertificateNo"
          style="width: 520px"
          clearable
          placeholder="输入网约车资格证号"
        />
      </n-form-item>

      <n-form-item label="身份证签发机关" path="driverNetworkVehicleCertificateIssueOrganization">
        <n-input
          style="width: 520px"
          v-model:value="form.driverNetworkVehicleCertificateIssueOrganization"
          clearable
          placeholder="输入身份证身份证签发机关"
        />
      </n-form-item>

      <n-form-item label="网约车资格证初领日期" path="driverNetworkVehicleCertificateGetDate">
        <n-date-picker
          style="width: 520px"
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
            :width="145"
            :height="100"
            @delete-upload="remove"
            @upload-change="change"
            v-model:value="uploadList"
          />
        </n-form-item>

        <n-form-item label="网约车资格证副页" path="driverNetworkVehicleCertificateOtherSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.CERTIFICATE }"
            name="file"
            :width="145"
            :height="100"
            @delete-upload="otherRemove"
            @upload-change="otherChange"
            v-model:value="otherUploadList"
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
import { FormInst, useMessage } from "naive-ui";
import { UploadTypeEnum } from "@/enums/httpEnum";
import BasicModal from "@/components/Modal/Modal.vue";
import BasicUpload from "@/components/Upload/Upload.vue";
import { updateCertificate } from "@/api/capacity/capacity";
import { certRules } from "./data";
import { CertRecordInter, CertInter } from "./type";
import dayjs from "dayjs";
export default defineComponent({
  name: "CertificateModal",
  components: { BasicModal, BasicUpload },
  setup() {
    const ModalRef = ref();
    const uploadType = ref("");
    const message = useMessage();
    const loading = ref(false);
    const uploadList = ref<string[]>([]);
    const otherUploadList = ref<string[]>([]);
    const form = ref<CertInter>({
      driverId: "",
      driverNetworkVehicleCertificateNo: "",
      driverNetworkVehicleCertificateIssueOrganization: "",
      driverNetworkVehicleCertificateGetDate: 0,
      driverNetworkVehicleCertificateEffectiveDateBegin: 0,
      driverNetworkVehicleCertificateEffectiveDateEnd: 0,
      driverNetworkVehicleCertificateFaceSide: "",
      driverNetworkVehicleCertificateOtherSide: "",
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (record: CertRecordInter) => {
      console.log(record);
      const {
        driverId,
        driverNetworkVehicleCertificateNo,
        driverNetworkVehicleCertificateIssueOrganization,
        driverNetworkVehicleCertificateGetDate,
        driverNetworkVehicleCertificateEffectiveDateBegin,
        driverNetworkVehicleCertificateEffectiveDateEnd,
        driverNetworkVehicleCertificateFaceSide,
        driverNetworkVehicleCertificateOtherSide,
      } = record;

      form.value = {
        driverId,
        driverNetworkVehicleCertificateNo,
        driverNetworkVehicleCertificateIssueOrganization,
        driverNetworkVehicleCertificateGetDate: new Date(
          driverNetworkVehicleCertificateGetDate
        ).getTime(),
        driverNetworkVehicleCertificateEffectiveDateBegin: new Date(
          driverNetworkVehicleCertificateEffectiveDateBegin
        ).getTime(),
        driverNetworkVehicleCertificateEffectiveDateEnd: new Date(
          driverNetworkVehicleCertificateEffectiveDateEnd
        ).getTime(),
        driverNetworkVehicleCertificateFaceSide: driverNetworkVehicleCertificateFaceSide.fileId,
        driverNetworkVehicleCertificateOtherSide: driverNetworkVehicleCertificateOtherSide.fileId,
      };

      uploadList.value = [driverNetworkVehicleCertificateFaceSide.filePath];
      otherUploadList.value = [driverNetworkVehicleCertificateOtherSide.filePath];
      const { showModal } = ModalRef.value;
      showModal();
    };

    function remove(file: string[]) {
      console.log(file);
      form.value.driverNetworkVehicleCertificateFaceSide = "";
      uploadList.value = [];
    }
    function change(file: { filePath: string; fileId: string }) {
      form.value.driverNetworkVehicleCertificateFaceSide = file.fileId;
      uploadList.value = [file.filePath];
    }

    function otherRemove(file: string[]) {
      console.log(file);
      form.value.driverNetworkVehicleCertificateOtherSide = "";
      otherUploadList.value = [];
    }
    function otherChange(file: { filePath: string; fileId: string }) {
      form.value.driverNetworkVehicleCertificateOtherSide = file.fileId;
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
              driverNetworkVehicleCertificateGetDate: dayjs(
                driverNetworkVehicleCertificateGetDate
              ).format("YYYY-MM-DD"),
              driverNetworkVehicleCertificateEffectiveDateBegin: dayjs(
                driverNetworkVehicleCertificateEffectiveDateBegin
              ).format("YYYY-MM-DD"),
              driverNetworkVehicleCertificateEffectiveDateEnd: dayjs(
                driverNetworkVehicleCertificateEffectiveDateEnd
              ).format("YYYY-MM-DD"),
              driverNetworkVehicleCertificateOtherSide: {
                fileId: driverNetworkVehicleCertificateFaceSide,
              },
              driverNetworkVehicleCertificateFaceSide: {
                fileId: driverNetworkVehicleCertificateOtherSide,
              },
            });
            console.log(res);
            message.success(window.$tips[res.code]);
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
        driverNetworkVehicleCertificateGetDate: 0,
        driverNetworkVehicleCertificateEffectiveDateBegin: 0,
        driverNetworkVehicleCertificateEffectiveDateEnd: 0,
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
      certRules,
      uploadList,
      otherUploadList,
      remove,
      change,
      handleModal,
      otherRemove,
      otherChange,
      handleReset,
      handleValidate,
    };
  },
});
</script>
