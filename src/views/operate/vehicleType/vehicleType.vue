<template>
  <div class="h-full box-border vehicle-type">
    <div class="simple-table">
      <n-data-table
        ref="table"
        striped
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="500px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="table-edit">
      <n-divider title-placement="left"> 车辆类型编辑 </n-divider>
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
        <n-form-item label="车辆类型描述" path="descript">
          <n-input v-model:value="form.descript" clearable placeholder="输入车辆类型描述" />
        </n-form-item>
        <n-form-item label="是否锁定" path="lock">
          <n-radio-group v-model:value="form.lock">
            <n-space>
              <n-radio :value="1">是</n-radio>
              <n-radio :value="0">否</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item label="车辆类型图片" path="lock">
          <BasicUpload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{}"
            name="files"
            :width="310"
            :height="130"
            @upload-change="uploadChange"
            v-model:value="uploadList"
            helpText="单个文件不超过2MB，最多只能上传1个文件"
          />
        </n-form-item>

        <n-form-item label="忙碌图标" path="busyImg">
          <BasicUpload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{}"
            name="files"
            :width="80"
            :height="80"
            @upload-change="uploadChange"
            v-model:value="uploadList"
            helpText="单个文件不超过2MB，最多只能上传1个文件"
          />
        </n-form-item>
        <n-form-item label="空闲图标" path="ldleImg">
          <BasicUpload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{}"
            name="files"
            :width="80"
            :height="80"
            @upload-change="uploadChange"
            v-model:value="uploadList"
            helpText="单个文件不超过2MB，最多只能上传1个文件"
          />
        </n-form-item>

        <div class="text-center flex-center">
          <n-button
            attr-type="button"
            :loading="loading"
            size="large"
            type="primary"
            @click="handleValidate"
            >保存</n-button
          >
          <n-button
            attr-type="button"
            :disabled="loading"
            type="warning"
            size="large"
            class="ml-10px"
            @click="handleReset"
            >重置</n-button
          >
        </div>
      </n-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, reactive, unref, toRefs } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import { NTag, UploadFileInfo, FormInst, useMessage } from "naive-ui";
import BasicUpload from "@/components/Upload/Upload.vue";
import { uploadUrl } from "@/config/config";
import { tableDataItem, tableItemProps } from "./type";
import { rules } from "./data";
export default defineComponent({
  name: "VehicleType",
  components: { BasicUpload },
  setup() {
    const state = reactive({
      isModal: false,
      loading: false,
      disabled: false,
    });
    const uploadHeaders = reactive({
      platform: "miniPrograms",
      timestamp: new Date().getTime(),
      token: "Q6fFCuhc1vkKn5JNFWaCLf6gRAc5n0LQHd08dSnG4qo=",
    });
    const uploadList = ref([
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    ]);
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const form = ref<tableDataItem>({
      orderType: null,
      vehicleType: null,
      descript: null,
      vehicleTypeImg: null,
      busyImg: null,
      ldleImg: null,
      lock: 1,
    });

    const fileList = ref<UploadFileInfo[]>([]);

    const data = ref([
      {
        orderType: "专车业务",
        vehicleType: "专车-经济型",
        descript: "",
        vehicleTypeImg: "",
        busyImg: "",
        ldleImg: "",
        lock: 1,
        id: 123123,
      },
    ]);

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
        key: "orderType",
        width: 110,
        align: "center",
      },
      {
        title: "车辆类型名称",
        key: "vehicleType",
        width: 110,
        align: "center",
      },
      {
        title: "锁定",
        key: "lock",
        width: 65,
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.lock === 1 ? "success" : "error",
            },
            {
              default: () => (row.lock === 1 ? "正常" : "锁定"),
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

    function handleSee() {}
    function handleEdit() {}

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          state.loading = true;
          state.disabled = true;
          console.log(unref(form));

          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function uploadChange(list: string[]) {
      console.log(list);
    }

    function handleReset() {
      form.value = {
        orderType: null,
        vehicleType: null,
        descript: null,
        vehicleTypeImg: null,
        busyImg: null,
        ldleImg: null,
        lock: 1,
      };
      formRef.value?.restoreValidation();
      state.isModal = false;
      state.loading = false;
      state.disabled = false;
    }

    return {
      ...toRefs(state),
      data,
      formRef,
      uploadHeaders,
      fileList,
      uploadUrl,
      uploadList,
      form,
      columns,
      rules,
      getRowKeyId: (row: tableItemProps) => row.id,
      handleReset,
      uploadChange,
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
  // background-color: $white;
  padding: 5px;
  .simple-table {
    width: 550px;
    height: auto;
    background-color: $white;
  }
  .table-edit {
    width: calc(100% - 550px - 15px);
    height: auto;
    background-color: $white;
  }
}
</style>
