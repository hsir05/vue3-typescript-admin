<template>
  <div class="h-full box-border overflow-hidden">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="90"
      class="pt-15px pb-15px mb-10px bg-white"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="角色名称" path="nameLike">
        <n-input v-model:value="queryValue.nameLike" clearable placeholder="输入角色名称" />
      </n-form-item>

      <n-form-item label="状态" path="stateEq">
        <n-radio-group v-model:value="queryValue.stateEq" style="width: 200px">
          <n-radio :value="null">全部</n-radio>
          <n-radio :value="item.value" v-for="item in lockOptions" :key="item.value">{{
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
      :row-key="getRowKeyId"
      :isAddBtn="true"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />

    <RoleDrawer ref="roleDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import TableActions from "@/components/TableActions/TableActions.vue";
import BasicTable from "@/components/Table/Table.vue";
import RoleDrawer from "./roleDrawer.vue";
import { NButton, useMessage } from "naive-ui";
import { lockOptions } from "@/config/form";
import { TableItemInter } from "./type";
import { PaginationInter } from "@/api/type";
import { getRolesPage, removeRole, modifyRoleState } from "@/api/system/system";
import dayjs from "dayjs";
export default defineComponent({
  name: "Roles",
  components: { BasicTable, RoleDrawer },
  setup() {
    const loading = ref(false);
    const roleDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const message = useMessage();
    const queryValue = ref({
      nameLike: null,
      stateEq: null,
      createTimeGe: null,
      createTimeLe: null,
    });
    const data = ref<TableItemInter[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: TableItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "角色名称",
        key: "name",
        align: "center",
      },

      {
        title: "描述",
        key: "description",
        align: "center",
      },
      {
        title: "角色创建时间",
        key: "createTime",
        align: "center",
        render(record: TableItemInter) {
          return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "状态",
        key: "state",
        align: "center",
        render(row: TableItemInter) {
          return h(
            NButton,
            {
              type: row.state === 1 ? "warning" : "success",
              size: "small",
              onClick: handleState.bind(null, row.roleId),
            },
            {
              default: () => (row.state === 1 ? "锁定" : "正常"),
            }
          );
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "200px",
        render(record: TableItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record.roleId),
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
                  onPositiveClick: handleRemove.bind(null, record.roleId),
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

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getRolesPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    async function handleState(roleId: string) {
      try {
        loading.value = true;
        let res = await modifyRoleState({ roleId });
        message.success(window.$tips[res.code]);
        getData({ pageIndex: 1, pageSize: 10 });
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    function handleEdit(roleId: string) {
      const { openDrawer } = roleDrawerRef.value;
      openDrawer("编辑角色", roleId);
    }
    function handleAdd() {
      const { openDrawer } = roleDrawerRef.value;
      openDrawer("新增角色");
    }
    async function handleRemove(roleId: string) {
      try {
        loading.value = true;
        let res = await removeRole({ roleId });
        console.log(res);
        getData({ pageIndex: 1, pageSize: 10 });
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        nameLike: null,
        stateEq: null,
        createTimeGe: null,
        createTimeLe: null,
      };
    };

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      loading,
      queryValue,
      data,
      roleDrawerRef,
      basicTableRef,
      getRowKeyId: (row: TableItemInter) => row.roleId,
      lockOptions,
      itemCount,
      columns,

      reloadPage,
      handleAdd,
      searchHandle,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      reset,
    };
  },
});
</script>
