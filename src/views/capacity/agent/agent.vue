<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="代理商名称" path="operationCompanyAgencyNamelike">
        <n-input
          v-model:value="queryValue.operationCompanyAgencyNamelike"
          clearable
          placeholder="输入代理商名称"
          style="width: 200px"
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
      :isAddBtn="true"
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
    <AgentDrawer ref="agentDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";

import {
  TrashOutline as RemoveIcon,
  CreateOutline as CreateIcon,
  EyeOutline as EyeIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import AgentDrawer from "./agentDrawer.vue";
import { NTag } from "naive-ui";
import { tableDataItem } from "./type";
import { getAgencyPage } from "@/api/capacity/capacity";
import { PaginationState } from "@/api/type";
export default defineComponent({
  name: "Agent",
  components: { BasicTable, AgentDrawer },
  setup() {
    const loading = ref(false);
    const agentDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      operationCompanyAgencyNamelike: "",
    });

    const data = ref([]);

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
        title: "代理商",
        key: "agent",
        align: "center",
      },
      {
        title: "登录账号",
        key: "account",
        align: "center",
      },
      {
        title: "联系人",
        key: "contacts",
        align: "center",
      },
      {
        title: "联系人性别",
        key: "sex",
        width: 100,
        align: "center",
      },

      {
        title: "联系人电话",
        key: "phone",
        width: 110,
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
        width: "130px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
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

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getAgencyPage({ page, search: search });
        console.log(res.data);

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

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = agentDrawerRef.value;
      openDrawer("编辑用户", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = agentDrawerRef.value;
      openDrawer("新增用户");
    }
    function handleRemove(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = { operationCompanyAgencyNamelike: "" };
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
