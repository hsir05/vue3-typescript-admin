<template>
  <div class="h-full box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="90"
      class="pt-15px pb-15px bg-white"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="角色名称" path="name">
        <n-input v-model:value="queryValue.name" clearable placeholder="输入角色名称" />
      </n-form-item>

      <n-form-item label="状态" path="radioGroupValue">
        <n-radio-group v-model:value="queryValue.status" style="width: 200px">
          <n-radio value>全部</n-radio>
          <n-radio :value="item.value" v-for="item in statusOptions" :key="item.value">{{
            item.label
          }}</n-radio>
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
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />

    <RoleDrawer ref="roleDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import TableActions from "@/components/TableActions/TableActions.vue";
import { PaginationProps } from "@/interface/table/table";
import BasicTable from "@/components/Table/Table.vue";
import RoleDrawer from "./roleDrawer.vue";
import { NTag } from "naive-ui";
import { data, statusOptions } from "./data";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "Role",
  components: { BasicTable, RoleDrawer },
  setup() {
    const loading = ref(false);
    const roleDrawerRef = ref();
    const basicTableRef = ref();
    const queryValue = ref({
      name: "",
      status: "",
    });

    const columns = [
      {
        type: "selection",
      },
      {
        title: "角色名称",
        key: "name",
        align: "center",
      },
      {
        title: "父级",
        key: "parentId",
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
        title: "描述",
        key: "descript",
        align: "center",
      },
      {
        title: "角色添加时间",
        key: "create_time",
        align: "center",
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
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                icon: RemoveIcon,
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

    function handleCheckRow(rowKeys: string[]) {
      console.log("选择了", rowKeys);
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = roleDrawerRef.value;
      openDrawer("编辑用户", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = roleDrawerRef.value;
      openDrawer("新增用户");
    }
    function handleRemove(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
    };
    const reset = () => {
      queryValue.value = { name: "", status: "" };
    };

    function reloadPage() {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    }

    function handlePage(pagination: PaginationProps) {
      console.log(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationProps) {
      console.log(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
    }

    return {
      loading,
      queryValue,
      data,
      roleDrawerRef,
      basicTableRef,
      statusOptions,
      columns,

      reloadPage,
      handleAdd,
      handleBatch,
      searchHandle,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      reset,
      handleCheckRow,
    };
  },
});
</script>
