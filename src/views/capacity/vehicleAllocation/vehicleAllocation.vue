<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="80"
      :style="{ flexWrap: 'wrap', justifyContent: 'flex-start' }"
      class="pt-15px pb-15px bg-white mb-5px"
      :model="queryValue"
    >
      <n-form-item label="车牌号" path="plate">
        <n-input
          v-model:value="queryValue.plate"
          clearable
          placeholder="输入车牌号"
          style="width: 160px"
        />
      </n-form-item>

      <n-form-item label="运营企业" path="companyName">
        <n-select
          clearable
          style="width: 160px"
          v-model:value="queryValue.companyName"
          placeholder="选择运营企业"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="司机工号" path="number">
        <n-input
          v-model:value="queryValue.number"
          clearable
          placeholder="输入司机工号"
          style="width: 160px"
        />
      </n-form-item>
      <n-form-item label="司机姓名" path="name">
        <n-input
          v-model:value="queryValue.name"
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
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <AgentDrawer ref="agentDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CarOutline as CarIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import AgentDrawer from "./vehicleAllDrawer.vue";
import { NTag } from "naive-ui";
import { tableDataItem } from "./type";
import { data } from "./data";
// import { getUsers } from "@/api/system/user";
import { PaginationState } from "@/api/type";
export default defineComponent({
  name: "VehicleAllocation",
  components: { BasicTable, AgentDrawer },
  setup() {
    const loading = ref(false);
    const agentDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      companyName: "",
      name: "",
      number: "",
      plate: "",
    });

    // const data = ref<tableDataItem[]>([]);

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
        key: "agent",
        align: "center",
      },
      {
        title: "车辆品牌",
        key: "account",
        align: "center",
      },
      {
        title: "车系",
        key: "contacts",
        align: "center",
      },
      {
        title: "车辆型号",
        key: "sex",
        width: 100,
        align: "center",
      },

      {
        title: "车辆类型",
        key: "phone",
        width: 100,
        align: "center",
      },
      {
        title: "运营企业",
        key: "phone",
        width: 110,
        align: "center",
      },
      {
        title: "当前绑定司机",
        key: "phone",
        width: 110,
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
              type: row.lock === 1 ? "success" : "error",
            },
            {
              default: () => (row.lock === 1 ? "正常" : "锁定"),
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

    function handleAlloca(record: Recordable) {
      console.log("点击了车辆分配", record.id);
      const { openDrawer } = agentDrawerRef.value;
      openDrawer("车辆分配", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = agentDrawerRef.value;
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
      queryValue.value = { name: "", number: "", companyName: "", plate: "" };
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

    return {
      queryValue,
      data,
      loading,
      agentDrawerRef,
      getRowKeyId: (row: tableDataItem) => row.id,
      options: [],
      basicTableRef,
      columns,
      itemCount,

      reloadPage,
      handleAdd,
      handleBatch,
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
