<template>
  <BasicModal title="图片上传" ref="ModalRef" :maskClosable="true">
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="left"
      :style="{ maxWidth: '520px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item :label="title" path="filePath" style="margin: 0 auto">
        <BasicUpload
          :data="{ uploadType: uploadType }"
          name="file"
          :width="310"
          :height="130"
          @delete-upload="imageRemove"
          @upload-change="uploadChange"
          v-model:value="uploadList"
        />
      </n-form-item>

      <div class="text-center">
        <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
          >保存
        </n-button>
      </div>
    </n-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormInst } from "naive-ui";
import BasicModal from "@/components/Modal/Modal.vue";
import BasicUpload from "@/components/Upload/Upload.vue";
export default defineComponent({
  name: "UplodModal",
  components: { BasicModal, BasicUpload },
  emits: ["on-remove", "on-sucess", "on-submit"],
  setup(_, { emit }) {
    const ModalRef = ref();
    const title = ref("图片上传");
    const uploadType = ref("");
    const loading = ref(false);
    const uploadList = ref<string[]>([]);
    interface FileInter {
      filePath: string;
      fileId: string;
    }
    const form = ref<FileInter>({
      filePath: "",
      fileId: "",
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (t: string, type: string, file: { filePath: string; fileId: string }) => {
      title.value = t;
      uploadType.value = type;

      form.value = file;
      uploadList.value = [file.filePath];
      const { showModal } = ModalRef.value;
      showModal();
    };

    function imageRemove(file: string[]) {
      form.value.filePath = file[0];
      uploadList.value = file;
      emit("on-remove", file[0]);
    }
    function uploadChange(fileData: { filePath: string; fileId: string }) {
      form.value = fileData;
      uploadList.value = [fileData.filePath];
      emit("on-sucess", form.value);
    }

    function handleValidate() {
      formRef.value?.validate((errors) => {
        if (!errors) {
          emit("on-submit", form.value);
        } else {
          console.log(errors);
        }
      });
    }
    function handleReset() {
      form.value = {
        filePath: "",
        fileId: "",
      };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      formRef,
      uploadType,
      title,
      form,
      loading,
      uploadList,
      rules: {
        filePath: { required: true, trigger: ["blur", "input"], message: "请上传图片" },
      },
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
