<template>
  <div ref="domRef" class="w-full h-full" style="display: table">
    <n-empty class="empty" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useScriptTag } from "@vueuse/core";
import { BAIDU_MAP_SDK_URL } from "@/config/map";

//@ts-nocheck
const { load } = useScriptTag(BAIDU_MAP_SDK_URL);
const domRef = ref<HTMLDivElement | null>(null);

// 渲染地图
async function renderBaiduMap(lng: number, lat: number) {
  await load(true);
  //@ts-ignore
  let map = null;
  let options = {
    gridPrecision: 2,
  };
  let gridlines = []; // 用来存储网格线覆盖物的数组

  // 初始化
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
  //   map.setMapStyleV2({ styleJson: stylesData.data });
  // 创建标注
  function createMarker(callback: Fn) {
    //@ts-ignore
    const marker = new BMap.Marker(point); // 创建标注
    //添加覆盖物
    //@ts-ignore
    map.addOverlay(marker);
    //拖拽标注
    marker.enableDragging();
    //@ts-ignore
    marker.addEventListener("dragend", function (e) {
      console.log(e);
      console.log("当前位置：" + e.point.lng + ", " + e.point.lat);
      callback(e.point.lng, e.point.lat);
    });

    return {};
  }

  // 给城市添加边界线
  function addBoundary() {
    //@ts-ignore
    let boundary = new BMap.Boundary();
    boundary.get(function (rs: any) {
      //获取行政区域
      let count = rs.boundaries.length; //行政区域的点有多少个
      for (let i = 0; i < count; i++) {
        //@ts-ignore
        let ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
        //@ts-ignore
        map.addOverlay(ply); //添加覆盖物
      }
    });
  }

  // 根究经纬度数值计算关键点经纬度数值
  function calculateKey(num: number) {
    // 1.让目标经纬度数字乘以精度（2、5或10），2.四舍五入保留一位小数，3.除以精度
    return Number(
      (Math.round(num * options.gridPrecision * 10) / 10 / options.gridPrecision).toFixed(2)
    );
  }

  // 添加传入的覆盖物
  function addOverlay(overlay: any) {
    //@ts-ignore
    map.addOverlay(overlay);
  }

  //绘制地图上的网格线
  function drawGrid(nePoint: { lng: number; lat: number }, swPoint: { lng: number; lat: number }) {
    let dValue = Number((0.1 / options.gridPrecision).toFixed(2)); // 两个相邻关键点之间经度或纬度之间的相差值
    let latMin = Number((calculateKey(swPoint.lat) + dValue / 2).toFixed(3));
    let latMax = Number((calculateKey(nePoint.lat) - dValue / 2).toFixed(3));
    let lngMin = Number((calculateKey(swPoint.lng) + dValue / 2).toFixed(3));
    let lngMax = Number((calculateKey(nePoint.lng) - dValue / 2).toFixed(3));
    // 画网格的纬度线（横线）
    for (let i = 0; i <= Math.round((latMax - latMin) / dValue); i++) {
      //@ts-ignore
      let polygon = new BMap.Polygon(
        [
          //@ts-ignore
          new BMap.Point(swPoint.lng, (latMin + i * dValue).toFixed(3)),
          //@ts-ignore
          new BMap.Point(nePoint.lng, (latMin + i * dValue).toFixed(3)),
        ],
        { strokeColor: "gray", strokeWeight: 0.2, fillOpacity: 0.5 }
      );
      addOverlay(polygon);
      gridlines.push(polygon);
    }
    // 画网格的经度线（竖线）
    for (let i = 0; i <= Math.round((lngMax - lngMin) / dValue); i++) {
      //@ts-ignore
      let polygon = new BMap.Polygon(
        [
          //@ts-ignore
          new BMap.Point((lngMin + i * dValue).toFixed(3), swPoint.lat),
          //@ts-ignore
          new BMap.Point((lngMin + i * dValue).toFixed(3), nePoint.lat),
        ],
        { strokeColor: "gray", strokeWeight: 0.2, fillOpacity: 0.5 }
      );
      addOverlay(polygon);
      gridlines.push(polygon);
    }
  }
  return {
    createMarker,
    addBoundary,
    drawGrid,
  };
}

// 通过 defineExpose 把方法暴露出去，然后父组件调用
defineExpose({
  renderBaiduMap,
});
</script>
<style scoped></style>
