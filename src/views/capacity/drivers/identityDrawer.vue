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
      :rules="identityRules"
      label-placement="left"
      label-width="140"
      style="width: 640px"
      require-mark-placement="right-hanging"
      :model="form"
    >
      <n-form-item label="身份证号码" path="driverIdentityCardNo">
        <n-input
          v-model:value="form.driverIdentityCardNo"
          style="width: 480px"
          clearable
          placeholder="输入身份证号码"
        />
      </n-form-item>

      <n-form-item label="身份证签发机关" path="driverIdentityCardIssueOrganization">
        <n-input
          style="width: 480px"
          v-model:value="form.driverIdentityCardIssueOrganization"
          clearable
          placeholder="输入身份证身份证签发机关"
        />
      </n-form-item>

      <div class="flex-align-start">
        <n-form-item label="身份证有效期始" path="driverIdentityCardEffectiveDateBegin">
          <n-date-picker
            style="width: 170px"
            format="yyyy-MM-dd"
            v-model:value="form.driverIdentityCardEffectiveDateBegin"
            type="date"
            clearable
          />
        </n-form-item>

        <n-form-item label="身份证有效期止" path="driverIdentityCardEffectiveDateEnd">
          <n-date-picker
            style="width: 170px"
            v-model:value="form.driverIdentityCardEffectiveDateEnd"
            type="date"
            clearable
          />
        </n-form-item>
      </div>

      <div class="flex-align-start">
        <n-form-item label="司机身份证头像面" path="driverIdentityFaceSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.DIRIVERIDENTITY }"
            name="file"
            :width="150"
            :height="120"
            @delete-upload="faceRemove"
            @upload-change="faceChange"
            v-model:value="faceUploadList"
          />
        </n-form-item>

        <n-form-item label="司机身份证国徽面" path="driverIdentityOtherSide">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.DIRIVERIDENTITY }"
            name="file"
            :width="150"
            :height="120"
            @delete-upload="otherRemove"
            @upload-change="otherdChange"
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
import { FormInst } from "naive-ui";
import { UploadTypeEnum } from "@/enums/httpEnum";
import BasicModal from "@/components/Modal/Modal.vue";
import BasicUpload from "@/components/Upload/Upload.vue";
import { updateDriverIdentity } from "@/api/capacity/capacity";
import { identityRules } from "./data";
import { IdentFormInter, RecordInter } from "./type";
// import dayjs from "dayjs";
export default defineComponent({
  name: "IdentityDrawer",
  components: { BasicModal, BasicUpload },
  setup() {
    const ModalRef = ref();
    const uploadType = ref("");
    const loading = ref(false);
    const faceUploadList = ref<string[]>([]);
    const otherUploadList = ref<string[]>([]);

    const form = ref<IdentFormInter>({
      driverId: "",
      driverIdentityCardNo: "",
      driverIdentityCardIssueOrganization: "",
      driverIdentityCardEffectiveDateBegin: 0,
      driverIdentityCardEffectiveDateEnd: 0,
      driverIdentityFaceSide: "",
      driverIdentityOtherSide: "",
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (record: RecordInter) => {
      const {
        driverId,
        driverIdentityCardNo,
        driverIdentityCardIssueOrganization,
        driverIdentityCardEffectiveDateBegin,
        driverIdentityCardEffectiveDateEnd,
        driverIdentityFaceSide,
        driverIdentityOtherSide,
      } = record;
      form.value = {
        driverId,
        driverIdentityCardNo,
        driverIdentityCardIssueOrganization,
        driverIdentityCardEffectiveDateBegin: new Date(
          driverIdentityCardEffectiveDateBegin
        ).getTime(),
        driverIdentityCardEffectiveDateEnd: new Date(driverIdentityCardEffectiveDateEnd).getTime(),
        driverIdentityFaceSide: driverIdentityFaceSide.fileId,
        driverIdentityOtherSide: driverIdentityOtherSide.fileId,
      };

      faceUploadList.value = [driverIdentityFaceSide.filePath];
      otherUploadList.value = [driverIdentityOtherSide.filePath];
      console.log(form.value);

      const { showModal } = ModalRef.value;
      showModal();
    };

    function faceRemove(file: string[]) {
      console.log(file);
      faceUploadList.value = [];
    }
    function faceChange(file: { filePath: string; fileId: string }) {
      form.value.driverIdentityFaceSide = file.fileId;
      faceUploadList.value = [file.filePath];
    }

    function otherRemove(file: string[]) {
      console.log(file);
      otherUploadList.value = [];
    }
    function otherdChange(file: { filePath: string; fileId: string }) {
      form.value.driverIdentityOtherSide = file.fileId;
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
        driverId: "",
        driverIdentityCardNo: "",
        driverIdentityCardIssueOrganization: "",
        driverIdentityCardEffectiveDateBegin: 0,
        driverIdentityCardEffectiveDateEnd: 0,
        driverIdentityFaceSide: "",
        driverIdentityOtherSide: "",
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
      faceUploadList,
      faceChange,
      faceRemove,
      otherUploadList,
      identityRules,
      otherRemove,
      handleModal,
      otherdChange,
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
