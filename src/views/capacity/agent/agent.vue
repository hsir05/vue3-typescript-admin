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
          v-model:value="queryValue.operationCompanyAgencyNameLike"
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
      :row-key="getRowKeyId"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <AgentDrawer ref="agentDrawerRef" :width="600" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import AgentDrawer from "./agentDrawer.vue";
import { NTag, useMessage } from "naive-ui";
import { tableDataItem } from "./type";
import { getAgencyPage, updateAgencyStatus } from "@/api/capacity/capacity";
import { PaginationInter } from "@/api/type";
import { sexEnum } from "@/enums/dict";
export default defineComponent({
  name: "Agent",
  components: { BasicTable, AgentDrawer },
  setup() {
    const loading = ref(false);
    const agentDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      operationCompanyAgencyNameLike: null,
    });

    const message = useMessage();

    const data = ref([]);

    const columns = [
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
        key: "operationCompanyAgencyName",
        align: "center",
      },
      {
        title: "登录账号",
        key: "companyLoginCredential.loginAccount",
        align: "center",
      },
      {
        title: "联系人",
        key: "operationCompanyAgencyContactName",
        align: "center",
      },
      {
        title: "联系人性别",
        key: "operationCompanyAgencyContactGender",
        width: 100,
        align: "center",
        render(row: tableDataItem) {
          return h("span", sexEnum[row.operationCompanyAgencyContactGender as number]);
        },
      },
      {
        title: "联系人电话",
        key: "operationCompanyAgencyContactPhone",
        width: 110,
        align: "center",
      },
      {
        title: "状态",
        key: "companyLoginCredential.loginCredentialState",
        align: "center",
        render(row: tableDataItem) {
          if (!row.companyLoginCredential) {
            return h("span", " ");
          } else {
            return h(
              NTag,
              {
                type: row.companyLoginCredential.loginCredentialState === 0 ? "success" : "error",
                onClick: handleStatus.bind(null, row),
              },
              {
                default: () =>
                  row.companyLoginCredential.loginCredentialState === 0 ? "正常" : "锁定",
              }
            );
          }
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
                onClick: handle.bind(null, record, true),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handle.bind(null, record, false),
                auth: ["dict001"],
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
        let res = await getAgencyPage({ page, search: search });
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

    function handle(record: Recordable, bool: boolean) {
      const { openDrawer } = agentDrawerRef.value;
      openDrawer("编辑代理商", record, bool);
    }
    function handleAdd() {
      const { openDrawer } = agentDrawerRef.value;
      openDrawer("新增代理商");
    }
    async function handleStatus(record: Recordable) {
      try {
        loading.value = true;
        let res = await updateAgencyStatus({
          operationCompanyAgencyId: record.operationCompanyAgencyId as string,
        });
        console.log(res);
        message.success(window.$tips[res.code]);
        const { resetPagination } = basicTableRef.value;
        resetPagination();
        getData({ pageIndex: 1, pageSize: 10 });
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
      queryValue.value = { operationCompanyAgencyNameLike: null };
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
      agentDrawerRef,
      basicTableRef,
      columns,
      itemCount,
      getRowKeyId: (row: tableDataItem) => row.operationCompanyAgencyId,

      reloadPage,
      handleAdd,
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
