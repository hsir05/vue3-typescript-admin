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
            v-model:value="form.cityCode"
            clearable
            filterable
            @update:value="handleUpdateValue"
            placeholder="选择开通城市"
            style="width: 260px"
            :options="openCityList"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="queryValue"
        >
          查找</n-button
        >
      </div>
      <div class="btn-bg flex">
        <n-button attr-type="button" type="primary">当前选中区域：{{ area }}</n-button>

        <n-button attr-type="button" type="primary" @click="handleAddArea">
          <template #icon>
            <n-icon>
              <AddIcon />
            </n-icon>
          </template>
          添加开通区域
        </n-button>
      </div>
      <!-- 表格 -->
      <n-data-table
        ref="table"
        :loading="loading"
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
      <Map
        ref="baiduMapRef"
        :nonPointsData="remoteNonEditablePoints"
        :currentPointsData="currentOpenAreaPoints"
        @update-nonEditArea="getNonEditAreaPonits"
      />

      <div class="map-edit-area" v-if="isShow">
        <div class="">
          <n-icon size="24" style="vertical-align: middle">
            <AlertIcon color="#f0a020" />
          </n-icon>
          <span class="ml-5px">新增或编辑区域时：</span>
        </div>
        <div class="ml-30px">
          <p class="mt-5px">地图中<span style="color: #eba624">黄色区块</span>为不可编辑区块；</p>
          <p class="mt-5px">地图中<span style="color: #89b929">绿色区块</span>为已选择区块；</p>
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

          <n-form-item label="状态" path="areaLock">
            <n-radio-group v-model:value="editForm.areaLock">
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
                <n-button attr-type="button" text type="primary" @click="handleAdjust">
                  <n-icon size="20">
                    <HandIcon />
                  </n-icon>
                </n-button>
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
                  <n-icon size="20">
                    <CreatIcon />
                  </n-icon>
                </n-button>
              </template>
              选择区域
            </n-tooltip>

            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  attr-type="button"
                  class="ml-10px"
                  text
                  type="primary"
                  @click="handleReset"
                >
                  <n-icon size="20">
                    <ArrowBackIcon />
                  </n-icon>
                </n-button>
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
                  @click="handleSave"
                >
                  <n-icon size="20">
                    <SaveOutIcon />
                  </n-icon>
                </n-button>
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
                  <n-icon size="20">
                    <RefreshIcon />
                  </n-icon>
                </n-button>
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
import { FormInst, SelectOption, useMessage, NTag } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { TableItemInter, OpenAreaFormInter, NonDataInter, NonEditAreaPonitsInter } from "./type";
import { statusOptions } from "@/config/form";
import { getAllOpenCity } from "@/api/common/common";
import {
  getCityOpenArea,
  removeArea,
  saveOpenArea,
  getOpenAreaPointList,
  getNonEditablePointList,
} from "@/api/operate/operate";
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
import { itemState } from "@/interface/common/common";
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
    const form = ref<OpenAreaFormInter>({
      cityCode: "110000",
      cityName: "北京",
      lat: 39.930936,
      lng: 116.406299,
    });
    const loading = ref(false);
    const isShow = ref(false);
    const formRef = ref<FormInst | null>(null);
    const baiduMapRef = ref();
    const message = useMessage();
    const { appTheme } = useProjectSetting();
    const area = ref<string | null>();

    const openCityList = ref([]);
    const currentOpenAreaPoints = ref<NonDataInter[]>([]);
    const remoteNonEditablePoints = ref<NonDataInter[]>([]);
    const data = ref([]);
    const editFormRef = ref();

    const editForm = ref<TableItemInter>({
      areaName: null,
      areaLock: 1,
      areaCode: null,
      cityCode: null,
    });

    const columns = [
      {
        title: "区域名称",
        key: "areaName",
        align: "center",
      },
      {
        title: "区域编码",
        key: "areaCode",
        align: "center",
      },
      {
        title: "状态",
        key: "areaLock",
        align: "center",
        render(row: TableItemInter) {
          return h(
            NTag,
            {
              type: row.areaLock === 1 ? "error" : "success",
            },
            {
              default: () => (row.areaLock === 1 ? "锁定" : "正常"),
            }
          );
        },
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 100,
        render(record: TableItemInter, index: number) {
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

    onMounted(() => {
      getOpenCity();
    });
    // const { renderBaiduMap } = baiduMapRef.value
    // // const { addMapEventListener, addBoundary, drawingManagerInit } = renderBaiduMap( form.value.lng, form.value.lat );
    // const {resetCenter, addMapEventListener, addBoundary, drawingManagerInit } = renderBaiduMap();

    const getOpenCity = async () => {
      try {
        loading.value = true;
        let res = await getAllOpenCity();
        openCityList.value = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
            lng: item.lng,
            lat: item.lat,
          };
          return obj;
        });
        queryValue();
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    async function queryValue() {
      try {
        isShow.value = false;
        await formRef.value?.validate();
        loading.value = true;
        let res = await getCityOpenArea({ cityCode: form.value.cityCode });
        data.value = res.data;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    function handleUpdateValue(_: string, option: SelectOption) {
      form.value = {
        cityCode: option.value as string,
        cityName: option.label as string,
        lng: option.lng as number,
        lat: option.lat as number,
      };
    }

    async function remove(areaCode: string) {
      try {
        loading.value = true;
        let res = await removeArea({ areaCode });
        // console.log(res);
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }
    function handleAdjust() {
      const { map, drawingManager } = baiduMapRef.value;
      map.enableScrollWheelZoom();
      map.enableDoubleClickZoom();
      drawingManager.close();
    }
    function handleReset() {}
    async function handleSave() {
      try {
        loading.value = true;
        let option = {
          areaCode: editForm.value.areaCode,
          areaName: editForm.value.areaName,
          cityCode: form.value.cityCode,
          areaLock: editForm.value.areaLock,
          openAreaPointList: {
            lng: form.value.lng,
            lat: form.value.lat,
          },
        };
        let res = await saveOpenArea(option);
        console.log(res);
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    const getNonEditAreaPonits = async (paramData: NonEditAreaPonitsInter) => {
      try {
        let option = {
          areaCode: editForm.value.areaCode as string,
          ...paramData,
        };
        let res = await getNonEditablePointList(option);
        remoteNonEditablePoints.value = res.data;
      } catch (err) {
        console.log(err);
      }
    };
    async function getOpenAreaPoint(areaCode: string) {
      try {
        loading.value = true;
        let res = await getOpenAreaPointList({ areaCode });
        currentOpenAreaPoints.value = res.data;

        let option = {
          areaCode: editForm.value.areaCode as string,
          lngMin: res.data[0].lng,
          lngMax: res.data[res.data.length - 1].lng,
          latMin: res.data[0].lat,
          latMax: res.data[res.data.length - 1].lat,
        };
        let result = await getNonEditablePointList(option);
        remoteNonEditablePoints.value = result.data;

        const { renderBaiduMap, addMapEventListener, addBoundary, drawingManagerInit } =
          baiduMapRef.value;

        renderBaiduMap(form.value.lng, form.value.lat);
        addMapEventListener();
        addBoundary(form.value.cityName);
        drawingManagerInit();

        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    async function handleEdit(record: TableItemInter) {
      isShow.value = true;
      area.value = record.areaName;
      getOpenAreaPoint(record.areaCode as string);
      editForm.value = record;
    }
    function handleDelete(record: TableItemInter) {
      remove(record.areaCode as string);
    }
    function handleAddArea() {}

    function handleEditArea() {
      const { map, drawingManager } = baiduMapRef.value;
      map.disableScrollWheelZoom();
      map.disableDoubleClickZoom();
      drawingManager.open();
    }

    return {
      loading,
      isShow,
      area,
      form,
      formRef,
      openCityList,
      remoteNonEditablePoints,
      currentOpenAreaPoints,
      baiduMapRef,
      data,
      appTheme,
      editForm,
      editFormRef,
      columns,
      statusOptions,
      getRowKeyId: (row: TableItemInter) => row.cityCode,
      rule: {
        trigger: ["input", "blur"],
        validator() {
          if (form.value.cityCode === null) {
            return new Error("选择开通城市");
          }
        },
      },
      editRules: {
        areaName: { required: true, trigger: ["blur", "change"], message: "请输入区域名称" },
      },

      queryValue,
      handleSave,
      handleAdjust,
      handleReset,
      handleUpdateValue,
      handleAddArea,
      handleEditArea,
      getNonEditAreaPonits,
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
    width: 390px;
    background-color: $white;
  }

  .btn-bg {
    background-color: v-bind(appTheme);
  }

  .map {
    width: calc(100% - 390px - 10px);
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
