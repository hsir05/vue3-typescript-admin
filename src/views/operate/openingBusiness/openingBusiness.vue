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
            style="width: 260px"
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
      <div class="busy-type-item striped">
        <span class="vehicle-type-item">#</span>
        <div class="n-checkbox-group">
          <span class="n-checkbox">立即</span>
          <span class="n-checkbox">预约</span>
          <span class="n-checkbox">接机</span>
          <span class="n-checkbox">送机</span>
          <span class="n-checkbox">半日租</span>
          <span class="n-checkbox">全日租</span>
        </div>
      </div>

      <BusTypeItem title="专车-经济型" :list="specialEconomic" @on-update-value="handleSpeEco" />
      <BusTypeItem
        title="专车-舒适型"
        :list="specialComfort"
        @on-update-value="handleSpeCom"
        :striped="true"
      />
      <BusTypeItem title="专车-商务型" :list="specialBus" @on-update-value="handleSpeBus" />
      <BusTypeItem
        title="专车-豪华型"
        :list="specialPremium"
        @on-update-value="handleSpePre"
        :striped="true"
      />

      <BusTypeItem title="快车-经济型" :list="fastEconomic" @on-update-value="handleFastEco" />
      <BusTypeItem
        title="快车-舒适型"
        :list="fastComfort"
        @on-update-value="handleFastCom"
        :striped="true"
      />
      <BusTypeItem title="快车-商务型" :list="fastBus" @on-update-value="handleFastBus" />
      <BusTypeItem
        title="快车-豪华型"
        :list="fastPremium"
        @on-update-value="handleFastPre"
        :striped="true"
      />

      <BusTypeItem title="出租车" :list="taxi" @on-update-value="handleTaxi" />
    </div>
    <!-- 右侧 -->
    <ChargeForm ref="chargeFormDrawerRef" :width="650" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, h, reactive, toRefs, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import { itemState } from "@/interface/common/common";
import TableActions from "@/components/TableActions/TableActions.vue";
import { tableItemProps, tableDataItem, busTypeState } from "./type";
import { CreateOutline as CreateIcon } from "@vicons/ionicons5";
import { getCityOpenArea } from "@/api/operate/operate";
import BusTypeItem from "./busTypeItem.vue";
import ChargeForm from "./chargeFrom.vue";
import { getAllOpenCity, getDict } from "@/api/common/common";
import { getOpenAreaBuss, delBusiness } from "@/api/operate/operate";
export default defineComponent({
  name: "OpeningBusiness",
  components: {
    BusTypeItem,
    ChargeForm,
  },
  emits: ["on-save-after"],
  setup() {
    const data = ref([]);
    const openCityList = ref([]);
    const loading = ref(false);
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
      getOrderType();
    });

    const getData = async () => {
      try {
        let res = await getAllOpenCity();
        openCityList.value = res.data.map((item: itemState) => {
          let obj = {
            label: item.cityName,
            value: item.cityCode,
            lng: item.lng,
            lat: item.lat,
          };
          return obj;
        });
      } catch (err) {
        console.log(err);
      }
    };
    const getOrderType = async () => {
      try {
        let res = await getDict({ parentEntryCode: "OT00000" });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    async function queryOpenArea() {
      try {
        await formRef.value?.validate();
        console.log(cityCode.value);
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
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    async function remove(openBusinessId: string) {
      try {
        let res = await delBusiness({ openBusinessId });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    function handleEdit(record: tableDataItem) {
      getBussiness(record.areaCode as string);
    }

    function handleSpeEco(value: number[]) {
      state.specialEconomic = value;
      console.log(value);
      const { openDrawer } = chargeFormDrawerRef.value;
      openDrawer();
    }
    function handleSpeCom(value: number[]) {
      state.specialComfort = value;
      console.log(value);
      remove("");
    }
    function handleSpeBus(value: number[]) {
      state.specialBus = value;
      console.log(value);
    }
    function handleSpePre(value: number[]) {
      state.specialPremium = value;
      console.log(value);
    }
    function handleFastEco(value: number[]) {
      state.fastEconomic = value;
      console.log(value);
    }
    function handleFastCom(value: number[]) {
      state.fastComfort = value;
      console.log(value);
    }
    function handleFastBus(value: number[]) {
      state.fastBus = value;
      console.log(value);
    }
    function handleFastPre(value: number[]) {
      state.fastPremium = value;
      console.log(value);
    }
    function handleTaxi(value: number[]) {
      state.taxi = value;
      console.log(value);
    }

    return {
      ...toRefs(state),
      loading,
      queryFormRef,
      chargeFormDrawerRef,
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

      handleSpeEco,
      handleSpeBus,
      handleSpePre,
      handleSpeCom,
      handleFastEco,
      handleFastCom,
      handleFastBus,
      handleFastPre,
      queryOpenArea,
      handleTaxi,
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
}
</style>
