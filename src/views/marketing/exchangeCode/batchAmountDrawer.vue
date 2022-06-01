<template>
  <BasicDrawer v-model:show="isDrawer" title="批量添加代金券" @on-close-after="onCloseAfter">
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="90"
      style="flex-wrap: wrap"
      class="pt-15px bg-white mb-5px"
      :model="form"
    >
      <n-form-item label="开始时间" path="start">
        <n-date-picker v-model:value="form.start" style="width: 210px" type="date" clearable />
      </n-form-item>

      <n-form-item label="结束时间" path="end">
        <n-date-picker v-model:value="form.end" type="date" style="width: 210px" clearable />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="query">提交</n-button>
      </n-form-item>
    </n-form>

    <div class="pb-5px text-right">
      <n-button attr-type="button" type="primary" class="mr-10px" @click="handleBatch"
        >批量添加</n-button
      >
    </div>
    <n-data-table
      :loading="loading"
      ref="table"
      striped
      :columns="columns"
      class="box-border"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="pagination"
    />

    <CodeDetailModal ref="codeDetailModalRef" />
    <CodeDrawer ref="codeDrawerRef" :width="650" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, reactive, h, ref, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import CodeDrawer from "./codeDrawer.vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { RefreshCircleOutline as RefreshIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import CodeDetailModal from "./codeDetailModal.vue";

import { TableDataItemInter } from "./type";
export default defineComponent({
  name: "BatchCodeDrawer",
  components: { CodeDetailModal, CodeDrawer },
  emits: ["on-save-after"],
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const message = useMessage();
    const codeDetailModalRef = ref();
    const codeDrawerRef = ref();
    const formRef = ref<FormInst | null>(null);
    const form = ref({
      code: null,
      count: null,
      start: null,
      end: null,
    });
    const data = ref([
      {
        id: "12313",
      },
    ]);
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
        title: "任务名称",
        key: "name",
        align: "center",
      },
      {
        title: "开始时间",
        key: "faceValue",
        align: "center",
      },
      {
        title: "总条数",
        key: "num",
        align: "center",
      },
      {
        title: "生成条数",
        key: "count",
        align: "center",
      },
      {
        title: "任务状态",
        key: "num",
        align: "center",
      },
      {
        title: "操作人",
        key: "count",
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
                label: "刷新",
                type: "primary",
                isIconBtn: true,
                icon: RefreshIcon,
                onClick: handleRefresh.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "兑换码详情",
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

    function openDrawer(record?: TableDataItemInter) {
      if (record) {
        console.log(record);
        message.success("验证成功");
      }
      state.isDrawer = true;
    }

    function query() {}

    function handleBatch() {
      const { openDrawer } = codeDrawerRef.value;
      openDrawer("添加兑换码");
    }

    function handleRefresh(record: Recordable) {
      console.log(record);
    }
    function handleDetail(record: Recordable) {
      console.log(record);
      const { handleModal } = codeDetailModalRef.value;
      handleModal();
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      form,
      formRef,
      data,
      codeDetailModalRef,
      columns,
      ...toRefs(state),
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: TableDataItemInter) => row.exchangeCodeId,
      query,
      openDrawer,
      codeDrawerRef,
      onCloseAfter,
      handleBatch,
    };
  },
});
</script>
