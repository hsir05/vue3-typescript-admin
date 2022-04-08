import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { AreaChartOutlined as AreaChartIcon } from "@vicons/antd";



import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/operation-statistics",
    name: "operationStatistics",
    redirect: "/operation-statistics/city",
    component: PARENTLAYOUT,
    meta: {
      title: "运营统计分析",
      icon: renderIcon(AreaChartIcon),
      sort: 1,
    },
    children: [
      {
        path: "/operation-statistics/city",
        name: `operation-statistics_city-statistics`,
        meta: {
          title: "城市单量统计",
        },
        component: () => import("@/views/operationStatistics/cityStatistics/cityStatistics.vue"),
      },
      {
        path: "/operation-statistics/enterprise",
        name: `driver-finance_enterprise-statistics`,
        meta: {
          title: "运营企业单量统计",
        },
        component: () => import("@/views/operationStatistics/enterpriseStatistics/enterpriseStatistics.vue"),
      },
      {
        path: "/operation-statistics/driver",
        name: `driver-finance_driver-statistics`,
        meta: {
          title: "司机单量统计",
        },
        component: () => import("@/views/operationStatistics/driverStatistics/driverStatistics.vue"),
      },
      {
        path: "/operation-statistics/driver-online-time",
        name: `driver-finance_driver-statistics`,
        meta: {
          title: "司机在线时长统计",
        },
        component: () => import("@/views/operationStatistics/diriverOnlineTimeStatistics/diriverOnlineTimeStatistics.vue"),
      },
    ],
  },
];

export default routes;