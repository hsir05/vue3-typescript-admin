<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      :show-feedback="false"
      label-width="120"
      class="pt-15px bg-white pb-10px mb-5px flex-wrap"
      :model="queryValue"
    >
      <n-form-item label="消费规则名称" path="customerCouponConsumeRuleNameLike">
        <n-input
          v-model:value="queryValue.customerCouponConsumeRuleNameLike"
          clearable
          placeholder="输入消费规则名称"
          style="width: 180px"
        />
      </n-form-item>

      <n-form-item label-width="90" label="开通城市" path="couponUsedCityCodesLike">
        <n-select
          v-model:value="queryValue.couponUsedCityCodesLike"
          clearable
          filterable
          placeholder="选择开通城市"
          style="width: 140px"
          :options="openCityData"
        />
      </n-form-item>

      <n-form-item label="可使用的订单类型" path="couponUsedOrderTypesLike">
        <n-select
          clearable
          filterable
          style="width: 140px"
          v-model:value="queryValue.couponUsedOrderTypesLike"
          placeholder="选择可使用的订单类型"
          :options="orderTypeData"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="handleValidate">查询</n-button>
      </n-form-item>
    </n-form>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :row-key="getRowKeyId"
      :loading="loading"
      :itemCount="itemCount"
      :isAddBtn="true"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />

    <VouchersRuleDrawer ref="vouchersRuleDrawerRef" :width="600" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import VouchersRuleDrawer from "./vouchersRuleDrawer.vue";
import { TableDataItemInter } from "./type";
import { getCouponConsumeRulePage, removeCoupon } from "@/api/marketing/marketing";
import { PaginationInter } from "@/api/type";
import { FormInst, useMessage } from "naive-ui";
import { getDict, getAllOpenCity } from "@/api/common/common";
import { itemState, CityItemInter } from "@/interface/common/common";
export default defineComponent({
  name: "Vouchers",
  components: { BasicTable, VouchersRuleDrawer },
  setup() {
    const loading = ref(false);
    const vouchersRuleDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const openCityData = ref<CityItemInter[]>([]);
    const orderTypeData = ref([]);
    const queryValue = ref({
      customerCouponConsumeRuleNameLike: null,
      couponUsedCityCodesLike: null,
      couponUsedOrderTypesLike: null,
    });
    const queryFormRef = ref<FormInst | null>(null);
    const message = useMessage();

    const data = ref<TableDataItemInter[]>([]);

    const columns = [
      //   {
      //     type: "selection",
      //     align: "center",
      //   },
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
        title: "消费规则名称",
        key: "customerCouponConsumeRuleName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "使用限制金额(元)",
        key: "couponLimitedAmount",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "可使用的城市",
        key: "couponUsedCityNames",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "可使用的订单类型",
        key: "couponUsedOrderTypeNames",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "可使用的车型",
        key: "couponUsedVehicleTypeNames",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "可使用的时间",
        key: "couponUsedDayTimeSection",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "可使用的星期",
        key: "couponUsedWeekSection",
        align: "center",
        ellipsis: {
          tooltip: true,
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

    onMounted(() => {
      getOpenCity();
      getDictDate();
      getData({ pageIndex: 1, pageSize: 10 });
    });

    async function getOpenCity() {
      try {
        let res = await getAllOpenCity();
        openCityData.value = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
          };
          return obj;
        });
        openCityData.value.unshift({ label: "不限", value: "all" });
      } catch (err) {
        console.log(err);
      }
    }

    const getDictDate = async () => {
      try {
        let res = await getDict({ parentEntryCode: "OT00000" });
        orderTypeData.value = res.data.map((item: { entryCode: string; entryName: string }) => {
          let obj = {
            label: item.entryName,
            value: item.entryCode,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    };

    const handleValidate = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getCouponConsumeRulePage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    function handleEdit(record: Recordable) {
      const { openDrawer } = vouchersRuleDrawerRef.value;
      openDrawer("编辑代金券消费规则", record);
    }
    function handleAdd() {
      const { openDrawer } = vouchersRuleDrawerRef.value;
      openDrawer("新增代金券消费规则");
    }

    async function handleRemove(record: Recordable) {
      try {
        loading.value = true;
        let res = await removeCoupon({
          customerCouponConsumeRuleId: record.customerCouponConsumeRuleId,
        });
        console.log(res);
        getData({ pageIndex: 1, pageSize: 10 });
        message.success(window.$tips[res.code]);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
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
      queryFormRef,
      loading,
      vouchersRuleDrawerRef,
      basicTableRef,
      columns,
      openCityData,
      orderTypeData,
      getRowKeyId: (row: TableDataItemInter) => row.customerCouponConsumeRuleId,
      itemCount,
      queryValue,

      reloadPage,
      handleAdd,
      handleRemove,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleValidate,
    };
  },
});
</script>
