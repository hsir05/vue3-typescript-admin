import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { AreaChartOutlined as AreaChartIcon } from "@vicons/antd";



import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/operation-statistics",
    name: "operationStatistics",
    redirect: "/operation-statistics/city-statistics",
    component: PARENTLAYOUT,
    meta: {
      title: "运营统计分析",
      icon: renderIcon(AreaChartIcon),
      sort: 1,
    },
    children: [
      {
        path: "/operation-statistics/city-statistics",
        name: `operation-statistics_city-statistics`,
        meta: {
          title: "城市单量统计",
        },
        component: () => import("@/views/operationStatistics/cityStatistics/cityStatistics.vue"),
      },
      {
        path: "/operation-statistics/enterprise-statistics",
        name: `driver-finance_enterprise-statistics`,
        meta: {
          title: "运营企业单量统计",
        },
        component: () => import("@/views/operationStatistics/enterpriseStatistics/enterpriseStatistics.vue"),
      },
      {
        path: "/operation-statistics/driver-statistics",
        name: `driver-finance_driver-statistics`,
        meta: {
          title: "司机单量统计",
        },
        component: () => import("@/views/operationStatistics/driverStatistics/driverStatistics.vue"),
      },

    ],
  },
];

export default routes;