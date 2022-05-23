<template>
  <div class="h-full box-border opening-urban">
    <div class="simple-table">
      <div class="mt-10px mb-10px text-right flex">
        <n-button attr-type="button" type="primary" @click="handleAddCity">
          <template #icon>
            <n-icon>
              <AddIcon />
            </n-icon>
          </template>
          添加开通城市
        </n-button>
        <n-button attr-type="button" type="primary">当前选中城市：{{ openCity.cityName }}</n-button>
      </div>

      <n-data-table
        ref="table"
        :data="data"
        :loading="loading"
        :row-class-name="rowClassName"
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 260px)"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="map">
      <Map ref="baiduMapRef" @on-dragend="updateMapPoint" />
    </div>

    <OpeningUrbanModal ref="ModalRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref, onMounted, toRaw } from "vue";
import { TableItemInter } from "./type";
import { useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import Map from "@/components/Map/BaiduMap.vue";
import { useProjectSetting } from "@/hooks/setting/useProjectSetting";
import {
  LocationOutline as LocationIcon,
  TrashOutline as TrashIcon,
  Add as AddIcon,
} from "@vicons/ionicons5";
import { removeOpenCity, saveCenterPoint } from "@/api/operate/operate";
import { getAllOpenCity } from "@/api/common/common";
import OpeningUrbanModal from "./openingUrbanModal.vue";
import { lighten } from "@/utils/index";
export default defineComponent({
  name: "OpeningUrban",
  components: { Map, AddIcon, OpeningUrbanModal },
  setup() {
    const baiduMapRef = ref();
    const ModalRef = ref();
    const loading = ref(false);
    const mapLoading = ref(false);
    const data = ref([]);
    const selectdIndex = ref(0);
    const { appTheme } = useProjectSetting();
    const lightenStr = lighten(appTheme.value, 16);
    const message = useMessage();

    const openCity = ref<TableItemInter>({
      cityName: null,
      cityCode: null,
      lng: null,
      lat: null,
    });

    const columns = [
      {
        title: "#",
        key: "index",
        align: "center",
        width: 50,
        render(_: TableItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "城市",
        key: "cityName",
        align: "center",
      },
      {
        title: "城市编码",
        key: "cityCode",
        width: 100,
        align: "center",
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
                label: "编辑定位",
                type: "primary",
                icon: LocationIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record, index),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "primary",
                isIconBtn: true,
                icon: TrashIcon,
                onClick: handleRemove.bind(null, record),
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
        loading.value = true;
        let res = await getAllOpenCity();
        data.value = res.data;
        if (res.data.length > 0) {
          openCity.value = res.data[0];
          const { renderBaiduMap, createMarker } = baiduMapRef.value;
          renderBaiduMap(res.data[0].lng, res.data[0].lat);
          createMarker();
        }
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    async function updateMapPoint(lng: number, lat: number) {
      try {
        mapLoading.value = true;
        let res = await saveCenterPoint({
          cityName: openCity.value.cityName,
          cityCode: openCity.value.cityCode,
          lng,
          lat,
        });
        message.success(window.$tips[res.code]);
        mapLoading.value = false;
      } catch (err) {
        console.log(err);
        mapLoading.value = false;
      }
    }

    async function handleEdit(record: TableItemInter, index: number) {
      selectdIndex.value = index;
      openCity.value = record;

      const { renderBaiduMap, createMarker } = baiduMapRef.value;
      renderBaiduMap(toRaw(record).lng, toRaw(record).lat);
      createMarker();
    }
    async function handleRemove(record: TableItemInter) {
      loading.value = true;
      try {
        let res = await removeOpenCity({ cityCode: record.cityCode as string });
        console.log(res);
        message.success(window.$tips[res.code]);
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    const rowClassName = (_: TableItemInter, index: number) => {
      if (index === selectdIndex.value) {
        return "selected";
      }
      return "";
    };

    function handleAddCity() {
      const { handleModal } = ModalRef.value;
      handleModal();
    }

    return {
      baiduMapRef,
      ModalRef,
      loading,
      mapLoading,
      lightenStr,
      data,
      columns,
      openCity,
      rowClassName,
      updateMapPoint,
      getRowKeyId: (row: TableItemInter) => row.cityCode,
      handleAddCity,
    };
  },
});
</script>
<style lang="scss" scoped>
.opening-urban {
  display: flex;
  align-content: flex-start;
  justify-content: space-between;

  .simple-table {
    width: 400px;
    height: auto;
    background-color: $white;
  }

  .map {
    width: calc(100% - 400px - 10px);
    height: auto;
    overflow: scroll;
    background-color: $white;
    box-sizing: border-box;
    padding-top: 5px;
    padding-left: 5px;
  }
}

:deep(.selected td) {
  background-color: v-bind(lightenStr) !important;
  color: white !important;
}
</style>
