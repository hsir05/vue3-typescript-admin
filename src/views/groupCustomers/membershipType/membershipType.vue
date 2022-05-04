<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="120"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="会员名称" path="memberNameLike">
        <n-input
          v-model:value="queryValue.memberNameLike"
          clearable
          placeholder="输入会员名称"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="会员状态" path="memberLockEq">
        <n-radio-group v-model:value="queryValue.memberLockEq">
          <n-radio :value="null">全部</n-radio>
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
      :rowKey="getRowKeyId"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <MemberDrawer ref="memberDrawerRef" :width="500" @on-save-after="handleSaveAfter" />

    <DetailDrawer ref="detailDrawerRef" :width="650" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { EyeOutline as EyeIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import { NTag } from "naive-ui";
import MemberDrawer from "./memberDrawer.vue";
import DetailDrawer from "@/components/memberDetail/memberDetailDrawer.vue";
import { tableDataItem } from "./type";
import { statusOptions } from "@/config/form";
import { getGroupMemberList } from "@/api/groupCustomers/groupCustomers";
import { PaginationState } from "@/api/type";
export default defineComponent({
  name: "MembershipType",
  components: { MemberDrawer, BasicTable, DetailDrawer },
  setup() {
    const loading = ref(false);
    const memberDrawerRef = ref();
    const basicTableRef = ref();
    const detailDrawerRef = ref();

    const itemCount = ref(null);
    const queryValue = ref({
      memberNameLike: "",
      memberLockEq: 1,
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
        title: "会员名称",
        key: "name",
        align: "center",
      },
      {
        title: "会员描述",
        key: "descript",
        align: "center",
      },
      {
        title: "会员类型",
        key: "type",
        align: "center",
      },
      {
        title: "会员状态",
        key: "status",
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: "info",
            },
            {
              default: () => (row.status === 1 ? "正常" : "锁定"),
            }
          );
        },
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
                label: "详情",
                type: "primary",
                icon: EyeIcon,
                onClick: handleSee.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
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
        let res = await getGroupMemberList({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.itemCount;
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
      const { openDrawer } = memberDrawerRef.value;
      openDrawer("编辑用户", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = memberDrawerRef.value;
      openDrawer("新增用户");
    }
    function handleSee(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = detailDrawerRef.value;
      openDrawer("会员详情", record);
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = { memberNameLike: "", memberLockEq: 1 };
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
      memberDrawerRef,
      detailDrawerRef,
      basicTableRef,
      statusOptions,
      columns,
      itemCount,
      getRowKeyId: (row: tableDataItem) => row.id,

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
