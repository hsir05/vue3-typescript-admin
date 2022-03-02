import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { OptionsSharp } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/dev",
    name: "developer",
    redirect: "/dev/dict",
    component: PARENTLAYOUT,
    meta: {
      title: "开发人员管理",
      icon: renderIcon(OptionsSharp),
      sort: 1,
    },
    children: [
      {
        path: "/dev/dict",
        name: "developer_dict",
        meta: {
          title: "字典管理",
        },
        component: () => import("@/views/developer/dict/dict.vue"),
      },
      {
        path: "/dev/menu",
        name: "developer_menu",
        meta: {
          title: "菜单管理",
        },
        component: () => import("@/views/developer/menu/menu.vue"),
      },
    ],
  },
];

export default routes;
