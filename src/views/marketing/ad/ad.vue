<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <div class="flex-align-start pt-15px pb-10px mb-10px bg-white">
      <n-form-item
        ref="queryFormRef"
        :rule="queryRule"
        :show-feedback="false"
        label-width="90"
        label="开通城市"
        label-placement="left"
      >
        <n-select
          v-model:value="cityCodeEq"
          clearable
          filterable
          placeholder="选择开通城市"
          style="width: 260px"
          :options="openCityData"
        />
      </n-form-item>

      <n-button
        attr-type="button"
        :loading="loading"
        class="ml-10px"
        type="primary"
        @click="handleValidate"
        >查找
      </n-button>
    </div>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      :isAddBtn="true"
      @on-add="handleAdd"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <AdDrawer ref="adDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  TrashOutline as RemoveIcon,
  CreateOutline as CreateIcon,
  ArrowBackCircleOutline as ArrowBackIcon,
  ArrowForwardCircleOutline as ArrowIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import AdDrawer from "./adDrawer.vue";
import { tableDataItem, CityItemInter } from "./type";
import { itemState } from "@/interface/common/common";
import { statusOptions } from "@/config/form";
import { getAdPage } from "@/api/marketing/marketing";
import { getAllOpenCity } from "@/api/common/common";
import { PaginationState } from "@/api/type";
import { FormInst, NImage } from "naive-ui";
export default defineComponent({
  name: "Ad",
  components: { BasicTable, AdDrawer },
  setup() {
    const loading = ref(false);
    const adDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);

    const openCityData = ref<CityItemInter[]>([]);

    const cityCodeEq = ref("all");
    const queryFormRef = ref<FormInst | null>(null);
    // const message = useMessage();
    const data = ref<tableDataItem[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "广告",
        key: "advertisementImageUrl",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(row: tableDataItem) {
          return h(NImage as any, {
            src: row.advertisementImageUrl,
            width: 30,
          });
        },
      },
      {
        title: "广告开通城市",
        key: "cityName",
        ellipsis: {
          tooltip: true,
        },
        align: "center",
      },
      {
        title: "广告标题",
        key: "advertisementTitle",
        ellipsis: {
          tooltip: true,
        },
        align: "center",
      },
      {
        title: "广告生效时间",
        key: "advertisementEffectiveTimeBegin",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "广告失效时间",
        key: "advertisementEffectiveTimeEnd",
        align: "center",
      },
      {
        title: "广告H5url",
        key: "advertisementH5Url",
        align: "center",
      },
      {
        title: "排序",
        key: "advertisementSeq",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "200px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "前移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowBackIcon,
                onClick: handleUp.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "后移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowIcon,
                onClick: handleDown.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                icon: RemoveIcon,
                isIconBtn: true,
                secondary: true,
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

    async function handleValidate() {
      try {
        await queryFormRef.value?.validate();
        getData({ pageIndex: 1, pageSize: 10 });
      } catch (err) {
        console.log(err);
      }
    }

    onMounted(() => {
      getOpenCity();
      getData({ pageIndex: 1, pageSize: 10 });
    });

    async function getOpenCity() {
      try {
        let res = await getAllOpenCity();
        openCityData.value = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
          };
          return obj;
        });
        openCityData.value.unshift({ label: "不限", value: "all" });
      } catch (err) {
        console.log(err);
      }
    }

    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { cityCodeEq: cityCodeEq.value };
        let res = await getAdPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleUp(record: Recordable) {
      console.log("点击了编辑", record.openCityAdvertisementId);
    }
    function handleDown(record: Recordable) {
      console.log("点击了编辑", record.openCityAdvertisementId);
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.openCityAdvertisementId);
      const { openDrawer } = adDrawerRef.value;
      openDrawer(record.openCityAdvertisementId);
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = adDrawerRef.value;
      openDrawer("添加城市广告", cityCodeEq.value);
    }
    function handleRemove(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationState) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationState) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      openCityData,
      data,
      cityCodeEq,
      queryFormRef,
      loading,
      adDrawerRef,
      basicTableRef,
      statusOptions,
      columns,
      itemCount,
      getRowKeyId: (row: tableDataItem) => row.openCityAdvertisementId,
      queryRule: {
        trigger: ["input", "blur"],
        validator() {
          if (cityCodeEq.value === null) {
            return new Error("选择开通城市");
          }
        },
      },

      reloadPage,
      handleAdd,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleValidate,
    };
  },
});
</script>
