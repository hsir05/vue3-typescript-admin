<template>
  <BasicModal
    title="编辑司机身份证照片信息"
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
      :style="{ maxWidth: '520px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item label="身份证号" path="driverIdentityCardNo">
        <n-input v-model:value="form.driverIdentityCardNo" clearable placeholder="输入身份证号" />
      </n-form-item>

      <n-form-item label="身份证签发机关" path="driverIdentityCardIssueOrganization">
        <n-input
          v-model:value="form.driverIdentityCardIssueOrganization"
          clearable
          placeholder="输入身份证号"
        />
      </n-form-item>

      <n-form-item label="身份证有效期始" path="driverIdentityCardEffectiveDateBegin">
        <n-date-picker
          v-model:value="form.driverIdentityCardEffectiveDateBegin"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item label="身份证有效期止" path="driverIdentityCardEffectiveDateEnd">
        <n-date-picker
          v-model:value="form.driverIdentityCardEffectiveDateEnd"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item path="vehicleTypeImageId">
        <BasicUpload
          :data="{ uploadType: UploadTypeEnum.DIRIVERIDENTITY }"
          name="file"
          :width="120"
          :height="120"
          @delete-upload="imageRemove"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>

      <n-form-item path="vehicleTypeImageId">
        <BasicUpload
          :data="{ uploadType: UploadTypeEnum.DIRIVERIDENTITY }"
          name="file"
          :width="120"
          :height="120"
          @delete-upload="imageRemove"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst } from "naive-ui";
import { UploadTypeEnum } from "@/enums/httpEnum";
import BasicModal from "@/components/Modal/Modal.vue";
import BasicUpload from "@/components/Upload/Upload.vue";
import { updateDriverIdentity } from "@/api/capacity/capacity";
import { licenseRules } from "./data";
export default defineComponent({
  name: "LicenseDrawer",
  components: { BasicModal, BasicUpload },
  setup() {
    interface FiledInter {
      field: string;
    }
    interface FormInter {
      driverId: string | null;
      driverIdentityCardNo: string | null;
      driverIdentityCardIssueOrganization: string | null;
      driverIdentityCardEffectiveDateBegin: string | null;
      driverIdentityCardEffectiveDateEnd: string | null;
      driverIdentityFaceSide: FiledInter;
      driverIdentityOtherSide: FiledInter;
    }
    const ModalRef = ref();
    const uploadType = ref("");
    const loading = ref(false);
    const uploadList = ref<string[]>([]);
    const form = ref<FormInter>({
      filePath: null,
      driverIdentityCardNo: null,
      driverIdentityCardIssueOrganization: null,
      driverIdentityCardEffectiveDateBegin: null,
      driverIdentityCardEffectiveDateEnd: null,
      driverIdentityFaceSide: {
        field: null,
      },
      driverIdentityOtherSide: {
        field: null,
      },
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (record) => {
      console.log(record);
      const { showModal } = ModalRef.value;
      showModal();
    };

    function imageRemove(file: string[]) {
      form.value.filePath = file[0];
      uploadList.value = file;
    }
    function uploadChange(file: { filePath: string; fileId: string }) {
      form.value.filePath = file.fileId;
      uploadList.value = [file.filePath];
    }

    function handleValidate() {
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          loading.value = true;
          try {
            let res = await updateDriverIdentity(form.value);
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
      form.value = { filePath: null };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
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
<style lang="scss">
.n-form-item-blank {
  margin: 0 auto;
}
</style>
