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
      <n-form-item label="运营企业名称" path="companyName">
        <n-select
          clearable
          style="width: 150px"
          v-model:value="queryValue.companyName"
          placeholder="选择运营企业名称"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="开通区域" path="openArea">
        <n-select
          clearable
          filterable
          style="width: 150px"
          v-model:value="queryValue.openArea"
          placeholder="选择开通区域"
          @update:value="handleUpdateValue"
          :options="options"
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
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <OrderComDrawer ref="orderComDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";

import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import OrderComDrawer from "./orderComDrawer.vue";
import { tableDataItem } from "./type";
import { data } from "./data";
// import { getUsers } from "@/api/system/user";
import { PaginationState } from "@/api/type";
export default defineComponent({
  name: "OrderCommissions",
  components: { BasicTable, OrderComDrawer },
  setup() {
    const loading = ref(false);
    const orderComDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      companyName: null,
      openArea: null,
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
        title: "流量方",
        key: "agent",
        align: "center",
      },
      {
        title: "订单业务类型",
        key: "account",
        align: "center",
      },
      {
        title: "订单类型",
        key: "contacts",
        align: "center",
      },
      {
        title: "流量方比率",
        key: "sex",
        width: 100,
        align: "center",
      },

      {
        title: "平台比率",
        key: "phone",
        width: 110,
        align: "center",
      },
      {
        title: "代理商比率",
        key: "phone",
        width: 110,
        align: "center",
      },
      {
        title: "企业比例",
        key: "phone",
        width: 110,
        align: "center",
      },
      {
        title: "司机比率",
        key: "phone",
        width: 110,
        align: "center",
      },

      {
        title: "操作",
        key: "action",
        align: "center",
        width: "100px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
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

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = orderComDrawerRef.value;
      openDrawer("编辑用户", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = orderComDrawerRef.value;
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
      queryValue.value = { companyName: null, openArea: null };
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

    function handleUpdateValue() {}

    return {
      queryValue,
      data,
      loading,
      orderComDrawerRef,
      basicTableRef,
      columns,
      itemCount,
      rule: {
        companyName: { required: true, trigger: ["blur", "input"], message: "请选择运营企业名称" },
        openArea: { required: true, trigger: ["blur", "input"], message: "请选择开通区域" },
      },
      options: [],

      reloadPage,
      handleAdd,
      handleBatch,
      searchHandle,
      reset,
      handleCheckRow,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleUpdateValue,
    };
  },
});
</script>
