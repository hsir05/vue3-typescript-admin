<template>
  <div class="">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      :show-feedback="false"
      label-width="90"
      :model="queryForm"
    >
      <n-form-item label="运营企业" path="companyId">
        <n-select
          clearable
          style="width: 200px"
          v-model:value="queryForm.companyId"
          placeholder="选择运营企业"
          :options="options"
        />
      </n-form-item>

      <div class="flex-center">
        <n-form-item label="时间区间" path="section">
          <n-date-picker
            v-model:value="queryForm.section"
            style="width: 220px"
            type="daterange"
            :shortcuts="rangeShortcuts"
            :update-value-on-close="true"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="query"
          >查找</n-button
        >
      </div>
    </n-form>

    <div class="bg-white p-10px" style="height: calc(100% - 95px)">
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 95px - 280px)"
        flex-height
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
      />

      <!-- 分页 -->
      <n-pagination
        v-if="itemCount"
        v-model:page="page"
        v-model:page-size="pageSize"
        v-model:item-count="itemCount"
        :page-slot="5"
        :show-size-picker="true"
        :show-quick-jumper="true"
        class="mt-10px justify-end mr-10px"
        :on-update:page="handlePage"
        :on-update:page-size="handlePageSize"
        :page-sizes="pageSizes"
      >
        <template #prefix> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, reactive, onMounted, toRefs } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { pageSizes, rangeShortcuts } from "@/config/table";
import { tableDataItem } from "../type";
export default defineComponent({
  name: "OperateCompanyStatement",
  setup() {
    const loading = ref(false);
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref({
      section: [new Date("2022-03-16"), new Date("2022-03-18")],
      cityCode: "allCity",
      companyId: null,
    });
    const itemCount = ref(10);
    const pagination = reactive({
      page: 1,
      pageSize: 10,
    });
    const message = useMessage();

    const data = ref([
      {
        success: true,
        code: "200",
        message: null,
        result: {
          recordsFiltered: 3,
          list: [
            [
              "兰州益民约车汽车服务有限公司",
              1884.41,
              1884.41,
              197.42,
              "75e642e0096b4a41a2b2ecf933c92247",
            ],
            ["兰州顺风汽车出租有限公司", 78.9, 78.9, 3.94, "75e642e0096b4a41a2b2ecf933c92255"],
            ["兰州大桥出租汽车有限公司", 10, 10, 0.5, "75e642e0096b4a41a2b2ecf933c92279"],
          ],
          recordsTotal: 3,
        },
      },
    ]);
    const columns = [
      {
        title: "运营企业",
        key: "flowSquare",
        align: "center",
      },
      {
        title: "总报价",
        key: "flowSquare",
        align: "center",
      },
      {
        title: "总抽成金额",
        key: "flowSquare",
        align: "center",
      },
      {
        title: "企业抽成金额",
        key: "flowSquare",
        align: "center",
      },
    ];

    onMounted(() => {});

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(queryForm));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    function handlePage(page: number) {
      pagination.page = page;
    }
    // 每页显示
    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
    }
    return {
      loading,
      queryForm,
      columns,
      data,
      options: [],
      itemCount,
      getRowKeyId: (row: tableDataItem) => row.id,
      pageSizes,
      ...toRefs(pagination),
      rangeShortcuts,

      query,
      handlePage,
      handlePageSize,
    };
  },
});
</script>
