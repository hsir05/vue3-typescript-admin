import { defineStore } from "pinia";
import type { RouteLocationNormalized } from "vue-router";
import { locStorage } from "@/utils/storage";
import { MULTIPLE_TABS_KEY } from "@/config/constant";
import { PageEnum } from "@/enums/pageEnum";

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string;
  name: string;
};
export interface MultipleTabState {
  cachetabsList: Set<string>;
  tabsList: RouteItem[];
}

const whiteList = ["Redirect", "login"];
 
export const useAppTabsStore = defineStore({
  id: "app-tabs",
  state: (): MultipleTabState => ({
    cachetabsList: new Set(), 
    tabsList: locStorage.get(MULTIPLE_TABS_KEY) || [],
  }),
  getters: {
    getTabsList(): RouteItem[] {
      return this.tabsList;
    },
  },
  actions: { 
    initTabs(routes: RouteItem[]) {
      this.tabsList = routes;
    },
    addTab(route: RouteItem): boolean {
      // 添加标签页
      if (whiteList.includes(route.name)) return false;
      
      const isExists = this.tabsList.some((item) => item.fullPath == route.fullPath);
      if (!isExists) {
        this.tabsList.push(route);
      }
      return true;
    },
    closeCurrentTab(route: RouteItem) {
      return Promise.resolve().then(() => {
        const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
        this.tabsList.splice(index, 1);
      });
    },
    clearCacheTabs() {
      this.cachetabsList = new Set();
    },
    closeOtherTabs(route: RouteItem) {
      if (this.tabsList.length === 2 && route.fullPath !== PageEnum.BASE_HOME) {
        return false;
      }
      this.tabsList = this.tabsList.filter(
        (item) => item.fullPath == route.fullPath || item.fullPath === PageEnum.BASE_HOME
      );
    },
    closeAllTab(route: RouteItem) {
      if (route.fullPath === PageEnum.BASE_HOME) {
        this.tabsList = this.tabsList.filter((item) => item.fullPath === PageEnum.BASE_HOME);
      } else {
        this.tabsList = [];
      } 
      locStorage.set(MULTIPLE_TABS_KEY, this.tabsList);
    },
  },
});
