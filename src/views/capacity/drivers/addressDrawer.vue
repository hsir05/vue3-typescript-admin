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
      <BaiduMap ref="baiduMapRef" />
    </div>

    <div class="text-center flex-center mt-20px">
      <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
        >保存
      </n-button>
      <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
        >重置</n-button
      >
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
      driverId: " ",
      driverHomeAddress: " ",
      driverHomeAddressDetail: " ",
      lng: 0,
      lat: 0,
    });
    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          state.loading = true;
          try {
            let res = await saveDriverAddress(form.value);
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
        console.log(
          driverHomeAddress,
          driverHomeAddressDetail,
          driverHomeAddressLongitude,
          driverHomeAddressLatitude
        );
        form.value = {
          driverId,
          driverHomeAddress,
          driverHomeAddressDetail,
          lng: driverHomeAddressLongitude || 103.824048,
          lat: driverHomeAddressLatitude || 36.061509,
        };
        console.log(form.value);

        const { renderBaiduMap } = baiduMapRef.value;
        const { createMarker } = await renderBaiduMap(form.value.lng, form.value.lat);
        createMarker((lng: number, lat: number) => {
          console.log(lng, lat);
        });

        state.loading = false;
      } catch (err) {
        console.log(err);
        message.error("司机信息获取失败,请稍候重试");
        state.loading = false;
      }
    };

    function handleReset() {}

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
      formRef,
      form,
      baiduMapRef,
      addressRules,
      onCloseAfter,
      openDrawer,
      handleReset,
      handleValidate,
    };
  },
});
</script>
<style lang="scss" scoped>
.map-box {
  height: 600px;
}
</style>
