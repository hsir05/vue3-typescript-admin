<template>
  <BasicModal
    :title="title"
    ref="ModalRef"
    :maskClosable="true"
    @on-cancel="handleReset"
    @on-ok="handleValidate"
  >
    <n-form
      ref="formRef"
      :rules="rules"
      label-placement="top"
      :style="{ maxWidth: '520px' }"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item path="filePath" style="margin: 0 auto">
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
  emits: ["on-remove", "on-sucess"],
  setup(_, { emit }) {
    interface FormInter {
      filePath: string | null;
    }
    const ModalRef = ref();
    const title = ref("图片上传");
    const uploadType = ref("");
    const loading = ref(false);
    const uploadList = ref<string[]>([]);
    const form = ref<FormInter>({
      filePath: null,
    });
    const formRef = ref<FormInst | null>(null);

    const handleModal = (t: string, type: string, filePath: string) => {
      title.value = t;
      uploadType.value = type;
      uploadList.value = [filePath];
      const { showModal } = ModalRef.value;
      showModal();
    };

    function imageRemove(file: string[]) {
      form.value.filePath = file[0];
      uploadList.value = file;
      emit("on-remove", file[0]);
    }
    function uploadChange(file: { filePath: string; fileId: string }) {
      form.value.filePath = file.fileId;
      uploadList.value = [file.filePath];
      emit("on-sucess", file.filePath);
    }

    function handleValidate() {
      formRef.value?.validate((errors) => {
        if (!errors) {
          //   loading.value = true
        } else {
          console.log(errors);
        }
      });
    }
    function handleReset() {
      form.value = { filePath: null };
      formRef.value?.restoreValidation();
    }

    return {
      ModalRef,
      uploadType,
      title,
      form,
      loading,
      uploadList,
      rules: {
        filePath: { required: true, trigger: ["blur", "change"], message: "请上传图片" },
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
<style lang="scss">
.n-form-item-blank {
  margin: 0 auto;
}
</style>
