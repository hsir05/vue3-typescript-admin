<template>
  <div class="h-full box-border order-reserve-time">
    <div class="order-reserve-time-left">
      <n-data-table
        ref="table"
        :data="openCityData"
        :columns="columns"
        class="box-border"
        min-height="calc(100vh - 204px)"
        flex-height
        :row-key="getRowKeyId"
        :pagination="false"
      />
    </div>
    <div class="order-reserve-time-right ml-10px">
      <n-alert title="提示" type="warning" class="mb-10px">
        接单预留时间指为了不影响后续订单服务而预留出的时间,
        在这段预留出的时间内，不会再接到立即订单。 <br />
        如：专车业务预约订单的接单预留时间设置为60分钟， 则司机的待服务订单中有一个该类型订单，
        且用车时间在60分钟之内时，不会再接到立即订单。<br />
        新增或编辑接单预留时间时： 点击出现边框即可编辑接单预留时间，
        编辑完成后点击其他位置即可保存(预留时间单位为分钟)。 <br />
        删除接单预留时间时：将边框中的内容清空即可删除该接单预留时间
      </n-alert>

      <div class="">
        <n-spin :show="loading">
          <template v-if="isShow">
            <div
              :class="['busy-type-item', 'flex-align-start', index % 2 === 0 ? '' : 'striped']"
              v-for="(type, index) in orderTypeData"
              :key="type.entryId"
            >
              <span class="busy-type-content-item">{{ type.entryName }}</span>
              <template v-for="item in orderBusTypeData" :key="item.entryId">
                <div class="busy-type-content-item">
                  <span v-if="index === 0">{{ item.entryName }}</span>
                  <n-input-number
                    clearable
                    :min="0"
                    :value="getValue(type.entryCode, item.entryCode).reserveTime"
                    @update:value="handleChange"
                    @blur="
                      handleBlur(
                        $event,
                        getValue(type.entryCode, item.entryCode),
                        type.entryCode,
                        item.entryCode
                      )
                    "
                    v-else
                    class="number-input"
                  />
                </div>
              </template>
            </div>
          </template>

          <n-empty class="empty" v-else />
        </n-spin>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref, onMounted } from "vue";
import { tableItemProps, tableDataItem, tableEditDataItem } from "./type";
import TableActions from "@/components/TableActions/TableActions.vue";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import { getAllOpenCity, getDict } from "@/api/common/common";
import { useMessage } from "naive-ui";
import {
  getAcceptOrderTime,
  saveAccptOrderTime,
  removeAcceptOrderTime,
} from "@/api/operate/operate";
import ShowOrEdit from "./ShowOrEdit.vue";
export default defineComponent({
  name: "OrderReserveTime",
  setup() {
    const editData = ref([]);
    const loading = ref(false);
    const isShow = ref(false);
    const cityCode = ref();
    const columns = [
      {
        title: "城市名称",
        key: "cityName",
        width: 120,
        align: "center",
      },
      {
        title: "城市编码",
        key: "cityCode",
        width: 90,
        align: "center",
      },
      {
        title: "操作",
        key: "actions",
        align: "center",
        width: 90,
        render(record: tableDataItem) {
          return h(TableActions as any, {
            actions: [
              {
                label: "编辑接单预留时间",
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
    interface cityOpenOrderTypeState {
      cityCode: string | null;
      orderBusinessType: string | null;
      acceptOrderReserveTimeSettingId?: string | null;
      orderType: string | null;
      reserveTime: number | null;
    }
    interface orderTypeState {
      entryId: string;
      entryCode: string;
      entryName: string;
    }
    interface orderBusTypeState {
      entryId: string;
      entryCode: string;
      entryName: string;
    }

    const openCityData = ref([]);
    const orderTypeData = ref<orderTypeState[]>([]);
    const cityOpenOrderTypeData = ref<cityOpenOrderTypeState[]>([]);
    const orderBusTypeData = ref<orderBusTypeState[]>([]);
    const message = useMessage();

    const editColumns = [
      {
        title: "#",
        key: "orderBusinessType",
        width: 100,
        align: "center",
      },
      {
        title: "专车业务",
        key: "majorBus",
        align: "center",
        render(row: tableEditDataItem, index: number) {
          return h(ShowOrEdit as any, {
            value: row.majorBus,
            onUpdateValue(v: string) {
              editData.value[index].majorBus = v;
            },
          });
        },
      },
      {
        title: "快车业务",
        key: "fastBus",
        align: "center",
        render(row: tableEditDataItem, index: number) {
          return h(ShowOrEdit as any, {
            value: row.fastBus,
            onUpdateValue(v: string) {
              editData.value[index].fastBus = v;
            },
          });
        },
      },
      {
        title: "出租车业务",
        key: "taxiBus",
        width: 90,
        align: "center",
        render(row: tableEditDataItem, index: number) {
          return h(ShowOrEdit as any, {
            value: row.taxiBus,
            onUpdateValue(v: string) {
              editData.value[index].taxiBus = v;
            },
          });
        },
      },
    ];

    onMounted(() => {
      getOpenCityData();
      getOrderBusType();
      getOrderType();
    });

    function handleEdit(record: Recordable) {
      cityCode.value = record.cityCode;
      getAcceptOrderData(record.cityCode);
    }

    const getOpenCityData = async () => {
      try {
        let res = await getAllOpenCity();
        openCityData.value = res.data;
      } catch (err) {
        console.log(err);
      }
    };
    const getOrderType = async () => {
      try {
        let res = await getDict({ parentEntryCode: "OT00000" });
        orderTypeData.value = res.data;
        orderTypeData.value.unshift({ entryId: " ", entryName: "#", entryCode: " " });
      } catch (err) {
        console.log(err);
      }
    };

    const getOrderBusType = async () => {
      try {
        let res = await getDict({ parentEntryCode: "OBT0000" });
        console.log(res);
        orderBusTypeData.value = res.data;
      } catch (err) {
        console.log(err);
      }
    };

    const getAcceptOrderData = async (cityCode: string) => {
      try {
        loading.value = true;
        isShow.value = false;
        let res = await getAcceptOrderTime({ cityCode });
        console.log(res);
        cityOpenOrderTypeData.value = res.data;
        loading.value = false;
        isShow.value = true;
      } catch (err) {
        console.log(err);
        loading.value = false;
        isShow.value = false;
      }
    };
    const getValue = (orderType: string, orderBusinessType: string) => {
      let result = {};
      for (let key of cityOpenOrderTypeData.value) {
        if (key.orderBusinessType === orderBusinessType && key.orderType === orderType) {
          result = key;
          break;
        }
      }
      return result as cityOpenOrderTypeState;
    };
    const handleChange = (value: number) => {
      console.log(value);
    };
    const handleBlur = (
      event: FocusEvent,
      item: cityOpenOrderTypeState,
      orderBusinessType: string,
      orderType: string
    ) => {
      //@ts-ignore
      let value = event.target && event.target.value;
      console.log(value);

      if (value) {
        let option: cityOpenOrderTypeState = {
          orderType: orderType,
          orderBusinessType: orderBusinessType,
          reserveTime: null,
          cityCode: cityCode.value,
        };
        if (item.acceptOrderReserveTimeSettingId) {
          option = { ...item };
        }

        option.reserveTime = value;
        saveOrderTime(option);
      } else if (item.acceptOrderReserveTimeSettingId) {
        remove(item.acceptOrderReserveTimeSettingId);
      }
    };

    const saveOrderTime = async (option: cityOpenOrderTypeState) => {
      try {
        loading.value = true;
        let res = await saveAccptOrderTime(option);
        console.log(res);
        message.success(res.message);
        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };
    const remove = async (acceptOrderReserveTimeSettingId: string) => {
      try {
        loading.value = true;
        let res = await removeAcceptOrderTime({ acceptOrderReserveTimeSettingId });
        console.log(res);
        loading.value = false;
        message.success(res.message);
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    return {
      columns,
      loading,
      isShow,
      getRowKeyId: (row: tableItemProps) => row.id,

      editColumns,
      openCityData,
      orderTypeData,
      orderBusTypeData,
      cityOpenOrderTypeData,
      editData,
      handleChange,
      getValue,
      handleBlur,
    };
  },
});
</script>
<style lang="scss" scoped>
.order-reserve-time {
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;

  &-left {
    width: 300px;
  }

  &-right {
    width: calc(100% - 300px - 10px);
    max-width: 1090px;
    padding: 5px;
    background-color: $white;
    box-sizing: border-box;
  }

  .busy-type-content-item {
    width: 33%;
  }

  .number-input {
    width: 150px;
    display: inline-block;
  }
}
</style>
