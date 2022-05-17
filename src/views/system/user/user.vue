<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="70"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="帐号" path="accountLike">
        <n-input
          v-model:value="queryValue.accountLike"
          clearable
          placeholder="输入帐号"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="用户名称" path="nameLike">
        <n-input
          v-model:value="queryValue.nameLike"
          clearable
          placeholder="输入用户名称"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="状态" path="stateEq">
        <n-radio-group v-model:value="queryValue.stateEq">
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
      :loading="loading"
      :isAddBtn="true"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
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
import { NTag, useMessage } from "naive-ui";
import UserDrawer from "./userDrawer.vue";
import { TableItemInter } from "./type";
import { lockOptions } from "@/config/form";
import { getUsersPage, removeUser } from "@/api/system/system";
import { PaginationInter } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "User",
  components: { BasicTable, UserDrawer },
  setup() {
    const loading = ref(true);
    const userDrawerRef = ref();
    const basicTableRef = ref();
    const message = useMessage();
    const itemCount = ref(null);
    const queryValue = ref({
      nameLike: null,
      stateEq: null,
      accountLike: null,
      createTimeGe: null,
      createTimeLe: null,
    });

    const data = ref<TableItemInter[]>([]);

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
        render(_: TableItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
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
        render(row: TableItemInter) {
          return h(
            NTag,
            {
              type: "success",
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
        title: "邮箱",
        key: "email",
        align: "center",
      },
      {
        title: "角色",
        key: "roles",
        align: "center",
        render(row: TableItemInter) {
          return h(
            "span",
            row.roles.reduce((pre, next) => (pre += next.roleName), "")
          );
        },
      },
      {
        title: "状态",
        key: "state",
        align: "center",
        render(row: TableItemInter) {
          return h(
            NTag,
            {
              type: row.state === 1 ? "error" : "success",
            },
            {
              default: () => (row.state === 1 ? "锁定" : "正常"),
            }
          );
        },
      },
      {
        title: "创建时间",
        key: "createTime",
        align: "center",
        render(record: TableItemInter) {
          return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm"));
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
                onClick: handleEdit.bind(null, record.adminId),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                isIconBtn: true,
                icon: RemoveIcon,
                secondary: true,
                auth: ["dict002"],
                popConfirm: {
                  onPositiveClick: handleRemove.bind(null, record.adminId),
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

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getUsersPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleEdit(adminId: string) {
      const { openDrawer } = userDrawerRef.value;
      openDrawer("编辑用户", adminId);
    }

    function handleAdd() {
      const { openDrawer } = userDrawerRef.value;
      openDrawer("新增用户");
    }
    async function handleRemove(adminId: string) {
      try {
        loading.value = true;
        let res = await removeUser({ adminId });
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
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        nameLike: null,
        stateEq: null,
        accountLike: null,
        createTimeGe: null,
        createTimeLe: null,
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
      queryValue,
      data,
      loading,
      userDrawerRef,
      basicTableRef,
      lockOptions,
      columns,
      getRowKeyId: (row: TableItemInter) => row.adminId,
      itemCount,

      reloadPage,
      handleAdd,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
