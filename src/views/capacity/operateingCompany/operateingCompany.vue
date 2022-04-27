<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="120"
      class="pt-15px pb-15px bg-white mb-10px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="运营企业名称" path="nameLike">
        <n-input
          v-model:value="queryValue.nameLike"
          clearable
          placeholder="输入运营企业名称"
          style="width: 200px"
        />
      </n-form-item>
      <n-form-item label="运营企业编码" path="operationCompanyCodeLike">
        <n-input
          v-model:value="queryValue.operationCompanyCodeLike"
          clearable
          placeholder="输入运营企业编码"
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
      :row-key="getRowKeyId"
      :columns="columns"
      :loading="loading"
      :isAddBtn="true"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <OprComDrawer ref="OprComDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { useMessage, useDialog } from "naive-ui";
import {
  GitCompareOutline as GitCompareIcon,
  CreateOutline as CreateIcon,
  EyeOutline as EyeIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import OprComDrawer from "./oprComDrawer.vue";
import { tableDataItem } from "./type";
import { getCompanyPage, updateAgentStatus } from "@/api/capacity/capacity";
import { PaginationState } from "@/api/type";
export default defineComponent({
  name: "OperateingCompany",
  components: { BasicTable, OprComDrawer },
  setup() {
    const loading = ref(false);
    const OprComDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      nameLike: null,
      operationCompanyCodeLike: null,
    });
    const dialog = useDialog();
    const message = useMessage();

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
        title: "运营企业名称",
        key: "operationCompanyName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "运营企业编号",
        key: "operationCompanyCode",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "社会统一信用代码",
        key: "unifiedSocialCreditCode",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "代理商",
        key: "agent",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(record: tableDataItem) {
          return h("span", handleValue(record.operationCompanyAgencyList));
        },
      },
      {
        title: "运营城市",
        key: "operationCityName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "运营城市编码",
        key: "operationCityCode",
        width: 110,
        align: "center",
      },
      {
        title: "运营城市地址",
        key: "operationCompanyAddress",
        align: "center",
        ellipsis: {
          tooltip: true,
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
              {
                label: "修改代理状态",
                type: "primary",
                icon: GitCompareIcon,
                isIconBtn: true,
                isShow: record.allowAgency === 0 ? false : true,
                onClick: handleAgent.bind(null, record),
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

    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getCompanyPage({ page, search: search });
        console.log(res.data);

        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const handleValue = (list: string[] | null | undefined) => {
      if (!list || list.length === 0) {
        return "不允许代理";
      } else if (list.length === 1) {
        return list[0];
      } else {
        let result = list.reduce((Separator, item) => (item += Separator), ",");
        return result;
      }
    };

    function handleCheckRow(rowKeys: string[]) {
      console.log("选择了", rowKeys);
    }

    function handle(record: Recordable, bool: boolean) {
      const { openDrawer } = OprComDrawerRef.value;
      openDrawer(`${bool ? "查看" : "编辑"}运营企业`, record, bool);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      const { openDrawer } = OprComDrawerRef.value;
      openDrawer("新增运营企业", false);
    }
    function handleAgent(record: Recordable) {
      dialog.warning({
        title: "提示",
        content: "你确定修改代理状态？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: () => {
          updateStatus(record.operationCompanyId);
        },
        onNegativeClick: () => {},
      });
    }

    const updateStatus = async (operationCompanyId: string) => {
      try {
        loading.value = true;
        let res = await updateAgentStatus({ operationCompanyId });
        console.log(res);
        message.success(res.message);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

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
        operationCompanyCodeLike: null,
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
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      queryValue,
      data,
      loading,
      OprComDrawerRef,
      basicTableRef,
      columns,
      itemCount,
      getRowKeyId: (row: tableDataItem) => row.operationCompanyId,

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
