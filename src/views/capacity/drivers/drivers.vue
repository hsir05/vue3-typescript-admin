<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      :rule="rule"
      label-placement="left"
      :show-feedback="false"
      label-width="80"
      class="pt-15px bg-white pb-10px mb-5px flex-wrap"
      :model="queryValue"
    >
      <n-form-item label="司机工号" path="driverNoLike">
        <n-input
          v-model:value="queryValue.driverNoLike"
          clearable
          placeholder="输入司机工号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="司机姓名" path="driverFullNameLike">
        <n-input
          v-model:value="queryValue.driverFullNameLike"
          clearable
          placeholder="输入司机姓名"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="运营企业" path="operationCompanyIdEq">
        <n-select
          clearable
          style="width: 150px"
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择运营企业"
          @update:value="handleUpdateValue"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item label="司机状态" path="driverStateEq">
        <n-select
          clearable
          filterable
          style="width: 150px"
          v-model:value="queryValue.driverStateEq"
          placeholder="选择司机状态"
          @update:value="handleUpdateValue"
          :options="vehicleTypeData"
        />
      </n-form-item>

      <n-form-item label="是否锁定" path="driverLockEq">
        <n-radio-group v-model:value="queryValue.driverLockEq">
          <n-space>
            <n-radio :value="item.value" v-for="item in stateOptions" :key="item.value">{{
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
      :row-key="getRowKeyId"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <DriversDrawer ref="driversDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
    <DriverCerDrawer ref="driverCerDrawerRef" :width="500" @on-save-after="handleTraSaveAfter" />
    <AddressDrawer ref="addressDrawerRef" @on-save-after="handleTraSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
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
import { stateOptions } from "@/config/form";
import { getAllOperateCompany } from "@/api/common/common";
import { tableDataItem } from "./type";
import { useMessage, NTag } from "naive-ui";
import { getDriverPage, initPassword } from "@/api/capacity/capacity";
import { PaginationState } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "Drivers",
  components: { BasicTable, DriversDrawer, AddressDrawer, DriverCerDrawer },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const driversDrawerRef = ref();
    const vehicleTypeData = ref([]);
    const companyData = ref([]);

    const basicTableRef = ref();
    const addressDrawerRef = ref();
    const driverCerDrawerRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      driverNoLike: null,
      operationCompanyIdEq: null,
      driverFullNameLike: null,
      driverStateEq: null,
      driverLockEq: null,
    });

    const data = ref<tableDataItem[]>([]);

    const columns = [
      //   { type: "selection", align: "center" },
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 60,
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      { title: "司机工号", key: "driverNo", width: 100, align: "center" },
      {
        title: "司机姓名",
        key: "driverFullName",
        width: 100,
        align: "center",
      },
      {
        title: "司机性别",
        key: "driverGender",
        width: 100,
        align: "center",
        render(row: tableDataItem) {
          return h(
            "span",
            `${row.driverGender === 1 ? "男" : row.driverGender === 0 ? "女" : "未知"}`
          );
        },
      },
      {
        title: "司机手机号",
        key: "driverPhone",
        width: 100,
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },

      {
        title: "司机民族",
        key: "driverNation",
        width: 110,
        align: "center",
      },
      {
        title: "司机学历",
        key: "driverEducation",
        width: 100,
        align: "center",
      },
      {
        title: "运营企业",
        key: "operationCompany",
        width: 110,
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "是否锁定",
        key: "driverLock",
        width: 110,
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.driverLock === "正常" ? "success" : "error",
            },
            {
              default: () => row.driverLock,
            }
          );
        },
      },
      {
        title: "司机状态",
        key: "driverState",
        width: 80,
        align: "center",
      },
      {
        title: "添加时间",
        key: "createTime",
        width: 95,
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(record: tableDataItem) {
          return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm"));
        },
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

    onMounted(() => {
      getAllCompanyData();
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        companyData.value = res.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getDriverPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function hanldleSee(record: Recordable) {
      console.log(record);
      const { openDrawer } = driversDrawerRef.value;
      openDrawer("查看司机信息", record, true);
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = driversDrawerRef.value;
      openDrawer("编辑司机信息", record, false);
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

    async function resetPassword(record: Recordable) {
      try {
        loading.value = true;
        let res = await initPassword({ driverId: record.driverId });
        console.log(res);
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        driverNoLike: null,
        operationCompanyIdEq: null,
        driverFullNameLike: null,
        driverStateEq: null,
        driverLockEq: null,
      };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };

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
      //   getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
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
      getRowKeyId: (row: tableDataItem) => row.driverId,

      rule: {
        companyName: { required: true, trigger: ["blur", "input"], message: "请选择运营企业名称" },
        openArea: { required: true, trigger: ["blur", "input"], message: "请选择开通区域" },
      },
      options: [],
      companyData,
      stateOptions,
      vehicleTypeData,

      reloadPage,
      searchHandle,
      reset,
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
