import { App } from "vue";
import { createRouter, createWebHashHistory, RouteRecordRaw, } from "vue-router";
import { createRouterGuard } from "./routeGuard";
import { LoginRoute, RedirectRoute, ErrorPageRoute } from "@/router/base";

const modules = import.meta.glob('./modules/**/*.ts', { eager: true }) ;

export const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach(key => {
    /* @ts-ignore */
    const item = modules[key].default;
    if (item) {
        routeModuleList.push(...item);
    } else {
        window.console.error(`路由模块解析出错: key = ${key}`);
    }
});


// any 需要优化
function sortRoute(a:any, b:any) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0);
}

routeModuleList.sort(sortRoute);


//无需验证权限
// export const constantRouter: RouteRecordRaw[] = [ RootRoute, LoginRoute, RedirectRoute, ErrorPageRoute];
export const constantRouter: RouteRecordRaw[] = [  LoginRoute, RedirectRoute, ErrorPageRoute];

const router = createRouter({
  history: createWebHashHistory(''),
  routes: [...routeModuleList, ...constantRouter],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
}

export default router;
