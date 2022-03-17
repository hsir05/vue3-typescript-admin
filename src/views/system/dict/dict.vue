<template>
  <div class="dict">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="80"
      class="pt-15px pb-15px bg-white"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="字典名称" path="name">
        <n-input v-model:value="queryValue.name" clearable placeholder="输入字典名称" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>
    <!-- 表格 -->
    <div class="bg-white mt-10px p-10px" style="height: calc(100% - 95px)">
      <div class="flex pb-10px">
        <n-button-group>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><AddIcon /></n-icon> </template
            >添加
          </n-button>
          <n-button
            secondary
            :disabled="checkedRowKeysRef.length > 1 ? false : true"
            @click="handleBatch"
            type="error"
          >
            <template #icon>
              <n-icon><RemoveIcon /></n-icon>
            </template>
            批量删除
          </n-button>
        </n-button-group>

        <div class="flex align-center">
          <!--当前刷新-->
          <Reload @reload-data="reloadPage" />
        </div>
      </div>
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
        @update:checked-row-keys="handleCheck"
      />

      <n-pagination
        v-model:page="pagination.page"
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
        <template #prefix> 共 {{ itemCount }} 项 </template>
      </n-pagination>
    </div>

    <DictModal ref="dictModalRef" width="700px" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref, reactive, toRaw, onMounted } from "vue";
import { useMessage, FormInst } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import Reload from "@/components/Reload/Reload.vue";
import DictModal from "./dictModal.vue";
// import Explain from "@/components/Explain/Explain.vue";
import {
  Add as AddIcon,
  TrashOutline as RemoveIcon,
  CreateOutline as CreateIcon,
  AddOutline as Add,
} from "@vicons/ionicons5";
import { tableDataItem } from "./type";
// import { data } from "./data";
import { pageSizes } from "@/config/table";
import { getDict } from "@/api/system/dict";
import { PaginationState } from "@/api/type";

export default defineComponent({
  name: "Dict",
  components: { AddIcon, RemoveIcon, Reload, DictModal },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const loading = ref(false);
    const dictModalRef = ref();
    const checkedRowKeysRef = ref<string[]>([]);
    const queryValue = ref({
      name: "",
    });
    const pagination = reactive({
      page: 1,
      pageSize: 10,
    });
    const itemCount = ref(null);
    const data = ref<tableDataItem[]>([]);
    const message = useMessage();

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      getData({ page: 1, pageSize: 10 });
    };
    const reset = () => {
      unref(queryValue).name = "";
      getData({ page: 1, pageSize: 10 });
    };

    onMounted(() => {
      getData({ page: 1, pageSize: 10 });
    });

    const getData = async (pagination: PaginationState) => {
      loading.value = true;
      try {
        let res = await getDict({ ...pagination, ...queryValue.value });
        data.value = res.data;
        itemCount.value = res.itemCount;
        loading.value = false;
      } catch (err) {
        console.log(err);
      }
    };

    function handleCheck(rowKeys: string[]) {
      console.log(rowKeys);
      checkedRowKeysRef.value = rowKeys;
    }

    function handleBatch() {
      console.log("点击了批量删除");
    }

    function handleAdd() {
      console.log("点击了新增");
      const { showModal } = dictModalRef.value;
      showModal("新增用户");
    }

    function handleEdit(record: Recordable) {
      const { showModal } = dictModalRef.value;
      showModal("编辑字典", record);
    }

    function handlePositiveClick(record: Recordable) {
      message.info("点击了删除", record);
      console.log("点击了删除", record);
    }
    function reloadPage() {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    }

    function handlePage(page: number) {
      console.log(page);
      pagination.page = page;
      getData(toRaw(pagination));
    }
    function handlePageSize(pageSize: number) {
      console.log(pageSize);
      pagination.pageSize = pageSize;
      getData(toRaw(pagination));
    }

    const columns = [
      {
        type: "selection",
      },
      {
        title: "序号",
        key: "index",
        width: 70,
        align: "center",
        render(_: tableDataItem, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "字典名称",
        key: "name",
        align: "center",
      },
      {
        title: "字典编码",
        key: "code",
        align: "center",
      },
      {
        title: "排序",
        key: "sort",
        width: 80,
        align: "center",
      },
      {
        title: "是否有子词条",
        key: "status",
        width: 110,
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: "350px",
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "添加子词条",
                type: "primary",
                icon: Add,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
              {
                label: "删除",
                type: "error",
                icon: RemoveIcon,
                secondary: true,

                auth: ["dict002"],
                popConfirm: {
                  onPositiveClick: handlePositiveClick.bind(null, record),
                  title: "您确定删除?",
                },
              },
            ],
          });
        },
      },
    ];

    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      getData({ page: 1, pageSize: 10 });
    }

    return {
      formRef,
      dictModalRef,
      queryValue,
      checkedRowKeysRef,
      pagination,
      itemCount,
      pageSizes,
      loading,
      data,
      columns,
      getRowKeyId: (row: tableDataItem) => row.id,
      searchHandle,
      handleCheck,
      reset,
      reloadPage,
      handlePage,
      handlePageSize,
      handleAdd,
      handleSaveAfter,
      handleBatch,
    };
  },
});
</script>
<style lang="scss" scoped>
.dict {
  height: 100%;
  box-sizing: border-box;
}
</style>
