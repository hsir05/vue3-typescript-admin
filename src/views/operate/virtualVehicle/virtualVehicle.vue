<template>
  <div class="h-full box-border virtual-vehicle">
    <!-- 左侧 -->
    <div class="virtual-vehicle-left mr-10px">
      <!-- 检索 -->
      <n-form
        ref="queryFormRef"
        :rules="queryRules"
        label-placement="left"
        class="mt-10px"
        :style="{ maxWidth: '360px', marginLeft: '10px' }"
        require-mark-placement="right-hanging"
        label-width="80"
        :model="queryForm"
      >
        <n-form-item label="流量方" path="influxCode">
          <n-select
            clearable
            filterable
            v-model:value="queryForm.influxCode"
            placeholder="选择流量方"
            :options="influxData"
          />
        </n-form-item>

        <div class="flex-center">
          <n-form-item label="开通城市" path="cityCode">
            <n-select
              clearable
              style="width: 250px"
              filterable
              v-model:value="queryForm.cityCode"
              placeholder="选择开通城市"
              :options="openCityData"
            />
          </n-form-item>

          <n-button
            attr-type="button"
            :loading="loading"
            class="ml-10px"
            type="primary"
            @click="query"
            >查找
          </n-button>
        </div>
      </n-form>

      <!-- 左侧表格 -->
      <div class="mt-10px mb-10px text-right flex">
        <!-- <span>虚拟车头列表</span> -->
        <n-button attr-type="button" type="primary" @click="handleAddVirtual">
          <template #icon>
            <n-icon>
              <AddIcon />
            </n-icon>
          </template>
          添加虚拟车头
        </n-button>
      </div>
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border mt-10px"
        min-height="250px"
        flex-height
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />
    </div>

    <!-- 右侧 -->
    <div class="virtual-vehicle-right">
      <n-divider title-placement="left">
        <n-icon class="mr-10px" size="20"> <CarIcon /> </n-icon>添加开通虚拟车头
      </n-divider>

      <n-form
        ref="formRef"
        :rules="rules"
        style="display: flex; flex-wrap: wrap; width: 100%; margin: 0 auto"
        :disabled="disabled"
        label-placement="left"
        require-mark-placement="right-hanging"
        label-width="120"
        :model="form"
      >
        <n-form-item label="司机姓名" path="driverFullName">
          <n-input
            v-model:value="form.driverFullName"
            clearable
            style="width: 280px"
            placeholder="输入司机姓名"
          />
        </n-form-item>
        <n-form-item label="司机手机号" path="driverPhone">
          <n-input
            v-model:value="form.driverPhone"
            clearable
            style="width: 280px"
            @on-update:value="uniquePhone"
            placeholder="输入司机手机号"
          />
        </n-form-item>
        <n-form-item label="车牌号" path="plateNumber">
          <n-input
            v-model:value="form.plateNumber"
            clearable
            @on-update:value="uniquePlate"
            style="width: 280px"
            placeholder="输入车牌号"
          />
        </n-form-item>
        <n-form-item label="车辆品牌" path="vehicleBrand">
          <n-input
            v-model:value="form.vehicleBrand"
            clearable
            style="width: 280px"
            placeholder="输入车辆品牌"
          />
        </n-form-item>
        <n-form-item label="车系" path="vehicleSeries">
          <n-input
            v-model:value="form.vehicleSeries"
            clearable
            style="width: 280px"
            placeholder="输入车系"
          />
        </n-form-item>
        <n-form-item label="车辆颜色" path="vehicleColor">
          <n-input
            v-model:value="form.vehicleColor"
            clearable
            style="width: 280px"
            placeholder="输入车辆颜色"
          />
        </n-form-item>

        <n-form-item label="车辆类型" path="vehicleTypeId">
          <n-select
            clearable
            style="width: 280px"
            filterable
            v-model:value="form.vehicleTypeId"
            placeholder="选择车辆类型"
            :options="vehicleTypeData"
          />
        </n-form-item>

        <n-form-item label="车辆备注" path="vehicleNote">
          <n-input
            v-model:value="form.vehicleNote"
            type="textarea"
            round
            clearable
            style="width: 280px"
            placeholder="输入车辆颜色"
          />
        </n-form-item>

        <n-form-item label="司机头像" path="driverIdentificationPhotoUrl" class="mt-20px">
          <BasicUpload
            :data="{ uploadType: UploadTypeEnum.AVATAR }"
            name="file"
            :width="100"
            :height="100"
            @delete-upload="uploadRemove"
            @upload-change="uploadChange"
            v-model:value="uploadList"
            helpText="单个文件不超过2MB,最多只能上传1个文件"
          />
        </n-form-item>

        <div class="text-center w-full">
          <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate"
            >保存</n-button
          >

          <n-button
            attr-type="button"
            :loading="loading"
            class="ml-10px"
            type="warning"
            @click="handleValiReset"
            >重置</n-button
          >
        </div>
      </n-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref, onMounted, reactive, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import BasicUpload from "@/components/Upload/Upload.vue";
import { UploadTypeEnum } from "@/enums/httpEnum";
import {
  Add as AddIcon,
  CarOutline as CarIcon,
  EyeOutline as EyeIcon,
  TrashOutline as RemoveIcon,
  CreateOutline as CreateIcon,
} from "@vicons/ionicons5";
import { tableDataItem, formState } from "./type";
import { getInfluxList, getAllOpenCity } from "@/api/common/common";
import { getVehicleType } from "@/api/operate/operate";
import { itemState } from "@/interface/common/common";
import defaultAvatar from "@/assets/image/default-avatar.png";
import {
  saveVirtual,
  removeVirtual,
  uniqueDriverPhone,
  uniquePlateNumber,
  getDiriver,
} from "@/api/operate/operate";
export default defineComponent({
  name: "VirtualVehicle",
  components: { AddIcon, CarIcon, BasicUpload },
  setup() {
    const loading = ref(false);
    const disabled = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref<tableDataItem>({
      influxCode: null,
      cityCode: null,
    });
    const state = reactive({
      influxData: [],
      openCityData: [],
      vehicleTypeData: [],
    });

    const formRef = ref<FormInst | null>(null);
    const form = ref<formState>({
      driverFullName: null,
      driverPhone: null,
      plateNumber: null,
      vehicleBrand: null,
      vehicleSeries: null,
      vehicleColor: null,
      vehicleTypeId: null,
      vehicleNote: null,
      driverIdentificationPhotoUrl: null,
    });
    const uploadList = ref<string[]>([]);
    const message = useMessage();

    const columns = [
      {
        title: "司机姓名",
        key: "driverFullName",
        width: 80,
        align: "center",
      },
      {
        title: "车牌号",
        key: "plateNumber",
        width: 85,
        align: "center",
      },
      {
        title: "车辆类型",
        key: "vehicleBrand",
        width: 90,
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 110,
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handle.bind(null, record, true),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handle.bind(null, record, false),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                icon: RemoveIcon,
                secondary: true,
                isIconBtn: true,
                auth: ["dict002"],
                popConfirm: {
                  onPositiveClick: handleRemove.bind(null, record),
                  title: "您确定删除?",
                },
              },
            ],
          });
        },
      },
    ];
    const data = ref([]);

    onMounted(() => {
      getInflux();
      getOpenCity();
      getVehiclieData();
    });

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate(async (errors) => {
        if (!errors) {
          console.log(unref(queryForm));
          let option = {
            influxCode: queryForm.value.influxCode as string,
            cityCode: queryForm.value.cityCode as string,
          };
          let res = await getDiriver(option);
          console.log(res);
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    async function getInflux() {
      try {
        let res = await getInfluxList();
        console.log(res);
        state.influxData = res.data;

        state.influxData = res.data.map((item: { entryName: string; entryCode: string }) => {
          let obj = {
            label: item.entryName,
            value: item.entryCode,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    }
    async function getOpenCity() {
      try {
        let res = await getAllOpenCity();
        console.log(res);
        state.openCityData = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    }

    const getVehiclieData = async () => {
      try {
        let res = await getVehicleType({ operationCompanyId: "" });
        console.log(res.data);

        state.vehicleTypeData = res.data.map(
          (item: { vehicleTypeName: string; vehicleTypeId: string }) => {
            let obj = {
              label: item.vehicleTypeName,
              value: item.vehicleTypeId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    async function uniquePhone(driverPhone: string) {
      try {
        let option = {
          influxCode: queryForm.value.influxCode,
          cityCode: queryForm.value.cityCode,
          driverPhone: driverPhone,
        };
        let res = await uniqueDriverPhone(option);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    async function uniquePlate(plateNumber: string) {
      try {
        let option = {
          influxCode: queryForm.value.influxCode,
          cityCode: queryForm.value.cityCode,
          plateNumber: plateNumber,
        };
        let res = await uniquePlateNumber(option);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    async function remove(virtualDriverId: string) {
      try {
        let res = await removeVirtual({ virtualDriverId });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    async function save() {
      try {
        let option = {
          ...queryForm.value,
          ...form.value,
        };
        let res = await saveVirtual(option);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    function handle(record: Recordable, bool: boolean) {
      disabled.value = bool;
      const {
        driverFullName,
        driverPhone,
        plateNumber,
        vehicleBrand,
        vehicleSeries,
        vehicleColor,
        vehicleTypeId,
        vehicleNote,
        driverIdentificationPhotoUrl,
      } = record;
      form.value = {
        driverFullName,
        driverPhone,
        plateNumber,
        vehicleBrand,
        vehicleSeries,
        vehicleColor,
        vehicleTypeId,
        vehicleNote,
        driverIdentificationPhotoUrl,
      };
      let imgUrl = driverIdentificationPhotoUrl ? driverIdentificationPhotoUrl : defaultAvatar;
      uploadList.value = [imgUrl];
    }
    function handleRemove(record: Recordable) {
      remove(record.vehicleTypeId);
    }

    function handleAddVirtual() {
      disabled.value = false;
      uploadList.value = [];
      handleValiReset();
    }

    function uploadChange(file: { filePath: string; fileId: string }) {
      form.value.driverIdentificationPhotoUrl = file.fileId;
      uploadList.value = [file.filePath];
    }
    function uploadRemove(file: string[]) {
      form.value.driverIdentificationPhotoUrl = file[0];
      uploadList.value = file;
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));
          save();
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleValiReset() {
      form.value = {
        driverFullName: null,
        driverPhone: null,
        plateNumber: null,
        vehicleBrand: null,
        vehicleSeries: null,
        vehicleColor: null,
        vehicleTypeId: null,
        vehicleNote: null,
        driverIdentificationPhotoUrl: null,
      };
      formRef.value?.restoreValidation();
    }

    return {
      loading,
      disabled,
      columns,
      data,
      UploadTypeEnum,
      ...toRefs(state),
      getRowKeyId: (row: tableDataItem) => row.id,

      queryFormRef,
      queryForm,
      queryRules: {
        influxCode: { required: true, trigger: ["blur", "change"], message: "请选择流量方" },
        cityCode: { required: true, trigger: ["blur", "change"], message: "请选择开通城市" },
      },

      formRef,
      form,
      rules: {
        driverFullName: { required: true, trigger: ["blur", "change"], message: "请输入司机姓名" },
        driverPhone: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入正确格式的手机号码",
        },
        plateNumber: { required: true, trigger: ["blur", "change"], message: "请输入正确的车牌号" },
        vehicleBrand: { required: true, trigger: ["blur", "change"], message: "请输入车辆品牌" },
        vehicleSeries: { required: true, trigger: ["blur", "change"], message: "请输入车系" },
        vehicleColor: { required: true, trigger: ["blur", "change"], message: "请输入车辆颜色" },
        vehicleTypeId: { required: true, trigger: ["blur", "change"], message: "请选择车辆类型" },
        driverIdentificationPhotoUrl: {
          required: true,
          trigger: ["blur", "change"],
          message: "请上传司机头像",
        },
      },
      uploadList,

      query,
      uniquePhone,
      uniquePlate,

      handleAddVirtual,
      handleValidate,
      uploadChange,
      uploadRemove,
      handleValiReset,
    };
  },
});
</script>
<style lang="scss" scoped>
.n-divider:not(.n-divider--vertical) {
  margin: 18px 0;
}

.virtual-vehicle {
  box-sizing: border-box;
  display: flex;
  justify-content: end;
  align-content: flex-start;
  $width: 420px;

  &-left {
    width: $width;
    background-color: $white;
  }

  &-right {
    width: calc(100% - $width - 10px);
    background-color: $white;
    overflow: scroll;
  }
}
</style>
