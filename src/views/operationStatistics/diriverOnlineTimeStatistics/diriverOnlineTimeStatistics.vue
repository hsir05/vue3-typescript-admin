<template>
  <div class="diriver-online-time-statistics">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px online-time"
      require-mark-placement="right-hanging"
      label-width="100"
      :model="queryForm"
    >
      <n-form-item label="运营企业" path="operationCompanyId">
        <n-select
          v-model:value="queryForm.operationCompanyId"
          clearable
          filterable
          placeholder="选择运营企业"
          style="width: 260px"
          :options="operateCompanyOptions"
        />
      </n-form-item>

      <n-form-item label="统计时段" path="type">
        <n-radio-group v-model:value="type" @update:value="handleType">
          <n-radio value="1">按日统计</n-radio>
          <n-radio value="0">按月统计</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="统计时段" path="day">
        <n-date-picker
          v-model:value="queryForm.day"
          :type="type === '1' ? 'date' : 'month'"
          clearable
          style="width: 180px"
        />
      </n-form-item>

      <n-form-item label="查找方式" path="mode">
        <n-radio-group v-model:value="mode" @update:value="handleMode">
          <n-radio value="1">按班组查找</n-radio>
          <n-radio value="0">按工号查找</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item :label="mode === '1' ? '司机班组' : '司机工号'" path="monitor">
        <!-- <n-select v-model:value="queryForm.monitor" clearable filterable
                    :placeholder="mode === '1' ? '司机班组' : '司机工号'" style="width: 260px"
                    :options="operateCompanyOptions" /> -->
      </n-form-item>

      <n-button attr-type="button" :loading="loading" class="ml-10px" type="primary" @click="query"
        >查找</n-button
      >
    </n-form>

    <div class="diriver-online-time-line mt-10px pt-10px pb-10px">
      <order />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
// import { getDriverClazzs, OnlineInfoInter, findDriverDayOnlineTimeInfo, getDriverWorkRestRecord } from "@/api/operationStatistics/operationStatistics"
import { getDriverClazzs } from "@/api/operationStatistics/operationStatistics";
import Order from "./order.vue";
export default defineComponent({
  name: "DiriverOnlineTimeStatistics",
  components: {
    Order,
  },
  setup() {
    const loading = ref(false);
    const type = ref("1");
    const mode = ref("1");
    const queryForm = ref({
      day: null,
      operationCompanyId: "75e642e0096b4a41a2b2ecf933c92247",
      checkType: null,
      driverClazzId: null,
    });

    const clazzs = ref([]);

    onMounted(() => {
      getData();
    });

    const getData = async () => {
      try {
        let res = await getDriverClazzs({ operationCompanyId: queryForm.value.operationCompanyId });

        clazzs.value = res.data.map((item: { id: string; name: string }) => {
          return { label: item.name, value: item.id };
        });
      } catch (err) {
        console.log(err);
      }
    };

    const handleType = (value: string) => {
      console.log(value);
    };
    function handleMode(value: string) {
      console.log(value);
      //     let { companyId, date } = unref(queryForm);
      //     queryForm.value = {
      //         monitor: null,
      //         companyId,
      //         date,
      //     };
    }

    function query(e: MouseEvent) {
      e.preventDefault();
    }

    return {
      loading,
      type,
      mode,
      queryForm,
      operateCompanyOptions: [],

      query,
      handleType,
      handleMode,
    };
  },
});
</script>
<style lang="scss" scoped>
.online-time {
  flex-wrap: wrap;
}

.diriver-online-time-line {
  background-color: $white;
}
</style>
