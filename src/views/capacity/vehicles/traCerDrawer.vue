<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '460px' }"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="运输证字号" path="plageNumber">
        <n-input
          v-model:value="form.plageNumber"
          clearable
          placeholder="请输入运输证字号，如X交运管许可XX字XXX号"
        />
      </n-form-item>
      <n-form-item label="运输证发证机关" path="color">
        <n-input
          v-model:value="form.color"
          clearable
          placeholder="请输入运输证发证机关，如XX交通运输管理处"
        />
      </n-form-item>
      <n-form-item label="车辆品牌" path="brand">
        <n-input v-model:value="form.brand" clearable placeholder="输入车辆品牌" />
      </n-form-item>

      <n-form-item label="运输证有效期始" path="vehiclesDate">
        <n-date-picker v-model:value="form.vehiclesDate" type="date" clearable />
      </n-form-item>

      <n-form-item label="运输证有效期止" path="vehiclesDate">
        <n-date-picker v-model:value="form.vehiclesDate" type="date" clearable />
      </n-form-item>

      <n-form-item label="车辆照片" path="lock">
        <BasicUpload
          :data="{}"
          name="file"
          :width="310"
          :height="130"
          @upload-change="uploadChange"
          v-model:value="uploadList"
          helpText="单个文件不超过2MB，最多只能上传1个文件"
        />
      </n-form-item>

      <n-form-item label="运输证" path="lock">
        <BasicUpload
          :data="{}"
          name="file"
          :width="310"
          :height="130"
          @upload-change="uploadChange"
          v-model:value="uploadList"
          helpText="单个文件不超过2MB，最多只能上传1个文件"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button
          attr-type="button"
          :loading="loading"
          :disabled="disabled"
          size="large"
          type="primary"
          @click="handleValidate"
          >保存</n-button
        >
        <n-button
          attr-type="button"
          type="warning"
          :disabled="disabled"
          size="large"
          class="ml-10px"
          @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, useMessage, SelectOption } from "naive-ui";
import { rules } from "./data";
import { tableDataItem } from "./type";
import BasicUpload from "@/components/Upload/Upload.vue";
import { uploadUrl } from "@/config/config";
export default defineComponent({
  name: "TraCerDrawer",
  components: { BasicUpload },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
      openCityData: [],
    });
    const title = ref("菜单");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      plageNumber: null,
      brand: null,
      carSeies: null,
      color: null,
      carType: null,
      companyName: null,
      create_time: null,
      distance: null,
      plate: null,
      vehiclesType: null,
      lock: 1,
      remark: null,
      fuelType: null,
      engineNumber: null,
      vin: null,
      engineDisplacement: null,
      drivingPermitType: null,
      vehiclesDate: null,
    });

    const uploadList = ref([
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    ]);

    function openDrawer(t: string, item?: tableDataItem | String) {
      console.log(item);
      if (item === "see") {
        state.disabled = true;
      } else if (item) {
        form.value = { ...form.value, ...item };
      }
      title.value = t;
      state.isDrawer = true;
    }

    function uploadChange(list: string[]) {
      console.log(list);
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));

          handleSaveAfter();

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleUpdateValue(_: string, option: SelectOption) {
      console.log(option);
      // console.log(toRaw(form.value));

      //    form.value.city = unref(option).label
      //    form.value.code = option.value
    }

    function handleSaveAfter() {
      emit("on-save-after");
    }

    function handleReset() {
      form.value = {
        plageNumber: null,
        brand: null,
        carSeies: null,
        color: null,
        carType: null,
        companyName: null,
        create_time: null,
        distance: null,
        plate: null,
        vehiclesType: null,
        lock: 1,
        remark: null,
        fuelType: null,
        engineNumber: null,
        vin: null,
        engineDisplacement: null,
        drivingPermitType: null,
        vehiclesDate: null,
      };
      formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    return {
      ...toRefs(state),
      formRef,
      title,
      rules,
      uploadUrl,
      form,
      uploadList,
      openDrawer,
      handleUpdateValue,
      uploadChange,
      handleReset,
      handleValidate,
      onCloseAfter,
    };
  },
});
</script>
