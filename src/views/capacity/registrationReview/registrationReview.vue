<template>
  <div class="h-full bg-white">
    <n-tabs type="segment" @update:value="handleUpdateValue">
      <n-tab-pane name="DRS0004" tab="平台未审核司机">
        <n-data-table
          :loading="loading"
          ref="table"
          min-height="calc(100vh - 310px)"
          flex-height
          striped
          :columns="columns"
          class="box-border tabs-table"
          :row-key="getRowKeyId"
          :data="data"
          :pagination="pagination"
        />
      </n-tab-pane>
      <n-tab-pane name="DRS0005" tab="平台审核通过司机">
        <n-data-table
          :loading="loading"
          ref="table"
          striped
          :columns="columns"
          min-height="calc(100vh - 310px)"
          flex-height
          class="box-border"
          :row-key="getRowKeyId"
          :data="data"
          :pagination="pagination"
        />
      </n-tab-pane>
      <n-tab-pane name="DRS0006" tab="平台审核为通过司机">
        <n-data-table
          :loading="loading"
          ref="table"
          striped
          :columns="columns"
          min-height="calc(100vh - 310px)"
          flex-height
          class="box-border"
          :row-key="getRowKeyId"
          :data="data"
          :pagination="pagination"
        />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, h } from "vue";
import { tableDataItem } from "./type";
import { getAllOperateCompany } from "@/api/common/common";
import { getDriverRegisterPage } from "@/api/capacity/capacity";
import { PaginationState } from "@/api/type";
import dayjs from "dayjs";
export default defineComponent({
  name: "RegistrationReview",
  setup() {
    const loading = ref(false);
    const data = ref([]);
    const companyData = ref([]);
    const itemCount = ref(null);
    const queryValue = ref({
      registerStateEq: "DRS0004",
      driverFullNameLike: null,
      driverPhoneLike: null,
      operationCompanyIdEq: null,
      plateNumberLike: null,
      driverRegTimeGe: null,
      driverRegTimeLe: null,
      companyCheckTimeGe: null,
      companyCheckTimeLe: null,
      platformCheckTimeGe: null,
      platformCheckTimeLe: null,
    });
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
      {
        title: "司机姓名",
        key: "driverFullName",
        align: "center",
      },
      {
        title: "司机手机号",
        key: "driverPhone",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "司机身份证号",
        key: "driverIdentityCardNo",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "运营企业",
        key: "operationCompanyName",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "车牌号",
        key: "plateNumber",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "车辆类型",
        key: "vehicleBrand",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "注册时间",
        key: "registerSubmitTime",
        align: "center",
        render(record: tableDataItem) {
          return h("span", dayjs(record.registerSubmitTime).format("YYYY-MM-DD HH:mm"));
        },
      },
      {
        title: "司机注册状态",
        key: "driverState",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
      {
        title: "企业审核时间",
        key: "companyCheckTime",
        align: "center",
        ellipsis: {
          tooltip: true,
        },
      },
    ];

    onMounted(() => {
      getAllCompanyData();
      getData({ pageIndex: 1, pageSize: 10 });
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
    const getData = async (page: PaginationState) => {
      loading.value = true;
      try {
        let search = { ...queryValue.value };
        let res = await getDriverRegisterPage({ page, search: search });
        console.log(res);

        data.value = res.data.content;
        itemCount.value = res.data.totalElements;
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const handleUpdateValue = (value: string) => {
      console.log(value);
      data.value = [];
      queryValue.value.registerStateEq = value;
      getData({ pageIndex: 1, pageSize: 10 });
    };

    return {
      loading,
      queryValue,
      itemCount,
      pagination: {
        pageSize: 10,
      },
      getRowKeyId: (row: tableDataItem) => row.driverRegisterId,

      data,
      handleUpdateValue,
      columns,
    };
  },
});
</script>
<style lang="scss">
// .tabs{
//     height: 100%;
// }
// .tabs-table{
//     height: 100%;
// }
</style>
