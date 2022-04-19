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
        >
          查找</n-button
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
        <OrderItem />
        <OrderEdit />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import Map from "@/components/Map/BaiduMap.vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { tableDataItem } from "./type";
import { statusOptions } from "@/config/form";
import OrderItem from "./orderTableItem.vue";
import OrderEdit from "./orderEditItem.vue";
import { EyeOutline as EyeIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import openCityList from "@/config/openCityList.json";
export default defineComponent({
  name: "OrderLimit",
  components: {
    Map,
    OrderItem,
    OrderEdit,
  },
  setup() {
    const cityCode = ref("620100");
    const loading = ref(false);
    const formRef = ref<FormInst | null>(null);
    const baiduMapRef = ref();
    const message = useMessage();

    const data = ref([
      {
        areaCode: "620100A01",
        areaLock: 0,
        areaName: "主城区",
        cityCode: "620100",
      },
    ]);

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
                label: "x详情",
                type: "primary",
                isIconBtn: true,
                icon: EyeIcon,
                onClick: hanldleSee.bind(null, record),
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

    onMounted(async () => {
      const { renderBaiduMap } = baiduMapRef.value;
      await renderBaiduMap(103.841521, 36.067212);
      //   addBoundary()
    });

    function handleEdit(record: tableDataItem) {
      console.log(record);
      const { renderBaiduMap } = baiduMapRef.value;
      renderBaiduMap(103.841521, 36.067212);
    }
    function hanldleSee(record: Recordable) {
      console.log(record);
    }

    function handleEditArea() {}

    return {
      loading,
      cityCode,
      formRef,
      openCityList,
      baiduMapRef,
      data,
      columns,
      statusOptions,
      getRowKeyId: (row: tableDataItem) => row.id,
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
      width: 470px;
      height: auto;
      background-color: $white;
      border-radius: 2px;
    }
  }
}
</style>
