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
      <n-form-item label="权限名称" path="nameLike">
        <n-input v-model:value="queryValue.nameLike" clearable placeholder="输入权限名称" />
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

    <AuthDrawer ref="authDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import TableActions from "@/components/TableActions/TableActions.vue";
import BasicTable from "@/components/Table/Table.vue";
import AuthDrawer from "./authDrawer.vue";
import { NButton, useMessage } from "naive-ui";
import { lockOptions } from "@/config/form";
import { TableDataItemInter } from "./type";
import { PaginationInter } from "@/api/type";
import { getAuthPage, removeAuth, modifyAuthState } from "@/api/system/system";
import dayjs from "dayjs";
export default defineComponent({
  name: "Roles",
  components: { BasicTable, AuthDrawer },
  setup() {
    const loading = ref(false);
    const authDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const message = useMessage();
    const queryValue = ref({
      nameLike: null,
      codeLike: null,
      urlLike: null,
      stateEq: null,
      createTimeGe: null,
      createTimeLe: null,
    });
    const data = ref<TableDataItemInter[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: TableDataItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "权限名称",
        key: "name",
        align: "center",
      },
      {
        title: "权限CODE",
        key: "code",
        align: "center",
      },
      {
        title: "状态",
        key: "state",
        align: "center",
        render(row: TableDataItemInter) {
          return h(
            NButton,
            {
              type: row.state === 1 ? "warning" : "success",
              size: "small",
              onClick: handleState.bind(null, row.authorityId),
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
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "200px",
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record.authorityId),
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
                  onPositiveClick: handleRemove.bind(null, record.authorityId),
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
        let res = await getAuthPage({ page, search: search });
        console.log(res.data);

        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    async function handleState(authorityId: string) {
      try {
        loading.value = true;
        let res = await modifyAuthState({ authorityId });
        message.success(window.$tips[res.code]);
        getData({ pageIndex: 1, pageSize: 10 });
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }

    function handleEdit(authorityId: string) {
      const { openDrawer } = authDrawerRef.value;
      openDrawer("编辑权限", authorityId);
    }
    function handleAdd() {
      const { openDrawer } = authDrawerRef.value;
      openDrawer("新增权限");
    }
    async function handleRemove(authorityId: string) {
      try {
        loading.value = true;
        let res = await removeAuth({ authorityId });
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
        codeLike: null,
        urlLike: null,
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
      authDrawerRef,
      basicTableRef,
      getRowKeyId: (row: TableDataItemInter) => row.authorityId,
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
