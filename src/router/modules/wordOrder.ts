import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { OptionsSharp } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/work-order",
    name: "workOrder",
    redirect: "/work-order/meituan-order",
    component: PARENTLAYOUT,
    meta: {
      title: "工单管理",
      icon: renderIcon(OptionsSharp),
      sort: 1,
    },
    children: [
      {
        path: "/work-order/meituan-order",
         name: `work-order_meituan-order`,
        meta: {
          title: "美团投诉订单管理",
        },
        component: () => import("@/views/workOrder/meiTuanOrder.vue"),
      },
    ],
  },
];

export default routes;
