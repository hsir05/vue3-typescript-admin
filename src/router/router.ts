import { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { createRouterGuard } from "./routeGuard";
import ParentLayout from "@/layout/parentLayout.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashoard",
    component: ParentLayout,
    children: [
        {
            path: "/welcome",
            name: 'Welcome',
            component: () => import("@/views/dashboard/welcome/Welcome.vue"),
        },
        {
            path: "/workbench",
            name: "Workbench",
            component: () => import("@/views/dashboard/workbench/Workbench.vue"),
        },
    ]
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
}

export default router;
