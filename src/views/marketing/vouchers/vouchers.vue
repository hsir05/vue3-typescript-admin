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
    <DetailDrawer ref="detailDrawerRef" :width="700" @on-save-after="handleSaveAfter" />
    <VouchersDrawer ref="vouchersDrawerRef" :width="600" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { EyeOutline as EyeIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import DetailDrawer from "./detailDrawer.vue";
import VouchersDrawer from "./vouchersDrawer.vue";
import { tableDataItem } from "./type";
// import { getUsers } from "@/api/system/user";
import { PaginationState } from "@/api/type";
import { FormInst, useMessage } from "naive-ui";
export default defineComponent({
  name: "Vouchers",
  components: { BasicTable, DetailDrawer, VouchersDrawer },
  setup() {
    const loading = ref(false);
    const detailDrawerRef = ref();
    const vouchersDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);

    const cityCode = ref(null);
    const queryFormRef = ref<FormInst | null>(null);
    const message = useMessage();

    const data = ref<tableDataItem[]>([
      {
        id: "123123",
        phone: "string",
        startTime: "string",
        endTime: "string",
        voucher: "string",
        active: "注册赠送",
        voucherFaceValue: "string",
        createTime: "2022-04-08 18:32:23",
      },
    ]);

    const columns = [
      {
        type: "selection",
        align: "center",
      },
      {
        title: "代金券名称",
        key: "voucher",
        align: "center",
      },
      {
        title: "所属客户手机号",
        key: "phone",
        align: "center",
      },
      {
        title: "代金券面值(元)",
        key: "voucherFaceValue",
        align: "center",
      },
      {
        title: "获得时间",
        key: "createTime",
        align: "center",
      },
      {
        title: "获得时机",
        key: "active",
        align: "center",
      },
      {
        title: "生效时间",
        key: "startTime",
        align: "center",
      },
      {
        title: "失效时间",
        key: "endTime",
        align: "center",
      },
      {
        title: "使用状态",
        key: "sort",
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
                label: "详情",
                type: "primary",
                isIconBtn: true,
                icon: EyeIcon,
                onClick: handleDetail.bind(null, record),
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

    function handleDetail(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { openDrawer } = detailDrawerRef.value;
      openDrawer("代金券详情", record);
    }
    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = vouchersDrawerRef.value;
      openDrawer("赠送代金券");
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
      detailDrawerRef,
      vouchersDrawerRef,
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
