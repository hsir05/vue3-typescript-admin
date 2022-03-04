import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { OptionsSharp } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/system",
    name: "system",
    redirect: "/system/dict",
    component: PARENTLAYOUT,
    meta: {
      title: "系统管理",
      icon: renderIcon(OptionsSharp),
      sort: 1,
    },
    children: [
      {
        path: "/system/dict",
        name: "system_dict",
        meta: {
          title: "字典管理",
        },
        component: () => import("@/views/system/dict/dict.vue"),
      },
      {
        path: "/system/menu",
        name: "system_menu",
        meta: {
          title: "菜单管理",
        },
        component: () => import("@/views/system/menu/menu.vue"),
      },
    ],
  },
];

export default routes;
