<template>
  <div ref="domRef" class="w-full h-full" style="display: table">
    <n-empty class="empty" />
  </div>
</template>

<script setup lang="ts">
//@ts-nocheck

import { ref } from "vue";
const domRef = ref<HTMLDivElement | null>(null);
import stylesData from "@/assets/custom_map_config.json";

// 渲染地图
async function renderBaiduMap(
  currentOpenAreaPointsData = [],
  remoteNonEditablePointsData = [],
  lng = 116.405725,
  lat = 39.935362
) {
  // await load(true);
  let options = {
    gridPrecision: 2,
    showGrid: true,
  };
  let timer = null;
  let drawingManager = null;

  let gridlines = []; // 用来存储网格线覆盖物的数组
  let nonEditablePoints = []; // 用来存储不可选择区块的数组
  let openAreaPointList = currentOpenAreaPointsData;
  let currentOpenAreaPoints = []; // 用来存储当前开通区域的区块的数组（新增或编辑时即是可编辑区块）
  let remoteNonEditablePoints = remoteNonEditablePointsData; // 用来存储当前开通区域的区块的数组（新增或编辑时即是可编辑区块）

  let Event = {
    tilesloaded: "tilesloaded",
  };
  // 初始化
  let map = new BMap.Map(domRef.value!, { enableMapClick: false, minZoom: 11, maxZoom: 15 });
  let point = new BMap.Point(lng, lat);
  // 初始化地图,设置中心点坐标和地图级别
  map.centerAndZoom(point, 12);
  //鼠标滚轮控制缩放
  map.disableDoubleClickZoom(false);

  map.setMapStyleV2({ styleJson: stylesData });

  map.addEventListener(Event.tilesloaded, function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      let bounds = map.getBounds();
      let nePoint = bounds.getNorthEast(); //可视区域右上角(东北角）
      let swPoint = bounds.getSouthWest(); //可视区域左下角(西南角)
      // 清除全部网格线
      if (options.showGrid) {
        clearAllGrid();
        // 绘制地图范围内的网格
        drawGrid(nePoint, swPoint);
      }

      clearOutSideNonEditablePieces(nePoint, swPoint);
      addNonEditablePieces(remoteNonEditablePoints, nePoint, swPoint);
      addCurrentOpenAreaPieces(openAreaPointList);
    }, 200);
  });

  function mapDrawingInit() {
    options.showGrid = true;

    drawingManager = new BMapLib.DrawingManager(map, {
      isOpen: false, //是否开启绘制模式
      enableDrawingTool: false, //是否显示工具栏
      enableCalculate: false, //是否开启距离或面积计算
      rectangleOptions: {
        strokeColor: "#666", //边线颜色。
        fillColor: "#ccc", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.4, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid", //边线的样式，solid或dashed。
      }, //多边形的样式
    });

    drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener("rectanglecomplete", function (overlay) {
      let bounds = overlay.getBounds();
      // 选中在选择框的块
      let nePoint = bounds.getNorthEast(); //可视区域右上角(东北角）
      let swPoint = bounds.getSouthWest(); //可视区域左下角(西南角)
      // 添加或删除用绘制工具选择的区域（添加及删除覆盖物和openAreaMapBox.currentOpenAreaPoints中的元素）
      refershCurrentOpenAreaPieces(remoteNonEditablePoints, nePoint, swPoint);

      // 刪除鼠标绘制的图层
      overlay.remove();
    });
  }
  // 给城市添加边界线
  function addBoundary(name) {
    let boundary = new BMap.Boundary();
    boundary.get(name, function (rs) {
      //获取行政区域
      let count = rs.boundaries.length; //行政区域的点有多少个
      for (let i = 0; i < count; i++) {
        let ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
  }
  // 在地图上添加区块,会返回地图上添加的区块覆盖物
  function addPiece(keyLng, keyLat, style) {
    let dValue = Number((0.1 / options.gridPrecision).toFixed(2)); // 两个相邻关键点之间经度或纬度之间的相差值
    let rectangle = new BMap.Polygon(
      [
        new BMap.Point((keyLng - dValue / 2).toFixed(3), (keyLat - dValue / 2).toFixed(3)),
        new BMap.Point((keyLng - dValue / 2).toFixed(3), (keyLat + dValue / 2).toFixed(3)),
        new BMap.Point((keyLng + dValue / 2).toFixed(3), (keyLat + dValue / 2).toFixed(3)),
        new BMap.Point((keyLng + dValue / 2).toFixed(3), (keyLat - dValue / 2).toFixed(3)),
      ],
      style
    );
    map.addOverlay(rectangle);
    return rectangle;
  }
  // 绘制地图上的网格线
  function drawGrid(nePoint, swPoint) {
    let dValue = Number((0.1 / options.gridPrecision).toFixed(2)); // 两个相邻关键点之间经度或纬度之间的相差值
    let latMin = Number((calculateKey(swPoint.lat) + dValue / 2).toFixed(3));
    let latMax = Number((calculateKey(nePoint.lat) - dValue / 2).toFixed(3));
    let lngMin = Number((calculateKey(swPoint.lng) + dValue / 2).toFixed(3));
    let lngMax = Number((calculateKey(nePoint.lng) - dValue / 2).toFixed(3));
    // 画网格的纬度线（横线）
    for (let i = 0; i <= Math.round((latMax - latMin) / dValue); i++) {
      let polygon = new BMap.Polygon(
        [
          new BMap.Point(swPoint.lng, (latMin + i * dValue).toFixed(3)),
          new BMap.Point(nePoint.lng, (latMin + i * dValue).toFixed(3)),
        ],
        { strokeColor: "gray", strokeWeight: 0.2, fillOpacity: 0.5 }
      );
      addOverlay(polygon);
      gridlines.push(polygon);
    }
    // 画网格的经度线（竖线）
    for (let i = 0; i <= Math.round((lngMax - lngMin) / dValue); i++) {
      let polygon = new BMap.Polygon(
        [
          new BMap.Point((lngMin + i * dValue).toFixed(3), swPoint.lat),
          new BMap.Point((lngMin + i * dValue).toFixed(3), nePoint.lat),
        ],
        { strokeColor: "gray", strokeWeight: 0.2, fillOpacity: 0.5 }
      );
      addOverlay(polygon);
      gridlines.push(polygon);
    }
  }
  // 清除地图上的网格线
  function clearAllGrid() {
    for (let i = gridlines.length - 1; i >= 0; i--) {
      removeOverlay(gridlines[i]);
      gridlines.splice(i, 1);
    }
  }
  // 在地图上添加某范围内的不可编辑区块（可以传入一个区域编码，添加的不可编辑区块中将不会包含该区域编码下的区块）
  function addNonEditablePieces(data, nePoint, swPoint) {
    if (nePoint && swPoint) {
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let openAreaPoint = data[i];
          // 判断返回的不可选关键点（或区块）是不是已经在可编辑区块列表中，如果在，从可编辑区块列表中删除
          for (let i = currentOpenAreaPoints.length - 1; i >= 0; i--) {
            if (
              currentOpenAreaPoints[i].lng === openAreaPoint.lng &&
              currentOpenAreaPoints[i].lat === openAreaPoint.lat
            ) {
              removeOverlay(currentOpenAreaPoints[i].piece);
              currentOpenAreaPoints.splice(i, 1);
              break;
            }
          }
          // 判断已经存在的不可选区块中有没有该不可选择的区块，没有的话，就添加覆盖物及nonEditablePoints中的元素
          let isExist = false;
          for (let i = 0; i < nonEditablePoints.length; i++) {
            if (
              nonEditablePoints[i].lng === openAreaPoint.lng &&
              nonEditablePoints[i].lat === openAreaPoint.lat
            ) {
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            openAreaPoint.piece = addPiece(openAreaPoint.lng, openAreaPoint.lat, {
              strokeColor: "#eba624",
              fillColor: "#eba624",
              strokeWeight: 0.1,
              fillOpacity: 0.5,
            });
            nonEditablePoints.push(openAreaPoint);
          }
        }
      } else {
        clearInSideNonEditablePieces(nePoint, swPoint);
      }
    }
  }
  // 删除地图上某范围内的不可编辑区域
  function clearInSideNonEditablePieces(nePoint, swPoint) {
    let latMin = swPoint ? calculateKey(swPoint.lat) : 0;
    let latMax = nePoint ? calculateKey(nePoint.lat) : 90;
    let lngMin = swPoint ? calculateKey(swPoint.lng) : 0;
    let lngMax = nePoint ? calculateKey(nePoint.lng) : 180;
    for (let i = nonEditablePoints.length - 1; i >= 0; i--) {
      // 如果在地图可视范围内，清除之
      if (
        lngMin <= nonEditablePoints[i].lng &&
        nonEditablePoints[i].lng <= lngMax &&
        latMin <= nonEditablePoints[i].lat &&
        nonEditablePoints[i].lat <= latMax
      ) {
        removeOverlay(nonEditablePoints[i].piece);
        nonEditablePoints.splice(i, 1);
      }
    }
  }
  // 删除地图上某范围外的不可编辑区域
  function clearOutSideNonEditablePieces(nePoint, swPoint) {
    let latMin = swPoint ? calculateKey(swPoint.lat) : 0;
    let latMax = nePoint ? calculateKey(nePoint.lat) : 90;
    let lngMin = swPoint ? calculateKey(swPoint.lng) : 0;
    let lngMax = nePoint ? calculateKey(nePoint.lng) : 180;
    for (let i = nonEditablePoints.length - 1; i >= 0; i--) {
      // 如果不在地图可视范围内，清除之
      if (
        !(
          lngMin <= nonEditablePoints[i].lng &&
          nonEditablePoints[i].lng <= lngMax &&
          latMin <= nonEditablePoints[i].lat &&
          nonEditablePoints[i].lat <= latMax
        )
      ) {
        removeOverlay(nonEditablePoints[i].piece);
        nonEditablePoints.splice(i, 1);
      }
    }
  }
  // 在地图上添加某个开通区域的关键点区块(添加完之后会将地图移动到区域中间)
  function addCurrentOpenAreaPieces(data) {
    if (data && data.length > 0) {
      let latMin, latMax, lngMin, lngMax;
      for (let i = 0; i < data.length; i++) {
        let openAreaPoint = data[i];
        if (!latMin || latMin > openAreaPoint.lat) {
          latMin = openAreaPoint.lat;
        }
        if (!latMax || latMax < openAreaPoint.lat) {
          latMax = openAreaPoint.lat;
        }
        if (!lngMin || lngMin > openAreaPoint.lng) {
          lngMin = openAreaPoint.lng;
        }
        if (!lngMax || lngMax < openAreaPoint.lng) {
          lngMax = openAreaPoint.lng;
        }
        openAreaPoint.piece = addPiece(openAreaPoint.lng, openAreaPoint.lat, {
          strokeColor: "#89b929",
          fillColor: "#89b929",
          strokeWeight: 0.1,
          fillOpacity: 0.5,
        });
        currentOpenAreaPoints.push(openAreaPoint);
      }
      // panTo((lngMin + lngMax) / 2, (latMin + latMax) / 2)
    }
  }
  function removeAllOverlay() {
    for (let i = 0; i < currentOpenAreaPoints.length; i++) {
      removeOverlay(currentOpenAreaPoints[i].piece);
    }
  }
  // 删除地图上某范围内的可编辑区域
  function clearInSideCurrentOpenAreaPieces(nePoint, swPoint) {
    let latMin = swPoint ? calculateKey(swPoint.lat) : 0;
    let latMax = nePoint ? calculateKey(nePoint.lat) : 90;
    let lngMin = swPoint ? calculateKey(swPoint.lng) : 0;
    let lngMax = nePoint ? calculateKey(nePoint.lng) : 180;
    for (let i = currentOpenAreaPoints.length - 1; i >= 0; i--) {
      // 如果在地图可视范围内，清除之
      if (
        lngMin <= currentOpenAreaPoints[i].lng &&
        currentOpenAreaPoints[i].lng <= lngMax &&
        latMin <= currentOpenAreaPoints[i].lat &&
        currentOpenAreaPoints[i].lat <= latMax
      ) {
        removeOverlay(currentOpenAreaPoints[i].piece);
        currentOpenAreaPoints.splice(i, 1);
      }
    }
  }
  // 根究经纬度数值计算关键点经纬度数值
  function calculateKey(number) {
    // 1.让目标经纬度数字乘以精度（2、5或10），2.四舍五入保留一位小数，3.除以精度
    return Number(
      (Math.round(number * options.gridPrecision * 10) / 10 / options.gridPrecision).toFixed(2)
    );
  }

  function refershCurrentOpenAreaPieces(remoteNonEditablePoints, nePoint, swPoint) {
    // _setMapTilesloadedListener()
    // 1.计算出选中的关键点列表（可能没有、可能是1个，可能是多个）waitSelectedPoints
    let waitSelectedPoints = [];

    let dValue = Number((0.1 / options.gridPrecision).toFixed(2)); // 两个相邻关键点之间经度或纬度之间的相差值
    let latMin = calculateKey(swPoint.lat, options.gridPrecision);
    let latMax = calculateKey(nePoint.lat, options.gridPrecision);
    let lngMin = calculateKey(swPoint.lng, options.gridPrecision);
    let lngMax = calculateKey(nePoint.lng, options.gridPrecision);

    if (nePoint.lng === swPoint.lng && nePoint.lat === swPoint.lat) {
      waitSelectedPoints.push({ lng: lngMax, lat: latMax });
    } else {
      for (
        let i = Number((latMin + dValue).toFixed(2));
        i < latMax;
        i = Number((i + dValue).toFixed(2))
      ) {
        for (
          let j = Number((lngMin + dValue).toFixed(2));
          j < lngMax;
          j = Number((j + dValue).toFixed(2))
        ) {
          waitSelectedPoints.push({ lng: j, lat: i });
        }
      }
    }
    // 2.判断关键点在不在不可选关键点（区块列表）nonEditablePoints中，在的话该关键点就不再处理，从waitSelectedPoints中移除
    for (let i = waitSelectedPoints.length - 1; i >= 0; i--) {
      for (let j = 0; j < nonEditablePoints.length; j++) {
        if (
          waitSelectedPoints[i].lng === nonEditablePoints[j].lng &&
          waitSelectedPoints[i].lat === nonEditablePoints[j].lat
        ) {
          waitSelectedPoints.splice(i, 1);
          break;
        }
      }
    }
    // 3.调用查找不可选关键点的接口，再从waitSelectedPoints中过滤一次不可选关键点（区块），（waitSelectedPoints中没有数据就不用调接口了）
    if (waitSelectedPoints.length > 0) {
      // let remoteNonEditablePoints
      for (let i = waitSelectedPoints.length - 1; i >= 0; i--) {
        for (let j = 0; j < remoteNonEditablePoints.length; j++) {
          if (
            waitSelectedPoints[i].lng === remoteNonEditablePoints[j].lng &&
            waitSelectedPoints[i].lat === remoteNonEditablePoints[j].lat
          ) {
            waitSelectedPoints.splice(i, 1);
            break;
          }
        }
      }
    }
    // 4.已经选中的取消选中，没选中的添加选中
    for (let i = 0; i < waitSelectedPoints.length; i++) {
      let index = -1;
      for (let j = 0; j < currentOpenAreaPoints.length; j++) {
        if (
          waitSelectedPoints[i].lng === currentOpenAreaPoints[j].lng &&
          waitSelectedPoints[i].lat === currentOpenAreaPoints[j].lat
        ) {
          index = j;
          break;
        }
      }
      if (index > -1) {
        removeOverlay(currentOpenAreaPoints[index].piece);
        currentOpenAreaPoints.splice(index, 1);
      } else {
        waitSelectedPoints[i].piece = addPiece(
          waitSelectedPoints[i].lng,
          waitSelectedPoints[i].lat,
          { strokeColor: "#89b929", fillColor: "#89b929", strokeWeight: 0.1, fillOpacity: 0.5 }
        );
        currentOpenAreaPoints.push(waitSelectedPoints[i]);
      }
    }
  }

  // 设置地图中心位置
  function reSetCenter(lng, lat, delay) {
    setTimeout(
      function () {
        map.setCenter(new BMap.Point(lng, lat));
      },
      delay ? delay : 0
    );
  }
  // 设置地图中心位置,如果新的中点在可视范围内，将会平滑移动过去
  function panTo(lng, lat, delay) {
    setTimeout(
      function () {
        map.panTo(new BMap.Point(lng, lat));
      },
      delay ? delay : 0
    );
  }
  // 添加传入的覆盖物
  function addOverlay(overlay) {
    map.addOverlay(overlay);
  }
  // 删除传入的覆盖物
  function removeOverlay(overlay) {
    map.removeOverlay(overlay);
  }
  // 清除所有覆盖物
  function clearOverlays() {
    // 清除所有覆盖物
    map.clearOverlays();
    // 清除openAreaMapBox中存储的引用
    gridlines.splice(0, gridlines.length);
    nonEditablePoints.splice(0, nonEditablePoints.length);
    currentOpenAreaPoints.splice(0, currentOpenAreaPoints.length);
  }
  // 添加单个点覆盖物
  function addMarker(lng, lat, icon) {
    let marker;
    if (icon) {
      marker = new BMap.Marker(new BMap.Point(lng, lat), { icon: icon });
    } else {
      marker = new BMap.Marker(new BMap.Point(lng, lat));
    }
    map.addOverlay(marker);
    return marker;
  }

  return {
    addBoundary,
    removeAllOverlay,
    mapDrawingInit,
    clearInSideCurrentOpenAreaPieces,
    reSetCenter,
    panTo,
    clearOverlays,

    addMarker,
  };
}

// 通过 defineExpose 把方法暴露出去，然后父组件调用
defineExpose({
  renderBaiduMap,
});
</script>
<style scoped></style>
