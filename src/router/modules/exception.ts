import { RouteRecordRaw } from 'vue-router';
import { PARENTLAYOUT } from "@/router/constant";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/exception",
    name: "exception",
    redirect: "/exception/403",
    component: PARENTLAYOUT,
    meta: {
      title: "异常页面",
      icon: "file -exception",
      sort: 3,
    },
    children: [
      {
        path: "/exception/403",
        name: "403",
        meta: {
          sort: 1,
          keepAlive: true,
          title: "403",
        },
        component: () => import("@/views/exception/403.vue"),
      },
      {
        path: "/exception/404",
        name: "404",
        meta: {
          sort: 2,
          keepAlive: true,
          title: "404",
        },
        component: () => import("@/views/exception/404.vue"),
      },
      {
        path: "/exception/500",
        name: "500",
        meta: {
          sort: 3,
          keepAlive: true,
          title: "500",
        },
        component: () => import("@/views/exception/500.vue"),
      },
    ],
  },
];

export default routes;
