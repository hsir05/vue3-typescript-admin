<template>
  <div class="h-full overflow-hidden driver-member">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white mb-10px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="运营企业" path="operationCompanyIdEq">
        <n-select
          clearable
          style="width: 320px"
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择运营企业"
          :options="companyData"
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
      :row-key="getRowKeyId"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />

    <DriMemDrawer ref="driMemDrawerRef" :width="500" @on-save-after="handleSaveAfter" />

    <MemberList ref="memberListRef" :width="700" @on-save-after="handleSaveMemberAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import DriMemDrawer from "./driMemDrawer.vue";
import MemberList from "./memberList.vue";
import { useMessage } from "naive-ui";
import { tableDataItem } from "./type";
import { getDriverMemberPage, removeMember } from "@/api/capacity/capacity";
import { getAllOperateCompany } from "@/api/common/common";
import { PaginationState } from "@/api/type";
export default defineComponent({
  name: "DriverMember",
  components: { BasicTable, DriMemDrawer, MemberList },

  setup() {
    const loading = ref(false);
    const message = useMessage();
    const companyData = ref([]);
    const driMemDrawerRef = ref();
    const memberListRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      operationCompanyIdEq: null,
    });

    const data = ref<tableDataItem[]>([]);

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
        title: "运营企业",
        key: "operationCompanyName",
        align: "center",
        width: 250,
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "开通时间",
        key: "openTime",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "派单限制开始时间",
        key: "dispatchOrderLimitBeginTime",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "即将生效产品个数",
        key: "comingIntoEffectGoodsNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },

      {
        title: "生效中产品个数",
        key: "inEffectGoodsNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "会员有效期内司机个数",
        key: "validPeriodDriverNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "会员有效期外司机个数",
        key: "outOfValidityDriverNumber",
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
                label: "会员编辑列表",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handlememberList.bind(null, record),
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
      getAllCompanyData();
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        companyData.value = res.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getDriverMemberPage({ page, search: search });
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

    function handlememberList(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = memberListRef.value;
      openDrawer("编辑用户", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = driMemDrawerRef.value;
      openDrawer("新增用户");
    }
    async function handleRemove(record: Recordable) {
      loading.value = true;
      try {
        let res = await removeMember({
          operationCompanyOpenedDriverMemberId: record.operationCompanyOpenedDriverMemberId,
        });
        console.log(res);
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
      queryValue.value = { operationCompanyIdEq: null };
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
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationState) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handleSaveMemberAfter() {}

    return {
      queryValue,
      data,
      loading,
      driMemDrawerRef,
      memberListRef,
      basicTableRef,
      columns,
      itemCount,
      companyData,
      getRowKeyId: (row: tableDataItem) => row.operationCompanyOpenedDriverMemberId,

      reloadPage,
      handleAdd,
      handleBatch,
      searchHandle,
      reset,
      handleCheckRow,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleSaveMemberAfter,
    };
  },
});
</script>
