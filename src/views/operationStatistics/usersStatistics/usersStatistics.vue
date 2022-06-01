<template>
  <div>
    <div class="bg-white p-10px">
      <n-spin :show="loading">
        <n-row>
          <n-col :span="10" v-for="(item, index) in usersData" :key="index">
            <n-statistic :label="item.label" class="text-center p-10px">
              <template #suffix>
                <span>{{ item.value }}</span>
              </template>
            </n-statistic>
          </n-col>
        </n-row>
      </n-spin>
    </div>

    <div class="flex mt-10px p-10px bg-white">
      <span>用户增长曲线</span>
      <n-date-picker
        v-model:value="month"
        style="width: 200px"
        :is-date-disabled="disablePreviousDate"
        @update:value="handleDate"
        type="month"
      />
    </div>
    <n-spin :show="loading" class="bg-white">
      <Order :data="lineData" :xAxisData="dateData" />
    </n-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  BarcodeOutline as BarcodeIcon,
  AlarmOutline as AlarmIcon,
  CodeWorking as CodeIcon,
  IdCardOutline as IdCardIcon,
} from "@vicons/ionicons5";
import Order from "./order.vue";
import dayjs from "dayjs";
import { getCustomer } from "@/api/operationStatistics/operationStatistics";
export default defineComponent({
  name: "UsersStatistics",
  components: {
    Order,
  },
  setup() {
    const loading = ref(false);
    const month = ref(new Date().getTime());
    const lineData = ref([]);
    const dateData = ref([]);
    const usersData = ref([
      {
        label: "当前用户总数",
        value: "",
        icon: AlarmIcon,
        key: "pendingOrders",
      },
      {
        label: "今日新增用户",
        value: "",
        key: "pendingServiceOrders",
        icon: BarcodeIcon,
      },
      {
        label: "今日活跃用户",
        value: "",
        key: "inServiceOrders",
        icon: CodeIcon,
      },
      {
        label: "今日用车用户",
        value: "",
        key: "toBePaidOrders",
        icon: IdCardIcon,
      },
    ]);

    onMounted(() => {
      getData(dayjs(new Date()).format("YYYY-MM"));
    });

    const getData = async (month: string) => {
      loading.value = true;
      try {
        let res = await getCustomer({ month });
        usersData.value[0].value = res.data.customerCount;
        usersData.value[1].value = res.data.newCustomerCount;
        usersData.value[2].value = res.data.activeCustomerCount;
        usersData.value[3].value = res.data.orderCustomerCount;

        dateData.value = res.data.dayList;
        lineData.value = res.data.countList;

        loading.value = false;
      } catch (err) {
        console.log(err);
        loading.value = false;
      }
    };

    function handleDate(value: string) {
      getData(dayjs(new Date(value)).format("YYYY-MM"));
    }

    return {
      loading,
      month,
      dateData,
      lineData,
      usersData,
      disablePreviousDate(ts: number) {
        return ts > Date.now();
      },
      legenData: ["用户总数"],
      handleDate,
    };
  },
});
</script>
<style lang="scss" scoped></style>
