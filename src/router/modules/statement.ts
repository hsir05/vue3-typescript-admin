import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { DocumentTextOutline } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/statement",
    name: "statement",
    redirect: "/statement/influx",
    component: PARENTLAYOUT,
    meta: {
      title: "对帐单",
      icon: renderIcon(DocumentTextOutline),
      sort: 1,
    },
    children: [
      {
        path: "/statement/influx",
         name: `statement_influx`,
        meta: {
          title: "流量方对帐单",
        },
        component: () => import("@/views/statement/influx/influx.vue"),
      },
      {
        path: "/statement/operate-company",
         name: `statement_operate-company`,
        meta: {
          title: "运营企业对帐单",
        },
        component: () => import("@/views/statement/operateCompany/operateCompany.vue"),
      },
      {
        path: "/statement/driver",
         name: `statement_driver`,
        meta: {
          title: "司机对帐单",
        },
        component: () => import("@/views/statement/driver/driver.vue"),
      }
    ],
  },
];

export default routes;
