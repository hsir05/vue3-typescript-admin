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
      //   component: () => import("@/views/system/dict/dict.vue"),
      // },
      // {
      //   path: "/system/menus",
      //   name: "system_menu",
      //   meta: {
      //     title: "菜单管理",
      //   },
      //   component: () => import("@/views/system/menu/menu.vue"),
      // },
      {
        path: "/system/user",
         name: `system_user`,
        meta: {
          title: "用户管理",
        },
        component: () => import("@/views/system/user/user.vue"),
      },
      {
        path: "/system/role",
        name: `system_role`,
        meta: {
          title: "角色管理",
        },
        component: () => import("@/views/system/role/role.vue"),
      },
    ],
  },
];

export default routes;
