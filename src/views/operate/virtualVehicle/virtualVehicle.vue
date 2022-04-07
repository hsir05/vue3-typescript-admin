<template>
  <div class="h-full box-border virtual-vehicle">
    <!-- 左侧 -->
    <div class="virtual-vehicle-left mr-10px">
      <n-divider title-placement="left">
        <n-icon class="mr-10px" size="20"> <SearchIcon /> </n-icon>检索条件
      </n-divider>
      <!-- 检索 -->
      <n-form
        ref="queryFormRef"
        :rules="queryRules"
        label-placement="left"
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
            :options="influxList.result"
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
              :options="cityData.result"
            />
          </n-form-item>

          <n-button
            attr-type="button"
            :loading="loading"
            class="ml-10px"
            type="primary"
            @click="query"
            >查找</n-button
          >
        </div>
        <!-- <div class="text-center">
          <n-button
            attr-type="button"
            :loading="loading"
            class="w-1/3 mr-5px"
            type="warning"
            @click="handleReset"
            >重置</n-button
          >
        </div> -->
      </n-form>

      <!-- 左侧表格 -->
      <div class="mt-10px mb-10px text-right flex">
        <!-- <span>虚拟车头列表</span> -->

        <n-button attr-type="button" type="primary" @click="handleAddVirtual">
          <template #icon>
            <n-icon> <AddIcon /> </n-icon>
          </template>
          添加虚拟车头</n-button
        >
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
        style="display: flex; flex-wrap: wrap; width: 850px; margin: 0 auto"
        :disabled="disabled"
        label-placement="left"
        require-mark-placement="right-hanging"
        label-width="120"
        :model="form"
      >
        <n-form-item label="司机姓名" path="name">
          <n-input
            v-model:value="form.name"
            clearable
            style="width: 280px"
            placeholder="输入司机姓名"
          />
        </n-form-item>
        <n-form-item label="司机手机号" path="phone">
          <n-input
            v-model:value="form.phone"
            clearable
            style="width: 280px"
            placeholder="输入司机手机号"
          />
        </n-form-item>
        <n-form-item label="车牌号" path="plateNumber">
          <n-input
            v-model:value="form.plateNumber"
            clearable
            style="width: 280px"
            placeholder="输入车牌号"
          />
        </n-form-item>
        <n-form-item label="车辆品牌" path="brand">
          <n-input
            v-model:value="form.brand"
            clearable
            style="width: 280px"
            placeholder="输入车辆品牌"
          />
        </n-form-item>
        <n-form-item label="车系" path="carSeies">
          <n-input
            v-model:value="form.carSeies"
            clearable
            style="width: 280px"
            placeholder="输入车系"
          />
        </n-form-item>
        <n-form-item label="车辆颜色" path="color">
          <n-input
            v-model:value="form.color"
            clearable
            style="width: 280px"
            placeholder="输入车辆颜色"
          />
        </n-form-item>

        <n-form-item label="车辆类型" path="carType">
          <n-select
            clearable
            style="width: 280px"
            filterable
            v-model:value="form.carType"
            placeholder="选择车辆类型"
            :options="cityData.result"
          />
        </n-form-item>

        <!-- <n-form-item label="司机头像" path="avatar">
          <n-select
            clearable
            filterable
            style="width: 200px"
            v-model:value="form.avatar"
            placeholder="选择司机头像"
            :options="cityData.result"
          />
        </n-form-item> -->

        <n-form-item label="司机头像" path="avatar">
          <BasicUpload
            :action="uploadUrl"
            :data="{}"
            name="files"
            :width="100"
            :height="100"
            @upload-change="uploadChange"
            v-model:value="uploadList"
            helpText="单个文件不超过2MB，最多只能上传1个文件"
          />
        </n-form-item>

        <div class="text-center w-full">
          <n-button
            attr-type="button"
            size="large"
            :loading="loading"
            type="primary"
            @click="handleValidate"
            >保存</n-button
          >

          <n-button
            attr-type="button"
            :loading="loading"
            size="large"
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
import { defineComponent, ref, h, unref } from "vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import BasicUpload from "@/components/Upload/Upload.vue";
import cityData from "@/config/cityData.json";
import influxList from "@/config/influxList.json";
import { uploadUrl } from "@/config/config";
import vehicleTypeList from "@/config/vehicleTypeList.json";
import {
  Add as AddIcon,
  Search as SearchIcon,
  CarOutline as CarIcon,
  EyeOutline as EyeIcon,
  TrashOutline as RemoveIcon,
  CreateOutline as CreateIcon,
} from "@vicons/ionicons5";
import { tableDataItem, tableVirtualDataItem } from "./type";
export default defineComponent({
  name: "VirtualVehicle",
  components: { SearchIcon, AddIcon, CarIcon, BasicUpload },
  setup() {
    const loading = ref(false);
    const disabled = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref<tableDataItem>({
      influxCode: null,
      cityCode: null,
    });

    const formRef = ref<FormInst | null>(null);
    const form = ref<tableVirtualDataItem>({
      name: null,
      phone: null,
      plateNumber: null,
      brand: null,
      carSeies: null,
      color: null,
      carType: null,
      avatar: null,
    });

    const uploadList = ref([
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    ]);

    const message = useMessage();

    const columns = [
      {
        title: "司机姓名",
        key: "name",
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
        key: "carType",
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
                onClick: handleSee.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
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
    const data = ref<tableVirtualDataItem[]>([
      {
        name: "章三",
        phone: null,
        plateNumber: "GA00195",
        brand: null,
        carSeies: null,
        color: null,
        carType: "专车-经济型",
        avatar: null,
        id: "123123",
      },
    ]);

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(queryForm));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }
    function handleReset() {
      queryForm.value = { influxCode: null, cityCode: null };
      queryFormRef.value?.restoreValidation();
    }

    function handleSee() {}
    function handleEdit() {}
    function handleRemove(record: Recordable) {
      message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    function handleAddVirtual() {}

    function uploadChange(list: string[]) {
      console.log(list);
    }

    function handleValidate(e: MouseEvent) {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(form));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handleValiReset() {
      form.value = {
        name: null,
        phone: null,
        plateNumber: null,
        brand: null,
        carSeies: null,
        color: null,
        carType: null,
        avatar: null,
      };
      formRef.value?.restoreValidation();
    }

    return {
      loading,
      uploadUrl,
      disabled,
      columns,
      data,
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
        name: { required: true, trigger: ["blur", "change"], message: "请输入司机姓名" },
        phone: { required: true, trigger: ["blur", "change"], message: "请输入正确格式的手机号码" },
        plateNumber: { required: true, trigger: ["blur", "change"], message: "请输入正确的车牌号" },
        brand: { required: true, trigger: ["blur", "change"], message: "请输入车辆品牌" },
        carSeies: { required: true, trigger: ["blur", "change"], message: "请输入车系" },
        color: { required: true, trigger: ["blur", "change"], message: "请输入车辆颜色" },
        carType: { required: true, trigger: ["blur", "change"], message: "请输入车辆类型" },
        avatar: { required: true, trigger: ["blur", "change"], message: "请上传司机头像" },
      },

      cityData,
      influxList,
      vehicleTypeList,
      uploadList,

      query,
      handleReset,

      handleAddVirtual,
      handleValidate,
      uploadChange,
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
  &-left {
    width: 400px;
    background-color: $white;
  }
  &-right {
    width: calc(100% - 400px - 10px);
    background-color: $white;
  }
}
</style>
