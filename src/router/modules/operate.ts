import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { EaselOutline } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/operate",
    name: "operate",
    redirect: "/operate/vehicle-type",
    component: PARENTLAYOUT,
    meta: {
      title: "运营基础配置",
      icon: renderIcon(EaselOutline),
      sort: 1,
    },
    children: [
      {
        path: "/operate/vehicle-type",
         name: `operate_vehicle-type`,
        meta: {
          title: "车辆类型管理",
        },
        component: () => import("@/views/operate/vehicleType/vehicleType.vue"),
      },
      {
        path: "/operate/opening-urban",
        name: "operate_opening-urban",
        meta: {
          title: "开通城市管理",
        },
        component: () => import("@/views/operate/openingUrban/openingUrban.vue"),
      },
      {
        path: "/operate/opening-businsess",
         name: `operate_opening-businsess`,
        meta: {
          title: "开通业务管理",
        },
        component: () => import("@/views/operate/openingBusinsess/openingBusinsess.vue"),
      },
      {
        path: "/operate/opening-area",
        name: `operate_opening-area`,
        meta: {
          title: "开通区域管理",
        },
        component: () => import("@/views/operate/openingArea/openingArea.vue"),
      },
    ],
  },
];

export default routes;
