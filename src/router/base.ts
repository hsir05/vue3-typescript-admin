import { PageEnum } from "@/enums/pageEnum";
import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT, ERRORPAGE, REDIRECT_NAME } from "./constant";

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/system/login/login.vue'),
  meta: {
    title: 'Login', 
  },
};

export const ErrorPageRoute: RouteRecordRaw = {
  path: "/:path(.*)*",
  name: "ErrorPage",
  component: PARENTLAYOUT,
  meta: {
    title: "ErrorPage",
    hideBreadcrumb: true,
  },
  children: [
    {
      path: "/:path(.*)*",
      name: "ErrorPage",
      component: ERRORPAGE,
      meta: {
        title: "ErrorPage",
        hideBreadcrumb: true,
      },
    },
  ],
};
 
export const RedirectRoute: RouteRecordRaw = {
  path: "/redirect",
  name: REDIRECT_NAME,
  component: PARENTLAYOUT,
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
  },
  children: [ 
    {
      path: "/redirect/:path(.*)",
      name: REDIRECT_NAME,
      component: () => import("@/views/redirect/redirect.vue"),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};