<template>
  <div ref="domRef" class="w-full h-full" style="display: table">
    <n-empty class="empty" />
  </div>
</template>

<script setup lang="ts">
//@ts-nocheck

import { ref, toRefs, watch } from "vue";
import stylesData from "@/assets/custom_map_config.json";

const domRef = ref<HTMLDivElement | null>(null);
const emit = defineEmits(["update-nonEditArea", "on-dragend"]);

interface NonDataInter {
  areaCode: string;
  lat: number;
  lng: number;
}
const props = defineProps({
  nonPointsData: {
    type: Array as PropType<NonDataInter[]>,
    default: () => [],
  },
  currentPointsData: {
    type: Array as PropType<NonDataInter[]>,
    default: () => [],
  },
});
//用来存储从接口获取的不可编辑区域的数据
const remoteNonEditablePointsData = ref<NonDataInter[]>([]);
const openAreaPointList = ref<NonDataInter[]>([]);

const { nonPointsData, currentPointsData } = toRefs(props);
remoteNonEditablePointsData.value = nonPointsData;
openAreaPointList.value = currentPointsData;

let options = {
  gridPrecision: 2,
  showGrid: true,
};
let Event = {
  tilesloaded: "tilesloaded",
};

let timer = null;

const map = ref(null);
const drawingManager = ref(null);
const point = ref(null);
const drivingRoute = ref(null);
const heatmapOverlay = ref(null);

let gridlines = []; // 用来存储网格线覆盖物的数组
let nonEditablePoints = []; // 用来存储不可选择区块的数组
const currentOpenAreaPoints = ref([]); // 用来存储当前开通区域的区块的数组（新增或编辑时即是可编辑区块）

watch(nonPointsData, (newValue) => {
  remoteNonEditablePointsData.value = newValue;
});
watch(currentPointsData, (newValue) => {
  openAreaPointList.value = newValue;
});

// 渲染地图
function renderBaiduMap(lng = 116.405725, lat = 39.935362) {
  // 初始化
  map.value = new BMap.Map(domRef.value!, { enableMapClick: false, minZoom: 11, maxZoom: 15 });
  point.value = new BMap.Point(lng, lat);
  // 初始化地图,设置中心点坐标和地图级别
  map.value.centerAndZoom(point.value, 12);
  //鼠标滚轮控制缩放
  map.value.disableDoubleClickZoom(false);
  map.value.setMapStyleV2({ styleJson: stylesData });
}

// 添加地图监听
function addMapEventListener() {
  map.value.addEventListener(Event.tilesloaded, function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      let bounds = map.value.getBounds();
      let nePoint = bounds.getNorthEast(); //可视区域右上角(东北角）
      let swPoint = bounds.getSouthWest(); //可视区域左下角(西南角)

      //   // 清除覆盖物
      //   for (let key of currentOpenAreaPoints) {
      //     removeOverlay(key.piece);
      //   }
      //   currentOpenAreaPoints = [];

      // 清除全部网格线
      if (options.showGrid) {
        clearAllGrid();
        // 绘制地图范围内的网格
        drawGrid(nePoint, swPoint);
      }
      let paramData = {};
      paramData.lngMin = calculateKey(swPoint.lng);
      paramData.lngMax = calculateKey(nePoint.lng);
      paramData.latMin = calculateKey(swPoint.lat);
      paramData.latMax = calculateKey(nePoint.lat);
      emit("update-nonEditArea", paramData);
    }, 200);
  });
}

function drawingManagerInit() {
  options.showGrid = true;
  drawingManager.value = new BMapLib.DrawingManager(map, {
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
  drawingManager.value.setDrawingMode(BMAP_DRAWING_RECTANGLE);
  // 添加鼠标绘制工具监听事件，用于获取绘制结果
  drawingManager.value.addEventListener("rectanglecomplete", function (overlay) {
    let bounds = overlay.getBounds();
    // 选中在选择框的块
    let nePoint = bounds.getNorthEast(); //可视区域右上角(东北角）
    let swPoint = bounds.getSouthWest(); //可视区域左下角(西南角)
    // 添加或删除用绘制工具选择的区域（添加及删除覆盖物和openAreaMapBox.currentOpenAreaPoints中的元素）
    refershCurrentOpenAreaPieces(remoteNonEditablePointsData.value, nePoint, swPoint);
    // 刪除鼠标绘制的图层
    overlay.remove();
  });
}

// 车辆轨迹
function trackIng(
  beginLng: number,
  beginLat: number,
  endLng: number,
  endLat: number,
  startIcon,
  endIcon
) {
  let myP1 = new BMap.Point(beginLng, beginLat); //起点
  let myP2 = new BMap.Point(endLng, endLat); //终点

  drivingRoute.value = new BMap.DrivingRoute(map.value, {
    renderOptions: { map: map.value, autoViewport: true },
  });
  drivingRoute.value.clearResults();
  // 为百度地图路径显示添加个性化图片
  drivingRoute.value.setMarkersSetCallback(function (result) {
    result[0].marker.setIcon(
      new BMap.Icon(startIcon, new BMap.Size(81, 33), { anchor: new BMap.Size(40, 33) })
    );
    result[1].marker.setIcon(
      new BMap.Icon(endIcon, new BMap.Size(81, 33), { anchor: new BMap.Size(40, 33) })
    );
  });
  drivingRoute.value.search(myP1, myP2);
}
// 添加地图热点
function addHeartMap() {
  map.value.enableScrollWheelZoom(true);
  heatmapOverlay.value = new BMapLib.HeatmapOverlay({ radius: 10 });
  map.value.addOverlay(heatmapOverlay.value);
}

function refreshHeatMap(pointList: { lng: number; lat: number }) {
  let points = [];

  for (let key of pointList) {
    points.push({
      lng: key.lng * 1e-6,
      lat: key.lat * 1e-6,
      count: 1,
    });
  }

  if (points && points.length > 0) {
    heatmapOverlay.value.setDataSet({
      data: points,
      max: 10,
    });
    heatmapOverlay.value.show();
  } else {
    heatmapOverlay.value && heatmapOverlay.value.hide();
  }
}

// 给城市添加边界线
function addBoundary(name) {
  let boundary = new BMap.Boundary();
  boundary.get(name, function (rs) {
    //获取行政区域
    let count = rs.boundaries.length; //行政区域的点有多少个
    for (let i = 0; i < count; i++) {
      let ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
      map.value.addOverlay(ply); //添加覆盖物
    }
  });
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
  removeAllOverlay();
  clearOutSideNonEditablePieces(nePoint, swPoint);
  addCurrentOpenAreaPieces(openAreaPointList.value);
  addNonEditablePieces(remoteNonEditablePointsData.value, nePoint, swPoint);
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
  map.value.addOverlay(rectangle);
  return rectangle;
}
// 在地图上添加某个开通区域的关键点区块(添加完之后会将地图移动到区域中间)
function addCurrentOpenAreaPieces(data) {
  currentOpenAreaPoints.value = [];
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
      currentOpenAreaPoints.value.push(openAreaPoint);
    }
    // panTo((lngMin + lngMax) / 2, (latMin + latMax) / 2)
  }
}
// 在地图上添加某范围内的不可编辑区块（可以传入一个区域编码，添加的不可编辑区块中将不会包含该区域编码下的区块）
function addNonEditablePieces(data, nePoint, swPoint) {
  if (nePoint && swPoint) {
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let openAreaPoint = data[i];
        // 判断返回的不可选关键点（或区块）是不是已经在可编辑区块列表中，如果在，从可编辑区块列表中删除
        for (let i = currentOpenAreaPoints.value.length - 1; i >= 0; i--) {
          if (
            currentOpenAreaPoints[i].lng === openAreaPoint.lng &&
            currentOpenAreaPoints[i].lat === openAreaPoint.lat
          ) {
            removeOverlay(currentOpenAreaPoints.value[i].piece);
            currentOpenAreaPoints.value.splice(i, 1);
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
// 清除地图上的网格线
function clearAllGrid() {
  for (let i = gridlines.length - 1; i >= 0; i--) {
    removeOverlay(gridlines[i]);
    gridlines.splice(i, 1);
  }
}
// 删除地图上某范围内的可编辑区域-------
function clearInSideCurrentOpenAreaPieces(nePoint, swPoint) {
  let latMin = swPoint ? calculateKey(swPoint.lat) : 0;
  let latMax = nePoint ? calculateKey(nePoint.lat) : 90;
  let lngMin = swPoint ? calculateKey(swPoint.lng) : 0;
  let lngMax = nePoint ? calculateKey(nePoint.lng) : 180;
  for (let i = currentOpenAreaPoints.value.length - 1; i >= 0; i--) {
    // 如果在地图可视范围内，清除之
    if (
      lngMin <= currentOpenAreaPoints.value[i].lng &&
      currentOpenAreaPoints.value[i].lng <= lngMax &&
      latMin <= currentOpenAreaPoints.value[i].lat &&
      currentOpenAreaPoints.value[i].lat <= latMax
    ) {
      removeOverlay(currentOpenAreaPoints.value[i].piece);
      currentOpenAreaPoints.value.splice(i, 1);
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
// 在一定范围内更新当前开通区域选中的关键点及区块
function refershCurrentOpenAreaPieces(remoteNonEditablePoints, nePoint, swPoint) {
  // 1.计算出选中的关键点列表（可能没有、可能是1个，可能是多个）waitSelectedPoints
  let waitSelectedPoints = [];

  let dValue = Number((0.1 / options.gridPrecision).toFixed(2)); // 两个相邻关键点之间经度或纬度之间的相差值
  let latMin = calculateKey(swPoint.lat);
  let latMax = calculateKey(nePoint.lat);
  let lngMin = calculateKey(swPoint.lng);
  let lngMax = calculateKey(nePoint.lng);

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
    for (let j = 0; j < currentOpenAreaPoints.value.length; j++) {
      if (
        waitSelectedPoints[i].lng === currentOpenAreaPoints.value[j].lng &&
        waitSelectedPoints[i].lat === currentOpenAreaPoints.value[j].lat
      ) {
        index = j;
        break;
      }
    }
    if (index > -1) {
      removeOverlay(currentOpenAreaPoints.value[index].piece);
      currentOpenAreaPoints.value.splice(index, 1);
    } else {
      waitSelectedPoints[i].piece = addPiece(waitSelectedPoints[i].lng, waitSelectedPoints[i].lat, {
        strokeColor: "#89b929",
        fillColor: "#89b929",
        strokeWeight: 0.1,
        fillOpacity: 0.5,
      });
      currentOpenAreaPoints.value.push(waitSelectedPoints[i]);
    }
  }
}
// 添加传入的覆盖物
function addOverlay(overlay) {
  map.value.addOverlay(overlay);
}
// 删除传入的覆盖物
function removeOverlay(overlay) {
  map.value.removeOverlay(overlay);
}
function removeAllOverlay() {
  // 清除覆盖物
  for (let key of currentOpenAreaPoints.value) {
    removeOverlay(key.piece);
  }
  // currentOpenAreaPoints = [];
}
// 清除所有覆盖物
function clearOverlays() {
  // 清除所有覆盖物
  map.value.clearOverlays();
  // 清除openAreaMapBox中存储的引用
  gridlines.splice(0, gridlines.length);
  nonEditablePoints.splice(0, nonEditablePoints.length);
  currentOpenAreaPoints.value.splice(0, currentOpenAreaPoints.value.length);
}
// 添加单个点覆盖物
function addMarker(lng, lat, icon) {
  let marker;
  if (icon) {
    marker = new BMap.Marker(new BMap.Point(lng, lat), { icon: icon });
  } else {
    marker = new BMap.Marker(new BMap.Point(lng, lat));
  }

  map.value.addOverlay(marker);
  return marker;
}

function createMarker() {
  let marker = new BMap.Marker(point.value, {
    enableDragging: true,
  }); // 创建标注
  map.value.addOverlay(marker); // 将标注添加到地图中
  // marker.disableDragging();     // 不可拖拽
  marker.addEventListener("dragend", function () {
    var nowPoint = marker.getPosition(); // 拖拽完成之后坐标的位置
    console.log(nowPoint);
    emit("on-dragend", nowPoint.lng, nowPoint.lat);
  });
}

// 设置地图中心位置
function resetCenter(lng, lat, delay) {
  setTimeout(
    function () {
      map.value.setCenter(new BMap.Point(lng, lat));
    },
    delay ? delay : 0
  );
}
// 设置地图中心位置,如果新的中点在可视范围内，将会平滑移动过去
function panTo(lng, lat, delay) {
  setTimeout(
    function () {
      map.value.panTo(new BMap.Point(lng, lat));
    },
    delay ? delay : 0
  );
}
// 通过 defineExpose 把方法暴露出去，然后父组件调用
defineExpose({
  renderBaiduMap,
  addBoundary,
  drawingManagerInit,
  clearInSideCurrentOpenAreaPieces,
  addCurrentOpenAreaPieces,
  resetCenter,
  panTo,
  clearOverlays,
  addMapEventListener,
  removeAllOverlay,
  addMarker,
  createMarker,
  trackIng,
  addHeartMap,
  refreshHeatMap,
  map,
  drawingManager,
  currentOpenAreaPoints,
});
</script>
<style scoped></style>
