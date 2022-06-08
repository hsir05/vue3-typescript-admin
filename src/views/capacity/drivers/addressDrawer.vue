<template>
  <BasicDrawer
    v-model:show="isDrawer"
    title="司机家庭地址编辑"
    :width="700"
    @on-close-after="onCloseAfter"
  >
    <n-form
      ref="formRef"
      :rules="addressRules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '540px' }"
      require-mark-placement="right-hanging"
      label-width="170"
      :model="form"
    >
      <n-form-item label="司机家庭地址" path="driverHomeAddress">
        <n-input
          v-model:value="form.driverHomeAddress"
          clearable
          :maxlength="100"
          placeholder="输入司机详细家庭地址"
        />
      </n-form-item>

      <n-form-item label="司机详细家庭地址" path="driverHomeAddressDetail">
        <n-input
          v-model:value="form.driverHomeAddressDetail"
          clearable
          :maxlength="100"
          placeholder="输入司机详细家庭地址"
        />
      </n-form-item>

      <n-form-item label="司机家庭地址地图位置">
        <n-input-group>
          <n-input-number v-model:value="form.lng" :disabled="true" :style="{ width: '50%' }" />
          <n-input-number v-model:value="form.lat" :disabled="true" :style="{ width: '50%' }" />
        </n-input-group>
      </n-form-item>
    </n-form>

    <div class="map-box">
      <BaiduMap ref="baiduMapRef" @on-dragend="handleDragend" />
    </div>

    <div class="text-center flex-center mt-20px">
      <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
        >保存
      </n-button>
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { saveDriverAddress, getDriverDetail } from "@/api/capacity/capacity";
import BaiduMap from "@/components/Map/BaiduMap.vue";
import { DriverAddressInter } from "./type";
import { addressRules } from "./data";
import homeIcon from "@/assets/image/icon_home.png";
export default defineComponent({
  name: "AddressDrawer",
  components: { BaiduMap },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const message = useMessage();
    const baiduMapRef = ref();

    const formRef = ref<FormInst | null>(null);
    const form = ref<DriverAddressInter>({
      driverId: null,
      driverHomeAddress: null,
      driverHomeAddressDetail: null,
      lng: 0,
      lat: 0,
    });
    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res = await saveDriverAddress({
              ...form.value,
              lng: Math.trunc((form.value.lng as number) * 1000000),
              lat: Math.trunc((form.value.lat as number) * 1000000),
            });
            console.log(res);
            message.success(window.$tips[res.code]);
            handleSaveAfter();
            state.loading = false;
          } catch (err) {
            console.log(err);
            state.loading = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    function openDrawer(driverId: string) {
      getDetail(driverId);
      state.isDrawer = true;
    }

    const getDetail = async (driverId: string) => {
      state.loading = true;
      try {
        let res = await getDriverDetail({ driverId });
        const {
          driverHomeAddress,
          driverHomeAddressDetail,
          driverHomeAddressLongitude,
          driverHomeAddressLatitude,
        } = res.data.driver;
        form.value = {
          driverId,
          driverHomeAddress,
          driverHomeAddressDetail,
          lng: driverHomeAddressLongitude * 1e-6 || 103.824048,
          lat: driverHomeAddressLatitude * 1e-6 || 36.061509,
        };
        console.log(form.value);

        const { renderBaiduMap, createMarker } = baiduMapRef.value;
        renderBaiduMap(form.value.lng, form.value.lat);
        createMarker(homeIcon);
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };
    function handleDragend(lng: number, lat: number, address: string) {
      form.value.lng = lng;
      form.value.lat = lat;
      form.value.driverHomeAddress = address;
      form.value.driverHomeAddressDetail = address;
    }

    function handleSaveAfter() {
      form.value.driverId = null;
      emit("on-save-after");
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
    }

    return {
      ...toRefs(state),
      formRef,
      form,
      baiduMapRef,
      addressRules,
      onCloseAfter,
      openDrawer,
      handleValidate,
      handleDragend,
    };
  },
});
</script>
<style lang="scss" scoped>
.map-box {
  height: 600px;
}
</style>
