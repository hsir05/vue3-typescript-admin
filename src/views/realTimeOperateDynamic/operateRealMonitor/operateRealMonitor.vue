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
        <n-col :span="8">
          <n-statistic label="统计数据" :value="99" class="text-center p-10px border">
            <template #prefix>
              <n-icon>
                <FileTrayFullOutline />
              </n-icon>
            </template>
            <template #suffix> / 100 </template>
          </n-statistic>
        </n-col>
        <n-col :span="8">
          <n-statistic label="活跃用户" class="text-center p-10px"> 1,234,123 </n-statistic>
        </n-col>

        <n-col :span="8">
          <n-statistic label="活跃用户" class="text-center p-10px"> 1,234,123 </n-statistic>
        </n-col>

        <n-col :span="8">
          <n-statistic label="活跃用户" class="text-center p-10px"> 1,234,123 </n-statistic>
        </n-col>

        <n-col :span="8">
          <n-statistic label="活跃用户" class="text-center p-10px"> 1,234,123 </n-statistic>
        </n-col>

        <n-col :span="8">
          <n-statistic label="活跃用户" class="text-center p-10px"> 1,234,123 </n-statistic>
        </n-col>
      </n-row>
    </div>

    <div class="bg-white p-10px mt-10px">
      <Line />
    </div>
    <div class="flex-align-start bg-white p-10px mt-10px">
      <Gauge width="50%" />
      <Gauge width="50%" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { FormInst } from "naive-ui";
import Line from "./line.vue";
import Gauge from "./gauge.vue";
import { FileTrayFullOutline } from "@vicons/ionicons5";
export default defineComponent({
  name: "OperateRealMonitor",
  components: { FileTrayFullOutline, Line, Gauge },
  setup() {
    const baiduMapRef = ref();
    const loading = ref(false);
    const formRef = ref<FormInst | null>(null);
    const form = ref({
      companyId: null,
      orderType: null,
    });

    onMounted(() => {});

    function handleValidate() {}

    return {
      formRef,
      form,
      loading,
      baiduMapRef,
      options: [],

      handleValidate,
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
</style>
