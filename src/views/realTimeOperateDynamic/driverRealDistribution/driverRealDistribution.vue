<template>
  <div class="h-full flex-align-start">
    <div class="map"><Map ref="baiduMapRef" /></div>

    <div class="map-right">
      <n-form-item ref="formRef" label-width="70" label="运营企业" label-placement="top">
        <n-select
          clearable
          filterable
          v-model:value="companyId"
          placeholder="选择运营企业"
          :options="options"
        />
      </n-form-item>

      <n-form-item ref="formRef" label-width="70" label="司机工号" label-placement="top">
        <n-select
          clearable
          filterable
          v-model:value="companyId"
          placeholder="选择司机工号"
          :options="options"
        />
      </n-form-item>

      <n-form-item ref="formRef" label-width="70" label="车辆类型" label-placement="top">
        <n-select
          clearable
          filterable
          v-model:value="companyId"
          placeholder="选择车辆类型"
          :options="options"
        />
      </n-form-item>

      <n-divider title-placement="left">异常司机</n-divider>
      <n-empty description="暂无" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Map from "@/components/Map/BaiduMap.vue";
export default defineComponent({
  name: "DriverRealDistribution",
  components: { Map },
  setup() {
    const companyId = ref(null);
    const baiduMapRef = ref();
    onMounted(async () => {
      const { renderBaiduMap } = baiduMapRef.value;
      await renderBaiduMap(103.841521, 36.067212);
    });

    return {
      companyId,
      baiduMapRef,
      options: [],
    };
  },
});
</script>
<style lang="scss" scoped>
.map {
  width: calc(100% - 260px - 10px);
  height: 100%;
  overflow: scroll;
  background-color: $white;
  box-sizing: border-box;
  padding-top: 5px;
  padding-left: 5px;
  position: relative;
}

.map-right {
  // w-255px p-10px ml-10px bg-white h-full box-border
  width: 255px;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-left: 10px;
  background-color: $white;
}
</style>
