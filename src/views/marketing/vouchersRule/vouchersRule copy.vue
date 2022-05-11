<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <div class="flex-align-start pt-15px mb-10px bg-white">
      <n-form-item
        ref="queryFormRef"
        :rule="queryRule"
        label-width="90"
        label="开通城市"
        label-placement="left"
      >
        <n-select
          v-model:value="cityCode"
          clearable
          filterable
          placeholder="选择开通城市"
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
    <VouchersRuleDrawer ref="vouchersRuleDrawerRef" :width="600" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import VouchersRuleDrawer from "./vouchersRuleDrawer.vue";
import { tableDataItem } from "./type";
// import { getUsers } from "@/api/system/user";
import { PaginationState } from "@/api/type";
import { FormInst, useMessage } from "naive-ui";
export default defineComponent({
  name: "VouchersRule",
  components: { BasicTable, VouchersRuleDrawer },
  setup() {
    const loading = ref(false);
    const vouchersRuleDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);

    const cityCode = ref(null);
    const queryFormRef = ref<FormInst | null>(null);
    const message = useMessage();

    const data = ref<tableDataItem[]>([
      {
        id: "123123",
        rule: "string",
        limitAmount: 2,
        cityCode: "number",
        orderType: "string",
        vehcicle: "string",
        stageTime: "string",
        stageWeek: "string",
      },
    ]);

    const columns = [
      {
        type: "selection",
        align: "center",
      },
      {
        title: "消费规则名称",
        key: "rule",
        align: "center",
      },
      {
        title: "使用限制金额(元)",
        key: "phone",
        align: "center",
      },
      {
        title: "可使用的城市",
        key: "voucherFaceValue",
        align: "center",
      },
      {
        title: "可使用的订单类型",
        key: "createTime",
        align: "center",
      },
      {
        title: "可使用的车型",
        key: "active",
        align: "center",
      },
      {
        title: "可使用的时间",
        key: "startTime",
        align: "center",
      },
      {
        title: "可使用的星期",
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

    // const getData = async (pagination: PaginationState) => {
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

    function handleBatch() {
      console.log("点击了批量删除");
    }

    function handleEdit() {
      console.log("点击了新增");
      const { openDrawer } = vouchersRuleDrawerRef.value;
      openDrawer("编辑");
    }

    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = vouchersRuleDrawerRef.value;
      openDrawer("新增");
    }
    function handleRemove(record: Recordable) {
      console.log("点击了删除", record.id);
    }

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
      options: [],
      data,
      cityCode,
      queryFormRef,
      loading,
      vouchersRuleDrawerRef,
      basicTableRef,
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
