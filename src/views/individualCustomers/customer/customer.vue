<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="90"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="客户手机号" path="customerPhoneLike">
        <n-input
          v-model:value="queryValue.customerPhoneLike"
          clearable
          placeholder="输入会员名称"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="集团客户状态" path="customerLockEq">
        <n-radio-group v-model:value="queryValue.customerLockEq">
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
      :isAddBtn="true"
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
    <DetailDrawer ref="detailDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
    <TypeModal ref="typeModalRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  EyeOutline as EyeIcon,
  CreateOutline as CreateIcon,
  LockClosedOutline as LockClosedIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import { NTag, useMessage } from "naive-ui";
import DetailDrawer from "./detailDrawer.vue";
import TypeModal from "./typeModal.vue";
import { TableItemInter } from "./type";
import { lockOptions } from "@/config/form";
import { getCustomerPage, lockCustomer } from "@/api/individualCustomers/individualCustomers";
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
    const message = useMessage();

    const itemCount = ref(null);
    const queryValue = ref({
      customerPhoneLike: null,
      customerMemberNameEq: null,
      customerLockEq: null,
      customerRegTimeGE: null,
      customerRegTimeLE: null,
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
        title: "客户昵称",
        key: "customerNickname",
        align: "center",
        render(_: TableItemInter) {
          return h("span", "匿名");
        },
      },
      {
        title: "客户姓名",
        key: "customerName",
        align: "center",
        render(_: TableItemInter) {
          return h("span", "匿名");
        },
      },
      {
        title: "客户性别",
        key: "customerGender",
        align: "center",
      },
      {
        title: "客户生日",
        key: "customerBirthday",
        align: "center",
        render(_: TableItemInter) {
          return h("span", "暂无");
        },
      },
      {
        title: "客户邮箱",
        key: "customerEmail",
        align: "center",
        render(_: TableItemInter) {
          return h("span", "暂无");
        },
      },
      {
        title: "客户手机号",
        key: "customerPhone",
        align: "center",
      },
      {
        title: "客户注册时间",
        key: "customerRegTime",
        align: "center",
        render(record: TableItemInter) {
          return h("span", dayjs(record.customerRegTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "客户状态",
        key: "customerLock",
        align: "center",
        render(row: TableItemInter) {
          return h(
            NTag,
            {
              type: row.customerLock === 0 ? "success" : "error",
            },
            {
              default: () => (row.customerLock === 0 ? "正常" : "锁定"),
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
                onClick: handleLock.bind(null, record.customerId),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record.customerMemberId, record.customerId),
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
        let res = await getCustomerPage({ page, search: search });
        data.value = res.data.content;
        console.log(res);

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

    function handleEdit(customerMemberId: string, customerId: string) {
      const { handleModal } = typeModalRef.value;
      handleModal(customerMemberId, customerId);
    }
    function handleSee(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = detailDrawerRef.value;
      openDrawer("编辑会员", record);
    }
    async function handleLock(groupCustomerId: string) {
      console.log("点击了编辑", groupCustomerId);
      try {
        loading.value = true;
        let res = await lockCustomer({ groupCustomerId });
        console.log(res);
        getData({ pageIndex: 1, pageSize: 10 });
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    }
    function handleBatch() {
      console.log("点击了批量删除");
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
      //   getData({ page: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = {
        customerPhoneLike: null,
        customerMemberNameEq: null,
        customerLockEq: null,
        customerRegTimeGE: null,
        customerRegTimeLE: null,
      };
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

    return {
      queryValue,
      data,
      loading,
      detailDrawerRef,
      basicTableRef,
      lockOptions,
      columns,
      itemCount,

      reloadPage,
      handleAdd,
      typeModalRef,
      getRowKeyId: (row: TableItemInter) => row.customerMemberId,
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
