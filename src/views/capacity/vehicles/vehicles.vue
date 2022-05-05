<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      :rule="rule"
      label-placement="left"
      label-width="80"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="车牌号" path="plateNumberLike">
        <n-input
          v-model:value="queryValue.plateNumberLike"
          clearable
          placeholder="输入车牌号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="运营企业" path="operationCompanyIdEq">
        <n-select
          clearable
          style="width: 280px"
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择运营企业"
          @update:value="handleUpdateValue"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item label="车辆类型" path="vehicleTypeIdEq">
        <n-select
          clearable
          filterable
          style="width: 150px"
          v-model:value="queryValue.vehicleTypeIdEq"
          placeholder="选择车辆类型"
          @update:value="handleUpdateValue"
          :options="vehicleTypeData"
        />
      </n-form-item>

      <n-form-item label="是否锁定" path="vehicleStateEq">
        <n-radio-group v-model:value="queryValue.vehicleStateEq">
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
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <VehiclesDrawer ref="vehiclesDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
    <TraCerDrawer ref="traCerDrawerRef" :width="500" @on-save-after="handleTraSaveAfter" />
    <TransferDrawer ref="TransferDrawerRef" :width="650" @on-save-after="handleTraSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
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
import { stateOptions } from "@/config/form";
import { tableDataItem } from "./type";
import { useMessage, NTag } from "naive-ui";
import { getVehiclePage, initMileage } from "@/api/capacity/capacity";
import { getVehicleType } from "@/api/operate/operate";
import { getAllOperateCompany } from "@/api/common/common";
import { PaginationState } from "@/api/type";
import TransferDrawer from "./transferDrawer.vue";
import dayjs from "dayjs";
export default defineComponent({
  name: "Vehicles",
  components: { BasicTable, VehiclesDrawer, TraCerDrawer, TransferDrawer },
  setup() {
    const loading = ref(false);
    const message = useMessage();
    const vehiclesDrawerRef = ref();
    const traCerDrawerRef = ref();
    const basicTableRef = ref();
    const TransferDrawerRef = ref();
    const itemCount = ref(null);
    const companyData = ref([]);
    const vehicleTypeData = ref([]);
    const queryValue = ref({
      operationCompanyIdEq: null,
      plateNumberLike: null,
      vehicleTypeIdEq: null,
      vehicleStateEq: null,
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
      { title: "车牌号", key: "plateNumber", width: 100, align: "center" },
      {
        title: "车辆品牌",
        key: "vehicleBrand",
        width: 100,
        align: "center",
      },
      {
        title: "车系",
        key: "vehicleSeries",
        width: 100,
        align: "center",
      },
      {
        title: "车辆型号",
        key: "vehicleModel",
        width: 100,
        align: "center",
      },

      {
        title: "车辆颜色",
        key: "vehicleColor",
        width: 110,
        align: "center",
      },
      {
        title: "核定载客位",
        key: "vehicleSeats",
        width: 100,
        align: "center",
      },
      {
        title: "运营企业",
        key: "operationCompanyName",
        width: 110,
        align: "center",
      },
      {
        title: "车辆类型",
        key: "vehicleTypeName",
        width: 110,
        align: "center",
      },
      {
        title: "当前里程",
        key: "vehicleCurrentMileage",
        width: 110,
        align: "center",
      },
      {
        title: "状态",
        key: "vehicleState",
        width: 70,
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.vehicleState === 0 ? "success" : "error",
            },
            {
              default: () => (row.vehicleState === 0 ? "正常" : "锁定"),
            }
          );
        },
      },
      {
        title: "添加时间",
        key: "createTime",
        width: 95,
        align: "center",
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
                onClick: handleInitMileage.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "车辆转移",
                type: "primary",
                icon: GitCompareIcon,
                isIconBtn: true,
                onClick: handleTransfer.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getAllCompanyData();
      getAllVehicleTypeData();
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
    const getAllVehicleTypeData = async () => {
      try {
        let res = await getVehicleType({ operationCompanyId: "" });
        vehicleTypeData.value = res.data.map(
          (item: { vehicleTypeName: string; vehicleTypeId: string }) => {
            let obj = {
              label: item.vehicleTypeName,
              value: item.vehicleTypeId,
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
        let res = await getVehiclePage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleCheckRow(rowKeys: string[]) {
      console.log("选择了", rowKeys);
    }
    function hanldleSee(record: Recordable) {
      console.log(record);
      const { openDrawer } = vehiclesDrawerRef.value;
      openDrawer("查看车辆", record, "see");
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = vehiclesDrawerRef.value;
      openDrawer("编辑车辆", record, "edit");
    }
    async function handleTransfer(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = TransferDrawerRef.value;
      openDrawer(record);
    }
    function handleTraCert(record: Recordable) {
      const { openDrawer } = traCerDrawerRef.value;
      openDrawer("编辑运输证照片信息", record);
    }
    async function handleInitMileage(record: Recordable) {
      try {
        loading.value = true;
        let res = await initMileage({
          operationCompanyVehicleId: record.operationCompanyVehicleId,
        });
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
        operationCompanyIdEq: null,
        plateNumberLike: null,
        vehicleTypeIdEq: null,
        vehicleStateEq: null,
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
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
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
      vehiclesDrawerRef,
      TransferDrawerRef,
      traCerDrawerRef,
      basicTableRef,
      stateOptions,
      columns,
      itemCount,
      getRowKeyId: (row: tableDataItem) => row.operationCompanyVehicleId,

      rule: {
        companyName: { required: true, trigger: ["blur", "input"], message: "请选择运营企业名称" },
        openArea: { required: true, trigger: ["blur", "input"], message: "请选择开通区域" },
      },
      options: [],
      companyData,
      vehicleTypeData,

      reloadPage,
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
