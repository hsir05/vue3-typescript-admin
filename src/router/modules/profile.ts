import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { OptionsSharp } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/setting",
    name: "setting",
    redirect: "/setting/profile",
    component: PARENTLAYOUT,
    meta: {
      title: "设置管理",
      icon: renderIcon(OptionsSharp),
      sort: 1,
    },
    children: [
      {
        path: "/setting/profile",
         name: `setting_profile`,
        meta: {
          title: "个人设置",
        },
        component: () => import("@/views/system/profile/profile.vue"),
      }
    ],
  },
];

export default routes;
