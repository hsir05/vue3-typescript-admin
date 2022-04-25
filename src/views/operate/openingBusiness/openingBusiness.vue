<template>
  <div class="h-full box-border opening-business">
    <!-- 左侧 -->
    <div class="opening-business-left">
      <div class="flex-align-start">
        <n-form-item
          ref="queryFormRef"
          :rule="queryRule"
          label-width="70"
          label="开通城市"
          label-placement="left"
        >
          <n-select
            v-model:value="cityCode"
            clearable
            filterable
            placeholder="选择开通城市"
            style="width: 300px"
            :options="openCityList"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="queryOpenArea"
        >
          查找</n-button
        >
      </div>

      <n-data-table
        ref="table"
        :data="data"
        :columns="columns"
        class="box-border"
        min-height="400px"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <!-- 中间 -->
    <div class="opening-business-right">
      <template v-if="isShow">
        <div
          :class="['busy-type-item', index % 2 === 0 ? '' : 'striped']"
          v-for="(vehicleType, index) in vehicleTypeData"
          :key="vehicleType.vehicleTypeId"
        >
          <span class="busy-type-content-item">{{ vehicleType.vehicleTypeName }}</span>
          <template v-if="index === 0">
            <span
              class="busy-type-content-item"
              v-for="orderType in orderTypeData"
              :key="orderType.entryId"
              >{{ orderType.entryName }}</span
            >
          </template>

          <template v-else>
            <span
              class="busy-type-content-item"
              v-for="orderType in orderTypeData"
              :key="orderType.entryId"
            >
              <n-tooltip
                trigger="hover"
                v-if="getValResult(vehicleType.vehicleTypeId, orderType.entryCode).result"
              >
                <template #trigger>
                  <n-tag
                    type="success"
                    @click="
                      toggle(
                        vehicleType,
                        orderType,
                        getValResult(vehicleType.vehicleTypeId, orderType.entryCode).obj
                      )
                    "
                    size="small"
                    >已开通</n-tag
                  >
                </template>
                点击关闭
              </n-tooltip>

              <n-tooltip trigger="hover" v-else>
                <template #trigger>
                  <n-tag type="warning" size="small" @click="toggle(vehicleType, orderType)"
                    >关闭</n-tag
                  >
                </template>
                点击开通
              </n-tooltip>
            </span>
          </template>
        </div>
      </template>
      <n-empty v-else class="empty" />
    </div>
    <!-- 右侧 -->
    <ChargeFormDrawer ref="chargeFormDrawerRef" :width="650" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, reactive, toRefs, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { tableItemProps, tableDataItem, busTypeState, vehicleState, orderTypeState } from "./type";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import { getCityOpenArea } from "@/api/operate/operate";
import ChargeFormDrawer from "./chargeFrom.vue";
import { getAllOpenCity, getDict } from "@/api/common/common";
// import { getOpenAreaBuss, delBusiness, getVehicleType } from "@/api/operate/operate";
import { getOpenAreaBuss, getVehicleType } from "@/api/operate/operate";
import { formState } from "./type";
export default defineComponent({
  name: "OpeningBusiness",
  components: {
    ChargeFormDrawer,
  },
  emits: ["on-save-after"],
  setup() {
    const data = ref([]);
    const openCityList = ref([]);
    const loading = ref(false);
    const isShow = ref(false);
    const areaCode = ref<string | null>(null);
    const chargeFormDrawerRef = ref();

    const cityCode = ref(null);
    const formRef = ref<FormInst | null>(null);
    const queryFormRef = ref<FormInst | null>(null);
    const message = useMessage();

    const state = reactive<busTypeState>({
      specialEconomic: [],
      specialComfort: [],
      specialBus: [],
      specialPremium: [],
      fastEconomic: [],
      fastComfort: [],
      fastBus: [],
      fastPremium: [],
      taxi: [],
    });

    const vehicleTypeData = ref<vehicleState[]>([]);
    const orderTypeData = ref<orderTypeState[]>([]);
    const bussinessData = ref([]);

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
        render(record: tableDataItem, index: number) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handleEdit.bind(null, record, index),
                auth: ["dict001"],
              },
            ],
          });
        },
      },
    ];

    onMounted(() => {
      getData();
      getSquareData();
    });

    const getSquareData = () => {
      Promise.all([
        getVehicleType({ operationCompanyId: "" }),
        getDict({ parentEntryCode: "OT00000" }),
      ])
        .then((res) => {
          let dataArr = res.map((item) => item.data);
          console.log(dataArr);

          dataArr[0].unshift({ vehicleTypeId: " ", vehicleTypeName: "#" });
          vehicleTypeData.value = dataArr[0];
          orderTypeData.value = dataArr[1];
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getValResult = (vehicleTypeId: string, entryCode: string) => {
      let obj = {};
      let result = bussinessData.value.some((item: formState) => {
        if (item.vehicleTypeId === vehicleTypeId && item.orderType === entryCode) {
          obj = item;
          return true;
        } else {
          return false;
        }
      });

      return { obj, result: result };
    };

    const getData = async () => {
      try {
        let res = await getAllOpenCity();
        openCityList.value = res.data.map((item: { cityName: string; cityCode: string }) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    };

    async function queryOpenArea() {
      try {
        isShow.value = false;
        bussinessData.value = [];
        await formRef.value?.validate();
        let res = await getCityOpenArea({ cityCode: cityCode.value });
        data.value = res.data;
      } catch (err) {
        console.log(err);
        message.error("验证失败");
      }
    }

    async function getBussiness(areaCode: string) {
      try {
        let res = await getOpenAreaBuss({ areaCode });
        bussinessData.value = res.data;
        isShow.value = true;
      } catch (err) {
        console.log(err);
      }
    }

    const toggle = (vehicleType: vehicleState, orderType: orderTypeState, editObj?: formState) => {
      let option = {
        orderType: orderType.entryCode,
        vehicleTypeId: vehicleType.vehicleTypeId,
        areaCode: areaCode.value,
        ...editObj,
      };
      console.log(option);

      const { openDrawer } = chargeFormDrawerRef.value;
      openDrawer(option);
    };

    function handleEdit(record: tableDataItem) {
      areaCode.value = record.areaCode as string;
      getBussiness(record.areaCode as string);
    }

    function handleSaveAfter() {
      getBussiness(areaCode.value as string);
    }

    return {
      ...toRefs(state),
      loading,
      isShow,
      queryFormRef,
      chargeFormDrawerRef,
      vehicleTypeData,
      orderTypeData,
      cityCode,
      columns,
      getRowKeyId: (row: tableItemProps) => row.id,
      data,
      openCityList,
      queryRule: {
        trigger: ["input", "blur"],
        validator() {
          if (cityCode.value === null) {
            return new Error("选择开通城市");
          }
        },
      },

      getValResult,
      toggle,
      queryOpenArea,
      handleSaveAfter,
    };
  },
});
</script>
<style lang="scss" scoped>
.opening-business {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;
  $w: 460px;

  &-left {
    width: $w;
    background-color: $white;
    padding: 20px 10px 10px;
  }

  &-right {
    width: calc(100% - $w - 10px);
    background-color: $white;
    overflow: scroll;
    padding: 20px 10px 10px;
    box-sizing: border-box;
    margin-left: 10px;
  }

  .busy-type-item {
    display: flex;
    align-content: center;
    border: 1px solid #efeff5;
    margin-top: -1px;

    .busy-type-content-item {
      min-width: 22px;
      padding: 10px;
      width: 14.28%;
      border-left: 1px solid #f2f3f5;
      justify-content: center;
      text-align: center;
      cursor: pointer;
    }

    .n-tag {
      cursor: pointer;
    }
  }
}
</style>
