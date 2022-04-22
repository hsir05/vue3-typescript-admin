<template>
  <div class="h-full">
    <n-form
      ref="formRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      :show-feedback="false"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="form"
    >
      <n-form-item ref="formRef" label="运营企业">
        <n-select
          clearable
          filterable
          v-model:value="form.operationCompanyId"
          placeholder="选择运营企业"
          @update:value="handleUpdateValue"
          :options="options"
        />
      </n-form-item>

      <n-form-item ref="formRef" label="订单类型">
        <n-select
          clearable
          filterable
          v-model:value="form.orderBusinessType"
          placeholder="选择订单类型"
          style="width: 170px"
          :options="options"
        />
      </n-form-item>

      <n-button
        attr-type="button"
        :disabled="loading"
        class="ml-10px"
        type="primary"
        @click="query"
      >
        查找
      </n-button>
    </n-form>
    <div class="bg-white p-10px">
      <n-spin :show="loading">
        <n-row>
          <n-col :span="8" v-for="(item, index) in orderData" :key="index">
            <n-statistic :label="item.label" class="text-center p-10px">
              <template #prefix>
                <!-- <n-icon :component="item.icon" size="25" /> -->
              </template>
              <template #suffix>
                <span>{{ item.value }}</span>
                <p class="today" v-if="item.today">今日</p>
              </template>
            </n-statistic>
          </n-col>
        </n-row>
      </n-spin>
    </div>

    <div class="bg-white p-10px mt-10px">
      <Line
        :data="lineData"
        :xAxisData="['服务中', '空闲中', '休息中', '已下班']"
        text="司机服务状态统计"
        :subtext="subtext"
      />
    </div>
    <div class="flex-align-start bg-white p-10px mt-10px">
      <Gauge
        width="50%"
        :data="workRatio"
        text="上班司机比率"
        subtext="上班比率=(服务中司机 + 空闲司机 + 休息中司机)/全部司机"
      />
      <Gauge
        width="50%"
        :data="busyRatio"
        text="忙碌司机比率"
        subtext="忙碌比率=服务中司机 /(服务中司机 + 空闲司机 + 休息中司机)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { FormInst } from "naive-ui";
import Line from "./line.vue";
import Gauge from "./gauge.vue";
import { getOperationCompany } from "@/api/common/common";
import { getChartsData, getOrderBusinessType } from "@/api/realtimeDynamic/realtimeDynamic";
import {
  BarcodeOutline as BarcodeIcon,
  ReaderOutline as ReaderIcon,
  AlarmOutline as AlarmIcon,
  NewspaperOutline as NewspaperIcon,
  CodeWorking as CodeIcon,
  IdCardOutline as IdCardIcon,
} from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";
export default defineComponent({
  name: "Login",
  components: {
    Line,
    Gauge,
  },
  setup() {
    const loading = ref(false);
    const options = [{ label: "asdf", value: "sd" }];
    const formRef = ref<FormInst | null>(null);
    const form = ref({
      operationCompanyId: null,
      orderBusinessType: null,
    });
    const lineData = ref<number[]>();
    const subtext = ref("司机总数： 人");
    const workRatio = ref<number>(0);
    const busyRatio = ref<number>(0);

    const orderData = ref([
      {
        label: "待派订单",
        value: "",
        icon: AlarmIcon,
        key: "pendingOrders",
        today: false,
      },
      {
        label: "待服务订单",
        value: "",
        key: "pendingServiceOrders",
        icon: BarcodeIcon,
        today: false,
      },
      {
        label: "服务中订单",
        value: "",
        key: "inServiceOrders",
        icon: CodeIcon,
        today: false,
      },
      {
        label: "待支付订单",
        value: "",
        key: "toBePaidOrders",
        icon: IdCardIcon,
        today: false,
      },
      {
        label: "已完成订单",
        value: "",
        key: "todayCompleteOrders",
        icon: NewspaperIcon,
        today: true,
      },
      {
        label: "已取消订单",
        value: "",
        key: "todayCanceledOrders",
        icon: ReaderIcon,
        today: true,
      },
    ]);

    onMounted(() => {
      getOperateCompanyData();
      getData();
    });

    const getOperateCompanyData = async () => {
      try {
        let res = await getOperationCompany();
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    const getComOrderType = async () => {
      try {
        let res = await getOrderBusinessType({ operationCompanyId: form.value.operationCompanyId });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async () => {
      loading.value = true;
      try {
        let res = await getChartsData({ operationCompanyId: null, orderBusinessType: "OBT0000" });
        orderData.value = orderData.value.map((item) => {
          item.value = res[item.key];
          return item;
        });
        let driverSum = res.inServiceOrders + res.idleDrivers + res.restDrivers + res.onlineDrivers;
        subtext.value = `司机总数：${driverSum} 人`;
        lineData.value = [res.inServiceOrders, res.idleDrivers, res.restDrivers, res.onlineDrivers];

        workRatio.value = (res.busyDrivers + res.idleDrivers + res.restDrivers) / driverSum;
        busyRatio.value = res.busyDrivers / driverSum;
        loading.value = false;
      } catch (err) {
        console.log(err);
      }
    };
    function handleUpdateValue(value: string) {
      console.log(value);

      getComOrderType();
    }
    function query() {}

    return {
      options,
      formRef,
      busyRatio,
      lineData,
      workRatio,
      subtext,
      loading,
      form,
      orderData,

      query,
      handleUpdateValue,
      renderIcon,
    };
  },
});
</script>
<style lang="scss" scoped>
.right {
  width: calc(100% - 320px - 10px);
  height: 100%;
  background-color: $white;
  box-sizing: border-box;
  padding-top: 5px;
  padding-right: 5px;
}

.left {
  width: 310px;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-right: 10px;
  background-color: $white;
}
.today {
  font-size: 14px;
}
</style>
