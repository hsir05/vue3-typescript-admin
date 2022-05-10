<template>
  <BasicDrawer
    v-model:show="isDrawer"
    title="司机证件照片信息"
    :width="1000"
    @on-close-after="onCloseAfter"
  >
    <n-spin :show="loading" class="mt-70px">
      <div class="img-info">
        <div class="img-box" v-if="!loading">
          <p class="title mt-10px mb-10px">司机免冠照片</p>
          <div class="">
            <n-image
              width="100"
              :fallback-src="ErrorImg"
              :src="driverIdentificationPhoto.filePath"
            />
          </div>
          <n-button
            attr-type="button"
            :loading="loading"
            :disabled="disabled"
            size="small"
            type="primary"
            @click="editDriverHead"
            >编辑司机免冠照片
          </n-button>
        </div>

        <div class="img-box" v-if="!loading">
          <p class="title mt-10px mb-10px">人脸识别采集图片</p>
          <div class="">
            <n-image
              width="100"
              :fallback-src="ErrorImg"
              :src="driverBaiduFaceRecognitionPhoto.filePath"
            />
          </div>

          <n-button
            attr-type="button"
            :loading="loading"
            :disabled="disabled"
            size="small"
            type="primary"
            @click="editDriverFace"
            >编辑人脸识别采集图片
          </n-button>
        </div>
      </div>
      <PhotoItem
        v-if="!loading"
        :positivePhoto="driverIdentityFaceSide"
        :reversePhoto="driverIdentityOtherSide"
        positiveText="司机身份证头像面"
        reverseText="司机身份证国徽面"
        btnText="编辑司机身份证照片信息"
        @edit-photo="editIdentity"
      />

      <PhotoItem
        v-if="!loading"
        :positivePhoto="driverLicenseFaceSide"
        :reversePhoto="driverLicenseOtherSide"
        positiveText="司机驾驶证正页"
        reverseText="司机驾驶证副页"
        btnText="编辑司机驾驶照片信息"
        @edit-photo="editLicense"
      />

      <PhotoItem
        v-if="!loading"
        :width="140"
        :positivePhoto="driverNetworkVehicleCertificateFaceSide"
        :reversePhoto="driverNetworkVehicleCertificateOtherSide"
        positiveText="司机网约车资格证正页"
        reverseText="司机网约车资格证副页"
        btnText="编辑网约车资格证照片信息"
        @edit-photo="editCertificate"
      />
    </n-spin>

    <UploadModal
      ref="driverHeaderModalRef"
      @on-remove="driverBareheadedRemove"
      @on-sucess="driverBareheadedSuccess"
      @on-submit="driverBareheadedSubmit"
    />
    <UploadModal
      ref="driverFaceModalRef"
      @on-remove="handleFaceRemove"
      @on-sucess="handleFaceSuccess"
      @on-submit="driverFaceSubmit"
    />

    <IdentityModal ref="identityModalRef" />
    <LicenseModal ref="licenseModalRef" />

    <CertificateModal ref="certificateModalRef" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import { useMessage } from "naive-ui";
import { getDriverDetail, updateDriverPhoto, updateDriverFacePhoto } from "@/api/capacity/capacity";
import PhotoItem from "./photoItem.vue";
import UploadModal from "@/components/UploadModal/UploadModal.vue";
import IdentityModal from "./identityModal.vue";
import LicenseModal from "./licenseModal.vue";
import CertificateModal from "./certificateModal.vue";
import { UploadTypeEnum } from "@/enums/httpEnum";
import { FileInter } from "./type";
import ErrorImg from "@/assets/image/image.png";
export default defineComponent({
  name: "DriverCerDrawer",
  components: { PhotoItem, UploadModal, IdentityModal, LicenseModal, CertificateModal },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const driverHeaderModalRef = ref();
    const driverFaceModalRef = ref();
    const licenseModalRef = ref();
    const identityModalRef = ref();
    const certificateModalRef = ref();
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      data: {
        driver: {},
      },
      driverId: "",
      driverIdentificationPhoto: {
        filePath: " ",
        fileId: "",
      },
      driverBaiduFaceRecognitionPhoto: {
        filePath: " ",
        fileId: "",
      },
      driverIdentityFaceSide: " ",
      driverIdentityOtherSide: " ",
      driverLicenseFaceSide: " ",
      driverLicenseOtherSide: " ",
      driverNetworkVehicleCertificateFaceSide: " ",
      driverNetworkVehicleCertificateOtherSide: " ",
    });

    const message = useMessage();

    function openDrawer(driverId: string) {
      getDetail(driverId);
      state.driverId = driverId;
      state.isDrawer = true;
    }
    const getDetail = async (driverId: string) => {
      state.loading = true;
      try {
        let res = await getDriverDetail({ driverId });
        console.log(res);
        console.log("-------------------------------------");
        // console.log(res.data.driver);

        state.data = res.data;

        state.driverIdentificationPhoto = res.data.driver.driverIdentificationPhoto;
        state.driverBaiduFaceRecognitionPhoto = res.data.driver.driverBaiduFaceRecognitionPhoto || {
          filePath: " ",
        };

        state.driverIdentityFaceSide = res.data.driver.driverIdentityFaceSide;
        state.driverIdentityOtherSide = res.data.driver.driverIdentityOtherSide || {
          filePath: " ",
        };

        state.driverLicenseFaceSide = res.data.driver.driverLicenseFaceSide || { filePath: " " };
        state.driverLicenseOtherSide = res.data.driver.driverLicenseOtherSide || { filePath: " " };

        // let filePath = res.data.driver.driverNetworkVehicleCertificateFaceSide
        // let otherFilePath = res.data.driver.driverNetworkVehicleCertificateOtherSide

        state.driverNetworkVehicleCertificateFaceSide = res.data.driver
          .driverNetworkVehicleCertificateFaceSide || { filePath: " " };
        // state.driverNetworkVehicleCertificateFaceSide = otherFilePath ? otherFilePath.filePath : " ";
        state.driverNetworkVehicleCertificateFaceSide = res.data.driver
          .driverNetworkVehicleCertificateOtherSide || { filePath: " " };
        // state.driverNetworkVehicleCertificateOtherSide =
        //     res.data.driver.driverNetworkVehicleCertificateOtherSide.filePath;

        console.log(state);

        state.loading = false;
      } catch (err) {
        console.log(err);
        message.error("证件信息获取失败,请稍候重试");
        state.loading = false;
      }
    };
    // 司机免冠照片
    function editDriverHead() {
      const { handleModal } = driverHeaderModalRef.value;
      handleModal(
        "司机免冠照片",
        UploadTypeEnum.DRIVERIDENTIFICATION,
        state.driverIdentificationPhoto
      );
    }
    function driverBareheadedRemove() {
      state.driverIdentificationPhoto = {
        filePath: "",
        fileId: "",
      };
    }
    async function driverBareheadedSuccess(file: FileInter) {
      state.driverIdentificationPhoto = file;
    }
    async function driverBareheadedSubmit(file: FileInter) {
      try {
        let res = await updateDriverPhoto({ driverId: state.driverId, fileId: file.fileId });
        console.log(res);
        message.success(window.$tips[res.code]);
      } catch (err) {
        console.log(err);
      }
    }
    // 司机人脸识别照片
    function editDriverFace() {
      const { handleModal } = driverFaceModalRef.value;
      handleModal(
        "人脸识别采集图片",
        UploadTypeEnum.DRIVERIDENTIFICATION,
        state.driverBaiduFaceRecognitionPhoto
      );
    }
    function handleFaceRemove() {
      state.driverBaiduFaceRecognitionPhoto = {
        filePath: "",
        fileId: "",
      };
    }
    function handleFaceSuccess(file: FileInter) {
      state.driverBaiduFaceRecognitionPhoto = file;
    }
    async function driverFaceSubmit(file: FileInter) {
      try {
        let res = await updateDriverFacePhoto({ driverId: state.driverId, fileId: file.fileId });
        console.log(res);
        message.success(window.$tips[res.code]);
      } catch (err) {
        console.log(err);
      }
    }

    // 身份证
    function editIdentity() {
      const { handleModal } = identityModalRef.value;
      handleModal(state.data.driver);
    }
    //驾驶证
    function editLicense() {
      const { handleModal } = licenseModalRef.value;
      handleModal(state.data.driver);
    }
    //网约车资格证
    function editCertificate() {
      const { handleModal } = certificateModalRef.value;
      handleModal(state.data.driver);
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      state.driverId = "";
      state.driverIdentificationPhoto = {
        filePath: " ",
        fileId: "",
      };
      state.driverBaiduFaceRecognitionPhoto = {
        filePath: " ",
        fileId: "",
      };
      state.driverIdentityFaceSide = " ";
      state.driverIdentityOtherSide = " ";
      state.driverLicenseFaceSide = " ";
      state.driverLicenseOtherSide = " ";
      state.driverNetworkVehicleCertificateFaceSide = " ";
      state.driverNetworkVehicleCertificateOtherSide = " ";
    }

    return {
      ...toRefs(state),
      driverFaceModalRef,
      driverHeaderModalRef,
      identityModalRef,
      licenseModalRef,
      certificateModalRef,
      ErrorImg,
      handleSaveAfter,
      driverBareheadedRemove,
      driverBareheadedSuccess,
      driverBareheadedSubmit,
      handleFaceRemove,
      handleFaceSuccess,
      driverFaceSubmit,
      editIdentity,
      editLicense,
      openDrawer,
      editDriverHead,
      editDriverFace,
      editCertificate,
      onCloseAfter,
    };
  },
});
</script>
<style scoped lang="scss">
.img-info {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.photot-box {
  height: 180px;
  overflow: hidden;
}

.img-box {
  width: 150px;
  text-align: center;
}

.title {
  font-size: 14px;
  text-align: center;
}
</style>
