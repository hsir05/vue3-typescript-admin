<template>
  <div class="flex-align-start order-detail">
    <div class="left">
      <n-descriptions label-placement="left" bordered :column="2">
        <n-descriptions-item label="流量方" :span="2">融合约车流量方</n-descriptions-item>
        <n-descriptions-item label="流量方订单号" :span="2"
          >202204141055555899496</n-descriptions-item
        >
        <n-descriptions-item label="订单类型">立即</n-descriptions-item>
        <n-descriptions-item label="订单状态">服务完成且已支付</n-descriptions-item>
        <n-descriptions-item label="客户手机号">187****5472 </n-descriptions-item>
        <n-descriptions-item label="乘车人手机号">187****5472 </n-descriptions-item>
        <n-descriptions-item label="司机姓名[工号]">187****5472 </n-descriptions-item>
        <n-descriptions-item label="司机手机号">187****5472 </n-descriptions-item>
        <n-descriptions-item label="车牌号">187****5472 </n-descriptions-item>
        <n-descriptions-item label="车辆类型">187****5472 </n-descriptions-item>
      </n-descriptions>

      <div class="p-20px mt-10px bg-white step">
        <n-steps vertical :current="(current as number)" :status="currentStatus">
          <n-step
            title="I Me Mine"
            description="All through the day, I me mine I me mine, I me mine"
          >
            <template #finish-icon>
              <n-icon>
                <DocumentIcon />
              </n-icon>
            </template>
          </n-step>
          <n-step
            title="Let It Be"
            description="When I find myself in times of trouble Mother Mary comes to me"
          />
          <n-step title="Break" />
          <n-step
            title="Come Together"
            description="Here come old flat top He come grooving up slowly"
          />
          <n-step
            title="Something"
            description="Something in the way she moves Attracts me like no other lover"
          />
        </n-steps>
      </div>
    </div>
    <div class="right">
      <Map ref="baiduMapRef" class="map" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { StepsProps } from "naive-ui";
import { DocumentTextOutline as DocumentIcon } from "@vicons/ionicons5";
import Map from "@/components/Map/BaiduMap.vue";
export default defineComponent({
  name: "FinisherOrderDetail",
  components: { Map, DocumentIcon },
  setup() {
    const route = useRoute();
    const baiduMapRef = ref();
    const currentRef = ref<number | null>(2);

    console.log(route.query.id);

    onMounted(async () => {
      const { renderBaiduMap } = baiduMapRef.value;
      await renderBaiduMap(103.841521, 36.067212);
      //   addBoundary()
    });

    return {
      currentStatus: ref<StepsProps["status"]>("finish"),
      current: currentRef,
      baiduMapRef,
    };
  },
});
</script>
<style lang="scss" scoped>
.order-detail {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.left {
  width: 500px;
  height: 100%;
  //   background-color: $white;
}
.right {
  width: calc(100% - 500px - 15px);
  height: 100%;
  padding: 5px;
  background-color: $white;
  margin-left: 10px;
  box-sizing: border-box;
  .map {
    height: 400px;
  }
}
.step {
  height: 57%;
}
</style>
