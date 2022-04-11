<template>
  <div class="">
    <!-- 检索 -->
    <n-form
      ref="queryFormRef"
      inline
      label-placement="left"
      class="pt-15px pb-15px bg-white mb-5px"
      require-mark-placement="right-hanging"
      :show-feedback="false"
      label-width="100"
      :model="queryForm"
    >
      <n-form-item label="开通城市" label-placement="left">
        <n-select
          v-model:value="queryForm.cityCode"
          clearable
          filterable
          placeholder="选择开通城市"
          style="width: 260px"
          :options="openCityList.result"
        />
      </n-form-item>

      <div class="flex-center">
        <n-form-item label="时间区间" path="section">
          <n-date-picker
            v-model:value="queryForm.section"
            style="width: 250px"
            type="daterange"
            :shortcuts="rangeShortcuts"
            :update-value-on-close="true"
          />
        </n-form-item>

        <n-button
          attr-type="button"
          :loading="loading"
          class="ml-10px"
          type="primary"
          @click="query"
          >查找</n-button
        >
      </div>
    </n-form>

    <n-select
      clearable
      style="width: 100px"
      filterable
      v-model:value="status"
      @update:value="handleStatus"
      :options="orderStateus.result"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, onMounted } from "vue";
import { FormInst, useMessage } from "naive-ui";
import orderStateus from "@/config/orderStatus.json";
import openCityList from "@/config/openCityList.json";
import { rangeShortcuts } from "@/config/table";
export default defineComponent({
  name: "CityOrderDistribution",
  setup() {
    const loading = ref(false);
    const status = ref("finished");
    const queryFormRef = ref<FormInst | null>(null);
    const queryForm = ref({
      section: [new Date("2022-03-16"), new Date("2022-03-18")],
      cityCode: "allCity",
    });
    const message = useMessage();

    onMounted(() => {});

    function handleStatus(value: string) {
      console.log(value);
      message.success("验证成功");
    }

    function query(e: MouseEvent) {
      e.preventDefault();
      queryFormRef.value?.validate((errors) => {
        if (!errors) {
          console.log(unref(queryForm));
          message.success("验证成功");
        } else {
          console.log(errors);
          message.error("验证失败");
        }
      });
    }

    return {
      loading,
      queryFormRef,
      status,
      queryForm,
      orderStateus,
      openCityList,
      rangeShortcuts,

      handleStatus,
      query,
    };
  },
});
</script>
