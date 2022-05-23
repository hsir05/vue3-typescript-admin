<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      :show-feedback="false"
      label-width="130"
      class="pt-15px bg-white pb-10px mb-5px flex-wrap"
      :model="queryValue"
    >
      <n-form-item label="代金券名称" path="couponNameLike">
        <n-input
          v-model:value="queryValue.couponNameLike"
          clearable
          placeholder="输入代金券名称"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="所属客户手机号" path="customerPhoneLike">
        <n-input
          v-model:value="queryValue.customerPhoneLike"
          clearable
          placeholder="输入所属客户手机号"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label="获得时间(起始)" path="couponAchieveTimeGe">
        <n-date-picker
          v-model:value="queryValue.couponAchieveTimeGe"
          type="datetime"
          style="width: 180px"
          clearable
        />
      </n-form-item>

      <n-form-item label="获得时间(结束)" path="couponAchieveTimeLe">
        <n-date-picker
          v-model:value="queryValue.couponAchieveTimeLe"
          type="datetime"
          style="width: 180px"
          clearable
        />
      </n-form-item>

      <n-form-item label-width="90" label="获得时机" path="couponAchieveOpportunityEq">
        <n-select
          v-model:value="queryValue.couponAchieveOpportunityEq"
          clearable
          filterable
          placeholder="选择获得时机"
          style="width: 140px"
          :options="couponAchieveOpportunityOptions"
        />
      </n-form-item>

      <n-form-item label="使用状态" path="couponUseStateEq">
        <n-select
          clearable
          filterable
          style="width: 140px"
          v-model:value="queryValue.couponUseStateEq"
          placeholder="选择使用状态"
          :options="couponUseStateOptions"
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
    <DetailDrawer ref="detailDrawerRef" :width="700" @on-save-after="handleSaveAfter" />
    <VouchersDrawer ref="vouchersDrawerRef" :width="600" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted, toRaw } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import DetailDrawer from "./detailDrawer.vue";
import VouchersDrawer from "./vouchersDrawer.vue";
import { TableDataItemInter } from "./type";
import { getCouponPage, removeCoupon } from "@/api/marketing/marketing";
import { PaginationInter } from "@/api/type";
import { FormInst, useMessage } from "naive-ui";
import dayjs from "dayjs";
import {
  couponAchieveOpportunityOptions,
  couponUseStateOptions,
  couponUseStateObj,
  couponAchieveOpportunityObj,
} from "@/config/form";
export default defineComponent({
  name: "Vouchers",
  components: { BasicTable, DetailDrawer, VouchersDrawer },
  setup() {
    const loading = ref(false);
    const detailDrawerRef = ref();
    const vouchersDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);

    const queryValue = ref({
      couponNameLike: null,
      customerPhoneLike: null,
      couponAchieveTimeGe: null,
      couponAchieveTimeLe: null,
      couponAchieveOpportunityEq: null,
      couponUseStateEq: null,
    });
    const queryFormRef = ref<FormInst | null>(null);
    const message = useMessage();

    const data = ref<TableDataItemInter[]>([]);

    const columns = [
      {
        type: "selection",
        align: "center",
      },
      {
        title: "代金券名称",
        key: "couponName",
        align: "center",
      },
      {
        title: "所属客户手机号",
        key: "customerPhone",
        align: "center",
      },
      {
        title: "代金券面值(元)",
        key: "couponDenomination",
        align: "center",
      },
      {
        title: "获得时间",
        key: "couponAchieveTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.couponAchieveTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "获得时机",
        key: "couponAchieveOpportunity",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", couponAchieveOpportunityObj[record.couponAchieveOpportunity]);
        },
      },
      {
        title: "生效时间",
        key: "startTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.couponEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "失效时间",
        key: "endTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.couponEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "使用状态",
        key: "couponUseState",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", couponUseStateObj[record.couponUseState]);
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
                label: "查看",
                type: "primary",
                isIconBtn: true,
                icon: CreateIcon,
                onClick: handleSee.bind(null, record),
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
        let res = await getCouponPage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    function handleSee(record: Recordable) {
      const { openDrawer } = detailDrawerRef.value;
      openDrawer(record.customerCouponId);
    }
    function handleAdd() {
      const { openDrawer } = vouchersDrawerRef.value;
      openDrawer("赠送代金券");
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
      detailDrawerRef,
      vouchersDrawerRef,
      basicTableRef,
      columns,
      getRowKeyId: (row: TableDataItemInter) => row.customerCouponId,
      itemCount,
      queryValue,
      couponAchieveOpportunityOptions,
      couponUseStateOptions,

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
