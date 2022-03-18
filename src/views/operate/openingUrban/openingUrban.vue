<template>
  <div class="h-full box-border opening-urban">
    <div class="simple-table">
      <n-data-table
        ref="table"
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="500px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="map">
      <Map ref="baiduMapRef" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref, onMounted, toRaw } from "vue";
import { tableItemProps, tableDataItem } from "./type";
import TableActions from "@/components/TableActions/TableActions.vue";
import Map from "@/components/Map/BaiduMap.vue";
import { LocationOutline as LocationIcon, TrashOutline as TrashIcon } from "@vicons/ionicons5";
export default defineComponent({
  name: "OpeningUrban",
  components: { Map },
  setup() {
    const baiduMapRef = ref();
    const data = ref([
      {
        id: "1123123",
        city: "北京",
        code: "11000",
        lng: 116.403414,
        lat: 39.924091,
      },
      {
        id: "1123333123",
        city: "兰州",
        code: "620100",
        lng: 103.832758,
        lat: 36.06537,
      },
      {
        id: "13123",
        city: "杭州",
        code: "330100",
        lng: 120.1126,
        lat: 30.225875,
      },
    ]);

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
        key: "city",
        align: "center",
      },
      {
        title: "城市编码",
        key: "code",
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
      const { renderBaiduMap } = baiduMapRef.value;
      renderBaiduMap(116.403414, 39.924091);
    });

    function handleEdit(record: tableDataItem, index: number) {
      console.log(toRaw(record), index);
      const { renderBaiduMap } = baiduMapRef.value;
      renderBaiduMap(toRaw(record).lng, toRaw(record).lat);
    }
    function handleDelete(record: tableDataItem) {
      console.log(record);
    }

    return {
      baiduMapRef,
      data,
      columns,
      getRowKeyId: (row: tableItemProps) => row.id,
    };
  },
});
</script>
<style lang="scss" scoped>
.opening-urban {
  display: flex;
  align-content: flex-start;
  justify-content: space-between;
  padding: 5px;

  .simple-table {
    width: 400px;
    height: auto;
    background-color: $white;
  }
  .map {
    width: calc(100% - 400px - 15px);
    height: auto;
    overflow: scroll;
    background-color: $white;
  }
}
// :deep(.active-row td) {
//   font-weight: 600;
//   background-color: v-bind(lightAppTheme);
//   color: $white;
//   cursor: pointer;
//   &:hover{
//       background-color: v-bind(hoverAppTheme);
//   }
// }
</style>
