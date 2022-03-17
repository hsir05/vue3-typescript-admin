<template>
  <div class="h-full box-border opening-urban">
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
    <div class="map">
      <Map />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref } from "vue";
import { tableItemProps, tableDataItem } from "./type";
import TableActions from "@/components/TableActions/TableActions.vue";
import Map from "@/components/Map/Map.vue";
import { LocationOutline as LocationIcon, TrashOutline as TrashIcon } from "@vicons/ionicons5";

export default defineComponent({
  name: "OpeningUrban",
  components: { Map },
  setup() {
    const data = ref([
      {
        id: "1123123",
        city: "北京",
        code: "11000",
        lon: "123123",
        lat: "123123",
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
        title: "城市",
        key: "city",
        width: 100,
        align: "center",
      },
      {
        title: "城市编码",
        key: "code",
        width: 110,
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
                label: "编辑定位",
                type: "primary",
                icon: LocationIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
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

    function handleEdit(record: tableDataItem) {
      console.log(record);
    }
    function handleDelete(record: tableDataItem) {
      console.log(record);
    }

    return {
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
</style>
