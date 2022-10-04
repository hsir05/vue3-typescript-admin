import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { OptionsSharp } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/plugin",
    name: "plugin",
    redirect: "/plugin/copy",
    component: PARENTLAYOUT,
    meta: {
      title: "插件示例",
      icon: renderIcon(OptionsSharp),
      sort: 1,
    },
    children: [
      {
        path: "/plugin/copy",
         name: `plugin_copy`,
        meta: {
          title: "剪切板",
        },
        component: () => import("@/views/plugin/copy/copy.vue"),
      }
    ],
  },
];

export default routes;
