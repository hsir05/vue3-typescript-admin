import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { CafeOutline as CafeIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "individual-customer",
    redirect: "/individual-customer/member",
    component: PARENTLAYOUT,
    meta: {
      title: "个人客户关系管理",
      icon: renderIcon(CafeIcon),
      sort: 1,
    },
     children: [
      {
        path: "/individual-customer/member",
        name: `individual-customer`,
        meta: {
          title: "个人客户会员类型管理",
        },
        component: () => import("@/views/individualCustomer/member/member.vue"),
      },
      {
        path: "/individual-customer/cancel-customer",
        name: `individual-cancel-customer`,
        meta: {
          title: "已注销个人客户",
        },
        component: () => import("@/views/individualCustomer/cancelCustomer/cancelCustomer.vue"),
      },
    ]
    },
];

export default routes;
