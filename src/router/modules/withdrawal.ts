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
        path: "/driver-finance/withdrawal",
        name: `driver-finance_withdrawal`,
        meta: {
          title: "司机提现管理",
        },
        component: () => import("@/views/driverFinance/withdrawal/withdrawal.vue"),
      },

    ],
  },
];

export default routes;