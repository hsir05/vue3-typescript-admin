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
      <n-form-item label="所在企业名称" path="operationCompanyId">
        <n-input
          v-model:value="queryValue.operationCompanyId"
          clearable
          placeholder="输入所在企业名称"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="紧急联系人姓名" path="operationCompanyEmergencyContactName">
        <n-input
          v-model:value="queryValue.operationCompanyEmergencyContactName"
          clearable
          placeholder="输入紧急联系人姓名"
          style="width: 150px"
        />
      </n-form-item>
      <n-form-item label="联系人手机号" path="operationCompanyEmergencyContactPhone">
        <n-input
          v-model:value="queryValue.operationCompanyEmergencyContactPhone"
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
      :itemCount="itemCount"
      :row-key="getRowKeyId"
      :isAddBtn="true"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <EnteEmeContactDrawer
      ref="enteEmeContactDrawerRef"
      :width="500"
      @on-save-after="handleSaveAfter"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import { useMessage } from "naive-ui";
import EnteEmeContactDrawer from "./enteEmeContactDrawer.vue";
import { tableDataItem } from "./type";
import { statusOptions } from "@/config/form";
import { getEmeConactPage, removeEmeContact } from "@/api/capacity/capacity";
import { PaginationState } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "EnteEmeContact",
  components: { BasicTable, EnteEmeContactDrawer },
  setup() {
    const loading = ref(false);
    const enteEmeContactDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      operationCompanyEmergencyContactName: null,
      operationCompanyId: null,
      operationCompanyEmergencyContactPhone: null,
    });

    const message = useMessage();

    const data = ref([]);

    const columns = [
      //   {
      //     type: "selection",
      //     align: "center",
      //   },
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
        key: "enterpriseName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "紧急联系人姓名",
        key: "operationCompanyEmergencyContactName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "紧急联系人手机号",
        key: "operationCompanyEmergencyContactPhone",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "紧急联系人邮箱",
        key: "operationCompanyEmergencyContactEmail",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "值班时间开始",
        key: "dutyTimeBegin",
        align: "center",
      },
      {
        title: "值班时间结束",
        key: "dutyTimeEnd",
        align: "center",
      },
      {
        title: "添加时间",
        key: "createTime",
        align: "center",
        width: 135,
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
        let search = {
          operationCompanyIdEq: queryValue.value.operationCompanyId,
          operationCompanyEmergencyContactNameLike:
            queryValue.value.operationCompanyEmergencyContactName,
          operationCompanyEmergencyContactPhoneLike:
            queryValue.value.operationCompanyEmergencyContactPhone,
        };
        let res = await getEmeConactPage({ page, search: search });
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
      console.log("点击了编辑", record);
      const { openDrawer } = enteEmeContactDrawerRef.value;
      openDrawer("编辑企业紧急联系人", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = enteEmeContactDrawerRef.value;
      openDrawer("新增企业紧急联系人");
    }
    async function handleRemove(record: Recordable) {
      try {
        loading.value = true;
        let res = await removeEmeContact({
          operationCompanyEmergencyContactId: record.operationCompanyEmergencyContactId,
        });
        console.log(res);
        message.success(res.message);
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
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        operationCompanyEmergencyContactName: null,
        operationCompanyId: null,
        operationCompanyEmergencyContactPhone: null,
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
      enteEmeContactDrawerRef,
      basicTableRef,
      getRowKeyId: (row: tableDataItem) => row.operationCompanyEmergencyContactId,
      statusOptions,
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
