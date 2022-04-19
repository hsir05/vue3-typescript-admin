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
        min-height="500px"
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

        <n-form-item label="车辆类型图片" path="lock">
          <BasicUpload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{}"
            name="files"
            :width="310"
            :height="130"
            @upload-change="uploadChange"
            v-model:value="vehichleTypeList"
          />
        </n-form-item>

        <div class="flex-align-start">
          <n-form-item label="忙碌图标" path="busyImg">
            <BasicUpload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :data="{}"
              name="files"
              :width="80"
              :height="160"
              @upload-change="uploadChange"
              v-model:value="busyImgList"
            />
          </n-form-item>
          <n-form-item label="空闲图标" path="ldleImg">
            <BasicUpload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :data="{}"
              name="files"
              :width="80"
              :height="160"
              @upload-change="uploadChange"
              v-model:value="ldleImgList"
            />
          </n-form-item>
        </div>

        <div class="text-center flex-center ml-140px">
          <n-button attr-type="button" :disabled="loading" type="primary" @click="handleValidate"
            >保存
          </n-button>
          <n-button
            attr-type="button"
            :disabled="loading"
            type="warning"
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
import { defineComponent, ref, h, reactive, unref, toRefs, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import { InfoCircleFilled as infoIcon } from "@vicons/antd";
import { NTag, UploadFileInfo, FormInst, useMessage } from "naive-ui";
import BasicUpload from "@/components/Upload/Upload.vue";
import { uploadUrl } from "@/config/config";
import { tableDataItem, tableItemProps } from "./type";
// import { getVehicleType } from "@/api/operate/operate";
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
    const uploadHeaders = reactive({
      platform: "miniPrograms",
      timestamp: new Date().getTime(),
      token: "Q6fFCuhc1vkKn5JNFWaCLf6gRAc5n0LQHd08dSnG4qo=",
    });
    const ldleImgList = ref([
      "https://yimin-chuxing-test.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/708299c0-0e8b-48ec-8a61-02673dce1b34.png",
    ]);
    const vehichleTypeList = ref([
      "https://yimin-chuxing-test.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/79ec0386-a572-4038-97ba-235248e08745.png",
    ]);
    const busyImgList = ref([
      "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E4%B8%93%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
    ]);
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const form = ref<tableDataItem>({
      orderBusinessType: null,
      vehicleTypeName: null,
      vehicleTypeDesc: null,
      vehicleTypeImage: null,
      vehicleTypeFreeIcon: null,
      vehicleTypeBusyIcon: null,
      vehicleTypeLock: 1,
    });

    const fileList = ref<UploadFileInfo[]>([
      {
        id: "3123ssdf",
        name: "ddd",
        status: "finished",
        percentage: 100,
        url: "https://yimin-chuxing-test.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/708299c0-0e8b-48ec-8a61-02673dce1b34.png",
      },
    ]);

    const data = ref<any[]>([]);

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
        // let res = await getVehicleType();
        setTimeout(() => {
          let res = {
            success: true,
            code: "suc000101",
            message: "车辆类型查询成功",
            data: [
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260001",
                orderBusinessType: "专车业务",
                vehicleTypeName: "专车-经济型",
                vehicleTypeDesc: "专车--5座紧凑型",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "4a07630a31454671a46d8b2b9bd7432b",
                  filePath:
                    "https://yimin-chuxing-test.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/708299c0-0e8b-48ec-8a61-02673dce1b34.png",
                  fileSuffix: ".png",
                  contentType: "application/octet-stream",
                  fileSize: 6111,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260001",
                  dataType: "AFT0015",
                  uploadTime: "2021-12-01T04:38:28.000+00:00",
                  uploadLoginCredentialId: "ca780fcec7df4dbeb53a95bcaa078a45",
                  sourceName: "%E4%B8%93%E8%BD%A6%E7%A9%BA%E9%97%B2.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "8a80808766a926240166a9268cb10011",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E4%B8%93%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260001",
                  dataType: "AFT0016",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "专车经济型忙碌.png",
                },
                vehicleTypeSeq: 1,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260002",
                orderBusinessType: "专车业务",
                vehicleTypeName: "专车-舒适型",
                vehicleTypeDesc: "专车--5座舒适型",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "8a80808766a926240166a9268cb10012",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E4%B8%93%E8%BD%A6%E7%A9%BA%E9%97%B2.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260002",
                  dataType: "AFT0015",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "专车舒适型空闲.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "8a80808766a926240166a9268cb10013",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E4%B8%93%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260002",
                  dataType: "AFT0016",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "专车舒适型忙碌.png",
                },
                vehicleTypeSeq: 2,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260003",
                orderBusinessType: "专车业务",
                vehicleTypeName: "专车-商务型",
                vehicleTypeDesc: "专车--7座商务型",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "8a80808766a926240166a9268cb10014",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E4%B8%93%E8%BD%A6%E7%A9%BA%E9%97%B2.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260003",
                  dataType: "AFT0015",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "专车商务型空闲.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "8a80808766a926240166a9268cb10015",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E4%B8%93%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260003",
                  dataType: "AFT0016",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "专车商务型忙碌.png",
                },
                vehicleTypeSeq: 3,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260004",
                orderBusinessType: "专车业务",
                vehicleTypeName: "专车-豪华型",
                vehicleTypeDesc: "专车--5座豪华型",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "8a80808766a926240166a9268cb10016",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E8%B1%AA%E5%8D%8E%E7%A9%BA%E9%97%B2.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260004",
                  dataType: "AFT0015",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "专车豪华型空闲.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "8a80808766a926240166a9268cb10017",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E4%B8%93%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260004",
                  dataType: "AFT0016",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "专车豪华型忙碌.png",
                },
                vehicleTypeSeq: 4,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260011",
                orderBusinessType: "快车业务",
                vehicleTypeName: "快车-经济型",
                vehicleTypeDesc: "快车--5座紧凑型",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "8a80808766a926240166a9268cb10018",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E5%BF%AB%E8%BD%A6%E7%A9%BA%E9%97%B2.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260011",
                  dataType: "AFT0015",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "快车经济型空闲.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "8a80808766a926240166a9268cb10019",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E5%BF%AB%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260011",
                  dataType: "AFT0016",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "快车经济型忙碌.png",
                },
                vehicleTypeSeq: 1,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260012",
                orderBusinessType: "快车业务",
                vehicleTypeName: "快车-舒适型",
                vehicleTypeDesc: "快车--5座舒适型",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "8a80808766a926240166a9268cb10020",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E5%BF%AB%E8%BD%A6%E7%A9%BA%E9%97%B2.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260012",
                  dataType: "AFT0015",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "快车舒适型空闲.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "8a80808766a926240166a9268cb10021",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E5%BF%AB%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260012",
                  dataType: "AFT0016",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "快车舒适型忙碌.png",
                },
                vehicleTypeSeq: 2,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260013",
                orderBusinessType: "快车业务",
                vehicleTypeName: "快车-商务型",
                vehicleTypeDesc: "快车--7座商务型",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "8a80808766a926240166a9268cb10022",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E5%BF%AB%E8%BD%A6%E7%A9%BA%E9%97%B2.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260013",
                  dataType: "AFT0015",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "快车商务型空闲.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "8a80808766a926240166a9268cb10023",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E5%BF%AB%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260013",
                  dataType: "AFT0016",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "快车商务型忙碌.png",
                },
                vehicleTypeSeq: 3,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260014",
                orderBusinessType: "快车业务",
                vehicleTypeName: "快车-豪华型",
                vehicleTypeDesc: "快车--5座豪华型",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "8a80808766a926240166a9268cb10024",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E5%BF%AB%E8%BD%A6%E7%A9%BA%E9%97%B2.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260014",
                  dataType: "AFT0015",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "快车豪华型空闲.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "8a80808766a926240166a9268cb10025",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/%E5%BF%AB%E8%BD%A6%E5%BF%99%E7%A2%8C.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6251,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260014",
                  dataType: "AFT0016",
                  uploadTime: "2018-10-25T02:56:08.000+00:00",
                  uploadLoginCredentialId: null,
                  sourceName: "快车豪华型忙碌.png",
                },
                vehicleTypeSeq: 4,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
              {
                vehicleTypeId: "8a80808763af1ab00163af1aea260021",
                orderBusinessType: "出租车业务",
                vehicleTypeName: "出租车",
                vehicleTypeDesc: "5座出租车",
                vehicleTypeImage: null,
                vehicleTypeFreeIcon: {
                  fileId: "e47f5f5aa4eb45cfaea0d5c7c55c1c02",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/fb505490-a72d-4d56-bc59-b786cd6751d0.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6111,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260021",
                  dataType: "AFT0015",
                  uploadTime: "2021-07-13T07:17:11.000+00:00",
                  uploadLoginCredentialId: "ca780fcec7df4dbeb53a95bcaa078a45",
                  sourceName: "专车-经济型-空闲.png",
                },
                vehicleTypeBusyIcon: {
                  fileId: "4e91d4dc722547cfaf69f35fee408509",
                  filePath:
                    "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_vehicle_images/vehicle_type/98d2ac00-2610-490e-81d6-1a695bc397cf.png",
                  fileSuffix: ".png",
                  contentType: "image/png",
                  fileSize: 6111,
                  tableName: "tb_vehicle_type",
                  dataId: "8a80808763af1ab00163af1aea260021",
                  dataType: "AFT0016",
                  uploadTime: "2021-07-13T07:29:40.000+00:00",
                  uploadLoginCredentialId: "ca780fcec7df4dbeb53a95bcaa078a45",
                  sourceName: "专车-经济型-空闲.png",
                },
                vehicleTypeSeq: 1,
                vehicleTypeLock: 0,
                createTime: 1541749712000,
              },
            ],
          };
          data.value = res.data;
          state.loading = false;
        }, 900);
      } catch (err) {
        console.log(err);
      }
    };

    function handleSee(record: Recordable) {
      state.disabled = true;
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
        orderBusinessType: null,
        vehicleTypeName: null,
        vehicleTypeDesc: null,
        vehicleTypeImage: null,
        vehicleTypeFreeIcon: null,
        vehicleTypeBusyIcon: null,
        vehicleTypeLock: 1,
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
      vehichleTypeList,
      ldleImgList,
      busyImgList,
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
