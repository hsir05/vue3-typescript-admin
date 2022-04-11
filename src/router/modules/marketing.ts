import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { ColorFilterOutline } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/marketing",
    name: "marketing",
    redirect: "/marketing/ad",
    component: PARENTLAYOUT,
    meta: {
      title: "营销管理",
      icon: renderIcon(ColorFilterOutline),
      sort: 1,
    },
    children: [
      {
        path: "/marketing/ad",
         name: `marketing_ad`,
        meta: {
          title: "广告配置",
        },
        component: () => import("@/views/marketing/ad/ad.vue"),
      }
    ],
  },
];

export default routes;
