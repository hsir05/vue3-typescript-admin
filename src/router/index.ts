import { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { createRouterGuard } from "./routeGuard";
import { RootRoute, LoginRoute, RedirectRoute, ErrorPageRoute } from "@/router/base";

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

// any 需要优化
function sortRoute(a:any, b:any) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0);
}

routeModuleList.sort(sortRoute);


//无需验证权限
export const constantRouter: RouteRecordRaw[] = [ RootRoute, LoginRoute, RedirectRoute, ErrorPageRoute];

const router = createRouter({
  history: createWebHistory(),
  routes: [...routeModuleList, ...constantRouter],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
}

export default router;
