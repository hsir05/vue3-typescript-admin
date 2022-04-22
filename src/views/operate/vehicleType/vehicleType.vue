<template>
  <div class="h-full box-border vehicle-type">
    <div class="simple-table">
      <n-data-table
        ref="table"
        striped
        :loading="loading"
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 210px)"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="table-edit">
      <n-divider title-placement="left"> 车辆类型编辑 </n-divider>

      <div class="tip mb-10px">
        <n-icon size="18" color="#f0a020" class="m-auto mr-6px"> <infoIcon /> </n-icon>提示:
        单个文件不超过2MB，最多只能上传1个文件
      </div>

      <n-form
        ref="formRef"
        :rules="rules"
        :disabled="disabled"
        label-placement="left"
        :style="{ maxWidth: '500px' }"
        require-mark-placement="right-hanging"
        label-width="150"
        :model="form"
      >
        <n-form-item label="车辆类型描述" path="vehicleTypeDesc">
          <n-input v-model:value="form.vehicleTypeDesc" clearable placeholder="输入车辆类型描述" />
        </n-form-item>
        <n-form-item label="是否锁定" path="vehicleTypeLock">
          <n-radio-group v-model:value="form.vehicleTypeLock">
            <n-space>
              <n-radio :value="1">是</n-radio>
              <n-radio :value="0">否</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item label="车辆类型图片" path="vehicleTypeImageId">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.VEHICLETYPE }"
            name="file"
            :width="310"
            :height="130"
            @upload-change="uploadVechicleChange"
            v-model:value="vehichleTypeList"
          />
        </n-form-item>

        <div class="flex-align-start">
          <n-form-item label="忙碌图标" path="vehicleTypeBusyIconId">
            <BasicUpload
              :data="{ uploadType: UploadTypeEnum.VEHICLETYPE }"
              name="file"
              :width="80"
              :height="160"
              @upload-change="uploadBusyChange"
              v-model:value="busyImgList"
            />
          </n-form-item>
          <n-form-item label="空闲图标" path="vehicleTypeFreeIconId">
            <BasicUpload
              :data="{ uploadType: UploadTypeEnum.VEHICLETYPE }"
              name="file"
              :width="80"
              :height="160"
              @upload-change="uploadFreeChange"
              v-model:value="ldleImgList"
            />
          </n-form-item>
        </div>

        <div class="text-center flex-center ml-140px">
          <n-button attr-type="button" :disabled="loading" type="primary" @click="handleValidate"
            >保存
          </n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, reactive, unref, toRefs, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import { InfoCircleFilled as infoIcon } from "@vicons/antd";
import { NTag, FormInst, useMessage } from "naive-ui";
import BasicUpload from "@/components/Upload/Upload.vue";
import { UploadTypeEnum } from "@/enums/httpEnum";
import { tableDataItem, tableItemProps } from "./type";
import { getVehicleType, vehicleTypeSave } from "@/api/operate/operate";
import { rules } from "./data";
export default defineComponent({
  name: "VehicleType",
  components: { BasicUpload, infoIcon },
  setup() {
    const state = reactive({
      isModal: false,
      loading: false,
      disabled: false,
    });
    const ldleImgList = ref<string[]>([]);
    const vehichleTypeList = ref<string[]>([]);
    const busyImgList = ref<string[]>([]);

    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const form = ref<tableDataItem>({
      vehicleTypeId: "",
      vehicleTypeDesc: "",
      vehicleTypeImageId: "",
      vehicleTypeBusyIconId: "",
      vehicleTypeFreeIconId: "",
      vehicleTypeLock: 1,
    });

    const data = ref<tableDataItem[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 60,
        render(_: tableItemProps, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "订单业务类型",
        key: "orderBusinessType",
        width: 110,
        align: "center",
      },
      {
        title: "车辆类型名称",
        key: "vehicleTypeName",
        width: 110,
        align: "center",
      },
      {
        title: "锁定",
        key: "vehicleTypeLock",
        width: 65,
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.vehicleTypeLock === 1 ? "success" : "error",
            },
            {
              default: () => (row.vehicleTypeLock === 1 ? "是" : "否"),
            }
          );
        },
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 110,
        render(record: tableItemProps) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handleSee.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      try {
        state.loading = true;
        let res = await getVehicleType();
        data.value = res;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    const vehicleTypeSaveSub = async () => {
      state.loading = true;
      try {
        let res = await vehicleTypeSave(form.value);
        console.log(res);
        message.success("保存成功");
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function handleSee(record: Recordable) {
      state.disabled = true;
      let vechile = record.vehicleTypeImage.filePath;
      let ldle = record.vehicleTypeFreeIcon.filePath;
      let busy = record.vehicleTypeBusyIcon.filePath;
      vehichleTypeList.value = vechile ? [vechile] : [];
      ldleImgList.value = ldle ? [ldle] : [];
      busyImgList.value = busy ? [busy] : [];

      const {
        vehicleTypeDesc,
        vehicleTypeId,
        vehicleTypeImage,
        vehicleTypeFreeIcon,
        vehicleTypeBusyIcon,
        vehicleTypeLock,
      } = record;

      form.value = {
        vehicleTypeId,
        vehicleTypeDesc,
        vehicleTypeImageId: vehicleTypeImage.fileId,
        vehicleTypeBusyIconId: vehicleTypeBusyIcon.fileId,
        vehicleTypeFreeIconId: vehicleTypeFreeIcon.fileId,
        vehicleTypeLock,
      };
    }
    function handleEdit(record: Recordable) {
      state.disabled = false;
      const {
        id,
        orderBusinessType,
        vehicleTypeName,
        vehicleTypeDesc,
        vehicleTypeImage,
        vehicleTypeFreeIcon,
        vehicleTypeBusyIcon,
        vehicleTypeLock,
      } = record;

      form.value = {
        id,
        orderBusinessType,
        vehicleTypeName,
        vehicleTypeDesc,
        vehicleTypeImage,
        vehicleTypeFreeIcon,
        vehicleTypeBusyIcon,
        vehicleTypeLock,
      };
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));
          vehicleTypeSaveSub();
        } else {
          console.log(errors);
        }
      });
    }

    function uploadVechicleChange(list: string[]) {
      console.log(list);
      message.success("上传成功!");
    }
    function uploadBusyChange(list: string[]) {
      console.log(list);
      message.success("上传成功!");
    }
    function uploadFreeChange(list: string[]) {
      console.log(list);
      message.success("上传成功!");
    }

    return {
      ...toRefs(state),
      data,
      formRef,
      vehichleTypeList,
      UploadTypeEnum,
      ldleImgList,
      busyImgList,
      form,
      columns,
      rules,

      getRowKeyId: (row: tableItemProps) => row.id,
      uploadBusyChange,
      uploadFreeChange,
      uploadVechicleChange,
      handleValidate,
    };
  },
});
</script>
<style lang="scss" scoped>
.vehicle-type {
  display: flex;
  align-content: flex-start;
  justify-content: space-between;
  padding: 5px;

  .simple-table {
    width: 550px;
    height: auto;
    background-color: $white;
  }

  .table-edit {
    width: calc(100% - 550px - 15px);
    height: auto;
    overflow: scroll;
    background-color: $white;
  }

  .tip {
    display: inline-flex;
    margin-left: 145px;
  }
}
</style>
