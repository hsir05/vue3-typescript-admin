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
      <n-form-item label="会员名称" path="customerMemberNameLike">
        <n-input
          v-model:value="queryValue.customerMemberNameLike"
          clearable
          placeholder="输入会员名称"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="会员状态" path="customerMemberLockEq">
        <n-radio-group v-model:value="queryValue.customerMemberLockEq">
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
      :isAddBtn="true"
      :columns="columns"
      :loading="loading"
      :rowKey="getRowKeyId"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
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
import DetailDrawer from "@/components/memberDetail/memberDetailDrawer.vue";
import { NTag } from "naive-ui";
import MemberDrawer from "./memberDrawer.vue";
import { TableItemInter } from "./type";
import { lockOptions } from "@/config/form";
import { getCustomerMemberPage } from "@/api/individualCustomers/individualCustomers";
import { PaginationState } from "@/api/type";
import { memberType } from "@/config/table";
export default defineComponent({
  name: "MembershipType",
  components: { MemberDrawer, BasicTable, DetailDrawer },
  setup() {
    const loading = ref(false);
    const memberDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      customerMemberNameLike: null,
      customerMemberLockEq: null,
    });
    const detailDrawerRef = ref();

    const data = ref<TableItemInter[]>([]);

    const columns = [
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
        title: "会员名称",
        key: "customerMemberName",
        align: "center",
      },
      {
        title: "会员描述",
        key: "customerMemberDesc",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "会员类型",
        key: "customerMemberType",
        align: "center",
        render(row: TableItemInter) {
          return h("span", memberType[row.customerMemberType]);
        },
      },
      {
        title: "会员状态",
        key: "customerMemberLock",
        align: "center",
        render(row: TableItemInter) {
          return h(
            NTag,
            {
              type: row.customerMemberLock === 1 ? "error" : "success",
            },
            {
              default: () => (row.customerMemberLock === 1 ? "锁定" : "正常"),
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
                label: "详情",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handleSee.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
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
        let res = await getCustomerMemberPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = memberDrawerRef.value;
      openDrawer("编辑用户", record);
    }
    function handleSee(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = detailDrawerRef.value;
      openDrawer("编辑会员", record);
    }

    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = memberDrawerRef.value;
      openDrawer("新增用户");
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        customerMemberNameLike: null,
        customerMemberLockEq: null,
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
      memberDrawerRef,
      detailDrawerRef,
      basicTableRef,
      lockOptions,
      columns,
      itemCount,
      getRowKeyId: (row: TableItemInter) => row.customerMemberId,

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
