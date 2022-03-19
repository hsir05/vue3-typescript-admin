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
        component: () => import("@/views/operate/openingBusiness/openingBusiness.vue"),
      },
      {
        path: "/operate/opening-area",
        name: `operate_opening-area`,
        meta: {
          title: "开通区域管理",
        },
        component: () => import("@/views/operate/openingArea/openingArea.vue"),
      },
      {
        path: "/operate/virtual-vehicle",
        name: `operate_virtual-vehicle`,
        meta: {
          title: "虚拟车头管理",
        },
        component: () => import("@/views/operate/virtualVehicle/virtualVehicle.vue"),
      },
      {
        path: "/operate/order-reserve-time",
        name: `operate_order-reserve-time`,
        meta: {
          title: "接单预留时间管理",
        },
        component: () => import("@/views/operate/orderReserveTime/orderReserveTime.vue"),
      },
      {
        path: "/operate/emergency-contac",
        name: `operate_emergency-contac`,
        meta: {
          title: "平台紧急联系人管理",
        },
        component: () => import("@/views/operate/emergencyContac/emergencyContac.vue"),
      },
    ],
  },
];

export default routes;
