<template>
  <div class="bg-white p-10px" style="calc(100% - 95px)">
    <!-- 顶部功能区 -->
    <div class="flex pb-10px">
      <n-button-group>
        <n-button type="primary" @click="handleAdd" v-if="getBindValues.isAddBtn"
          ><template #icon>
            <n-icon><AddIcon /></n-icon> </template
          >添加</n-button
        >
        <n-button
          v-if="getBindValues.isBatchBtn"
          secondary
          @click="handleBatch"
          :disabled="checkedRowKeysRef.length > 0 ? false : true"
          type="error"
        >
          <!-- <template #icon>
            <n-icon><RemoveIcon /></n-icon>
          </template> -->
          {{ getBindValues.batchText }}
        </n-button>
        <slot name="toolbarLeft"></slot>
      </n-button-group>

      <div class="flex align-center">
        <slot name="toolbarRight"></slot>
        <!-- 提示 -->
        <!-- <Explain title="配置说明">配置说明</Explain> -->
        <!--密度-->
        <Density :tableSize="tableSize" @handle-density="handleDensity" />
        <!--当前刷新-->
        <Reload @reload-data="reloadPage" />
      </div>
    </div>
    <!-- 表格 -->
    <n-data-table
      ref="table"
      :size="tableSize"
      striped
      v-bind="getBindValues"
      class="box-border"
      :min-height="getTableHeight"
      flex-height
      :pagination="false"
      @update:checked-row-keys="handleCheck"
    />
    <!-- 分页 -->
    <n-pagination
      v-if="getItemCount"
      v-model:page="pageIndex"
      v-model:page-size="pageSize"
      v-model:item-count="getItemCount"
      :page-slot="5"
      :show-size-picker="true"
      :show-quick-jumper="true"
      class="mt-10px justify-end"
      :on-update:page="handlePage"
      :on-update:page-size="handlePageSize"
      :page-sizes="pageSizes"
    >
      <template #prefix> 共 {{ getItemCount }} 项 </template>
    </n-pagination>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRaw, unref, computed, reactive, toRefs } from "vue";
import Reload from "@/components/Reload/Reload.vue";
import Density from "@/components/Density/Density.vue";
import { Add as AddIcon } from "@vicons/ionicons5";
// import { tableDataItem } from "./type";
import { pageSizes } from "@/config/table";
import { basicProps } from "./props";
export default defineComponent({
  name: "Table",
  components: { AddIcon, Reload, Density },
  props: {
    ...basicProps,
  },
  emits: ["on-add", "on-batch", "on-checked-row", "reload-page", "on-page", "on-pagSize"],
  setup(props, { emit }) {
    const checkedRowKeysRef = ref<string[]>([]);
    const tableSize = ref("medium");

    const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
    });

    const getTableHeight = computed(
      () => `calc(100vh - 95px - ${unref(props).itemCount ? "280px" : "245px"})`
    );

    const getBindValues = computed(() => {
      return {
        ...unref(props),
        columns: toRaw(unref(props).columns),
        loading: toRaw(unref(props).loading),
        data: toRaw(unref(props).data),
        isAddBtn: toRaw(unref(props).isAddBtn),
        batchText: toRaw(unref(props).batchText),
        isBatchBtn: toRaw(unref(props).isBatchBtn),
      };
    });
    const getItemCount = computed(() => {
      return toRaw(unref(props).itemCount);
    });
    // 新增
    function handleAdd() {
      emit("on-add");
    }
    function handleBatch() {
      emit("on-batch");
    }
    // 表格多选
    function handleCheck(rowKeys: string[]) {
      checkedRowKeysRef.value = rowKeys;
      emit("on-checked-row", rowKeys);
    }
    // 数据刷新
    function reloadPage() {
      emit("reload-page");
    }
    // 表格密度显示
    function handleDensity(value: string) {
      tableSize.value = value;
    }
    // 分页
    function handlePage(pageIndex: number) {
      pagination.pageIndex = pageIndex;
      emit("on-page", unref(pagination));
    }
    // 每页显示
    function handlePageSize(pageSize: number) {
      pagination.pageSize = pageSize;
      emit("on-pagSize", unref(pagination));
    }

    function resetPagination() {
      pagination.pageIndex = 1;
      pagination.pageSize = 10;
    }

    return {
      checkedRowKeysRef,
      ...toRefs(pagination),
      getItemCount,
      pageSizes,
      tableSize,
      getBindValues,
      item: 15,
      getTableHeight,

      handleCheck,
      handleAdd,
      handleBatch,
      reloadPage,
      handlePage,
      handlePageSize,
      handleDensity,
      resetPagination,
    };
  },
});
</script>
<style lang="scss" scoped></style>
