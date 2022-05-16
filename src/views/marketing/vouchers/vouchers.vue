<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      :show-feedback="false"
      label-width="80"
      class="pt-15px bg-white pb-10px mb-5px flex-wrap"
      :model="queryValue"
    >
      <n-form-item label="消费规则名称" path="customerCouponConsumeRuleNameLike">
        <n-input
          v-model:value="queryValue.customerCouponConsumeRuleNameLike"
          clearable
          placeholder="输入消费规则名称"
          style="width: 150px"
        />
      </n-form-item>

      <n-form-item label-width="90" label="开通城市" path="couponUsedCityCodesLike">
        <n-select
          v-model:value="queryValue.couponUsedCityCodesLike"
          clearable
          filterable
          placeholder="选择开通城市"
          style="width: 260px"
          :options="openCityData"
        />
      </n-form-item>

      <n-form-item label="可使用的订单类型" path="couponUsedOrderTypesLike">
        <n-select
          clearable
          filterable
          style="width: 150px"
          v-model:value="queryValue.couponUsedOrderTypesLike"
          placeholder="选择可使用的订单类型"
          :options="[]"
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
import { TrashOutline as RemoveIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import DetailDrawer from "./detailDrawer.vue";
import VouchersDrawer from "./vouchersDrawer.vue";
import { TableDataItemInter } from "./type";
import { getCouponConsumeRulePage, removeCoupon } from "@/api/marketing/marketing";
import { PaginationInter } from "@/api/type";
import { FormInst, useMessage } from "naive-ui";
import { CityItemInter } from "@/interface/common/common";
export default defineComponent({
  name: "Vouchers",
  components: { BasicTable, DetailDrawer, VouchersDrawer },
  setup() {
    const loading = ref(false);
    const detailDrawerRef = ref();
    const vouchersDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const openCityData = ref<CityItemInter[]>([]);

    const queryValue = ref({
      customerCouponConsumeRuleNameLike: null,
      couponUsedCityCodesLike: null,
      couponUsedOrderTypesLike: null,
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
                isIconBtn: true,
                secondary: true,
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
      const { openDrawer } = vouchersDrawerRef.value;
      openDrawer("编辑城市广告", record.openCityAdvertisementId);
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
      openCityData,
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
