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
          v-model:value="form.companyId"
          placeholder="选择运营企业"
          :options="options"
        />
      </n-form-item>

      <n-form-item ref="formRef" label="订单类型">
        <n-select
          clearable
          filterable
          v-model:value="form.orderType"
          placeholder="选择订单类型"
          style="width: 170px"
          :options="options"
        />
      </n-form-item>

      <n-button
        attr-type="button"
        :loading="loading"
        class="ml-10px"
        type="primary"
        @click="handleValidate"
      >
        查找
      </n-button>
    </n-form>
    <div class="bg-white p-10px">
      <n-row>
        <n-col :span="8" v-for="(item, index) in staticData" :key="index">
          <n-statistic :label="item.label" class="text-center p-10px">
            <template #prefix>
              <n-icon :component="item.icon" size="25" />
            </template>
            <template #suffix>
              <span>{{ item.value }}</span>
              <p class="today" v-if="item.today">今日</p>
            </template>
          </n-statistic>
        </n-col>
      </n-row>
    </div>

    <div class="bg-white p-10px mt-10px">
      <Line
        :data="[100, 23, 10, 30]"
        :xAxisData="['服务中', '空闲中', '休息中', '已下班']"
        text="司机服务状态统计"
        subtext="司机总数：0 人"
      />
    </div>
    <div class="flex-align-start bg-white p-10px mt-10px">
      <Gauge
        width="50%"
        :data="10"
        text="上班司机比率"
        subtext="上班比率=(服务中司机 + 空闲司机 + 休息中司机)/全部司机"
      />
      <Gauge
        width="50%"
        :data="30"
        text="忙碌司机比率"
        subtext="忙碌比率=服务中司机 /(服务中司机 + 空闲司机 + 休息中司机)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { FormInst } from "naive-ui";
import Line from "./line.vue";
import Gauge from "./gauge.vue";
import {
  BarcodeOutline as BarcodeIcon,
  ReaderOutline as ReaderIcon,
  AlarmOutline as AlarmIcon,
  NewspaperOutline as NewspaperIcon,
  CodeWorking as CodeIcon,
  IdCardOutline as IdCardIcon,
} from "@vicons/ionicons5";

const loading = ref(false);
const options = [{ label: "asdf", value: "sd" }];
const formRef = ref<FormInst | null>(null);
const form = ref({
  companyId: null,
  orderType: null,
});
const staticData = [
  {
    label: "待派订单",
    value: "10",
    icon: AlarmIcon,
    today: false,
  },
  {
    label: "待服务订单",
    value: "10",
    icon: BarcodeIcon,
    today: false,
  },
  {
    label: "服务中订单",
    value: "10",
    icon: CodeIcon,
    today: false,
  },
  {
    label: "待支付订单",
    value: "10",
    icon: IdCardIcon,
    today: false,
  },
  {
    label: "已完成订单",
    value: "10",
    icon: NewspaperIcon,
    today: true,
  },
  {
    label: "已取消订单",
    value: "10",
    icon: ReaderIcon,
    today: true,
  },
];

onMounted(() => {});

function handleValidate() {}
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
