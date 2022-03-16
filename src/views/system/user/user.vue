<template>
  <div class="h-full box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="70"
      class="pt-15px pb-15px bg-white"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="帐号" path="account">
        <n-input
          v-model:value="queryValue.account"
          clearable
          placeholder="输入帐号"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="用户名称" path="name">
        <n-input
          v-model:value="queryValue.name"
          clearable
          placeholder="输入用户名称"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="电话号码" path="phone">
        <n-input
          v-model:value="queryValue.phone"
          clearable
          placeholder="输入电话号码"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="状态" path="radioGroupValue">
        <n-radio-group v-model:value="queryValue.status">
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

    <UserDrawer ref="userDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import { NTag } from "naive-ui";
import UserDrawer from "./userDrawer.vue";
import { tableDataItem } from "./type";
import { PaginationProps } from "@/interface/table/table";
import { statusOptions } from "./data";
import { getUsers } from "@/api/system/user";
export default defineComponent({
  name: "User",
  components: { BasicTable, UserDrawer },
  setup() {
    const loading = ref(true);
    const userDrawerRef = ref();
    const basicTableRef = ref();
    const queryValue = ref({
      name: "",
      account: "",
      phone: "",
      status: "",
    });

    const data = ref<tableDataItem[]>([]);

    const columns = [
      {
        type: "selection",
      },
      {
        title: "帐号",
        key: "account",
        align: "center",
      },
      {
        title: "名称",
        key: "name",
        align: "center",
      },
      {
        title: "性别",
        key: "sex",
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: "info",
            },
            {
              default: () => (row.sex === 1 ? "男" : "女"),
            }
          );
        },
      },
      {
        title: "电话",
        key: "phone",
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
        title: "创建时间",
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

    onMounted(async () => {
      try {
        let res = await getUsers();
        data.value = res.data;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    });

    // nextTick(() => {
    //   const { page } = basicTableRef.value;
    //   console.log(page);
    // });

    function handleCheckRow(rowKeys: string[]) {
      console.log("选择了", rowKeys);
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = userDrawerRef.value;
      openDrawer("编辑用户", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = userDrawerRef.value;
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
      queryValue.value = { name: "", account: "", phone: "", status: "" };
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
      queryValue,
      data,
      loading,
      userDrawerRef,
      basicTableRef,
      statusOptions,
      columns,

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
