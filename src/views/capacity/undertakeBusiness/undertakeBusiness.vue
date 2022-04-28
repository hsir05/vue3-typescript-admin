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
    <!-- 中间busy-type-item busy-type-content-item-->
    <div class="opening-business-right h-full bg-white p-10px">
      <template v-if="isShow">
        <div class="flex-align-start w-full" v-for="item in orderBusTypeData" :key="item.entryId">
          <div class="busy-type-content-item text-center" style="width: 33%">
            {{ item.entryName }}
          </div>

          <div class="" style="width: 66%">
            <div class="" v-for="val in orderTypeData" :key="val.entryId">
              <span class="text-center" style="width: 50%; display: inline-block">{{
                val.entryName
              }}</span>
              <span class="text-center" style="width: 50%; display: inline-block">暂无</span>
            </div>
          </div>
        </div>
      </template>
      <n-empty v-else class="empty" />
    </div>
    <!-- 右侧 -->
    <ChargeFormDrawer ref="chargeFormDrawerRef" :width="650" @on-save-after="handleSaveAfter" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import { tableItemProps, tableDataItem, orderTypeState } from "./type";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import { getCityOpenArea } from "@/api/operate/operate";
import ChargeFormDrawer from "./chargeFrom.vue";
import { getAllOpenCity, getDict } from "@/api/common/common";
// import { getUndertakeBus, getAreaUndertakeBus, saveUndertakeBus } from "@/api/capacity/capacity"
import { getUndertakeBus } from "@/api/capacity/capacity";
import { formState } from "./type";
export default defineComponent({
  name: "UndertakeBusiness",
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

    const orderBusTypeData = ref<orderTypeState[]>([]);
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
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handle.bind(null, record, index),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handle.bind(null, record, index),
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
        getDict({ parentEntryCode: "OBT0000" }),
        getDict({ parentEntryCode: "OT00000" }),
      ])
        .then((res) => {
          let dataArr = res.map((item) => item.data);
          console.log(dataArr);

          orderBusTypeData.value = dataArr[0];
          orderTypeData.value = dataArr[1];
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // const getAreaUndertakeBus = async () => {
    //     try {
    //         let option =  {
    //             areaCode: areaCode.value,
    //             // operationCompanyId:
    //         }
    //         // let res = await getAreaUndertakeBus()
    //     } catch (err) {
    //         console.log(err);

    //     }
    // }

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
        console.log(res);

        data.value = res.data;
      } catch (err) {
        console.log(err);
        message.error("验证失败");
      }
    }

    async function getBussiness(areaCode: string) {
      try {
        let res = await getUndertakeBus({ areaCode });
        console.log(res.data);

        bussinessData.value = res.data;
        isShow.value = true;
      } catch (err) {
        console.log(err);
      }
    }

    const toggle = (
      orderBusType: orderTypeState,
      orderType: orderTypeState,
      editObj?: formState
    ) => {
      console.log(orderBusType, orderType, editObj);

      // let option = {
      //     orderType: orderType.entryCode,
      //     vehicleTypeId: orderBusType.orderBusTypeId,
      //     areaCode: areaCode.value,
      //     ...editObj,
      // };
      // const { openDrawer } = chargeFormDrawerRef.value;
      // openDrawer(option);
    };

    function handle(record: tableDataItem) {
      areaCode.value = record.areaCode as string;
      getBussiness(record.areaCode as string);
    }

    function handleSaveAfter() {
      // getBussiness(areaCode.value as string);
    }

    return {
      loading,
      isShow,
      queryFormRef,
      chargeFormDrawerRef,
      orderBusTypeData,
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
  // $w: 460px;
  $w: 260px;

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
}
</style>
