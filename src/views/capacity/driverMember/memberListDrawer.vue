<template>
  <BasicDrawer v-model:show="isDrawer" title="会员列表" @on-close-after="onCloseAfter">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="80"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="产品名称" path="goodsNameLike">
        <n-input
          v-model:value="queryValue.goodsNameLike"
          clearable
          :maxlength="100"
          placeholder="输入产品名称"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>
    <p class="">{{ operationCompanyName }} 司机会员产品列表</p>
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
      @on-page="handlePage"
      @on-pagination="handlepagSize"
    />

    <DriverMemDrawer ref="driverMemDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, h, toRefs, toRaw, ref } from "vue";
import BasicTable from "@/components/Table/Table.vue";
import { getDriverMemberGoodsPage } from "@/api/capacity/capacity";
import { PaginationState } from "@/api/type";
import { TableMemberItemInter, MemberFormInter } from "./type";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import DriverMemDrawer from "./driverMemberDrawer.vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import dayjs from "dayjs";
export default defineComponent({
  name: "MemberListDrawer",
  components: { DriverMemDrawer, BasicTable },
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
      disabled: false,
    });
    const basicTableRef = ref();
    const driverMemDrawerRef = ref();
    const itemCount = ref(null);
    const operationCompanyName = ref("");
    const data = ref<TableMemberItemInter[]>([]);

    const queryValue = ref<MemberFormInter>({
      operationCompanyIdEq: null,
      goodsNameLike: null,
    });

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: TableMemberItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "产品名称",
        key: "goodsName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },

      {
        title: "产品原价",
        key: "goodsTagPrice",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },

      {
        title: "产品售价",
        key: "goodsSellingPrice",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "产品内容描述",
        key: "purchasableDaysBeforeMemberExpire",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "到期前开放购买天数",
        key: "purchasableDaysBeforeMemberExpire",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "生失效时间",
        key: "openTime",
        align: "center",
        width: 240,
        ellipsis: {
          tooltip: true,
        },
        render(record: TableMemberItemInter) {
          return h(
            "span",
            `${dayjs(record.effectBeginTime).format("YYYY-MM-DD HH:mm")} 至 ${dayjs(
              record.effectEndTime
            ).format("YYYY-MM-DD HH:mm")}`
          );
        },
      },
      {
        title: "产品备注",
        key: "goodsRemark",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "创建时间",
        key: "createTime",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
        render(record: TableMemberItemInter) {
          return h("span", dayjs(record.createTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        render(record: TableMemberItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "会员产品列表",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record.driverMemberGoodsId),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    function openDrawer(operationCompanyIdEq: string, companyName: string) {
      queryValue.value.operationCompanyIdEq = operationCompanyIdEq;
      operationCompanyName.value = companyName;
      getData({ pageIndex: 1, pageSize: 10 });
      state.isDrawer = true;
    }

    const getData = async (page: PaginationState) => {
      state.loading = true;
      try {
        let search = { ...queryValue.value };
        let res = await getDriverMemberGoodsPage({ page, search: search });
        data.value = res.data.content;
        console.log(res.data);

        itemCount.value = res.data.totalElements;
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function handleEdit(driverMemberGoodsId: string) {
      const { openDrawer } = driverMemDrawerRef.value;
      openDrawer("编辑会员产品", queryValue.value.operationCompanyIdEq, driverMemberGoodsId);
    }
    function handleAdd() {
      const { openDrawer } = driverMemDrawerRef.value;
      openDrawer("新增会员产品", queryValue.value.operationCompanyIdEq);
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
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
    const reset = () => {
      const { resetPagination } = basicTableRef.value;
      resetPagination();
      const operationCompanyIdEq = queryValue.value.operationCompanyIdEq;
      queryValue.value = {
        operationCompanyIdEq: operationCompanyIdEq,
        goodsNameLike: null,
      };
      getData({ pageIndex: 1, pageSize: 10 });
    };

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
      state.disabled = false;
      handleReset();
    }

    function handleReset() {
      queryValue.value = {
        operationCompanyIdEq: null,
        goodsNameLike: null,
      };
      operationCompanyName.value = "";
    }

    return {
      ...toRefs(state),
      itemCount,
      driverMemDrawerRef,
      operationCompanyName,
      getRowKeyId: (row: TableMemberItemInter) => row.driverMemberGoodsId,

      queryValue,
      columns,
      data,
      basicTableRef,
      openDrawer,
      handleAdd,
      reloadPage,
      handlePage,
      handlepagSize,
      handleSaveAfter,
      reset,
      onCloseAfter,
      searchHandle,
    };
  },
});
</script>
