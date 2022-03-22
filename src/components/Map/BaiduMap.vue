<template>
  <div ref="domRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScriptTag } from "@vueuse/core";
import { BAIDU_MAP_SDK_URL } from "@/config/map";

const { load } = useScriptTag(BAIDU_MAP_SDK_URL);
const domRef = ref<HTMLDivElement | null>(null);

async function renderBaiduMap(lng: number, lat: number) {
  await load(true);
  //@ts-ignore
  const map = new BMap.Map(domRef.value!);
  //初始化，BMap.Map.centerAndZoom()方法要求设置中心点坐标和地图级别
  //@ts-ignore
  const point = new BMap.Point(lng, lat);
  //@ts-ignore
  map.centerAndZoom(point, 15);
  //@ts-ignore
  map.enableScrollWheelZoom(); //鼠标滚轮控制缩放
  //@ts-ignore
  var marker = new BMap.Marker(point); // 创建标注
  //@ts-ignore
  map.addOverlay(marker);

  //拖拽标注
  marker.enableDragging();
  //@ts-ignore
  marker.addEventListener("dragend", function (e) {
    console.log("当前位置：" + e.point.lng + ", " + e.point.lat);
  });
}

async function lMap(lng: number, lat: number) {
  await load(true);
  //@ts-ignore
  const map = new BMap.Map(domRef.value!); // 创建地图实例
  //@ts-ignore
  const point = new BMap.Point(lng, lat);
  //   const point = new BMap.Point(lng, lat); // 创建点坐标
  //@ts-ignore
  map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
  //@ts-ignore
  map.disableScrollWheelZoom();
  //@ts-ignore
  map.disableDoubleClickZoom();
  //   const tilelayer = new BMap.TileLayer(); // 创建地图层实例
  //   tilelayer.getTilesUrl = function () {
  //     // 设置图块路径
  //     return "layer.gif";
  //   };
  //    //@ts-ignore
  //   map.addTileLayer(tilelayer);
}
// 通过 defineExpose 把方法暴露出去，然后父组件调用
defineExpose({
  renderBaiduMap,
  lMap,
});

onMounted(() => {
  //   renderBaiduMap(103.832758, 36.06537);
});
</script>
<style scoped></style>
