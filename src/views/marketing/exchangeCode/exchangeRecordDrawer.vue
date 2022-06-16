<template>
  <BasicDrawer v-model:show="isDrawer" title="兑换码记录" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="兑换码">{{ detail?.exchangeCode }}</n-descriptions-item>
      <n-descriptions-item label="兑换类型">{{
         stateData.get(detail?.exchangeCodeExchangeType)
      }}</n-descriptions-item>
      <n-descriptions-item label="生效时间" :span="2">{{
        dayjs(detail?.exchangeCodeEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>
      <n-descriptions-item label="生成时间" :span="2">{{
        dayjs(detail?.exchangeCodeEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss")
      }}</n-descriptions-item>
      <n-descriptions-item label="可兑换次数">{{
        detail?.exchangeCodeUsableCount
      }}</n-descriptions-item>
      <n-descriptions-item label="已兑换次数">{{
        detail?.exchangeCodeUsedCount
      }}</n-descriptions-item>
      <n-descriptions-item v-if="isShow" label="兑换实充金额">{{
        detail?.exchangeRechargeAmount
      }}</n-descriptions-item>
      <n-descriptions-item  v-if="isShow" label="兑换赠送金额">{{
        detail?.exchangeGiftAmount
      }}</n-descriptions-item>
    </n-descriptions>

    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="queryForm"
    >
      <n-form-item label="客户手机号" path="customerPhoneLike">
        <n-input
          v-model:value="queryForm.customerPhoneLike"
          clearable
          placeholder="输入客户手机号"
          style="width: 200px"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="query">查询</n-button>
      </n-form-item>
    </n-form>
    <!-- 表格 -->
    <n-data-table
      :loading="loading"
      ref="table"
      striped
      :columns="columns"
      class="box-border"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="false"
    />
    <n-pagination
      v-model:page="pagination.page"
      v-model:page-size="pagination.pageSize"
      v-model:item-count="pagination.itemCount"
      :page-slot="5"
      show-size-picker
      show-quick-jumper
      class="mt-10px justify-end"
      :on-update:page="handlePage"
      :on-update:page-size="handlePageSize"
      :page-sizes="pageSizes"
    ></n-pagination>
  </BasicDrawer>
</template>
<script lang="ts">
import {defineComponent, h, reactive, ref, toRefs} from "vue";
import { FormInst } from "naive-ui";
import dayjs from "dayjs";
import { TableDataItemInter } from "./type";
import { PaginationInter } from "@/api/type";
import { getRecordPagePage, getExchangeCodeDetail } from "@/api/marketing/marketing";
import {getDict} from "@/api/common/common";
import {pageSizes} from "@/config/table";
export default defineComponent({
  name: "ExchangeRecordCodeDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const stateData: Map<string, string> = new Map();
    const exchangeCodeAchieveOpportunityData: Map<string, string> = new Map();
    const exchangeCodeStateData: Map<string, string> = new Map();
    const title = ref("");
    const detail = ref();
    const formRef = ref<FormInst | null>(null);
    interface QueryFormInter {
      customerPhoneLike: string | null;
      exchangeCodeIdEq: string | null;
    }
    const queryForm = ref<QueryFormInter>({
      customerPhoneLike: null,
      exchangeCodeIdEq: null,
    });

    const data = ref([]);
    const isShow = ref(false)
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
        title: "客户手机号",
        key: "customerPhone",
        align: "center",
      },
      {
        title: "获取途径",
        key: "exchangeCodeAchieveOpportunity",
        align: "center",
        render(row:TableDataItemInter){
          return h(
            "span",
            exchangeCodeAchieveOpportunityData.get(row.exchangeCodeAchieveOpportunity))
        }
      },
      {
        title: "状态",
        key: "exchangeCodeState",
        align: "center",
        render(row: TableDataItemInter) {
          return h(
            "span",
            exchangeCodeAchieveOpportunityData.get(row.exchangeCodeState))
        },
      },
      {
        title: "获取时间",
        key: "exchangeCodeUseTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.exchangeCodeUseTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "兑换备注",
        key: "exchangeCodeUseNote",
        align: "center",
      },
    ];

    const paginationReactive = reactive({
      page: 1,
      pageSize: 10,
      itemCount:0,
    })

    function openDrawer(exchangeCodeId: string) {
      if (exchangeCodeId) {
        queryForm.value.exchangeCodeIdEq = exchangeCodeId;
        getDetail(exchangeCodeId);
        getData({ pageIndex: 1, pageSize: 10 });
      }
      state.isDrawer = true;
    }

    const getDetail = async (exchangeCodeId: string) => {
      try {
        state.loading = true;
        let res = await getExchangeCodeDetail({ exchangeCodeId });
        detail.value = res.data;
        state.loading = false;
        if (res.data.exchangeCodeExchangeType ==="EXT0002"){
          isShow.value = true;
        }else {
          isShow.value = false;
        }
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    const getData = async (page: PaginationInter) => {
      try {
        state.loading = true;
        let dict = await getDict({parentEntryCode: "EXT0000"});
        dict.data.map((item: { entryName: string; entryCode: string }) => {
          stateData.set(item.entryCode, item.entryName);
        });
        let exchangeCodeAchieveOpportunity = await getDict({parentEntryCode: "EAO0000"});
        exchangeCodeAchieveOpportunity.data.map((item: { entryName: string; entryCode: string }) => {
          exchangeCodeAchieveOpportunityData.set(item.entryCode, item.entryName);
        });
        let exchangeCodeState = await getDict({parentEntryCode: "ECS0000"});
        exchangeCodeState.data.map((item: { entryName: string; entryCode: string }) => {
          exchangeCodeStateData.set(item.entryCode, item.entryName);
        });
        let search = {
          exchangeCodeIdEq: queryForm.value.exchangeCodeIdEq,
          customerPhoneLike: queryForm.value.customerPhoneLike,
        };
        let res = await getRecordPagePage({ page: page, search: search });
        console.log(res.data.content);
        data.value = res.data.content;
        paginationReactive.itemCount = res.data.totalElements
        state.loading = false;
      } catch (err) {
        console.log(err);
        state.loading = false;
      }
    };

    function query() {
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    function handlePage(pageIndex: number) {
      paginationReactive.page = pageIndex;
      getData({pageIndex:paginationReactive.page,pageSize:paginationReactive.pageSize});
    }

    function handlePageSize(pageSize: number) {
      paginationReactive.pageSize = pageSize;
      getData({pageIndex:paginationReactive.page,pageSize:paginationReactive.pageSize});
    }

    return {
      queryForm,
      formRef,
      columns,
      detail,
      title,
      data,
      stateData,
      pageSizes,
      isShow,
      pagination: paginationReactive,
      dayjs,
      ...toRefs(state),
      getRowKeyId: (row: TableDataItemInter) => row.exchangeCodeId,
      handlePage,
      handlePageSize,
      query,
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
