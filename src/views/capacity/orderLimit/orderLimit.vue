<template>
  <div class="h-full box-border open-area">
    <div class="open-area-left">
      <div class="m-10px flex-align-start">
        <n-form-item
          ref="formRef"
          label-width="70"
          label="开通城市"
          label-placement="left"
          :rule="rule"
        >
          <n-select
            v-model:value="cityCode"
            clearable
            filterable
            placeholder="选择开通城市"
            style="width: 260px"
            :options="openCityData"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="queryData"
        >
          查找</n-button
        >
      </div>

      <!-- 表格 -->
      <n-data-table
        ref="table"
        :loading="loading"
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 285px)"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>

    <div class="right">
      <n-data-table
        ref="table"
        v-if="isSee"
        :data="orderLimitData"
        :columns="orderColumns"
        class="box-border"
        :row-key="getRowKeyId"
        :pagination="false"
      />

      <OrderEdit v-if="isEdit" :orderLimitData="orderLimitData" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import { FormInst } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { TableDataInter, AreaInter } from "./type";
import { statusOptions } from "@/config/form";
import OrderEdit from "./orderEditItem.vue";
import { EyeOutline as EyeIcon, CreateOutline as CreateIcon } from "@vicons/ionicons5";
// import { getOpenCity, getOpenCityArea, getOrderLimit, realTimeOrderTopLimit } from "@/api/capacity/capacity"
import { getOpenCity, getOpenCityArea, getOrderLimit } from "@/api/capacity/capacity";
import { getVehicleType } from "@/api/operate/operate";
import { objInter } from "@/interface/common/common";
export default defineComponent({
  name: "OrderLimit",
  components: {
    OrderEdit,
  },
  setup() {
    const cityCode = ref("110000");
    const loading = ref(false);
    const openCityData = ref([]);
    const vehicleTypeData = ref([]);
    const formRef = ref<FormInst | null>(null);
    const isSee = ref(false);
    const isEdit = ref(false);

    const data = ref([]);
    const orderLimitData = ref([]);
    const vehicleTypeObj: objInter = {};

    const columns = [
      {
        title: "开通区域",
        key: "areaName",
        align: "center",
      },
      {
        title: "区域编码",
        key: "areaCode",
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 100,
        render(record: AreaInter) {
          return h(TableActions as any, {
            actions: [
              {
                label: "x详情",
                type: "primary",
                isIconBtn: true,
                icon: EyeIcon,
                onClick: handle.bind(null, record, "isSee"),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handle.bind(null, record, "isEdit"),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];
    const orderColumns = [
      {
        title: "车型",
        key: "vehicleType",
        align: "center",
        render(row: TableDataInter) {
          return h("span", vehicleTypeObj[row.vehicleType]);
        },
      },
      {
        title: "单量上限",
        key: "orderTopLimit",
        align: "center",
      },
      {
        title: "用车前占用时间",
        key: "beforeUseVehicleMinute",
        align: "center",
      },
      {
        title: "用车后占用时间",
        key: "afterUseVehicleMinute",
        align: "center",
      },
    ];

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      try {
        let result = await getVehicleType({ operationCompanyId: "" });
        vehicleTypeData.value = result.data;

        for (let key of result.data) {
          vehicleTypeObj[key.vehicleTypeId] = key.vehicleTypeName;
        }

        let res = await getOpenCity();
        openCityData.value = res.data.map((item: { cityName: string; cityCode: string }) => {
          return {
            label: item.cityName,
            value: item.cityCode,
          };
        });
      } catch (err) {
        console.log(err);
      }
    };
    async function queryData() {
      try {
        await formRef.value?.validate();
        try {
          loading.value = true;
          let res = await getOpenCityArea({ cityCode: cityCode.value });
          data.value = res.data;
          loading.value = false;
        } catch (err) {
          console.log(err);
          loading.value = false;
        }
      } catch (err) {
        console.log(err);
      }
    }

    async function handle(record: AreaInter, type: string) {
      let result = await getOrderLimit({ areaCode: record.areaCode as string });
      console.log(result.data);
      orderLimitData.value = result.data;
      if (type === "isSee") {
        isSee.value = true;
        isEdit.value = false;
      } else {
        isEdit.value = true;
        isSee.value = false;
      }
    }

    async function submit() {
      try {
        // let res = await realTimeOrderTopLimit()
        // console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    function handleEditArea() {}

    return {
      loading,
      cityCode,
      formRef,
      openCityData,
      data,
      isEdit,
      isSee,
      orderLimitData,
      orderColumns,
      columns,
      statusOptions,
      submit,
      getRowKeyId: (row: TableDataInter) => row.realTimeOrderTopLimitId,
      rule: {
        trigger: ["input", "blur"],
        validator() {
          if (cityCode.value === null) {
            return new Error("选择开通城市");
          }
        },
      },
      editRules: {
        areaName: { required: true, trigger: ["blur", "change"], message: "请输入区域名称" },
      },
      queryData,
      handleEditArea,
    };
  },
});
</script>
<style lang="scss" scoped>
.open-area {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;

  .open-area-left {
    width: 37%;
    background-color: $white;
  }

  .right {
    width: 50%;
    height: auto;
    overflow: scroll;
    background-color: $white;
    box-sizing: border-box;
    padding-top: 5px;
    padding-left: 5px;
    position: relative;
    margin-left: 15px;
  }
}
</style>
