<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="110"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="所在企业名称" path="operationCompanyIdEq">
        <n-input
          v-model:value="queryValue.operationCompanyIdEq"
          clearable
          placeholder="输入所在企业名称"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="紧急联系人姓名" path="operationCompanyEmergencyContactNameLike">
        <n-input
          v-model:value="queryValue.operationCompanyEmergencyContactNameLike"
          clearable
          placeholder="输入紧急联系人姓名"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="联系人手机号" path="operationCompanyEmergencyContactPhoneLike">
        <n-input
          v-model:value="queryValue.operationCompanyEmergencyContactPhoneLike"
          clearable
          placeholder="输入联系人手机号"
          style="width: 150px"
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
      :isAddBtn="true"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      :row-key="getRowKeyId"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <DispatcherDrawer ref="dispatcherDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import DispatcherDrawer from "./dispatcherDrawer.vue";
import { tableDataItem } from "./type";
import { statusOptions } from "@/config/form";
import { PaginationState } from "@/api/type";
import { getExpendPage } from "@/api/capacity/capacity";
import dayjs from "dayjs";
export default defineComponent({
  name: "Dispatcher",
  components: { BasicTable, DispatcherDrawer },
  setup() {
    const loading = ref(false);
    const dispatcherDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      operationCompanyIdEq: null,
      operationCompanyEmergencyContactNameLike: null,
      operationCompanyEmergencyContactPhoneLike: null,
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
        title: "所在企业名称",
        key: "operationCompanyName",
        align: "center",
      },
      {
        title: "值班调度人姓名",
        key: "operationCompanyExpendContactName",
        align: "center",
      },
      {
        title: "值班调度人手机号",
        key: "operationCompanyExpendContactPhone",
        align: "center",
      },
      {
        title: "值班调度人邮箱",
        key: "operationCompanyExpendContactEmail",
        align: "center",
      },
      {
        title: "值班开始时间",
        key: "dutyTimeBegin",
        align: "center",
      },
      {
        title: "值班结束时间",
        key: "dutyTimeEnd",
        align: "center",
      },
      {
        title: "创建时间",
        key: "createTime",
        align: "center",
        render(record: tableDataItem) {
          return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "120px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                icon: RemoveIcon,
                secondary: true,
                isIconBtn: true,
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
        let res = await getExpendPage({ page, search: search });
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
      const { openDrawer } = dispatcherDrawerRef.value;
      openDrawer("编辑企业紧急联系人", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = dispatcherDrawerRef.value;
      openDrawer("新增企业紧急联系人");
    }
    function handleRemove(record: Recordable) {
      console.log("点击了删除", record);
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
        operationCompanyIdEq: null,
        operationCompanyEmergencyContactNameLike: null,
        operationCompanyEmergencyContactPhoneLike: null,
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

    return {
      queryValue,
      data,
      loading,
      dispatcherDrawerRef,
      basicTableRef,
      statusOptions,
      getRowKeyId: (row: tableDataItem) => row.operationCompanyExpendContactId,
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
