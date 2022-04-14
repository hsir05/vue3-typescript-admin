import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { FundProjectionScreenOutlined } from "@vicons/antd";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/realtime-dynamic",
    name: "realTimeOperateDynamic",
    redirect: "/realtime-dynamic/dict",
    component: PARENTLAYOUT,
    meta: {
      title: "实时运营动态",
      icon: renderIcon(FundProjectionScreenOutlined),
      sort: 1,
    },
    children: [
      {
        path: "/realtime-dynamic/driver-distrib",
         name: `realtime-dynamic_driver-distrib`,
        meta: {
          title: "司机实时分布",
        },
        component: () => import("@/views/realTimeOperateDynamic/driverRealDistribution/driverRealDistribution.vue"),
      },
      {
        path: "/realtime-dynamic/operateRealMonitor",
        name: "realtime-dynamic_operateRealMonitor",
        meta: {
          title: "实时运营监测",
        },
        component: () => import("@/views/realTimeOperateDynamic/operateRealMonitor/operateRealMonitor.vue"),
      },
    ],
  },
];

export default routes;
