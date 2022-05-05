<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="80"
      :show-feedback="false"
      :style="{ flexWrap: 'wrap', justifyContent: 'flex-start' }"
      class="pt-15px pb-10px bg-white mb-5px"
      :model="queryValue"
    >
      <n-form-item label="车牌号" path="plateNumberLike">
        <n-input
          v-model:value="queryValue.plateNumberLike"
          clearable
          placeholder="输入车牌号"
          style="width: 160px"
        />
      </n-form-item>

      <n-form-item label="运营企业" path="operationCompanyIdEq">
        <n-select
          clearable
          style="width: 160px"
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择运营企业"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item label="司机工号" path="driverNoLike">
        <n-input
          v-model:value="queryValue.driverNoLike"
          clearable
          placeholder="输入司机工号"
          style="width: 160px"
        />
      </n-form-item>
      <n-form-item label="司机姓名" path="driverFullNameLike">
        <n-input
          v-model:value="queryValue.driverFullNameLike"
          clearable
          placeholder="输入司机姓名"
          style="width: 160px"
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
      :row-key="getRowKeyId"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <AgentDrawer ref="agentDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CarOutline as CarIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import AgentDrawer from "./vehicleAllDrawer.vue";
import { NTag } from "naive-ui";
import { getAllOperateCompany } from "@/api/common/common";
import { tableDataItem } from "./type";
import { getVehicleBindingPage } from "@/api/capacity/capacity";
import { PaginationState } from "@/api/type";
export default defineComponent({
  name: "VehicleAllocation",
  components: { BasicTable, AgentDrawer },
  setup() {
    const loading = ref(false);
    const agentDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const companyData = ref([]);
    const queryValue = ref({
      plateNumberLike: null,
      operationCompanyIdEq: null,
      driverFullNameLike: null,
      driverNoLike: null,
    });

    const data = ref<tableDataItem[]>([]);

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
        title: "车牌号",
        key: "plateNumber",
        align: "center",
      },
      {
        title: "车辆品牌",
        key: "vehicleBrand",
        align: "center",
      },
      {
        title: "车系",
        key: "vehicleSeries",
        align: "center",
      },
      {
        title: "车辆型号",
        key: "vehicleModel",
        align: "center",
      },

      {
        title: "车辆类型",
        key: "vehicleFuelTypes",
        align: "center",
      },
      {
        title: "运营企业",
        key: "operationCompanyName",
        align: "center",
      },
      {
        title: "当前绑定司机",
        key: "vehicleDrivingPermitType  ",
        align: "center",
      },
      {
        title: "车辆是否锁定",
        key: "status",
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.vehicleState === 1 ? "success" : "error",
            },
            {
              default: () => (row.vehicleState === 1 ? "正常" : "锁定"),
            }
          );
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "90px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "车辆分配",
                type: "primary",
                icon: CarIcon,
                isIconBtn: true,
                onClick: handleAlloca.bind(null, record),
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
        let res = await getVehicleBindingPage({ page, search: search });
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

    function handleAlloca(record: Recordable) {
      console.log("点击了车辆分配", record);
      const { openDrawer } = agentDrawerRef.value;
      openDrawer("车辆分配", record);
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
        plateNumberLike: null,
        operationCompanyIdEq: null,
        driverFullNameLike: null,
        driverNoLike: null,
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
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      queryValue,
      data,
      loading,
      agentDrawerRef,
      getRowKeyId: (row: tableDataItem) => row.operationCompanyVehicleId,
      companyData,
      basicTableRef,
      columns,
      itemCount,

      reloadPage,
      searchHandle,
      reset,
      handleCheckRow,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
