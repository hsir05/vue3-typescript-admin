<template>
  <BasicDrawer v-model:show="isDrawer" :title="title" @on-close-after="onCloseAfter">
    <n-descriptions label-placement="left" bordered :column="2">
      <n-descriptions-item label="兑换码">0001</n-descriptions-item>
      <n-descriptions-item label="兑换类型">22</n-descriptions-item>
      <n-descriptions-item label="生效时间" :span="2">2022-04-06 11:55:00</n-descriptions-item>
      <n-descriptions-item label="生成时间" :span="2">2020-04-24 08:51:10</n-descriptions-item>
      <n-descriptions-item label="可兑换次数">22</n-descriptions-item>
      <n-descriptions-item label="已兑换次数">22</n-descriptions-item>
      <n-descriptions-item label="兑换实充金额">22</n-descriptions-item>
      <n-descriptions-item label="兑换赠送金额">22</n-descriptions-item>
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
      <n-form-item label="客户手机号" path="agent">
        <n-input
          v-model:value="queryForm.phone"
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
      :pagination="pagination"
    />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, h, reactive, ref, toRefs } from "vue";
import { FormInst, useMessage, NTag } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "ExchangeRecordCodeDrawer",
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });

    const title = ref("");
    const message = useMessage();
    const formRef = ref<FormInst | null>(null);
    const queryForm = ref({
      phone: null,
    });

    const data = ref([
      {
        id: "23123",
        phone: "213123",
        channel: "sadfa",
        status: 1,
        createTime: "2022-09-09",
        remark: "备注",
      },
    ]);

    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "客户手机号",
        key: "phone",
        align: "center",
      },
      {
        title: "获取途径",
        key: "channel",
        align: "center",
      },
      {
        title: "状态",
        key: "status",
        align: "center",
        render(row: tableDataItem) {
          return h(
            NTag,
            {
              type: row.status === 1 ? "success" : "error",
            },
            {
              default: () => (row.status === 1 ? "正常" : "锁定"),
            }
          );
        },
      },
      {
        title: "获取时间",
        key: "createTime",
        align: "center",
      },
      {
        title: "兑换备注",
        key: "remark",
        align: "center",
      },
    ];

    function openDrawer(t: string, record?: tableDataItem) {
      if (record) {
        console.log(record);
        message.success("验证成功");
      }
      title.value = t;
      state.isDrawer = true;
    }

    function query() {}

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    return {
      queryForm,
      formRef,
      columns,
      title,
      data,
      pagination: {
        pageSize: 10,
      },
      ...toRefs(state),
      getRowKeyId: (row: tableDataItem) => row.id,

      query,
      openDrawer,
      onCloseAfter,
    };
  },
});
</script>
