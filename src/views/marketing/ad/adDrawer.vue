<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      :rules="rules"
      size="large"
      :disabled="disabled"
      label-placement="left"
      :style="{ maxWidth: '400px' }"
      require-mark-placement="right-hanging"
      label-width="120"
      :model="form"
    >
      <n-form-item label="广告标题" path="title">
        <n-input v-model:value="form.title" :maxlength="20" clearable placeholder="输入广告标题" />
      </n-form-item>
      <n-form-item label="广告开通城市" path="cityName">
        <n-input
          v-model:value="form.cityName"
          :disabled="true"
          clearable
          placeholder="输入广告开通城市"
        />
      </n-form-item>

      <n-form-item label="广告生效时间" path="startTime">
        <n-date-picker v-model:value="form.startTime" type="datetime" clearable />
      </n-form-item>

      <n-form-item label="广告失效时间" path="endTime">
        <n-date-picker v-model:value="form.endTime" type="datetime" clearable />
      </n-form-item>

      <n-form-item label="广告H5url" path="h5Url">
        <n-input v-model:value="form.h5Url" clearable placeholder="输入广告H5url" />
      </n-form-item>

      <n-form-item label="广告照片" path="adUrl">
        <BasicUpload
          :action="uploadUrl"
          :headers="uploadHeaders"
          :data="{}"
          name="files"
          :width="100"
          :height="100"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>

      <div class="text-center flex-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存</n-button
        >
        <n-button attr-type="button" type="warning" class="ml-10px" @click="handleReset"
          >重置</n-button
        >
      </div>
    </n-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import BasicUpload from "@/components/Upload/Upload.vue";
import { uploadUrl } from "@/config/config";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "AdDrawer",
  components: {
    BasicUpload,
  },
  setup(_, { emit }) {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });

    const uploadHeaders = reactive({
      platform: "miniPrograms",
      timestamp: new Date().getTime(),
      token: "Q6fFCuhc1vkKn5JNFWaCLf6gRAc5n0LQHd08dSnG4qo=",
    });

    const uploadList = ref<string[]>([]);

    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const form = ref<tableDataItem>({
      title: null,
      adUrl: null,
      cityName: null,
      cityCode: null,
      startTime: null,
      endTime: null,
      h5Url: null,
      sort: null,
      status: 1,
    });

    function openDrawer(t: string, record?: tableDataItem | string) {
      console.log(record);
      if (record) {
        // form.value = { ...form.value, ...record };
      }
      title.value = t;
      state.isDrawer = true;
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

    function handleReset() {
      //   form.value = { name: null, account: null, email: null, sex: null, phone: null, status: 1 };
      //   formRef.value?.restoreValidation();
    }
    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    function uploadChange(list: string[]) {
      console.log(list);
    }

    return {
      ...toRefs(state),
      title,
      formRef,
      form,
      uploadUrl,
      rules: {
        startTime: { required: true, trigger: ["blur", "input"], message: "请选择广告生效时间" },
        endTime: { required: true, trigger: ["blur", "input"], message: "请选择广告失效时间" },
        adUrl: { required: true, trigger: ["blur", "input"], message: "请上传广告" },
      },
      uploadHeaders,
      uploadList,

      openDrawer,
      handleReset,
      handleValidate,
      onCloseAfter,
      uploadChange,
    };
  },
});
</script>
