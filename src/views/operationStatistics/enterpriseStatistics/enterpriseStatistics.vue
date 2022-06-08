<template>
  <div>
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      :show-feedback="false"
      label-width="100"
      :model="queryForm"
    >
      <n-form-item label="运营企业" label-placement="left">
        <n-select
          v-model:value="queryForm.operationCompanyId"
          clearable
          filterable
          placeholder="选择运营企业"
          style="width: 260px"
          :options="companyData"
        />
      </n-form-item>

      <div class="flex-center">
        <n-form-item label="时间区间" path="section">
          <n-date-picker
            v-model:value="queryForm.section"
            style="width: 250px"
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
        >查找
        </n-button>
      </div>
    </n-form>

    <div class="flex mt-20px bg-white p-10px">
      <span>单量总计</span>
      <span>完成 / 取消</span>
    </div>

    <n-data-table
      :loading="loading"
      ref="table"
      striped
      :columns="columns"
      class="box-border mb-15px p-10px bg-white"
      :row-key="getRowKeyId"
      :data="data"
      :pagination="false"
    />
    <div class="flex mt-20px bg-white p-10px">
      <span>每日单量</span>
      <div class="flex">
        <n-select
          style="width: 100px; margin-right: 10px"
          filterable
          v-model:value="orderType"
          @update:value="handleOrderType"
          :options="orderTypeOption"
        />
        <n-select
          style="width: 100px"
          filterable
          v-model:value="status"
          @update:value="handleStatus"
          :options="orderStateType"
        />
      </div>
    </div>

    <n-spin :show="loading" class="bg-white">
      <Order :data="lineData" :xAxisData="dateData" :legendData="legendData" />
    </n-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import {
  TableDataItemInter,
  ArrItemInter,
  ItemInter,
  OrderItemInter,
  DataItemInter,
  VehicleTypeDataInter,
} from "./type";
import Order from "./order.vue";
import dayjs from "dayjs";
import { orderStateType } from "@/config/form";
import { getCompanyOrder } from "@/api/operationStatistics/operationStatistics";
import { getAllOperateCompany, getDict } from "@/api/common/common";
import { getVehicleType } from "@/api/operate/operate";
import { rangeShortcuts } from "@/config/table";
import { objInter } from "@/interface/common/common";
export default defineComponent({
  name: "EnterpriseStatistics",
  components: {
    Order,
  },
  setup() {
    const loading = ref(false);
    const status = ref("finished");
    const orderType = ref("orderType");

    interface OrderTypeInter {
      entryCode: string;
      entryId: string;
      entryName: string;
    }
    const orderTypeData = ref<OrderTypeInter[]>([]);
    const companyData = ref<ItemInter[]>([]);

    const vehicleTypeData = ref<VehicleTypeDataInter[]>([]);
    const queryForm = ref({
      section: [new Date().getTime() - 6 * 60 * 60 * 1000 * 24, new Date().getTime()],
      operationCompanyId: "allCompany",
    });


    const legendData = ref<string[]>([]);
    const lineData = ref<ArrItemInter[]>([]);
    const dateData = ref<string[]>([]);
    const allData = ref<DataItemInter[]>([]);

    const data = ref([]);

    const columns = [
      {
        title: "#",
        key: "orderTypeName",
        align: "center",
      },
      {
        title: "立即",
        key: "liji",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", `${row.liji.finished}/${row.liji.cancelled}`);
        },
      },
      {
        title: "预约",
        key: "yuyue",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", `${row.yuyue.finished}/${row.yuyue.cancelled}`);
        },
      },
      {
        title: "接机",
        key: "jieji",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", `${row.jieji.finished}/${row.jieji.cancelled}`);
        },
      },
      {
        title: "送机",
        key: "songji",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", `${row.songji.finished}/${row.songji.cancelled}`);
        },
      },
      {
        title: "半日租",
        key: "banrizu",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", `${row.banrizu.finished}/${row.banrizu.cancelled}`);
        },
      },
      {
        title: "全日租",
        key: "quanrizu",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", `${row.quanrizu.finished}/${row.quanrizu.cancelled}`);
        },
      },
      {
        title: "总计",
        key: "total",
        align: "center",
        render(row: TableDataItemInter) {
          return h("span", `${row.total.finished}/${row.total.cancelled}`);
        },
      },
    ];

    onMounted(() => {
      orderStateType.pop();
      getAllData();
    });

    const getAllData = async () => {
      loading.value = true;
      try {
        let response = await getDict({ parentEntryCode: "OT00000" });
        orderTypeData.value = response.data;

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
        companyData.value.unshift({ label: "全部", value: "allCompany" });

        let result = await getVehicleType({ operationCompanyId: "" });
        vehicleTypeData.value = result.data;

        getData();
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getData = async () => {
      try {
        loading.value = true;
        data.value = [];
        let option = {
          operationCompanyId: queryForm.value.operationCompanyId,
          beginDate: dayjs(queryForm.value.section[0]).format("YYYY-MM-DD") as string,
          endDate: dayjs(queryForm.value.section[1]).format("YYYY-MM-DD") as string,
        };
        let res = await getCompanyOrder(option);
        // console.log(res.data);
        allData.value = res.data;

        let orderType: objInter = {
          OT00001: "liji",
          OT00002: "yuyue",
          OT00003: "jieji",
          OT00004: "songji",
          OT00005: "banrizu",
          OT00006: "quanrizu",
        };

        let total = {
          orderTypeName: "总计",
          liji: {
            finished: 0,
            cancelled: 0,
          },
          yuyue: {
            finished: 0,
            cancelled: 0,
          },
          jieji: {
            finished: 0,
            cancelled: 0,
          },
          songji: {
            finished: 0,
            cancelled: 0,
          },
          banrizu: {
            finished: 0,
            cancelled: 0,
          },
          quanrizu: {
            finished: 0,
            cancelled: 0,
          },
          total: {
            finished: 0,
            cancelled: 0,
          },
        };
        for (let key of vehicleTypeData.value) {
          let arr = res.data.filter(
            (item: DataItemInter) => item.vehicleTypeId === key.vehicleTypeId
          );
          let tableData: OrderItemInter = {
            liji: {
              finished: 0,
              cancelled: 0,
            },
            yuyue: {
              finished: 0,
              cancelled: 0,
            },
            jieji: {
              finished: 0,
              cancelled: 0,
            },
            songji: {
              finished: 0,
              cancelled: 0,
            },
            banrizu: {
              finished: 0,
              cancelled: 0,
            },
            quanrizu: {
              finished: 0,
              cancelled: 0,
            },
            total: {
              finished: 0,
              cancelled: 0,
            },
          };
          tableData["orderTypeName"] = key.vehicleTypeName;
          for (let key of arr) {
            if (key.orderBelong === "finished") {
              //@ts-ignore
              tableData[orderType[key.orderTypeCode]].finished += key.orderCount;
              //@ts-ignore
              tableData.total.finished += key.orderCount;
              //@ts-ignore
              total[orderType[key.orderTypeCode]].finished += key.orderCount;
              total.total.finished += key.orderCount;
            }
            if (key.orderBelong === "cancelled") {
              //@ts-ignore
              tableData[orderType[key.orderTypeCode]].cancelled += key.orderCount;
              //@ts-ignore
              tableData.total.cancelled += key.orderCount;
              //@ts-ignore
              total[orderType[key.orderTypeCode]].cancelled += key.orderCount;
              total.total.cancelled += key.orderCount;
            }
          }
          //@ts-ignore
          data.value.push(tableData);
        }
        //@ts-ignore
        data.value.push(total);

        getLineData();

        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getLineData = () => {
      let arr: Array<number[]> = [];
      dateData.value = [];
      legendData.value = [];
      for (let i = 0; i < allData.value.length; i++) {
        let date = allData.value[i].date;
        if (dateData.value.indexOf(date) === -1) {
          dateData.value.push(date);
        }
      }
      if (orderType.value === "orderType") {
        for (let key of orderTypeData.value) {
          legendData.value.push(key.entryName);
          let seriesData: Array<number> = [];
          for (let i = 0; i < dateData.value.length; i++) {
            let orderCount = 0;
            for (let j = 0; j < allData.value.length; j++) {
              if (
                allData.value[j].date === dateData.value[i] &&
                allData.value[j].orderBelong === status.value &&
                allData.value[j].orderTypeCode === key.entryCode
              ) {
                orderCount += allData.value[j].orderCount;
              }
            }
            seriesData.push(orderCount);
          }
          arr.push(seriesData);
        }
      } else {
        for (let key of vehicleTypeData.value) {
          legendData.value.push(key.vehicleTypeName);
          let seriesData: Array<number> = [];
          for (let i = 0; i < dateData.value.length; i++) {
            let orderCount = 0;
            for (let j = 0; j < allData.value.length; j++) {
              if (
                allData.value[j].date === dateData.value[i] &&
                allData.value[j].orderBelong === status.value &&
                allData.value[j].vehicleTypeId === key.vehicleTypeId
              ) {
                orderCount += allData.value[j].orderCount;
              }
            }
            seriesData.push(orderCount);
          }
          arr.push(seriesData);
        }
      }
      lineData.value = arr;
    };

    function query() {
      getData();
    }

    function handleStatus() {
      getLineData();
    }

    function handleOrderType() {
      getLineData();
    }

    return {
      loading,
      status,
      orderType,
      orderTypeOption: [
        {
          label: "订单类型",
          value: "orderType",
        },
        {
          label: "车辆类型",
          value: "veichleType",
        },
      ],
      queryForm,
      columns,
      data,
      legendData,
      pagination: {
        pageSize: 10,
      },
      companyData,
      dateData,
      lineData,
      getRowKeyId: (row: TableDataItemInter) => row.id,
      rangeShortcuts,
      orderStateType,

      query,
      handleStatus,
      handleOrderType,
    };
  },
});
</script>
