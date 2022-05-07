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
      label-width="140"
      require-mark-placement="right-hanging"
      :model="form"
    >
      <n-form-item label="驾驶证号" path="driverIdentityCardNo">
        <n-input
          v-model:value="form.driverIdentityCardNo"
          style="width: 480px"
          clearable
          placeholder="输入驾驶证号"
        />
      </n-form-item>

      <n-form-item label="驾驶证档案编号" path="driverIdentityCardIssueOrganization">
        <n-input
          style="width: 480px"
          v-model:value="form.driverIdentityCardIssueOrganization"
          clearable
          placeholder="输入身份证驾驶证档案编号"
        />
      </n-form-item>

      <div class="flex-align-start">
        <n-form-item label="准驾车型" path="driverIdentityCardEffectiveDateBegin">
          <n-input
            style="width: 170px"
            v-model:value="form.driverIdentityCardIssueOrganization"
            clearable
            placeholder="输入准驾车型"
          />
        </n-form-item>

        <n-form-item label="驾驶证初领日期" path="driverIdentityCardEffectiveDateEnd">
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverIdentityCardEffectiveDateEnd"
            type="date"
            clearable
          />
        </n-form-item>
      </div>

      <div class="flex-align-start">
        <n-form-item label="驾驶证有效期始" path="driverIdentityCardEffectiveDateBegin">
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverIdentityCardEffectiveDateEnd"
            type="date"
            clearable
          />
        </n-form-item>

        <n-form-item label="驾驶证有效期止" path="driverIdentityCardEffectiveDateEnd">
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverIdentityCardEffectiveDateEnd"
            type="date"
            clearable
          />
        </n-form-item>
      </div>

      <div class="flex-align-start">
        <n-form-item label="驾驶证正页" path="driverIdentityFaceSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.DIRIVERIDENTITY }"
            name="file"
            :width="150"
            :height="120"
            @delete-upload="imageRemove"
            @upload-change="uploadChange"
            v-model:value="uploadList"
          />
        </n-form-item>

        <n-form-item label="驾驶证副页" path="driverIdentityOtherSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.DIRIVERIDENTITY }"
            name="file"
            :width="150"
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
import { updateDriverIdentity } from "@/api/capacity/capacity";
import { licenseRules } from "./data";
export default defineComponent({
  name: "LicenseDrawer",
  components: { BasicModal, BasicUpload },
  setup() {
    // interface FiledInter {
    //   field: string;
    // }
    interface FormInter {
      driverId: string | null;
      driverIdentityCardNo: string | null;
      driverIdentityCardIssueOrganization: string | null;
      driverIdentityCardEffectiveDateBegin: string | null;
      driverIdentityCardEffectiveDateEnd: string | null;
      driverIdentityFaceSide: string | null;
      driverIdentityOtherSide: string | null;

      //   driverIdentityFaceSide: FiledInter;
      //   driverIdentityOtherSide: FiledInter;
    }
    const ModalRef = ref();
    const uploadType = ref("");
    const loading = ref(false);
    const uploadList = ref<string[]>([]);
    const form = ref<FormInter>({
      driverId: null,
      driverIdentityCardNo: null,
      driverIdentityCardIssueOrganization: null,
      driverIdentityCardEffectiveDateBegin: null,
      driverIdentityCardEffectiveDateEnd: null,
      driverIdentityFaceSide: null,
      driverIdentityOtherSide: null,
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
              driverIdentityCardNo,
              driverIdentityCardIssueOrganization,
              driverIdentityCardEffectiveDateBegin,
              driverIdentityCardEffectiveDateEnd,
              driverIdentityFaceSide,
              driverIdentityOtherSide,
            } = form.value;
            let res = await updateDriverIdentity({
              driverId,
              driverIdentityCardNo,
              driverIdentityCardIssueOrganization,
              driverIdentityCardEffectiveDateBegin,
              driverIdentityCardEffectiveDateEnd,
              driverIdentityFaceSide: {
                field: driverIdentityFaceSide as string,
              },
              driverIdentityOtherSide: {
                field: driverIdentityOtherSide as string,
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
        driverId: null,
        driverIdentityCardNo: null,
        driverIdentityCardIssueOrganization: null,
        driverIdentityCardEffectiveDateBegin: null,
        driverIdentityCardEffectiveDateEnd: null,
        driverIdentityFaceSide: null,
        driverIdentityOtherSide: null,
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
