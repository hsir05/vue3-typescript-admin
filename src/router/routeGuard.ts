import type { Router } from "vue-router";
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; //样式必须引入

export function createRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    console.log(to, from);
    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });

  router.onError((error) => {
    console.log(error, "路由错误");
  });
}
