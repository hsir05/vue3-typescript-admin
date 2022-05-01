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
    <div class="opening-business-right h-full bg-white p-10px">
      <template v-if="isShow">
        <div class="flex-align-start w-full" v-for="item in orderBusTypeData" :key="item.entryId">
          <div class="order-type">
            {{ item.entryName }}
          </div>

          <div class="width-80">
            <div class="" v-for="(val, index) in orderTypeData" :key="val.entryId">
              <span :class="['border-item', 'width-30', index % 2 === 0 ? '' : 'striped']">{{
                val.entryName
              }}</span>
              <span :class="['border-item', 'width-70', index % 2 === 0 ? '' : 'striped']">{{
                getValResult(val.entryCode, item.entryCode).result
                  ? getValResult(val.entryCode, item.entryCode).operationCompany
                      .operationCompanyName
                  : "暂未开通"
              }}</span>
            </div>
          </div>
        </div>
      </template>

      <template v-if="isEdit">
        <n-form-item ref="queryFormRef" label-width="100" label="运营企业" label-placement="left">
          <n-select
            v-model:value="operationCompanyId"
            @update:value="handleSelect"
            clearable
            filterable
            placeholder="选择运营企业"
            style="width: 420px"
            :options="companyData"
          />
        </n-form-item>
        <div class="flex-align-start w-full">
          <div class="label">
            <p class="">承接业务</p>
          </div>
          <div class="border-item-box">
            <div
              :class="['busy-type-item', index % 2 === 0 ? '' : 'striped']"
              v-for="(orderType, index) in orderTypeData"
              :key="orderType.entryId"
            >
              <span class="border-item width-25">{{ orderType.entryName }}</span>
              <template v-if="index === 0">
                <span
                  class="border-item width-25"
                  v-for="orderBusType in orderBusTypeData"
                  :key="orderBusType.entryId"
                  >{{ orderBusType.entryName }}</span
                >
              </template>

              <template v-else>
                <span
                  class="border-item width-25"
                  v-for="orderBusType in orderBusTypeData"
                  :key="orderBusType.entryId"
                >
                  <n-tooltip
                    trigger="hover"
                    v-if="getValResult(orderType.entryCode, orderBusType.entryCode).result"
                  >
                    <template #trigger>
                      <n-tag
                        type="success"
                        @click="
                          toggle(
                            orderType.entryCode,
                            orderBusType.entryCode,
                            getValResult(orderType.entryCode, orderBusType.entryCode)
                          )
                        "
                        size="small"
                        >已添加</n-tag
                      >
                    </template>
                    点击移除
                  </n-tooltip>

                  <n-tooltip trigger="hover" v-else>
                    <template #trigger>
                      <n-tag
                        type="warning"
                        size="small"
                        @click="toggle(orderType.entryCode, orderBusType.entryCode)"
                      >
                        添加
                      </n-tag>
                    </template>
                    点击添加
                  </n-tooltip>
                </span>
              </template>
            </div>
          </div>
        </div>

        <div class="text-center flex-center mt-30px">
          <n-button attr-type="button" :loading="loading" type="primary" @click="handleValidate">
            保存
          </n-button>
        </div>
      </template>
      <n-empty v-if="!isShow & !isEdit" class="empty" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import TableActions from "@/components/TableActions/TableActions.vue";
import {
  tableItemProps,
  tableDataItem,
  orderTypeState,
  formState,
  resutlState,
  companyUndertakeBusinessState,
} from "./type";
import { CreateOutline as CreateIcon, EyeOutline as EyeIcon } from "@vicons/ionicons5";
import { getCityOpenArea } from "@/api/operate/operate";
import { getAllOpenCity, getDict, getAllOperateCompany } from "@/api/common/common";
import { getUndertakeBus, getAreaUndertakeBus, saveUndertakeBus } from "@/api/capacity/capacity";
import { cloneDeep } from "lodash-es";
export default defineComponent({
  name: "UndertakeBusiness",
  setup() {
    const data = ref([]);
    const openCityList = ref([]);
    const companyData = ref([]);

    const companyUndertakeBusinessList = ref<companyUndertakeBusinessState[]>([]);
    const loading = ref(false);
    const isShow = ref(false);
    const isEdit = ref(false);
    // const viewKey = ref(new Date().getTime());
    const areaCode = ref<string | null>(null);

    const cityCode = ref(null);
    const operationCompanyId = ref(null);
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
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "查看",
                type: "primary",
                icon: EyeIcon,
                isIconBtn: true,
                onClick: handle.bind(null, record, true),
                auth: ["dict001"],
              },
              {
                label: "编辑",
                type: "primary",
                icon: CreateIcon,
                isIconBtn: true,
                onClick: handle.bind(null, record, false),
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
      getAllCompanyData();
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

    const getAllCompanyData = async () => {
      try {
        let res = await getAllOperateCompany();
        console.log(res);
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

    const handleSelect = async (operationCompanyId: string) => {
      if (!operationCompanyId) {
        return false;
      }
      try {
        let option = {
          areaCode: areaCode.value as string,
          operationCompanyId: operationCompanyId,
        };
        loading.value = true;
        bussinessData.value = [];
        let res = await getAreaUndertakeBus(option);
        bussinessData.value = res.data;
        console.log(res);
        companyUndertakeBusinessList.value = res.data.map((item: companyUndertakeBusinessState) => {
          return { orderBusinessType: item.orderBusinessType, orderType: item.orderType };
        });
        console.log(companyUndertakeBusinessList.value);

        loading.value = false;
        isEdit.value = true;
      } catch (err) {
        loading.value = false;
        bussinessData.value = [];
        console.log(err);
      }
    };

    const handleValidate = async () => {
      try {
        loading.value = true;
        let option = {
          areaCode: areaCode.value,
          operationCompanyId: operationCompanyId.value,
          companyUndertakeBusinessList: companyUndertakeBusinessList.value,
        };

        let res = await saveUndertakeBus(option);
        console.log(res);
        bussinessData.value = [];
        operationCompanyId.value = null;
        companyUndertakeBusinessList.value = [];
        message.success("");
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    const getValResult = (orderType: string, orderBusinessType: string): resutlState => {
      let obj = {};
      let result = bussinessData.value.some((item: formState) => {
        if (item.orderBusinessType === orderBusinessType && item.orderType === orderType) {
          obj = item;
          return true;
        } else {
          return false;
        }
      });
      return { ...obj, result };
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
        isEdit.value = false;
        bussinessData.value = [];
        await formRef.value?.validate();
        let res = await getCityOpenArea({ cityCode: cityCode.value });
        data.value = res.data;
      } catch (err) {
        console.log(err);
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

    const toggle = (orderType: string, orderBusinessType: string, editObj?: formState) => {
      if (!operationCompanyId.value) {
        message.warning("请选择运营企业后添加");
        return false;
      }
      if (editObj) {
        let index = companyUndertakeBusinessList.value.findIndex(
          (item: companyUndertakeBusinessState) =>
            item.orderBusinessType === editObj.orderBusinessType &&
            item.orderType === editObj.orderType
        );
        let budIndex = bussinessData.value.findIndex(
          (item: companyUndertakeBusinessState) =>
            item.orderBusinessType === editObj.orderBusinessType &&
            item.orderType === editObj.orderType
        );
        if (budIndex >= 0) {
          bussinessData.value.splice(index, 1);
        }
        if (index >= 0) {
          companyUndertakeBusinessList.value.splice(index, 1);
        }
      } else {
        let dataArr = cloneDeep(bussinessData.value);
        // @ts-ignore
        dataArr.push({ orderType, orderBusinessType, areaCode: areaCode.value as string });
        console.log(dataArr);

        bussinessData.value = dataArr;
        companyUndertakeBusinessList.value.push({ orderType, orderBusinessType });
      }
    };

    function handle(record: tableDataItem, bool: boolean) {
      bussinessData.value = [];
      operationCompanyId.value = null;
      areaCode.value = record.areaCode as string;
      let index = orderTypeData.value.findIndex((item: orderTypeState) => item.entryName === "#");
      if (bool) {
        if (index >= 0) {
          orderTypeData.value.splice(index, 1);
        }
        isEdit.value = false;
        getBussiness(record.areaCode as string);
      } else if (!bool && index < 0) {
        isEdit.value = true;
        isShow.value = false;
        orderTypeData.value.unshift({ entryId: " ", entryName: "#", entryCode: " " });
      }
    }

    return {
      loading,
      isShow,
      isEdit,
      queryFormRef,
      orderBusTypeData,
      orderTypeData,
      cityCode,
      operationCompanyId,
      companyData,
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
      handleValidate,
      toggle,
      queryOpenArea,
      handleSelect,
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
    overflow: scroll;
  }

  .border-item {
    border: 1px solid #f2f3f5;
    margin-top: -1px;
    box-sizing: border-box;
    margin-left: -1px;
    display: inline-block;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  .order-type {
    @extend .border-item;
    width: 20%;
    height: 235px;
    line-height: 240px;
  }

  .label {
    width: 100px;
    text-align: right;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .border-item-box {
    width: calc(100% - 100px);
  }

  .width-30 {
    width: 30%;
  }

  .width-25 {
    width: 25.5%;
  }

  .width-70 {
    width: 70%;
  }

  .width-80 {
    width: 80%;
  }
}
</style>
