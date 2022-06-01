<template>
  <div class="w-fulls">
    <div class="upload">
      <n-spin size="small" :show="loading">
        <div class="upload-card">
          <!--图片列表-->
          <div
            class="upload-card-item"
            :style="getCSSProperties"
            v-for="(item, index) in imgList"
            :key="`img_${index}`"
          >
            <div class="upload-card-item-info">
              <div class="img-box" :style="{ width: getCSSProperties.width }">
                <img :src="item" style="width: 100%" />
              </div>
              <div class="img-box-actions">
                <n-icon size="18" class="mx-2 action-icon" @click="preview(item)">
                  <EyeOutlined />
                </n-icon>
                <n-icon size="18" class="mx-2 action-icon" @click="remove(index)">
                  <DeleteOutlined />
                </n-icon>
              </div>
            </div>
          </div>
          <div
            class="upload-card-item upload-card-item-select-picture"
            :style="getCSSProperties"
            v-if="imgList.length < maxNumber"
          >
            <n-upload
              v-bind="$props"
              :file-list-style="{ display: 'none' }"
              @before-upload="beforeUpload"
              @finish="finish"
              @error="handleErr"
              @remove="remove"
            >
              <div class="flex flex-col justify-center">
                <n-icon size="18" class="m-auto">
                  <PlusOutlined />
                </n-icon>
                <span class="upload-title">上传图片</span>
              </div>
            </n-upload>
          </div>
        </div>
      </n-spin>
    </div>

    <n-space>
      <div v-if="helpText" class="flex w-full">
        <n-icon size="18" color="#f0a020" class="m-auto mr-10px"> <infoIcon /> </n-icon>提示:
        {{ helpText }}
      </div>
    </n-space>

    <n-modal
      v-model:show="showModal"
      preset="card"
      style="max-width: 650px; max-height: 600px; text-align: center; overflow: hidden"
    >
      <img :src="previewUrl" style="height: 100%" />
    </n-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, watch, toRefs, computed } from "vue";
import { useMessage, useDialog, UploadFileInfo } from "naive-ui";
import {
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleFilled as infoIcon,
} from "@vicons/antd";

import { uploadConfig } from "@/config/table";
import { basicProps } from "./basicProps";
import { isString } from "@/utils/is";
// import { ResultEnum } from "@/enums/httpEnum"
export default defineComponent({
  name: "BasicUpload",
  components: { EyeOutlined, DeleteOutlined, PlusOutlined, infoIcon },
  props: {
    ...basicProps,
  },
  emits: ["upload-change", "upload-error", "delete-upload"],
  setup(props, { emit }) {
    const message = useMessage();
    const dialog = useDialog();
    const loading = ref(false);

    const state = reactive({
      showModal: false,
      previewUrl: "",
      //   originalImgList: [] as string[],
      imgList: props.value,
    });

    //赋值默认图片显示
    watch(
      () => props.value,
      () => {
        state.imgList = props.value.map((item: string) => {
          return item;
        });
      }
    );

    const getCSSProperties = computed(() => {
      return {
        width: `${props.width}px`,
        height: `${props.height}px`,
      };
    });

    function preview(url: string) {
      state.showModal = true;
      state.previewUrl = url;
    }

    function checkFileType(fileType: string) {
      return uploadConfig.fileType.includes(fileType);
    }

    //上传之前
    function beforeUpload({ file }: { file: UploadFileInfo }) {
      const fileInfo = file.file;
      const { maxSize, accept } = props;
      const acceptRef = (isString(accept) && accept.split(",")) || [];

      // 设置最大值，则判断
      if (maxSize && fileInfo && fileInfo.size / 1024 / 1024 >= maxSize) {
        message.error(`上传文件最大值不能超过${maxSize}M`);
        return false;
      }

      // 设置类型,则判断
      const fileType = uploadConfig.fileType;
      if (acceptRef.length > 0 && fileInfo && !checkFileType(fileInfo.type)) {
        message.error(`只能上传文件类型为${fileType.join(",")}`);
        return false;
      }
      loading.value = true;
      console.log(222);

      return true;
    }

    //上传结束
    function finish({ event }: { event?: ProgressEvent }) {
      let res = (event?.target as XMLHttpRequest).response;
      emit("upload-change", JSON.parse(res).data);
      message.success("上传成功!");
      loading.value = false;
    }
    function handleErr({ event }: { event?: ProgressEvent }) {
      let res = (event?.target as XMLHttpRequest).response;
      console.log(JSON.parse(res).data);
      message.error("上传失败，请稍候重试或联系管理员");
      loading.value = false;
    }

    //删除
    function remove(index: number) {
      dialog.info({
        title: "提示",
        content: "你确定要删除吗？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: () => {
          state.imgList.splice(index, 1);
          //   state.originalImgList.splice(index, 1);
          //   emit("upload-change", state.imgList);
          emit("delete-upload", state.imgList);
        },
        onNegativeClick: () => {},
      });
    }

    return {
      ...toRefs(state),
      beforeUpload,
      maxNumber: props.maxNumber,
      helpText: props.helpText,
      getCSSProperties,
      loading,
      finish,
      handleErr,
      remove,
      preview,
    };
  },
});
</script>
<style lang="scss" scoped>
.upload {
  overflow: hidden;
  &:deep(.n-upload) {
    height: 100%;
  }
  &:deep(.n-upload-trigger) {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  &-card {
    width: auto;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      margin: 0 8px 8px 0;
      position: relative;
      padding: 8px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      overflow: hidden;
      flex-direction: column;
      align-items: center;
      text-align: center;
      .upload-card-item-info {
        width: 100%;
      }
      &:hover {
        background: 0 0;

        .upload-card-item-info::before {
          opacity: 1;
          width: 100%;
        }

        &-info::before {
          opacity: 1;
        }
      }

      &-info {
        position: relative;
        height: 100%;
        padding: 0;
        overflow: hidden;

        &:hover {
          .img-box-actions {
            opacity: 1;
          }
        }

        &::before {
          position: absolute;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: all 0.3s;
          content: " ";
        }

        .img-box {
          position: relative;
          border-radius: 2px;
        }

        .img-box-actions {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          z-index: 10;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: space-around;

          &:hover {
            background: 0 0;
          }

          .action-icon {
            color: rgba(255, 255, 255, 0.85);

            &:hover {
              cursor: pointer;
              color: #fff;
            }
          }
        }
      }
    }

    &-item-select-picture {
      border: 1px dashed #d9d9d9;
      border-radius: 2px;
      cursor: pointer;
      background: #fafafa;
      color: #666;

      .upload-title {
        color: #666;
      }
    }
  }
}
</style>
