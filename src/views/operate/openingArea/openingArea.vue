<template>
  <div class="h-full box-border open-area">
    <div class="open-area-left">
      <div class="m-10px flex-align-start">
        <n-form-item
          ref="formRef"
          label-width="70"
          label="开通城市"
          label-placement="left"
          :rule="rule"
        >
          <n-select
            v-model:value="cityCode"
            clearable
            filterable
            placeholder="选择开通城市"
            style="width: 260px"
            :options="openCityList.result"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="handleValidate"
          >查找</n-button
        >
      </div>
      <div class="btn-bg flex">
        <n-button attr-type="button" type="primary">当前选中区域：{{ area }}</n-button>

        <n-button attr-type="button" type="primary" @click="handleAddArea">
          <template #icon>
            <n-icon> <AddIcon /> </n-icon>
          </template>
          添加开通区域</n-button
        >
      </div>
      <!-- 表格 -->
      <n-data-table
        ref="table"
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="400px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>

    <div class="map">
      <Map ref="baiduMapRef" />

      <div class="map-edit-area">
        <div class="">
          <n-icon size="24" style="vertical-align: middle">
            <AlertIcon color="#f0a020" />
          </n-icon>
          <span class="ml-5px">新增或编辑区域时：</span>
        </div>
        <div class="ml-30px">
          <p class="mt-5px">地图中<span class="color-yellow-400">黄色区块</span>为不可编辑区块；</p>
          <p class="mt-5px">地图中<span class="color-green-300">绿色区块</span>为已选择区块；</p>
          <p class="mt-5px">地图中空白区块为可选择区块。</p>
        </div>
        <n-form
          ref="editFormRef"
          :rules="editRules"
          size="small"
          label-placement="left"
          :style="{ maxWidth: '250px', marginLeft: '25px', marginTop: '20px' }"
          require-mark-placement="right-hanging"
          label-width="80"
          :model="editForm"
        >
          <n-form-item label="区域名称" path="areaName">
            <n-input v-model:value="editForm.areaName" clearable placeholder="输入区域名称" />
          </n-form-item>

          <n-form-item label="状态" path="status">
            <n-radio-group v-model:value="editForm.status">
              <n-space>
                <n-radio :value="item.value" v-for="item in statusOptions" :key="item.value">{{
                  item.label
                }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="操作">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button attr-type="button" text type="primary" @click="handleEditArea">
                  <n-icon size="20"> <HandIcon /> </n-icon
                ></n-button>
              </template>
              调整地图位置
            </n-tooltip>

            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  attr-type="button"
                  class="ml-10px"
                  text
                  type="primary"
                  @click="handleEditArea"
                >
                  <n-icon size="20"> <CreatIcon /> </n-icon
                ></n-button>
              </template>
              选择
            </n-tooltip>

            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  attr-type="button"
                  class="ml-10px"
                  text
                  type="primary"
                  @click="handleEditArea"
                >
                  <n-icon size="20"> <ArrowBackIcon /> </n-icon
                ></n-button>
              </template>
              还原
            </n-tooltip>

            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  attr-type="button"
                  class="ml-10px"
                  text
                  type="primary"
                  @click="handleEditArea"
                >
                  <n-icon size="20"> <SaveOutIcon /> </n-icon
                ></n-button>
              </template>
              保存
            </n-tooltip>

            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  attr-type="button"
                  class="ml-10px"
                  text
                  type="primary"
                  @click="handleEditArea"
                >
                  <n-icon size="20"> <RefreshIcon /> </n-icon
                ></n-button>
              </template>
              取消
            </n-tooltip>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import Map from "@/components/Map/BaiduMap.vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { tableItemProps, tableDataItem } from "./type";
import { statusOptions } from "@/config/form";
import {
  AlertCircle as AlertIcon,
  TrashOutline as TrashIcon,
  CreateOutline as CreatIcon,
  SaveOutline as SaveOutIcon,
  ArrowUndoCircleOutline as ArrowBackIcon,
  RefreshCircleOutline as RefreshIcon,
  Add as AddIcon,
  HandRightOutline as HandIcon,
  CreateOutline as CreateIcon,
} from "@vicons/ionicons5";
import openCityList from "@/config/openCityList.json";
export default defineComponent({
  name: "OpenArea",
  components: {
    Map,
    AddIcon,
    AlertIcon,
    HandIcon,
    CreatIcon,
    RefreshIcon,
    ArrowBackIcon,
    SaveOutIcon,
  },
  setup() {
    const cityCode = ref("620100");
    const loading = ref(false);
    const formRef = ref<FormInst | null>(null);
    const baiduMapRef = ref();
    const message = useMessage();
    const { appTheme } = useProjectSetting();
    const area = ref("主城区");

    const data = ref([
      {
        areaCode: "620100A01",
        areaLock: 0,
        areaName: "主城区",
        cityCode: "620100",
      },
    ]);
    const editFormRef = ref();
    const editForm = ref<tableDataItem>({
      areaName: null,
      status: 1,
      areaCode: null,
    });

    const columns = [
      {
        title: "开通区域",
        key: "areaName",
        align: "center",
      },
      {
        title: "区域编码",
        key: "areaCode",
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 100,
        render(record: tableDataItem, index: number) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record, index),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "primary",
                isIconBtn: true,
                icon: TrashIcon,
                onClick: handleDelete.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    async function handleValidate() {
      try {
        await formRef.value?.validate();
        console.log(cityCode.value);
      } catch (err) {
        console.log(err);
        message.error("验证失败");
      }
    }

    onMounted(() => {
      const { renderBaiduMap } = baiduMapRef.value;
      renderBaiduMap(103.841521, 36.067212);
    });

    function handleEdit(record: tableDataItem) {
      console.log(record);
      const { renderBaiduMap } = baiduMapRef.value;
      renderBaiduMap(103.841521, 36.067212);
    }
    function handleDelete() {}
    function handleAddArea() {}

    function handleEditArea() {}

    return {
      loading,
      area,
      cityCode,
      formRef,
      openCityList,
      baiduMapRef,
      data,
      appTheme,
      editForm,
      editFormRef,
      columns,
      statusOptions,
      getRowKeyId: (row: tableItemProps) => row.id,
      rule: {
        trigger: ["input", "blur"],
        validator() {
          if (cityCode.value === null) {
            return new Error("选择开通城市");
          }
        },
      },
      editRules: {
        areaName: { required: true, trigger: ["blur", "change"], message: "请输入区域名称" },
      },

      handleValidate,
      handleAddArea,
      handleEditArea,
    };
  },
});
</script>
<style lang="scss" scoped>
.open-area {
  display: flex;
  align-content: flex-start;
  justify-content: space-between;
  .open-area-left {
    width: 300px;
    background-color: $white;
  }
  .btn-bg {
    background-color: v-bind(appTheme);
  }

  .map {
    width: calc(100% - 300px - 10px);
    height: auto;
    overflow: scroll;
    background-color: $white;
    box-sizing: border-box;
    padding-top: 5px;
    padding-left: 5px;
    position: relative;
    .map-edit-area {
      position: absolute;
      padding: 10px;
      left: 10px;
      top: 10px;
      width: 300px;
      height: 270px;
      background-color: $white;
      border-radius: 4px;
    }
  }
}
</style>
