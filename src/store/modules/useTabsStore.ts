import { defineStore } from "pinia";
import type { RouteLocationNormalized } from "vue-router";
import { locStorage } from "@/utils/storage";
import { MULTIPLE_TABS_KEY } from "@/config/config";
import { PageEnum } from "@/enums/pageEnum";

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string;
  name: string;
};
export interface MultipleTabState {
  cacheTabList: Set<string>;
  tabList: RouteItem[];
}

const whiteList = ["Redirect", "login"];

export const useAppTabsStore = defineStore({
  id: "app-tabs",
  state: (): MultipleTabState => ({
    cacheTabList: new Set(),
    tabList: locStorage.get(MULTIPLE_TABS_KEY) || [],
  }),
  getters: {
    getTabList(): RouteItem[] {
      return this.tabList;
    },
  },
  actions: {
    initTabs(routes: RouteItem[]) {
      this.tabList = routes;
    },
    addTab(route: RouteItem): boolean {
      // 添加标签页
      if (whiteList.includes(route.name)) return false;
      const isExists = this.tabList.some((item) => item.fullPath == route.fullPath);
      if (!isExists) {
        this.tabList.push(route);
      }
      return true;
    },
    closeCurrentTab(route: RouteItem) {
      return Promise.resolve().then(() => {
        const index = this.tabList.findIndex((item) => item.fullPath == route.fullPath);
        this.tabList.splice(index, 1);
      });
    },
    clearCacheTabs() {
      this.cacheTabList = new Set();
    },
    closeOtherTabs(route: RouteItem){},
    closeAllTab(route: RouteItem) {
      if (route.fullPath === PageEnum.BASE_HOME) {
        this.tabList = this.tabList.filter((item) => item.fullPath === PageEnum.BASE_HOME);
      } else {
        this.tabList = [];
      }
      locStorage.set(MULTIPLE_TABS_KEY, this.tabList);
    },
  },
});
