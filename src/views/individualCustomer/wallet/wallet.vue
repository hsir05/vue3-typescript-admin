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
      <n-form-item label="客户手机号" path="phone">
        <n-input v-model:value="queryValue.phone" clearable placeholder="输入客户手机号" />
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
        v-model:page="pagination.page"
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
import { defineComponent, ref, h, unref, reactive } from "vue";
import { useMessage, FormInst } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { tableDataItem } from "./type";
import { pageSizes } from "@/config/table";
import { ReaderOutline as ReaderIcon } from "@vicons/ionicons5";
import { PayCircleOutlined as PayCircleIcon } from "@vicons/antd";
export default defineComponent({
  name: "Wallet",
  setup() {
    const formRef = ref<FormInst | null>(null);
    const queryValue = ref({
      phone: "",
    });
    const loading = ref(false);
    const itemCount = ref(null);
    const pagination = reactive({
      page: 1,
      pageSize: 10,
    });
    const message = useMessage();

    const columns = [
      {
        type: "selection",
      },
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "客户昵称",
        key: "nickname",
        align: "center",
      },
      {
        title: "客户姓名",
        key: "name",
        align: "center",
      },
      {
        title: "客户手机号",
        key: "phone",
        align: "center",
      },
      {
        title: "实充余额",
        key: "actualAmount",
        align: "center",
      },
      {
        title: "赠送余额",
        key: "giveAmount",
        width: 90,
        align: "center",
      },

      {
        title: "冻结金额",
        key: "frozenAmount",
        width: 90,
        align: "center",
      },
      {
        title: "可用余额",
        key: "availableAmount",
        align: "center",
      },
      {
        title: "总余额",
        key: "totalAmount",
        width: 90,
        align: "center",
      },
      {
        title: "钱包创建时间",
        key: "amountCreatetime",
        width: 90,
        align: "center",
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
                label: "交易记录",
                type: "primary",
                icon: ReaderIcon,
                isIconBtn: true,
                onClick: handleRecord.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "充值",
                type: "primary",
                icon: PayCircleIcon,
                isIconBtn: true,
                onClick: handleRecharge.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "退款",
                type: "primary",
                icon: ReaderIcon,
                isIconBtn: true,
                onClick: handleRefund.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "转账",
                type: "primary",
                icon: ReaderIcon,
                isIconBtn: true,
                onClick: handleTransfer.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    const data = ref([
      {
        id: "12313123",
        nickname: "string",
        name: "string",
        sex: 1,
        birthday: "string",
        email: "string",
        phone: "1809798797",
        memberName: "string",
        create_time: "string",
        cancelTime: "string",
      },
    ]);

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      //   getData({ page: 1, pageSize: 10 });
    };

    const reset = () => {
      unref(queryValue).phone = "";
      message.info("点击了删除");
      //   getData({ page: 1, pageSize: 10 });
    };

    function handleRecord(record: Recordable) {
      console.log(record);
    }
    function handleRecharge(record: Recordable) {
      console.log(record);
    }

    function handleRefund(record: Recordable) {
      console.log(record);
    }
    function handleTransfer(record: Recordable) {
      console.log(record);
    }

    function handlePage(page: number) {
      console.log(page);
      pagination.page = page;
      //   getData(toRaw(pagination));
    }
    function handlePageSize(pageSize: number) {
      console.log(pageSize);
      pagination.pageSize = pageSize;
      //   getData(toRaw(pagination));
    }

    return {
      queryValue,
      pagination,
      formRef,
      columns,
      loading,
      pageSizes,
      data,
      getRowKeyId: (row: tableDataItem) => row.id,
      itemCount,

      searchHandle,
      handlePageSize,
      handlePage,
      reset,
    };
  },
});
</script>
