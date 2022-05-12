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
      <n-form-item label="集团客户名称" path="groupCustomerNameLike">
        <n-input
          v-model:value="queryValue.groupCustomerNameLike"
          clearable
          placeholder="输入集团客户名称"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="联系人姓名" path="contactNameLike">
        <n-input
          v-model:value="queryValue.contactNameLike"
          clearable
          placeholder="输入联系人姓名"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="联系人手机号" path="contactNameLike">
        <n-input
          v-model:value="queryValue.contactNameLike"
          clearable
          :maxlength="11"
          placeholder="输入联系人手机号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="集团客户状态" path="groupCustomerLockEq">
        <n-radio-group v-model:value="queryValue.groupCustomerLockEq">
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
      :loading="loading"
      :itemCount="itemCount"
      :rowKey="getRowKeyId"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <DetailDrawer ref="detailDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
    <TypeModal ref="typeModalRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  EyeOutline as EyeIcon,
  CreateOutline as CreateIcon,
  LockClosedOutline as LockClosedIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import { NTag } from "naive-ui";
import DetailDrawer from "./detailDrawer.vue";
import TypeModal from "./typeModal.vue";
import { TableItemInter } from "./type";
import { lockOptions } from "@/config/form";
import { getGroupCustomerPage } from "@/api/groupCustomers/groupCustomers";
import { PaginationState } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "Customer",
  components: { BasicTable, DetailDrawer, TypeModal },
  setup() {
    const loading = ref(false);
    const detailDrawerRef = ref();
    const typeModalRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      groupCustomerNameLike: null,
      contactNameLike: null,
      contactPhoneLike: null,
      groupCustomerLockEq: null,
    });

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
        title: "集团客户名称",
        key: "groupCustomerName",
        align: "center",
      },
      {
        title: "联系人姓名",
        key: "contactName",
        align: "center",
      },
      {
        title: "联系人手机号",
        key: "contactPhone",
        align: "center",
      },
      {
        title: "集团会员名称",
        key: "groupCustomerMemberName",
        align: "center",
      },
      {
        title: "集团客户注册时间",
        key: "groupCustomerRegTime",
        align: "center",
        render(record: TableItemInter) {
          return h("span", dayjs(record.groupCustomerRegTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "集团客户状态",
        key: "groupCustomerLock",
        align: "center",
        render(row: TableItemInter) {
          return h(
            NTag,
            {
              type: row.groupCustomerLock === 0 ? "success" : "error",
              onClick: handleLock.bind(null, row),
            },
            {
              default: () => (row.groupCustomerLock === 0 ? "正常" : "锁定"),
            }
          );
        },
      },

      {
        title: "操作",
        key: "action",
        align: "center",
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
                label: "锁定",
                type: "primary",
                icon: LockClosedIcon,
                isIconBtn: true,
                onClick: handleLock.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
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
        let res = await getGroupCustomerPage({ page, search: search });
        console.log(res);

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
      const { handleModal } = typeModalRef.value;
      handleModal(record);
    }
    function handleSee(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = detailDrawerRef.value;
      openDrawer("编辑会员", record);
    }
    function handleLock(record: Recordable) {
      console.log("点击了编辑", record);
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = detailDrawerRef.value;
      openDrawer("新增用户");
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
        groupCustomerNameLike: null,
        contactNameLike: null,
        contactPhoneLike: null,
        groupCustomerLockEq: null,
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
      detailDrawerRef,
      basicTableRef,
      lockOptions,
      columns,
      getRowKeyId: (row: TableItemInter) => row.groupCustomerId,
      itemCount,

      reloadPage,
      handleAdd,
      typeModalRef,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
    };
  },
});
</script>
