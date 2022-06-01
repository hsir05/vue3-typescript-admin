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
          @click="getData"
        >
          查找</n-button
        >
      </div>
      <div class="btn-bg flex">
        <!-- <n-button attr-type="button" type="primary">当前选中区域：{{ area }}</n-button> -->

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
        min-height="600px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>

    <div class="map">
      <Map ref="baiduMapRef" v-if="mapShow" />
      <div class="map-edit-area" v-if="isShow">
        <n-form
          ref="editFormRef"
          :rules="editRules"
          label-placement="left"
          :style="{ maxWidth: '250px', marginLeft: '15px', marginTop: '20px' }"
          require-mark-placement="right-hanging"
          label-width="80"
          :model="editForm"
        >
          <n-form-item label="机场名称" path="airportName">
            <n-input v-model:value="editForm.airportName" clearable placeholder="输入机场名称" />
          </n-form-item>

          <n-form-item label="地址" path="airportAddressDetail">
            <n-input
              v-model:value="editForm.airportAddressDetail"
              clearable
              placeholder="输入地址"
            />
          </n-form-item>

          <n-form-item label="状态" path="openLock">
            <n-radio-group v-model:value="editForm.openLock">
              <n-space>
                <n-radio :value="item.value" v-for="item in lockOptions" :key="item.value">{{
                  item.label
                }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <div class="text-center">
            <n-button
              attr-type="button"
              :loading="loading"
              class="mb-10px"
              size="small"
              type="primary"
              @click="handleSave"
              >保存</n-button
            >
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted, nextTick } from "vue";
import Map from "@/components/Map/BaiduMap.vue";
import { FormInst, SelectOption, useMessage, NTag } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import { TableItemInter, OpenAreaFormInter, EditFormInter } from "./type";
import { lockOptions } from "@/config/form";
import { getAllOpenCity } from "@/api/common/common";
import {
  getOpenCityAirportList,
  saveAirport,
  swapOpenSeq,
  removeAirport,
} from "@/api/operate/operate";
import {
  TrashOutline as TrashIcon,
  ArrowBackCircleOutline as ArrowBackIcon,
  ArrowForwardCircleOutline as ArrowIcon,
  Add as AddIcon,
  CreateOutline as CreateIcon,
} from "@vicons/ionicons5";
import { itemState } from "@/interface/common/common";
import airportIcon from "@/assets/image/openCity_airport.png";
import { cloneDeep } from "lodash-es";
export default defineComponent({
  name: "OpenArea",
  components: {
    Map,
    AddIcon,
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
    const mapShow = ref(true);
    const formRef = ref<FormInst | null>(null);
    const baiduMapRef = ref();
    const message = useMessage();
    const { appTheme } = useProjectSetting();

    const openCityList = ref([]);
    const data = ref<TableItemInter[]>([]);
    const editFormRef = ref<FormInst | null>(null);

    const editForm = ref<EditFormInter>({
      cityCode: "110000",
      airportName: null,
      openLock: 1,
      airportAddressDetail: null,
      airportLat: 39.930936,
      airportLng: 116.406299,
      openCityAirportId: null,
    });

    const columns = [
      {
        title: "开通机场名称",
        key: "airportName",
        align: "center",
      },
      {
        title: "序列",
        key: "openSeq",
        width: 70,
        align: "center",
      },
      {
        title: "状态",
        key: "openLock",
        align: "center",
        render(row: TableItemInter) {
          return h(
            NTag,
            {
              type: row.openLock === 1 ? "error" : "success",
            },
            {
              default: () => (row.openLock === 1 ? "锁定" : "正常"),
            }
          );
        },
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 200,
        render(record: TableItemInter, index: number) {
          return h(TableActions as any, {
            actions: [
              {
                label: "前移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowBackIcon,
                onClick: handleToggle.bind(null, index, "up"),
                auth: ["dict001"],
              },
              {
                label: "后移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowIcon,
                onClick: handleToggle.bind(null, index, "down"),
                auth: ["dict001"],
              },
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
                onClick: handleDelete.bind(null, record.openCityAirportId),
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
        getData();
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    async function getData() {
      try {
        isShow.value = false;
        await formRef.value?.validate();
        loading.value = true;
        let res = await getOpenCityAirportList({ cityCode: form.value.cityCode });
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
      editForm.value = { ...form.value, ...editForm.value };
      isShow.value = false;
    }

    async function remove(openCityAirportId: string) {
      try {
        loading.value = true;
        let res = await removeAirport({ openCityAirportId });
        getData();
        message.success(window.$tips[res.code]);
        loading.value = false;
        mapShow.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    async function handleSave(e: MouseEvent) {
      e.preventDefault();
      editFormRef.value?.validate(async (errors) => {
        if (!errors) {
          try {
            loading.value = true;
            let option = {
              openCityAirportId: editForm.value.openCityAirportId,
              cityCode: form.value.cityCode,
              airportLng: editForm.value.airportLng,
              airportLat: editForm.value.airportLat,
              airportAddressDetail: editForm.value.airportName,
              openLock: editForm.value.openLock,
              airportName: editForm.value.airportName,
            };
            let res = await saveAirport(option);
            console.log(res);
            getData();
            message.success(window.$tips[res.code]);
            isShow.value = false;
            mapShow.value = false;
            loading.value = false;
          } catch (err) {
            console.log(err);
            loading.value = false;
          }
        } else {
          console.log(errors);
        }
      });
    }

    async function handleEdit(record: EditFormInter) {
      isShow.value = true;
      mapShow.value = true;
      nextTick(() => {
        const { renderBaiduMap, addMarker } = baiduMapRef.value;
        renderBaiduMap(record.airportLng, record.airportLat);
        addMarker(record.airportLng, record.airportLat, airportIcon);
        editForm.value = cloneDeep(record);
      });
    }
    function handleDelete(openCityAirportId: string) {
      remove(openCityAirportId);
    }
    async function handleToggle(index: number, type: string) {
      if (index === 0 && type === "up") {
        message.success("已经是第一个了");
        return false;
      }
      if (index === data.value.length - 1 && type === "down") {
        message.success("已经是最后一个了");
        return false;
      }
      loading.value = true;
      try {
        let option = {
          firstOpenCityAirportId:
            type === "up"
              ? data.value[index - 1].openCityAirportId
              : data.value[index].openCityAirportId,
          secondOpenCityAirportId:
            type === "up"
              ? data.value[index].openCityAirportId
              : data.value[index + 1].openCityAirportId,
        };
        let res = await swapOpenSeq(option);
        message.success(window.$tips[res.code]);
        getData();
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }
    function handleAddArea() {
      isShow.value = true;
      mapShow.value = true;
      nextTick(() => {
        editForm.value.airportName = null;
        editForm.value.airportAddressDetail = null;
        editForm.value.openCityAirportId = null;

        const { renderBaiduMap } = baiduMapRef.value;
        renderBaiduMap(editForm.value.airportLng, editForm.value.airportLat);
      });

      // addMarker(editForm.value.airportLng, editForm.value.airportLat, airportIcon);
    }

    return {
      loading,
      isShow,
      form,
      formRef,
      openCityList,
      baiduMapRef,
      data,
      appTheme,
      editForm,
      editFormRef,
      mapShow,
      columns,
      lockOptions,
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
        airportName: { required: true, trigger: ["blur", "change"], message: "请输入机场名称" },
        airportAddressDetail: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入地址",
        },
      },

      getData,
      handleSave,
      handleUpdateValue,
      handleAddArea,
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
    width: 480px;
    background-color: $white;
  }

  .btn-bg {
    background-color: v-bind(appTheme);
  }

  .map {
    width: calc(100% - 480px - 10px);
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
      height: 230px;
      background-color: $white;
      border-radius: 4px;
    }
  }
}
</style>
