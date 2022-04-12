<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <div class="flex-align-start pt-15px mb-10px bg-white">
      <n-form-item
        ref="queryFormRef"
        :rule="queryRule"
        label-width="90"
        label="开通城市"
        label-placement="left"
      >
        <n-select
          v-model:value="cityCode"
          clearable
          filterable
          placeholder="选择开通城市"
          style="width: 260px"
          :options="options"
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

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <AdDrawer ref="adDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  TrashOutline as RemoveIcon,
  CreateOutline as CreateIcon,
  ArrowBackCircleOutline as ArrowBackIcon,
  ArrowForwardCircleOutline as ArrowIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import AdDrawer from "./adDrawer.vue";
import { tableDataItem } from "./type";
import { statusOptions } from "@/config/form";
// import { getUsers } from "@/api/system/user";
import { PaginationState } from "@/api/type";
import { FormInst, useMessage, NTag, NImage } from "naive-ui";
export default defineComponent({
  name: "Ad",
  components: { BasicTable, AdDrawer },
  setup() {
    const loading = ref(false);
    const adDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);

    const cityCode = ref(null);
    const queryFormRef = ref<FormInst | null>(null);
    const message = useMessage();

    const data = ref<tableDataItem[]>([
      {
        id: "123123",
        title: "string",
        adUrl:
          "https://yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin-chuxing.oss-cn-beijing.aliyuncs.com/yimin_advertisement/images/400df05c-bb6b-49af-b1ee-ea7a7a309bb0.jpg",
        cityName: "string",
        cityCode: "string",
        startTime: "string",
        endTime: "string",
        h5Url: "string",
        sort: 23,
        status: 1,
      },
    ]);

    const columns = [
      {
        type: "selection",
        align: "center",
      },
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
        key: "adUrl",
        align: "center",
        render(row: tableDataItem) {
          return h(NImage as any, {
            src: row.adUrl,
            width: 90,
          });
        },
      },
      {
        title: "广告开通城市",
        key: "cityName",
        align: "center",
      },
      {
        title: "广告标题",
        key: "title",
        align: "center",
      },
      {
        title: "广告生效时间",
        key: "startTime",
        align: "center",
      },
      {
        title: "广告失效时间",
        key: "endTime",
        align: "center",
      },
      {
        title: "广告H5url",
        key: "h5Url",
        align: "center",
      },
      {
        title: "序列",
        key: "sort",
        align: "center",
      },
      {
        title: "状态",
        key: "status",
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.status === 1 ? "success" : "error",
            },
            {
              default: () => (row.status === 1 ? "正常" : "锁定"),
            }
          );
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
        console.log(cityCode.value);
      } catch (err) {
        console.log(err);
        message.error("验证失败");
      }
    }

    // onMounted(() => {
    //   getData({ page: 1, pageSize: 10 });
    // });

    // const getData = async (pagination: PaginationState) => {
    //   loading.value = true;
    //   try {
    //     let res = await getUsers({ ...pagination, cityCode: cityCode.value });
    //     data.value = res.data;
    //     itemCount.value = res.itemCount;
    //     loading.value = false;
    //   } catch (err) {
    //     console.log(err);
    //     loading.value = false;
    //   }
    // };

    // nextTick(() => {
    //   const { page } = basicTableRef.value;
    //   console.log(page);
    // });

    function handleCheckRow(rowKeys: string[]) {
      console.log("选择了", rowKeys);
    }

    function handleUp(record: Recordable) {
      console.log("点击了编辑", record.id);
    }
    function handleDown(record: Recordable) {
      console.log("点击了编辑", record.id);
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = adDrawerRef.value;
      openDrawer("编辑广告", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = adDrawerRef.value;
      openDrawer("添加城市广告", cityCode.value);
    }
    function handleRemove(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationState) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationState) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      //   getData({ page: 1, pageSize: 10 });
    }

    return {
      options: [],
      data,
      cityCode,
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
          if (cityCode.value === null) {
            return new Error("选择开通城市");
          }
        },
      },

      reloadPage,
      handleAdd,
      handleBatch,
      handleCheckRow,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleValidate,
    };
  },
});
</script>
