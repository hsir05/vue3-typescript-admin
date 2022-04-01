<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      :rule="rule"
      label-placement="left"
      label-width="80"
      class="pt-15px pb-15px bg-white mb-5px flex-wrap"
      :model="queryValue"
    >
      <n-form-item label="司机工号" path="number">
        <n-input
          v-model:value="queryValue.number"
          clearable
          placeholder="输入司机工号"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item label="司机姓名" path="name">
        <n-input
          v-model:value="queryValue.name"
          clearable
          placeholder="输入司机姓名"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item label="司机手机号" path="phone">
        <n-input
          v-model:value="queryValue.phone"
          clearable
          :maxlength="11"
          placeholder="输入司机手机号"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item label="运营企业" path="companyName">
        <n-select
          clearable
          style="width: 200px"
          v-model:value="queryValue.companyName"
          placeholder="选择运营企业"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="司机状态" path="status">
        <n-select
          clearable
          filterable
          style="width: 200px"
          v-model:value="queryValue.status"
          placeholder="选择司机状态"
          @update:value="handleUpdateValue"
          :options="vehicleTypeList.result.vehicleTypeList"
        />
      </n-form-item>

      <n-form-item label="是否锁定" path="lock">
        <n-radio-group v-model:value="queryValue.lock">
          <n-space>
            <n-radio :value="item.value" v-for="item in statusOptions" :key="item.value">{{
              item.label
            }}</n-radio>
          </n-space>
        </n-radio-group>
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
    <DriversDrawer ref="driversDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
    <DriverCerDrawer ref="driverCerDrawerRef" :width="500" @on-save-after="handleTraSaveAfter" />
    <AddressDrawer ref="addressDrawerRef" @on-save-after="handleTraSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";

import {
  CreateOutline as CreateIcon,
  EyeOutline as EyeIcon,
  LocationOutline as LocationIcon,
  ImageOutline as ImageIcon,
  RefreshCircleOutline as RefreshIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import DriversDrawer from "./driversDrawer.vue";
import AddressDrawer from "./addressDrawer.vue";
import DriverCerDrawer from "./driverCerDrawer.vue";
import { statusOptions } from "@/config/form";
import { tableDataItem } from "./type";
import { data } from "./data";
import { NTag } from "naive-ui";
// import { getUsers } from "@/api/system/user";
import { PaginationState } from "@/api/type";
import vehicleTypeList from "@/config/vehicleTypeList.json";
export default defineComponent({
  name: "Drivers",
  components: { BasicTable, DriversDrawer, AddressDrawer, DriverCerDrawer },
  setup() {
    const loading = ref(false);
    const driversDrawerRef = ref();
    const basicTableRef = ref();
    const addressDrawerRef = ref();
    const driverCerDrawerRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      number: null,
      companyName: null,
      phone: null,
      name: null,
      status: null,
      lock: 1,
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
      { title: "司机工号", key: "number", width: 100, align: "center" },
      {
        title: "司机姓名",
        key: "name",
        width: 100,
        align: "center",
      },
      {
        title: "司机性别",
        key: "sex",
        width: 100,
        align: "center",
      },
      {
        title: "司机手机号",
        key: "phone",
        width: 100,
        align: "center",
      },

      {
        title: "司机民族",
        key: "nation",
        width: 110,
        align: "center",
      },
      {
        title: "司机学历",
        key: "education",
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
        title: "是否锁定",
        key: "lock",
        width: 110,
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
        title: "司机状态",
        key: "status",
        width: 80,
        align: "center",
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
                label: "详情",
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
                label: "编辑司机家庭地址",
                type: "primary",
                icon: LocationIcon,
                isIconBtn: true,
                onClick: handleAddress.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "证件照片信息",
                type: "primary",
                icon: ImageIcon,
                isIconBtn: true,
                onClick: handleCert.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "还原密码",
                type: "primary",
                icon: RefreshIcon,
                isIconBtn: true,
                onClick: resetPassword.bind(null, record),
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
      const { openDrawer } = driversDrawerRef.value;
      openDrawer("查看", "see");
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = driversDrawerRef.value;
      openDrawer("编辑司机信息", record);
    }
    function handleCert(record: Recordable) {
      console.log("点击了证件", record.id);
      const { openDrawer } = driverCerDrawerRef.value;
      openDrawer("编辑司机证件信息", record);
    }
    function handleAddress(record: Recordable) {
      const { openDrawer } = addressDrawerRef.value;
      openDrawer("司机家庭地址编辑", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = driversDrawerRef.value;
      openDrawer("添加司机");
    }

    function resetPassword() {}

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        number: null,
        phone: null,
        companyName: null,
        status: null,
        name: null,
        lock: 1,
      };
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
      driversDrawerRef,
      driverCerDrawerRef,
      addressDrawerRef,
      basicTableRef,
      columns,
      itemCount,
      rule: {
        companyName: { required: true, trigger: ["blur", "input"], message: "请选择运营企业名称" },
        openArea: { required: true, trigger: ["blur", "input"], message: "请选择开通区域" },
      },
      options: [],
      statusOptions,
      vehicleTypeList,

      reloadPage,
      handleAdd,
      handleBatch,
      searchHandle,
      reset,
      handleCheckRow,
      handlePage,
      handlepagSize,
      resetPassword,
      handleSaveAfter,
      handleTraSaveAfter,
      handleUpdateValue,
    };
  },
});
</script>
