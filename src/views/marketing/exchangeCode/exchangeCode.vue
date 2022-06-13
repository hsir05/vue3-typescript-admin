<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="100"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      :model="form"
    >
      <n-form-item label="兑换码" path="exchangeCodeLike">
        <n-input v-model:value="form.exchangeCodeLike" clearable placeholder="输入兑换码" />
      </n-form-item>

      <n-form-item label="兑换类型" path="exchangeCodeExchangeTypeEq">
        <n-select
          v-model:value="form.exchangeCodeExchangeTypeEq"
          clearable
          filterable
          placeholder="选择兑换类型"
          style="width: 160px"
          :options="stateListData"
        />
      </n-form-item>

      <n-form-item label="生成时间(起始)" path="exchangeCodeCreateTimeGe">
        <n-date-picker v-model:value="form.exchangeCodeCreateTimeGe" type="datetime" clearable />
      </n-form-item>

      <n-form-item label="生成时间(结束)" path="exchangeCodeCreateTimeLe">
        <n-date-picker v-model:value="form.exchangeCodeCreateTimeLe" type="datetime" clearable />
      </n-form-item>

      <n-button attr-type="button" type="primary" @click="handleValidate">查询</n-button>
    </n-form>

    <!-- 表格 -->
    <div class="bg-white mt-10px p-10px">
      <!-- 顶部功能区 -->
      <div class="flex pb-10px">
        <n-button-group>
          <n-dropdown trigger="hover" :options="codeOptions" @select="handleCode">
            <n-button type="primary">
              <template #icon>
                <n-icon :component="DocumentIcon" />
              </template>
              代金券兑换码
            </n-button>
          </n-dropdown>

          <n-dropdown trigger="hover" :options="amoutOptions" @select="handleAmout">
            <n-button type="primary">
              <template #icon>
                <n-icon :component="AccountBookIcon" />
              </template>
              金额兑换码
            </n-button>
          </n-dropdown>
        </n-button-group>
      </div>
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        min-height="500px"
        flex-height
        class="box-border"
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />

      <n-pagination
        v-model:page="pagination.pageIndex"
        v-model:page-size="pagination.pageSize"
        v-model:item-count="itemCount"
        :page-slot="5"
        show-size-picker
        show-quick-jumper
        class="mt-10px justify-end"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ itemCount }} 项</template>
      </n-pagination>
    </div>

    <CodeDetailDrawer ref="codeDetailDrawerRef" :width="700" />
    <ExchangeRecordCodeDrawer ref="recordDrawerRef" :width="650" />
    <CodeDrawer ref="codeDrawerRef" :width="650" />

    <BatchCodeDrawer ref="batchCodeDrawerRef" />

    <AmountDrawer ref="amountDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
    <BatchAmountDrawer ref="batchAmountDrawerRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, reactive, toRaw, onMounted } from "vue";
import { FormInst } from "naive-ui";
import { TableDataItemInter } from "./type";
import TableActions from "@/components/TableActions/TableActions.vue";
import CodeDetailDrawer from "./codeDetailDrawer.vue";
import ExchangeRecordCodeDrawer from "./exchangeRecordDrawer.vue";
import CodeDrawer from "./codeDrawer.vue";
import AmountDrawer from "./amountDrawer.vue";
import BatchCodeDrawer from "./batchCodeDrawer.vue";
import BatchAmountDrawer from "./batchAmountDrawer.vue";
import { EyeOutline as EyeIcon, DocumentAttachOutline as DocumentIcon } from "@vicons/ionicons5";
import {
  FileExcelOutlined as FileExceIcon,
  AccountBookOutlined as AccountBookIcon,
} from "@vicons/antd";
import dayjs from "dayjs";
import { pageSizes } from "@/config/table";
import { PaginationInter } from "@/api/type";
import { getExchangeCodePage } from "@/api/marketing/marketing";
import { getDict } from "@/api/common/common";

export default defineComponent({
  name: "ExchangeCode",
  components: {
    CodeDetailDrawer,
    BatchAmountDrawer,
    AmountDrawer,
    ExchangeRecordCodeDrawer,
    CodeDrawer,
    BatchCodeDrawer,
  },
  setup() {
    const form = ref({
      exchangeCodeLike: null,
      exchangeCodeExchangeTypeEq: null,
      exchangeCodeCreateTimeGe: null,
      exchangeCodeCreateTimeLe: null,
    });
    const itemCount = ref(null);
    const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
    });
    const stateListData = ref();
    const stateData: Map<string, string> = new Map();
    const formRef = ref<FormInst | null>(null);
    const codeDetailDrawerRef = ref();
    const recordDrawerRef = ref();
    const codeDrawerRef = ref();
    const batchAmountDrawerRef = ref();
    const amountDrawerRef = ref();
    const batchCodeDrawerRef = ref();
    const loading = ref(false);
    const data = ref([]);
    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: TableDataItemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "兑换码",
        key: "exchangeCode",
        align: "center",
      },
      {
        title: "兑换类型",
        key: "exchangeCodeExchangeType",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", stateData.get(record.exchangeCodeExchangeType));
        },
      },
      {
        title: "生效时间",
        key: "exchangeCodeEffectiveTimeBegin",
        align: "center",
        render(record: TableDataItemInter) {
          return h(
            "span",
            dayjs(record.exchangeCodeEffectiveTimeBegin).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "失效时间",
        key: "exchangeCodeEffectiveTimeEnd",
        align: "center",
        render(record: TableDataItemInter) {
          return h(
            "span",
            dayjs(record.exchangeCodeEffectiveTimeEnd).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "生成时间",
        key: "exchangeCodeCreateTime",
        align: "center",
        render(record: TableDataItemInter) {
          return h("span", dayjs(record.exchangeCodeCreateTime).format("YYYY-MM-DD HH:mm:ss"));
        },
      },
      {
        title: "可兑换次数",
        key: "exchangeCodeUsableCount",
        align: "center",
      },
      {
        title: "已兑换次数",
        key: "exchangeCodeUsedCount",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "90px",
        render(record: TableDataItemInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "详情",
                type: "primary",
                isIconBtn: true,
                icon: EyeIcon,
                onClick: handleDetail.bind(null, record.exchangeCodeId),
                auth: ["dict001"],
              },
              {
                label: "兑换记录",
                type: "primary",
                isIconBtn: true,
                icon: FileExceIcon,
                onClick: handleRecord.bind(null, record.exchangeCodeId),
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

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        let dict = await getDict({ parentEntryCode: "EXT0000" });
        dict.data.map((item: { entryName: string; entryCode: string }) => {
          stateData.set(item.entryCode, item.entryName);
        });
        stateListData.value = dict.data.map((item: { entryName: string; entryCode: string }) => {
          return { label: item.entryName, value: item.entryCode };
        });
        let search = { ...form.value };
        let res = await getExchangeCodePage({ page, search: search });
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    async function handleValidate() {
      getData({ pageIndex: 1, pageSize: 10 });
    }

    function handleCode(key: string | number) {
      if (key === "codeSingle") {
        const { openDrawer } = codeDrawerRef.value;
        openDrawer("添加兑换码", true);
      } else {
        const { openDrawer } = batchCodeDrawerRef.value;
        openDrawer("批量添加代金券记录");
      }
    }

    function handleAmout(key: string | number) {
      if (key === "amoutSingle") {
        const { openDrawer } = amountDrawerRef.value;
        openDrawer("添加兑换码", true);
      } else {
        const { openDrawer } = batchAmountDrawerRef.value;
        openDrawer("批量添加金额兑换码记录");
      }
    }

    function handleDetail(exchangeCodeId: string) {
      const { openDrawer } = codeDetailDrawerRef.value;
      openDrawer(exchangeCodeId);
    }

    function handleRecord(exchangeCodeId: string) {
      const { openDrawer } = recordDrawerRef.value;
      openDrawer(exchangeCodeId);
    }

    function handlePage(pageIndex: number) {
      pagination.pageIndex = pageIndex;
      getData(toRaw(pagination));
    }

    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
      getData(toRaw(pagination));
    }

    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ pageIndex: 1, pageSize: 10 });
    }

    return {
      form,
      formRef,
      codeDetailDrawerRef,
      recordDrawerRef,
      codeDrawerRef,
      batchCodeDrawerRef,
      batchAmountDrawerRef,
      amountDrawerRef,
      loading,
      stateListData,
      options: [],
      itemCount,
      columns,
      data,
      stateData,
      getRowKeyId: (row: TableDataItemInter) => row.exchangeCodeId,
      pagination,
      pageSizes,
      DocumentIcon,
      AccountBookIcon,
      amoutOptions: [
        {
          label: "单个添加",
          key: "amoutSingle",
        },
        {
          label: "批量添加",
          key: "amoutBatch",
        },
      ],
      codeOptions: [
        {
          label: "单个添加",
          key: "codeSingle",
        },
        {
          label: "批量添加",
          key: "codeBatch",
        },
      ],

      handleValidate,
      handlePage,
      handleCode,
      handleAmout,
      handlePageSize,
      handleSaveAfter,
    };
  },
});
</script>
