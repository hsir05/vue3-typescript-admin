<template>
  <div ref="domRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScriptTag } from "@vueuse/core";
import { BAIDU_MAP_SDK_URL } from "@/config/map";
import stylesData from "@/config/mapstyles.json";

//@ts-nocheck
const { load } = useScriptTag(BAIDU_MAP_SDK_URL);
const domRef = ref<HTMLDivElement | null>(null);

// 渲染地图
async function renderBaiduMap(lng: number, lat: number) {
  await load(true);
  //@ts-ignore
  let map = null;
  // 初始化
  function mapInit() {
    //@ts-ignore
    map = new BMap.Map(domRef.value!, { enableMapClick: false, minZoom: 11, maxZoom: 15 });
    //@ts-ignore
    const point = new BMap.Point(lng, lat);
    // 初始化地图,设置中心点坐标和地图级别
    //@ts-ignore
    map.centerAndZoom(point, 15);
    //@ts-ignore
    map.enableScrollWheelZoom(); //鼠标滚轮控制缩放

    //@ts-ignore
    map.setMapStyleV2({ styleJson: stylesData.data });
  }
  // 创建标注
  function createMarker() {
    //@ts-ignore
    const marker = new BMap.Marker(point); // 创建标注
    //添加覆盖物
    //@ts-ignore
    map.addOverlay(marker);
    //拖拽标注
    marker.enableDragging();
    //@ts-ignore
    marker.addEventListener("dragend", function (e) {
      console.log("当前位置：" + e.point.lng + ", " + e.point.lat);
    });

    return {
      lng,
    };
  }

  onMounted(() => {
    mapInit();
  });
  return {
    mapInit,
    createMarker,
  };
}

// 通过 defineExpose 把方法暴露出去，然后父组件调用
defineExpose({
  renderBaiduMap,
});
</script>
<style scoped></style>
