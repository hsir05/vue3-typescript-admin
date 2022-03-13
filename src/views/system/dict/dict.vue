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
          <n-button type="primary">
            <template #icon>
              <n-icon><AddIcon /></n-icon> </template
            >添加
          </n-button>
          <n-button secondary :disabled="checkedRowKeysRef.length > 1 ? false : true" type="error">
            <template #icon>
              <n-icon><RemoveIcon /></n-icon>
            </template>
            批量删除
          </n-button>
        </n-button-group>

        <div class="flex align-center">
          <!-- 提示 -->
          <Explain title="配置说明">
            <n-alert title="关于字典的说明" type="warning">
              字典统一管理本系统中的枚举值，即字典中的词条，词条的名称用来在用户交互界面显示，词条编码为数据库中实际的保存值，参与业务。
              关于新增词条的说明
            </n-alert>
            <n-alert title="关于新增词条的说明" type="warning">
              新增词条时需要规定词条编码，词条编码统一使用两位[三位]大写字母加5位[4位]数字的格式（如：AT00001），编码一经规定不能修改，建议设计词条编码时一定慎重！
            </n-alert>
          </Explain>

          <!--当前刷新-->
          <Reload @reload-data="reloadPage" />
        </div>
      </div>
      <n-data-table
        :loading="loading"
        ref="table"
        striped
        :columns="columns"
        :scroll-x="1090"
        class="box-border"
        min-height="300px"
        flex-height
        :row-key="getRowKeyId"
        :data="data"
        :pagination="false"
        @update:checked-row-keys="handleCheck"
      />

      <n-pagination
        v-model:page="pagParam.page"
        v-model:page-size="pagParam.pageSize"
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

    <DictModal ref="dictModalRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, unref, reactive } from "vue";
import { useMessage, FormInst } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import Reload from "@/components/Reload/Reload.vue";
import DictModal from "./dictModal.vue";
import Explain from "@/components/Explain/Explain.vue";
import {
  Add as AddIcon,
  TrashOutline as RemoveIcon,
  CreateOutline as CreateIcon,
} from "@vicons/ionicons5";
import { tableDataItem } from "./type";
import { data } from "./data";
import { pageSizes } from "@/config/table";
export default defineComponent({
  name: "Dict",
  components: { AddIcon, RemoveIcon, Reload, DictModal, Explain },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const loading = ref(false);
    const dictModalRef = ref();
    const checkedRowKeysRef = ref<string[]>([]);
    const queryValue = ref({
      name: "",
    });
    const pagParam = reactive({
      page: 1,
      pageSize: 10,
    });
    const itemCount = ref(100);
    const message = useMessage();

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      console.log(queryValue.value);
    };
    const reset = () => {
      unref(queryValue).name = "";
    };

    function handleCheck(rowKeys: string[]) {
      console.log(rowKeys);
      checkedRowKeysRef.value = rowKeys;
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record.id);
      const { showModal } = dictModalRef.value;
      showModal();
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
      pagParam.page = page;
    }
    function handlePageSize(pageSize: number) {
      console.log(pageSize);
      pagParam.pageSize = pageSize;
    }

    const columns = [
      {
        type: "selection",
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
        align: "center",
      },
      {
        title: "是否有子词条",
        key: "status",
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: "230px",
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

    return {
      formRef,
      dictModalRef,
      queryValue,
      checkedRowKeysRef,
      pagParam,
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
