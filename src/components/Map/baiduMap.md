# 百度地图使用文档

使用@vueuse/core 的 useScriptTag API 插入 script 标签

## 初始化

```js
 await load(true);
  const map = new BMap.Map(domRef.value!);
  //初始化
  const point = new BMap.Point(116.403414, 39.924091);
  // centerAndZoom方法要求设置中心点坐标和地图级别
  map.centerAndZoom(point, 15);
  //鼠标滚轮控制缩放
  map.enableScrollWheelZoom();

  //



```

## 创建标注 拖拽标注

```js
var marker = new BMap.Marker(point);
// 将标注添加到地图中
map.addOverlay(marker);
// 标注图标可自定义 https://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/mark
//拖拽标注
marker.enableDragging();
marker.addEventListener("dragend", function (e) {
  console.log("当前位置：" + e.point.lng + ", " + e.point.lat);
});
```

## 添加折线

```js
  var polyline = new BMap.Polyline(
    [new BMap.Point(116.399, 39.91), new BMap.Point(116.405, 39.92)],
    { strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5 }
  );
  map.addOverlay(polyline);
```

