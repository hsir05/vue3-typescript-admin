<template>
  <BasicDrawer v-model:show="isDrawer" title="批量添加代金券" @on-close-after="onCloseAfter" style="width: 900px">
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="90"
      style="flex-wrap: wrap"
      class="pt-15px bg-white mb-5px"
      :model="form"
    >
      <n-form-item label="开始时间" path="beginTimeGe">
        <n-date-picker v-model:value="form.beginTimeGe" style="width: 210px" type="date" clearable/>
      </n-form-item>

      <n-form-item label="结束时间" path="beginTimeLe">
        <n-date-picker v-model:value="form.beginTimeLe" type="date" style="width: 210px" clearable/>
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="query">搜索</n-button>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" class="mr-10px" @click="handleBatch"
        >批量添加
        </n-button>
      </n-form-item>
    </n-form>
    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :itemCount="itemCount"
      @reload-page="reloadPage"
      @on-pagination="handlePagSize"
    />

    <CodeDetailModal ref="codeDetailModalRef" />
    <CodeDrawer ref="codeDrawerRef" :width="650" @on-save-after="handleSaveAfter"/>
  </BasicDrawer>
</template>
<script lang="ts">
import {defineComponent, reactive, h, ref, toRefs, toRaw} from "vue";
import { FormInst } from "naive-ui";
import CodeDrawer from "./codeDrawer.vue";
import TableActions from "@/components/TableActions/TableActions.vue";
import { RefreshCircleOutline as RefreshIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import CodeDetailModal from "./codeDetailModal.vue";

import {CouponInter, DataImportTaskITemInter} from "./type";
import dayjs from "dayjs";
import {dataImportTaskDetail, dataImportTaskPage} from "@/api/common/common";
import BasicTable from "@/components/Table/Table.vue";
import {PaginationInter} from "@/api/type";
import loading from "naive-ui/lib/_internal/loading";
export default defineComponent({
  name: "BatchCodeDrawer",
  components: { CodeDetailModal, CodeDrawer ,BasicTable},
  setup() {
    const state = reactive({
      isDrawer: false,
      loading: false,
    });
    const title = ref();
    const loading = ref(false);
    const itemCount = ref(null);
    const codeDetailModalRef = ref();
    const codeDrawerRef = ref();
    const formRef = ref<FormInst | null>(null);
    const form = ref({
      importType: "",
      beginTimeLe: null,
      beginTimeGe: null,
    });
    const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
    });
    const basicTableRef = ref();
    const data = ref<DataImportTaskITemInter[]>([]);
    const columns = [
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: DataImportTaskITemInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "任务名称",
        key: "taskName",
        align: "center",
      },
      {
        title: "开始时间",
        key: "beginTime",
        align: "center",
        render(record: DataImportTaskITemInter) {
          return h(
            "span",
            dayjs(record.beginTime).format("YYYY-MM-DD HH:mm:ss")
          );
        },
      },
      {
        title: "总条数",
        key: "importCount",
        align: "center",
      },
      {
        title: "生成条数",
        key: "successCount",
        align: "center",
      },
      {
        title: "任务状态",
        key: "state",
        align: "center",
        render(record: DataImportTaskITemInter) {
          return h(
            "span",
            record.endTime === null ? "生成中" : "已完成"
          );
        },
      },
      {
        title: "操作人",
        key: "operatorName",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        width: "90px",
        render(record: DataImportTaskITemInter) {
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
    function openDrawer(t: string) {
      title.value = t;
      console.info(t)
      //uploadList.value = [];
      data.value = []
      getData(pagination);
      state.isDrawer = true;
    }

    function query() {
      getData({pageIndex: 1, pageSize: 10})
    }

    function handleBatch() {
      const {openDrawer} = codeDrawerRef.value;
      openDrawer("批量添加兑换码",false);
    }

    function handleRefresh(record: Recordable) {
      const index = data.value?.findIndex((item: { dataImportTaskId: string }) => item.dataImportTaskId === record.dataImportTaskId);
      if (index != undefined && index >= 0) {
        let dataImportTask = data.value.at(index)
        if (dataImportTask != undefined) {
          getDetail(dataImportTask.dataImportTaskId, index)
        }
      }
    }

    function handleDetail(record: Recordable) {
      console.log(record);
      const {handleModal} = codeDetailModalRef.value;
      handleModal(record);
    }

    function onCloseAfter() {
      state.isDrawer = false;
      state.loading = false;
    }

    const getDetail = async (dataImportTaskId: string, index: number) => {
      loading.value = true;
      try {
        let res = await dataImportTaskDetail({dataImportTaskId: dataImportTaskId});
        data.value.forEach(function (item: any) {
          if (item.dataImportTaskId === dataImportTaskId) {
            data.value.splice(index, res.data)
          }
        })
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getData = async (page: PaginationInter) => {
      loading.value = true;
      try {
        form.value.importType = "IMP0003";
        let search = {...form.value};
        let res = await dataImportTaskPage({page, search: search});
        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function reloadPage() {
      const {resetPagination} = basicTableRef.value;
      resetPagination();
      getData({pageIndex: 1, pageSize: 10});
    }

    function handlePagSize(pagination: PaginationInter) {
      console.log(toRaw(pagination));
      getData(toRaw(pagination));
    }

    function handleSaveAfter() {
      reloadPage()
    }

    return {
      form,
      formRef,
      data,
      codeDetailModalRef,
      basicTableRef,
      columns,
      title,
      ...toRefs(state),
      pagination: {
        pageSize: 10,
      },
      itemCount,
      query,
      openDrawer,
      codeDrawerRef,
      onCloseAfter,
      handleBatch,
      reloadPage,
      handlePagSize,
      handleSaveAfter
    };
  },
});
</script>
