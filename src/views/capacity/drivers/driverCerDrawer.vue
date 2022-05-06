<template>
  <BasicDrawer
    v-model:show="isDrawer"
    title="司机证件照片信息"
    :width="1000"
    @on-close-after="onCloseAfter"
  >
    <n-spin :show="loading">
      <div class="img-info">
        <div class="img-box" v-if="!loading">
          <p class="title mt-10px mb-10px">司机免冠照片</p>
          <div class="">
            <n-image width="100" height="130" :src="driverHeaderImage" />
          </div>
          <n-button
            attr-type="button"
            :loading="loading"
            :disabled="disabled"
            size="small"
            type="primary"
            @click="editDriverHead(driverHeaderImage)"
            >编辑司机免冠照片
          </n-button>
        </div>

        <div class="img-box" v-if="!loading">
          <p class="title mt-10px mb-10px">人脸识别采集图片</p>
          <div class="">
            <n-image width="100" height="130" :src="driverBaiduFaceRecognitionPhoto" />
          </div>

          <n-button
            attr-type="button"
            :loading="loading"
            :disabled="disabled"
            size="small"
            type="primary"
            @click="editDriverFace(driverBaiduFaceRecognitionPhoto)"
            >编辑人脸识别采集图片
          </n-button>
        </div>
      </div>

      <PhotoItem
        v-if="!loading"
        :positivePhoto="driverIdentificationPhoto"
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
      />

      <PhotoItem
        v-if="!loading"
        :width="140"
        :positivePhoto="driverNetworkVehicleCertificateFaceSide"
        :reversePhoto="driverNetworkVehicleCertificateOtherSide"
        positiveText="司机网约车资格证正页"
        reverseText="司机网约车资格证副页"
        btnText="编辑网约车资格证照片信息"
      />
    </n-spin>

    <UploadModal
      ref="driverHeaderModalRef"
      @on-remove="handleHeaderRemove"
      @on-sucess="handleHeader"
    />
    <UploadModal ref="driverFaceModalRef" @on-remove="handleFaceRemove" @on-sucess="handleFace" />

    <LicenseDrawer ref="licenseDrawerRef" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import { useMessage } from "naive-ui";
import { getDriverDetail, updateDriverPhoto, updateDriverFacePhoto } from "@/api/capacity/capacity";
import PhotoItem from "./photoItem.vue";
import UploadModal from "@/components/UploadModal/UploadModal.vue";
import LicenseDrawer from "./licenseDrawer.vue";
import { UploadTypeEnum } from "@/enums/httpEnum";
export default defineComponent({
  name: "DriverCerDrawer",
  components: { PhotoItem, UploadModal, LicenseDrawer },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const driverHeaderModalRef = ref();
    const driverFaceModalRef = ref();
    const licenseDrawerRef = ref();
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      data: {},
      driverId: "",
      uploadModalRef: "",
      driverHeaderImage: "",
      driverBaiduFaceRecognitionPhoto: "",
      driverIdentificationPhoto: "",
      driverIdentityOtherSide: "",
      driverLicenseFaceSide: "",
      driverLicenseOtherSide: "",
      driverNetworkVehicleCertificateFaceSide: "",
      driverNetworkVehicleCertificateOtherSide: "",
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
        state.data = res.data;
        state.driverHeaderImage = res.data.driver.driverHeaderImage.filePath;
        state.driverBaiduFaceRecognitionPhoto =
          res.data.driver.driverBaiduFaceRecognitionPhoto.filePath;

        state.driverIdentificationPhoto = res.data.driver.driverIdentificationPhoto.filePath;
        state.driverIdentityOtherSide = res.data.driver.driverIdentityOtherSide.filePath;

        state.driverLicenseFaceSide = res.data.driver.driverLicenseFaceSide.filePath;
        state.driverLicenseOtherSide = res.data.driver.driverLicenseOtherSide.filePath;

        state.driverNetworkVehicleCertificateFaceSide =
          res.data.driver.driverNetworkVehicleCertificateFaceSide.filePath;
        state.driverNetworkVehicleCertificateOtherSide =
          res.data.driver.driverNetworkVehicleCertificateOtherSide.filePath;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function editDriverHead(filePath: string) {
      const { handleModal } = driverHeaderModalRef.value;
      handleModal("编辑司机免冠照片", UploadTypeEnum.DRIVERIDENTIFICATION, filePath);
    }
    function handleHeaderRemove(filePath: string) {
      console.log(filePath);
      state.driverHeaderImage = "";
    }
    async function handleHeader(filePath: string) {
      console.log(filePath);
      try {
        let res = await updateDriverPhoto({ driverId: state.driverId, fileId: filePath });
        console.log(res);
        message.success(window.$tips[res.code]);
      } catch (err) {
        console.log(err);
      }
    }

    function editDriverFace(filePath: string) {
      const { handleModal } = driverFaceModalRef.value;
      handleModal("编辑人脸识别采集图片", UploadTypeEnum.DRIVERIDENTIFICATION, filePath);
    }
    function handleFaceRemove(filePath: string) {
      console.log(filePath);
      state.driverIdentificationPhoto = "";
    }

    function editIdentity() {
      const { handleModal } = licenseDrawerRef.value;
      handleModal(state.data);
    }
    async function handleFace(filePath: string) {
      console.log(filePath);
      console.log(filePath);
      try {
        let res = await updateDriverFacePhoto({ driverId: state.driverId, fileId: filePath });
        console.log(res);
        message.success(window.$tips[res.code]);
      } catch (err) {
        console.log(err);
      }
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
    }

    return {
      ...toRefs(state),
      driverFaceModalRef,
      driverHeaderModalRef,
      licenseDrawerRef,
      handleSaveAfter,
      handleHeaderRemove,
      handleHeader,
      handleFaceRemove,
      handleFace,
      editIdentity,
      openDrawer,
      editDriverHead,
      editDriverFace,
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
