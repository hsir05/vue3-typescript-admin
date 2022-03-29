<template>
  <div class="h-full overflow-hidden driver-member">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="运营城市名称" path="cityCode">
        <n-select
          clearable
          filterable
          v-model:value="queryValue.cityCode"
          placeholder="选择运营城市"
          :options="cityData.result"
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
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import DriMemDrawer from "./driMemDrawer.vue";
import MemberList from "./memberList.vue";
import { tableDataItem } from "./type";
import cityData from "@/config/cityData.json";
import { data } from "./data";
// import { getUsers } from "@/api/system/user";
import { PaginationState } from "@/api/type";
export default defineComponent({
  name: "DriverMember",
  components: { BasicTable, DriMemDrawer, MemberList },

  setup() {
    const loading = ref(false);
    const driMemDrawerRef = ref();
    const memberListRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      cityCode: null,
    });

    // const data = ref<tableDataItem[]>([]);

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
        key: "agent",
        align: "center",
      },
      {
        title: "开通时间",
        key: "account",
        align: "center",
      },
      {
        title: "派单限制开始时间",
        key: "contacts",
        align: "center",
      },
      {
        title: "即将生效产品个数",
        key: "sex",
        width: 100,
        align: "center",
      },

      {
        title: "生效中产品个数",
        key: "phone",
        width: 110,
        align: "center",
      },
      {
        title: "会员有效期内司机个数",
        key: "phone",
        width: 110,
        align: "center",
      },
      {
        title: "会员有效期外司机个数",
        key: "phone",
        width: 110,
        align: "center",
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
                label: "关闭",
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

    // onMounted(() => {
    //   getData({ page: 1, pageSize: 10 });
    // });

    // const getData = async (pagination: PaginationState) => {
    //   loading.value = true;
    //   try {
    //     let res = await getUsers({ ...pagination, ...queryValue.value });
    //     // data.value = res.data;
    //     itemCount.value = res.itemCount;
    //     loading.value = false;
    //   } catch (err) {
    //     console.log(err);
    //     loading.value = false;
    //   }
    // };

    // nextTick(() => {
    //   const { page } = basicTableRef.value;
    //   console.log(page);
    // });

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
    function handleRemove(record: Recordable) {
      //   message.info("点击了删除", record);
      console.log("点击了删除", record);
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = { cityCode: null };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    };

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
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
      //   getData({ page: 1, pageSize: 10 });
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
      cityData,

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
