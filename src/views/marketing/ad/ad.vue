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
import { FormInst, useMessage, NImage } from "naive-ui";
import {
  TrashOutline as RemoveIcon,
  CreateOutline as CreateIcon,
  ArrowBackCircleOutline as ArrowBackIcon,
  ArrowForwardCircleOutline as ArrowIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import AdDrawer from "./adDrawer.vue";
import { TableDataItemInter } from "./type";
import { itemState, CityItemInter } from "@/interface/common/common";

import { statusOptions } from "@/config/form";
import { getAdPage, removeAd, upAdvertisement, downAdvertisement } from "@/api/marketing/marketing";
import { getAllOpenCity } from "@/api/common/common";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";

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
    const message = useMessage();
    const data = ref<TableDataItemInter[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: TableDataItemInter, rowIndex: number) {
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
        render(row: TableDataItemInter) {
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
        render(record: TableDataItemInter) {
          return h(
            "span",
            dayjs(record.advertisementEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "广告失效时间",
        key: "advertisementEffectiveTimeEnd",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(record: TableDataItemInter) {
          return h(
            "span",
            dayjs(record.advertisementEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "广告H5url",
        key: "advertisementH5Url",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
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
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "前移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowBackIcon,
                onClick: handleUp.bind(null, record.openCityAdvertisementId),
                auth: ["dict001"],
              },
              {
                label: "后移",
                type: "primary",
                isIconBtn: true,
                icon: ArrowIcon,
                onClick: handleDown.bind(null, record.openCityAdvertisementId),
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

    const getData = async (page: PaginationInter) => {
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

    async function handleUp(openCityAdvertisementId: string) {
      try {
        let res = await upAdvertisement({ openCityAdvertisementId });
        console.log(res);
        getData({ pageIndex: 1, pageSize: 10 });
        message.success(window.$tips[res.code]);
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }
    async function handleDown(openCityAdvertisementId: string) {
      try {
        let res = await downAdvertisement({ openCityAdvertisementId });
        console.log(res);
        getData({ pageIndex: 1, pageSize: 10 });
        message.success(window.$tips[res.code]);
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    function handleEdit(record: Recordable) {
      const { openDrawer } = adDrawerRef.value;
      openDrawer("编辑城市广告", record.openCityAdvertisementId);
    }
    function handleAdd() {
      const { openDrawer } = adDrawerRef.value;
      openDrawer("添加城市广告");
    }
    async function handleRemove(record: Recordable) {
      try {
        loading.value = true;
        let res = await removeAd({ openCityAdvertisementId: record.openCityAdvertisementId });
        console.log(res);
        getData({ pageIndex: 1, pageSize: 10 });
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
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
