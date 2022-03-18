<template>
  <div ref="domRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScriptTag } from "@vueuse/core";
import { BAIDU_MAP_SDK_URL } from "@/config/map";

const { load } = useScriptTag(BAIDU_MAP_SDK_URL);
const domRef = ref<HTMLDivElement | null>(null);

async function renderBaiduMap() {
  await load(true);
  //@ts-ignore
  const map = new BMap.Map(domRef.value!);

  //初始化，BMap.Map.centerAndZoom()方法要求设置中心点坐标和地图级别
  //@ts-ignore
  const point = new BMap.Point(116.403414, 39.924091);
  //@ts-ignore
  map.centerAndZoom(point, 15);
  //@ts-ignore
  map.enableScrollWheelZoom(); //鼠标滚轮控制缩放
  //@ts-ignore
  var marker = new BMap.Marker(point); // 创建标注
  //@ts-ignore
  map.addOverlay(marker);
}

onMounted(() => {
  renderBaiduMap();
});
</script>
<style scoped></style>
