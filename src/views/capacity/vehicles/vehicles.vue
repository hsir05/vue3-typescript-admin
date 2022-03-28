<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      :rule="rule"
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="车牌号" path="plageNumber">
        <n-input
          v-model:value="queryValue.plageNumber"
          clearable
          placeholder="输入车牌号"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item label="运营企业" path="companyName">
        <n-select
          clearable
          style="width: 150px"
          v-model:value="queryValue.companyName"
          placeholder="选择运营企业"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="车辆类型" path="vehicleType">
        <n-select
          clearable
          filterable
          style="width: 150px"
          v-model:value="queryValue.vehicleType"
          placeholder="选择车辆类型"
          @update:value="handleUpdateValue"
          :options="vehicleTypeList.result.vehicleTypeList"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :scroll-x="1200"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <VehiclesDrawer ref="vehiclesDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
    <TraCerDrawer ref="traCerDrawerRef" :width="500" @on-save-after="handleTraSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";

import {
  CreateOutline as CreateIcon,
  EyeOutline as EyeIcon,
  SyncCircleOutline as SyncCirIcon,
  GitCompareOutline as GitCompareIcon,
  ImageOutline as ImageIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import VehiclesDrawer from "./vehiclesDrawer.vue";
import TraCerDrawer from "./traCerDrawer.vue";
import { tableDataItem } from "./type";
import { data } from "./data";
import { NTag } from "naive-ui";
// import { getUsers } from "@/api/system/user";
import { PaginationState } from "@/api/type";
import vehicleTypeList from "@/config/vehicleTypeList.json";
export default defineComponent({
  name: "Vehicles",
  components: { BasicTable, VehiclesDrawer, TraCerDrawer },
  setup() {
    const loading = ref(false);
    const vehiclesDrawerRef = ref();
    const traCerDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      plageNumber: null,
      companyName: null,
      vehicleType: null,
    });

    // const data = ref<tableDataItem[]>([]);

    const columns = [
      { type: "selection", align: "center" },
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 60,
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      { title: "车牌号", key: "plageNumber", width: 100, align: "center" },
      {
        title: "车辆品牌",
        key: "brand",
        width: 100,
        align: "center",
      },
      {
        title: "车系",
        key: "carSeies",
        width: 100,
        align: "center",
      },
      {
        title: "车辆型号",
        key: "carType",
        width: 100,
        align: "center",
      },

      {
        title: "车辆颜色",
        key: "color",
        width: 110,
        align: "center",
      },
      {
        title: "核定载客位",
        key: "plate",
        width: 100,
        align: "center",
      },
      {
        title: "运营企业",
        key: "companyName",
        width: 110,
        align: "center",
      },
      {
        title: "车辆类型",
        key: "vehiclesType",
        width: 110,
        align: "center",
      },
      {
        title: "状态",
        key: "lock",
        width: 70,
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.lock === 1 ? "success" : "error",
            },
            {
              default: () => (row.lock === 1 ? "正常" : "锁定"),
            }
          );
        },
      },
      {
        title: "添加时间",
        key: "create_time",
        width: 95,
        align: "center",
      },

      {
        title: "操作",
        key: "action",
        align: "center",
        width: "220px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: hanldleSee.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑基本信息",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑运输证照片信息",
                type: "primary",
                icon: ImageIcon,
                isIconBtn: true,
                onClick: handleTraCert.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "里程清零",
                type: "primary",
                icon: SyncCirIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "车辆转移",
                type: "primary",
                icon: GitCompareIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    // onMounted(() => {
    //   getData({ page: 1, pageSize: 10 });
    // });

    // const getData = async (pagination: PaginationState) => {
    //   loading.value = true;
    //   try {
    //     let res = await getUsers({ ...pagination, ...queryValue.value });
    //     // data.value = res.data;
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
    function hanldleSee(record: Recordable) {
      console.log(record);
      const { openDrawer } = vehiclesDrawerRef.value;
      openDrawer("查看", "see");
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = vehiclesDrawerRef.value;
      openDrawer("编辑车辆", record);
    }
    function handleTraCert(record: Recordable) {
      const { openDrawer } = traCerDrawerRef.value;
      openDrawer("编辑运输证照片信息", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = vehiclesDrawerRef.value;
      openDrawer("新增用户");
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = { plageNumber: null, companyName: null, vehicleType: null };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    };

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
    function handleTraSaveAfter() {
      console.log("运输证处理");
    }

    function handleUpdateValue() {}

    return {
      queryValue,
      data,
      loading,
      vehiclesDrawerRef,
      traCerDrawerRef,
      basicTableRef,
      columns,
      itemCount,
      rule: {
        companyName: { required: true, trigger: ["blur", "input"], message: "请选择运营企业名称" },
        openArea: { required: true, trigger: ["blur", "input"], message: "请选择开通区域" },
      },
      options: [],
      vehicleTypeList,

      reloadPage,
      handleAdd,
      handleBatch,
      searchHandle,
      reset,
      handleCheckRow,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleTraSaveAfter,
      handleUpdateValue,
    };
  },
});
</script>
