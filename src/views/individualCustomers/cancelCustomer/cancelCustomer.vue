<template>
  <div class="cancel-customer">
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
      <n-form-item label="客户手机号" path="customerPhoneLike">
        <n-input
          v-model:value="queryValue.customerPhoneLike"
          clearable
          placeholder="输入客户手机号"
        />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <div class="bg-white p-10px" style="height: calc(100% - 95px)">
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 95px - 280px)"
        flex-height
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />

      <n-pagination
        v-model:page="pagination.pageIndex"
        v-model:page-size="pagination.pageSize"
        v-model:item-count="itemCount"
        :page-slot="5"
        show-size-picker
        show-quick-jumper
        class="mt-10px justify-end"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref, toRaw, onMounted, reactive } from "vue";
import { FormInst, NTag } from "naive-ui";
import { TableItemInter } from "./type";
import { PaginationInter } from "@/api/type";
import { pageSizes } from "@/config/table";
import { getCustomerInvalidPage } from "@/api/individualCustomers/individualCustomers";
import dayjs from "dayjs";
export default defineComponent({
  name: "CancelCustomer",
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      customerPhoneLike: "",
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
    });
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
        render(row: TableItemInter) {
          return h(
            NTag,
            {
              type: "success",
            },
            {
              default: () => (row.customerGender === 1 ? "男" : "女"),
            }
          );
        },
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
    ];

    const data = ref([]);

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getCustomerInvalidPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      getData({ pageIndex: 1, pageSize: 10 });
    };

    const reset = () => {
      unref(queryValue).customerPhoneLike = "";
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function handlePage(pageIndex: number) {
      pagination.pageIndex = pageIndex;
      getData(toRaw(pagination));
    }
    function handlePageSize(pageSize: number) {
      console.log(pageSize);
      pagination.pageSize = pageSize;
      getData(toRaw(pagination));
    }

    return {
      queryValue,
      pagination,
      formRef,
      columns,
      loading,
      pageSizes,
      data,
      getRowKeyId: (row: TableItemInter) => row.customerId,
      itemCount,

      searchHandle,
      handlePageSize,
      handlePage,
      reset,
    };
  },
});
</script>
