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
          v-model:value="cityCode"
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
        >查找</n-button
      >
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
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />
    <RechargeDrawer ref="rechargeDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import RechargeDrawer from "./rechargeDrawer.vue";
import { tableDataItem } from "./type";
import { statusOptions } from "@/config/form";
// import { getUsers } from "@/api/system/user";
import { PaginationInter } from "@/api/type";
import { FormInst, useMessage } from "naive-ui";
export default defineComponent({
  name: "RechargeActivity",
  components: { BasicTable, RechargeDrawer },
  setup() {
    const loading = ref(false);
    const rechargeDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);

    const cityCode = ref(null);
    const queryFormRef = ref<FormInst | null>(null);
    const message = useMessage();

    const data = ref<tableDataItem[]>([
      {
        id: "123123",
        channel: "string",
        ratio: 0,
        minAmount: 0,
        cumulativeQuota: 0,
        startTime: null,
        endTime: null,
        remark: "string",
      },
    ]);

    const columns = [
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
        title: "支付渠道",
        key: "channel",
        align: "center",
      },
      {
        title: "充值比率",
        key: "ratio",
        align: "center",
      },
      {
        title: "最低起充金额",
        key: "startTime",
        align: "center",
      },
      {
        title: "累计实冲金额",
        key: "cumulativeQuota",
        align: "center",
      },
      {
        title: "活动描述",
        key: "remark",
        align: "center",
      },
      {
        title: "活动开始时间",
        key: "startTime",
        align: "center",
      },
      {
        title: "活动结束时间",
        key: "endTime",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "100px",
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
            ],
          });
        },
      },
    ];

    async function handleValidate() {
      try {
        await queryFormRef.value?.validate();
        console.log(cityCode.value);
      } catch (err) {
        console.log(err);
        message.error("验证失败");
      }
    }

    // onMounted(() => {
    //   getData({ page: 1, pageSize: 10 });
    // });

    // const getData = async (pagination: PaginationInter) => {
    //   loading.value = true;
    //   try {
    //     let res = await getUsers({ ...pagination, cityCode: cityCode.value });
    //     data.value = res.data;
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

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = rechargeDrawerRef.value;
      openDrawer("编辑广告", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = rechargeDrawerRef.value;
      openDrawer("添加城市广告", cityCode.value);
    }

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      //   getData({ page: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      //   getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      //   getData({ page: 1, pageSize: 10 });
    }

    return {
      options: [],
      data,
      cityCode,
      queryFormRef,
      loading,
      rechargeDrawerRef,
      basicTableRef,
      statusOptions,
      columns,
      itemCount,
      queryRule: {
        trigger: ["input", "blur"],
        validator() {
          if (cityCode.value === null) {
            return new Error("选择开通城市");
          }
        },
      },

      reloadPage,
      handleAdd,
      handleBatch,
      handleCheckRow,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleValidate,
    };
  },
});
</script>
