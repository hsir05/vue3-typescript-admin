<template>
  <div class="h-full box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="80"
      class="pt-15px pb-15px bg-white"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="菜单名称" path="name">
        <n-input v-model:value="queryValue.name" clearable placeholder="输入菜单名称" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>
    <!-- 表格 -->
    <BasicTable
      :data="data"
      :columns="columns"
      :loading="loading"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
    />

    <MenuDrawer ref="menuDrawerRef" :width="500" />
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref, unref } from "vue";
// import { useMessage } from "naive-ui";
import BasicTable from "@/components/Table/Table.vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import MenuDrawer from "./menuDrawer.vue";
import { tableDataItem } from "./type";
import { data } from "./data";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
export default defineComponent({
  name: "Menu",
  components: { BasicTable, MenuDrawer },
  setup() {
    const loading = ref(false);
    const queryValue = ref({
      name: "",
    });
    const menuDrawerRef = ref();

    const columns = [
      {
        type: "selection",
      },
      {
        title: "序号",
        key: "index",
        align: "center",
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "菜单名称",
        key: "name",
        align: "center",
      },
      {
        title: "图标",
        key: "icon",
        align: "center",
      },
      {
        title: "权限标识",
        key: "auth",
        align: "center",
      },
      {
        title: "组件",
        key: "component",
        align: "center",
      },
      {
        title: "排序",
        key: "sort",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
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
                  onPositiveClick: handlePositiveClick.bind(null, record),
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
      const { openDrawer } = menuDrawerRef.value;
      openDrawer("编辑菜单");
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = menuDrawerRef.value;
      openDrawer("新增菜单");
    }
    function handlePositiveClick(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }
    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
    };
    const reset = () => {
      unref(queryValue).name = "";
    };
    function reloadPage() {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    }

    return {
      loading,
      columns,
      data,
      queryValue,
      menuDrawerRef,

      reloadPage,
      handleAdd,
      handleBatch,
      searchHandle,
      reset,
      handleCheckRow,
    };
  },
});
</script>
<style lang="scss" scoped></style>
