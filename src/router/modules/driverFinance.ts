import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { CafeOutline as CafeIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/driver-finance",
    name: "driverFinance",
    redirect: "/driver-finance/wallet",
    component: PARENTLAYOUT,
    meta: {
      title: "司机财务管理",
      icon: renderIcon(CafeIcon),
      sort: 1,
    },
    children: [
      {
        path: "/driver-finance/wallet",
        name: `driver-finance_wallet`,
        meta: {
          title: "司机钱包管理",
        },
        component: () => import("@/views/driverFinance/wallet/wallet.vue"),
      },
      {
        path: "/driver-finance/withdrawal-setting",
        name: `driver-finance_withdrawal-setting`,
        meta: {
          title: "司机提现设置",
        },
        component: () => import("@/views/driverFinance/withdrawalSetting/withdrawalSetting.vue"),
      },
      {
        path: "/driver-finance/withdrawal-statistics",
        name: `driver-finance_withdrawal-statistics`,
        meta: {
          title: "司机提现统计",
        },
        component: () => import("@/views/driverFinance/withdrawalStatistics/withdrawalStatistics.vue"),
      },

    ],
  },
];

export default routes;