import type { Router } from "vue-router";
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; //样式必须引入
import { PageEnum } from '@/enums/pageEnum';
import { ACCESS_TOKEN_KEY } from "@/config/config";
// import { ErrorPageRoute } from '@/router/base';
import { locStorage } from "@/utils/storage";

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const whitePathList = [LOGIN_PATH]; // no redirect whitelist

export function createRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    if (from.path === LOGIN_PATH && to.name === 'errorPage') {
      next(PageEnum.BASE_HOME);
      return;
    }

    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }

    // const token = locStorage.get(ACCESS_TOKEN_KEY);
    // if (!token){
    //     const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
    //         path: LOGIN_PATH,
    //         replace: true,
    //     };
    //     if (to.path) {
    //         redirectData.query = {
    //         ...redirectData.query,
    //         redirect: to.path,
    //         };
    //     }
    //     next(redirectData);
    //     return;
    // }
      next();
  });

  router.afterEach((to) => {
    NProgress.done();
    document.title = (to?.meta?.title as string) || document.title;

  });

  router.onError((error) => {
    console.log(error, "路由错误");
  });
}
