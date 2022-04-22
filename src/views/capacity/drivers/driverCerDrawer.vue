<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" :width="1000" @on-close-after="onCloseAfter">
    <n-alert title="提示" type="warning" class="mb-10px">
      单个文件不超过2MB，最多只能上传1个文件
    </n-alert>

    <n-form
      inline
      ref="formRef"
      :rules="rules"
      :disabled="disabled"
      label-placement="top"
      :style="{ flexWrap: 'wrap', justifyContent: 'space-around' }"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="司机免冠照片" path="bareheadedPhoto">
        <BasicUpload
          :data="{}"
          name="file"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>

      <n-form-item label="人脸识别采集图片" path="bareheadedPhoto">
        <BasicUpload
          :data="{}"
          name="file"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>

      <n-form-item label="司机身份证头像面" path="bareheadedPhoto">
        <BasicUpload
          :data="{}"
          name="file"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>
      <n-form-item label="司机身份证国徽面" path="bareheadedPhoto">
        <BasicUpload
          :data="{}"
          name="file"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>
      <n-form-item label="司机驾驶证正页" path="bareheadedPhoto">
        <BasicUpload
          :data="{}"
          name="file"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>
      <n-form-item label="司机驾驶证副页" path="bareheadedPhoto">
        <BasicUpload
          :data="{}"
          name="file"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>
      <n-form-item label="司机网约车资格证正页" path="bareheadedPhoto">
        <BasicUpload
          :data="{}"
          name="file"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>
      <n-form-item label="司机网约车资格证副页" path="bareheadedPhoto">
        <BasicUpload
          :data="{}"
          name="file"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>
    </n-form>
    <div class="text-center flex-center">
      <n-button
        attr-type="button"
        :loading="loading"
        size="large"
        type="primary"
        @click="handleValidate"
        >保存</n-button
      >
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, unref, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { certificatesState } from "./type";
import { uploadUrl } from "@/config/config";
import BasicUpload from "@/components/Upload/Upload.vue";

export default defineComponent({
  name: "DriverCerDrawer",
  components: { BasicUpload },
  emits: ["on-save-after"],
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const title = ref("司机证件照片信息");
    const uploadList = ref([
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    ]);

    const formRef = ref<FormInst | null>(null);
    const message = useMessage();

    const form = ref<certificatesState>({
      bareheadedPhoto: null,
      takePhotos: null,
      frontPhoto: null,
      reversePhoto: null,
      frontPage: null,
      reversePage: null,
      frontCer: null,
      reverseCer: null,
    });

    function openDrawer(t: string, record?: certificatesState) {
      console.log(record);
      if (!record) {
        state.disabled = true;
        state.isDrawer = true;
      } else if (record) {
        form.value = { ...form.value, ...record };
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
      uploadUrl,
      formRef,
      uploadList,
      form,
      title,
      rules: {
        bareheadedPhoto: {
          required: true,
          trigger: ["blur", "input"],
          message: "请上传司机免冠照片",
        },
        takePhotos: {
          required: true,
          trigger: ["blur", "input"],
          message: "请上传人脸识别采集图片",
        },
        frontPhoto: {
          required: true,
          trigger: ["blur", "input"],
          message: "请上传司机身份证头像面",
        },
        reversePhoto: {
          required: true,
          trigger: ["blur", "input"],
          message: "请上传司机身份证国徽面",
        },
        frontPage: { required: true, trigger: ["blur", "input"], message: "请上传司机驾驶证正页" },
        reversePage: {
          required: true,
          trigger: ["blur", "input"],
          message: "请上传司机驾驶证副页",
        },
        frontCer: {
          required: true,
          trigger: ["blur", "input"],
          message: "请上传司机网约车资格证正页",
        },
        reverseCer: {
          required: true,
          trigger: ["blur", "input"],
          message: "请上传司机网约车资格证副页",
        },
      },
      handleSaveAfter,
      handleValidate,
      openDrawer,
      uploadChange,
      onCloseAfter,
    };
  },
});
</script>
