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
      <n-form-item label="兑换码" path="code">
        <n-input v-model:value="form.code" clearable placeholder="输入兑换码" />
      </n-form-item>

      <n-form-item label="兑换类型" path="type">
        <n-select
          v-model:value="form.type"
          clearable
          filterable
          placeholder="选择兑换类型"
          style="width: 160px"
          :options="options"
        />
      </n-form-item>

      <n-form-item label="生成时间(起始)" path="startTime">
        <n-date-picker v-model:value="form.startTime" type="datetime" clearable />
      </n-form-item>

      <n-form-item label="生成时间(结束)" path="endTime">
        <n-date-picker v-model:value="form.endTime" type="datetime" clearable />
      </n-form-item>

      <n-button attr-type="button" type="primary" @click="query">查询</n-button>
    </n-form>

    <!-- 表格 -->

    <div class="bg-white mt-10px p-10px">
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
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h } from "vue";
import { FormInst } from "naive-ui";
import { tableDataItem } from "./type";
export default defineComponent({
  name: "ExchangeCode",
  setup() {
    const form = ref({
      code: null,
      type: null,
      startTime: null,
      endTime: null,
    });
    const formRef = ref<FormInst | null>(null);
    const loading = ref(false);
    const data = ref([]);
    const columns = [
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
    ];

    function query() {}

    return {
      form,
      formRef,
      loading,
      options: [],
      columns,
      data,
      getRowKeyId: (row: tableDataItem) => row.id,
      pagination: {
        pageSize: 10,
      },

      query,
    };
  },
});
</script>
