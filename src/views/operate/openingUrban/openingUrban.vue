<template>
  <div class="h-full box-border opening-urban">
    <div class="simple-table">
      <div class="mt-10px mb-10px text-right flex">
        <n-button attr-type="button" type="primary" @click="handleAddCity">
          <template #icon>
            <n-icon> <AddIcon /> </n-icon>
          </template>
          添加开通城市</n-button
        >
        <n-button attr-type="button" type="primary">当前选中城市：{{ label }}</n-button>
      </div>

      <n-data-table
        ref="table"
        :data="data"
        :loading="loading"
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 260px)"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="map">
      <Map ref="baiduMapRef" />
    </div>

    <OpeningUrbanModal ref="ModalRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref, onMounted, toRaw } from "vue";
import { tableItemProps, tableDataItem } from "./type";
import { useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import Map from "@/components/Map/BaiduMap.vue";
import {
  LocationOutline as LocationIcon,
  TrashOutline as TrashIcon,
  Add as AddIcon,
} from "@vicons/ionicons5";
import { getAllOpenCity, removeOpenCity, saveCenterPoint } from "@/api/operate/operate";
import OpeningUrbanModal from "./openingUrbanModal.vue";
export default defineComponent({
  name: "OpeningUrban",
  components: { Map, AddIcon, OpeningUrbanModal },
  setup() {
    const baiduMapRef = ref();
    const ModalRef = ref();
    const label = ref();
    const loading = ref(false);
    const mapLoading = ref(false);
    const data = ref([]);
    const message = useMessage();

    const columns = [
      {
        title: "#",
        key: "index",
        align: "center",
        width: 20,
        render(_: tableItemProps, rowIndex: number) {
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
        render(record: tableDataItem, index: number) {
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
                onClick: handleDelete.bind(null, record),
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
        data.value = res;
        if (res.length > 0) {
          label.value = res[0].cityName;
          const { renderBaiduMap } = baiduMapRef.value;
          const { createMarker } = await renderBaiduMap(res[0].lng, res[0].lat);
          createMarker(updateMapPoint);
        }
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    async function updateMapPoint(lng: number, lat: number) {
      console.log(lng, lat);

      try {
        mapLoading.value = true;
        await saveCenterPoint({ lng, lat });
        mapLoading.value = false;
      } catch (err) {
        console.log(err);
        mapLoading.value = false;
      }
    }

    async function handleEdit(record: tableDataItem, index: number) {
      console.log(toRaw(record), index);
      label.value = toRaw(record).cityName as string;
      const { renderBaiduMap } = baiduMapRef.value;
      const { createMarker } = await renderBaiduMap(toRaw(record).lng, toRaw(record).lat);
      createMarker((lng: number, lat: number) => {
        console.log(lng, lat);
      });
    }
    async function handleDelete(record: tableDataItem) {
      loading.value = true;
      try {
        await removeOpenCity({ cityCode: record.cityCode as string });
        message.success("保存成功");
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    function handleAddCity() {
      const { handleModal } = ModalRef.value;
      handleModal();
    }

    return {
      baiduMapRef,
      ModalRef,
      loading,
      mapLoading,
      data,
      columns,
      label,
      getRowKeyId: (row: tableItemProps) => row.id,
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
</style>
