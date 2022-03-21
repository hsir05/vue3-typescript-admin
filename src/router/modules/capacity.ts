import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { CafeOutline as CafeIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/capacity",
    name: "capacity",
    redirect: "/capacity/operateing-company",
    component: PARENTLAYOUT,
    meta: {
      title: "运力管理",
      icon: renderIcon(CafeIcon),
      sort: 1,
    },
    children: [
           {
        path: "/capacity/operateing-company",
         name: `capacity_operateing-company`,
        meta: {
          title: "运营企业管理",
        },
        component: () => import("@/views/capacity/operateingCompany/operateingCompany.vue"),
      },
    ],
  },
];

export default routes;
