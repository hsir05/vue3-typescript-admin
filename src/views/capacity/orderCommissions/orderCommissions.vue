<template>
  <div class="h-full overflow-hidden box-border">
    <!-- 搜索 -->
    <n-form
      ref="formRef"
      inline
      :rule="rule"
      label-placement="left"
      label-width="90"
      class="pt-15px pb-15px bg-white mb-10px"
      :show-feedback="false"
      :model="queryValue"
    >
      <n-form-item label="运营企业" path="operationCompanyId">
        <n-select
          clearable
          style="width: 300px"
          filterable
          v-model:value="queryValue.operationCompanyId"
          placeholder="选择运营企业"
          @update:value="handleUpdateCompany"
          :options="companyData"
        />
      </n-form-item>

      <n-form-item label="开通区域" path="areaCode">
        <n-select
          clearable
          filterable
          style="width: 150px"
          v-model:value="queryValue.areaCode"
          placeholder="选择开通区域"
          :options="openAreaData"
        />
      </n-form-item>

      <n-form-item>
        <n-button attr-type="button" type="primary" @click="searchHandle">查询</n-button>
        <n-button attr-type="button" type="warning" class="ml-10px" @click="reset">重置</n-button>
      </n-form-item>
    </n-form>

    <!-- 表格 -->
    <BasicTable
      :data="data"
      ref="basicTableRef"
      :columns="columns"
      :loading="loading"
      :isBatchBtn="true"
      batchText="批量修改"
      :row-key="getRowKeyId"
      :itemCount="null"
      @reload-page="reloadPage"
      @on-batch="handleBatch"
      @on-checked-row="handleCheckRow"
    />

    <OrderComDrawer ref="orderComDrawerRef" :width="500" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import TableActions from "@/components/TableActions/TableActions.vue";

import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import BasicTable from "@/components/Table/Table.vue";
import OrderComDrawer from "./orderComDrawer.vue";
import { TableDataInter } from "./type";
import { getRatePage } from "@/api/capacity/capacity";
import { getCompanyOpenArea } from "@/api/operate/operate";
import { getAllOperateCompany } from "@/api/common/common";
export default defineComponent({
  name: "OrderCommissions",
  components: { BasicTable, OrderComDrawer },
  setup() {
    const loading = ref(false);
    const orderComDrawerRef = ref();
    const basicTableRef = ref();
    const companyData = ref([]);
    const openAreaData = ref([]);
    const rowKeysData = ref<string[]>([]);
    const queryValue = ref({
      operationCompanyId: null,
      areaCode: null,

      //   operationCompanyId: "75e642e0096b4a41a2b2ecf933c92247",
      //   areaCode: "110000A01",
    });

    const data = ref<TableDataInter[]>([]);
    const columns = [
      {
        type: "selection",
        align: "center",
      },
      {
        title: "序号",
        key: "index",
        align: "center",
        width: 70,
        render(_: TableDataInter, rowIndex: number) {
          return h("span", `${rowIndex + 1}`);
        },
      },
      {
        title: "流量方",
        key: "influxCode",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "订单业务类型",
        key: "orderBusinessType",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "订单类型",
        key: "orderType",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "流量方比率",
        key: "influxDivideRate",
        align: "center",
      },

      {
        title: "平台比率",
        key: "platformDivideRate",
        align: "center",
      },
      {
        title: "代理商比率",
        key: "agencyDivideRate",
        align: "center",
      },
      {
        title: "企业比例",
        key: "companyDivideRate",
        align: "center",
      },
      {
        title: "司机比率",
        key: "driverDivideRate",
        align: "center",
      },

      {
        title: "操作",
        key: "action",
        align: "center",
        width: "100px",
        render(record: TableDataInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getAllCompanyData();
    });

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        companyData.value = res.data.map(
          (item: { operationCompanyName: string; operationCompanyId: string }) => {
            let obj = {
              label: item.operationCompanyName,
              value: item.operationCompanyId,
            };
            return obj;
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async () => {
      loading.value = true;
      try {
        let res = await getRatePage(queryValue.value);
        console.log(res.data);
        data.value = res.data;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleCheckRow(rowKeys: string[]) {
      console.log("选择了", rowKeys);
      rowKeysData.value = rowKeys;
    }

    function handleEdit(record: Recordable) {
      console.log("点击了编辑", record);
      const { openDrawer } = orderComDrawerRef.value;
      openDrawer(record, false);
    }
    function handleBatch() {
      let dataArr = [];
      for (let key of rowKeysData.value) {
        let item = data.value.find((item: TableDataInter) => item.orderIncomeDivideRateId === key);
        if (item) {
          dataArr.push({
            orderIncomeDivideRateId: item.orderIncomeDivideRateId,
            areaCode: item.areaCode,
            influxCode: item.influxCode,
            orderType: item.orderType,
            orderBusinessType: item.orderBusinessType,
          });
        }
      }

      const { openDrawer } = orderComDrawerRef.value;
      openDrawer(
        {
          operationCompany: { operationCompanyId: queryValue.value.operationCompanyId },
        },
        true,
        dataArr
      );
    }

    const searchHandle = (e: MouseEvent) => {
      e.preventDefault();
      getData();
    };
    async function handleUpdateCompany(companyId: string) {
      console.log(companyId);
      try {
        openAreaData.value = [];
        queryValue.value.areaCode = null;
        let res = await getCompanyOpenArea({ companyId });
        console.log(res);
        openAreaData.value = res.data.map((item: { areaName: string; areaCode: string }) => {
          let obj = {
            label: item.areaName,
            value: item.areaCode,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    }
    const reset = () => {
      queryValue.value = { operationCompanyId: null, areaCode: null };
      getData();
    };

    function reloadPage() {
      getData();
    }

    // 抽屉组件保存后处理
    function handleSaveAfter() {
      console.log("抽屉组件保存后处理");
      //   getData({ page: 1, pageSize: 10 });
    }

    return {
      queryValue,
      data,
      loading,
      companyData,
      openAreaData,
      orderComDrawerRef,
      getRowKeyId: (row: TableDataInter) => row.orderIncomeDivideRateId,
      basicTableRef,
      columns,
      rule: {
        operationCompanyId: {
          required: true,
          trigger: ["blur", "input"],
          message: "请选择运营企业",
        },
        areaCode: { required: true, trigger: ["blur", "input"], message: "请选择开通区域" },
      },

      reloadPage,
      handleBatch,
      searchHandle,
      handleUpdateCompany,
      reset,
      handleCheckRow,
      handleSaveAfter,
    };
  },
});
</script>
