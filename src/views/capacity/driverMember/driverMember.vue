<template>
  <div class="h-full overflow-hidden driver-member">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white mb-10px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="运营企业" path="operationCompanyIdEq">
        <n-select
          clearable
          style="width: 320px"
          v-model:value="queryValue.operationCompanyIdEq"
          placeholder="选择运营企业"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :isAddBtn="true"
      :row-key="getRowKeyId"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-add="handleAdd"
      @on-batch="handleBatch"
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />

    <MemberListDrawer
      ref="memberListDrawerRef"
      :width="1000"
      @on-save-after="handleSaveMemberAfter"
    />

    <OrderLimitTimeModal ref="orderLimitTimeModalRef" @on-save-after="handleSaveMemberAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, toRaw, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  CloseCircleOutline as CloseIcon,
  TimeOutline as TimeIcon,
  CubeSharp as CubeSharpIcon,
} from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";

import OrderLimitTimeModal from "./orderLimitTimeModal.vue";
import MemberListDrawer from "./memberListDrawer.vue";
import { useMessage } from "naive-ui";
import { TableItemInter } from "./type";
import { getDriverMemberPage, closeMember } from "@/api/capacity/capacity";
import { getAllOperateCompany } from "@/api/common/common";
import { PaginationState } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "DriverMember",
  components: { BasicTable, MemberListDrawer, OrderLimitTimeModal },

  setup() {
    const loading = ref(false);
    const message = useMessage();
    const companyData = ref([]);
    const driMemDrawerRef = ref();
    const orderLimitTimeModalRef = ref();
    const memberListDrawerRef = ref();
    const basicTableRef = ref();
    const itemCount = ref(null);
    const queryValue = ref({
      operationCompanyIdEq: null,
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
        title: "运营企业",
        key: "operationCompanyName",
        align: "center",
        width: 320,
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "开通时间",
        key: "openTime",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(record: TableItemInter) {
          return h("span", dayjs(record.openTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "派单限制开始时间",
        key: "dispatchOrderLimitBeginTime",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(record: TableItemInter) {
          return h("span", dayjs(record.dispatchOrderLimitBeginTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "即将生效产品个数",
        key: "comingIntoEffectGoodsNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },

      {
        title: "生效中产品个数",
        key: "inEffectGoodsNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "会员有效期内司机个数",
        key: "validPeriodDriverNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "会员有效期外司机个数",
        key: "outOfValidityDriverNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "150px",
        render(record: TableItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "会员产品列表",
                type: "primary",
                icon: CubeSharpIcon,
                isIconBtn: true,
                onClick: handleMemberList.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "调整派单限制开始时间",
                type: "primary",
                icon: TimeIcon,
                isIconBtn: true,
                isShow: record.dispatchOrderLimitBeginTime > new Date().getTime() ? false : true,
                onClick: handleOrderTime.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "关闭",
                type: "error",
                icon: CloseIcon,
                isIconBtn: true,
                secondary: true,
                auth: ["dict002"],
                popConfirm: {
                  onPositiveClick: handleClose.bind(null, record),
                  title: "您确定关闭?",
                },
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getAllCompanyData();
      getData({ pageIndex: 1, pageSize: 10 });
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        companyData.value = res.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getDriverMemberPage({ page, search: search });
        data.value = res.data.content;
        console.log(res.data);

        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleMemberList(record: TableItemInter) {
      const { openDrawer } = memberListDrawerRef.value;
      openDrawer(record.operationCompanyId, record.operationCompanyName);
    }
    function handleOrderTime(record: Recordable) {
      const { handleModal } = orderLimitTimeModalRef.value;
      handleModal({
        operationCompanyOpenedDriverMemberId: record.operationCompanyOpenedDriverMemberId,
        dispatchOrderLimitBeginTime: record.dispatchOrderLimitBeginTime,
      });
    }

    function handleBatch() {
      console.log("点击了批量删除");
    }
    function handleAdd() {
      console.log("点击了新增");
      const { openDrawer } = driMemDrawerRef.value;
      openDrawer("新增用户");
    }
    async function handleClose(record: Recordable) {
      loading.value = true;
      try {
        let res = await closeMember({
          operationCompanyOpenedDriverMemberId: record.operationCompanyOpenedDriverMemberId,
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

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };
    const reset = () => {
      queryValue.value = { operationCompanyIdEq: null };
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function reloadPage() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handlePage(pagination: PaginationState) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    function handlepagSize(pagination: PaginationState) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }
    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handleSaveMemberAfter() {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      queryValue,
      data,
      loading,
      driMemDrawerRef,
      orderLimitTimeModalRef,
      memberListDrawerRef,
      basicTableRef,
      columns,
      itemCount,
      companyData,
      getRowKeyId: (row: TableItemInter) => row.operationCompanyOpenedDriverMemberId,

      reloadPage,
      handleAdd,
      handleBatch,
      searchHandle,
      reset,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      handleSaveMemberAfter,
    };
  },
});
</script>
