<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <div class="flex-align-start pt-15px mb-10px bg-white">
      <n-form-item
        ref="queryFormRef"
        :rule="queryRule"
        label-width="90"
        label="支付渠道"
        label-placement="left"
      >
        <n-select
          v-model:value="paymentChannelTypeEq"
          clearable
          filterable
          placeholder="选择支付渠道"
          style="width: 260px"
          :options="options"
        />
      </n-form-item>

      <n-button
        attr-type="button"
        :loading="loading"
        class="ml-10px"
        type="primary"
        @click="handleValidate"
        >查找
      </n-button>
    </div>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <RechargeDrawer ref="rechargeDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import RechargeDrawer from "./rechargeDrawer.vue";
import { TableDataItemInter } from "./type";
import { statusOptions } from "@/config/form";
import { PaginationInter } from "@/api/type";
import { getWalletRechargeActivityPage } from "@/api/marketing/marketing";
import { FormInst } from "naive-ui";
import dayjs from "dayjs";

export default defineComponent({
  name: "RechargeActivity",
  components: { BasicTable, RechargeDrawer },
  setup() {
    const loading = ref(false);
    const rechargeDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);

    const paymentChannelTypeEq = ref<string | null>(null);
    const queryFormRef = ref<FormInst | null>(null);

    const data = ref<TableDataItemInter[]>([]);

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: TableDataItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "支付渠道",
        key: "paymentChannelType",
        align: "center",
      },
      {
        title: "充值比率",
        key: "rechargeRate",
        align: "center",
      },
      {
        title: "最低起充金额",
        key: "minimumRechargeAmount",
        align: "center",
      },
      {
        title: "累计实冲金额",
        key: "cumulativeRechargeAmount",
        align: "center",
      },
      {
        title: "活动描述",
        key: "activityDesc",
        align: "center",
      },
      {
        title: "活动开始时间",
        key: "activityBeginTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.activityBeginTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "活动结束时间",
        key: "activityEndTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.activityEndTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "100px",
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record.customerWalletRechargeActivityId),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    async function handleValidate() {
      try {
        await queryFormRef.value?.validate();
        getData({ pageIndex: 1, pageSize: 10 });
      } catch (err) {
        console.log(err);
      }
    }

    onMounted(() => {
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { paymentChannelTypeEq: paymentChannelTypeEq.value as string };
        let res = await getWalletRechargeActivityPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleEdit(customerWalletRechargeActivityId: string) {
      const { openDrawer } = rechargeDrawerRef.value;
      openDrawer("编辑钱包充值活动", customerWalletRechargeActivityId);
    }
    function handleAdd() {
      const { openDrawer } = rechargeDrawerRef.value;
      openDrawer("新增钱包充值活动");
    }

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      options: [],
      data,
      paymentChannelTypeEq,
      queryFormRef,
      loading,
      rechargeDrawerRef,
      basicTableRef,
      statusOptions,
      columns,
      itemCount,
      getRowKeyId: (row: TableDataItemInter) => row.customerWalletRechargeActivityId,
      queryRule: {
        trigger: ["input", "blur"],
        validator() {
          if (paymentChannelTypeEq.value === null) {
            return new Error("选择支付渠道");
          }
        },
      },

      reloadPage,
      handleAdd,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleValidate,
    };
  },
});
</script>
