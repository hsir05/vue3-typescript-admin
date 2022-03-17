import { defineStore } from "pinia";
import { ProjectSettingState } from "@/interface/projectSetting";
import { projectSetting } from "@/config/setting";
import { merge } from "lodash-es";
import { PROJECT_CONFIG_KEY } from "@/config/constant";
import { locStorage } from "@/utils/storage";

const { 
    collapsed, navStyle,
    darkTheme, appTheme, isTabs,
    isBreadcrumb, isPageAnimate, 
    pageAnimateType, isRefresh, navMode, showFooter 
} = locStorage.get(PROJECT_CONFIG_KEY) || projectSetting;

export const useAppProjectStore = defineStore({
  id: "app-project-setting",
  state: (): ProjectSettingState => ({
    collapsed,
    appTheme,
    darkTheme,
    isTabs,
    isPageAnimate,
    pageAnimateType,
    isBreadcrumb,
    isRefresh,
    navMode,
    navStyle,
    showFooter
  }),
  getters: {
    getCollapsed(): boolean {
      return this.collapsed;
    },
    getDarkTheme(): boolean {
      return this.darkTheme;
    },
    getAppTheme(): string {
      return this.appTheme;
    },
  },
  actions: {
    setProjectSetting(config: Partial<ProjectSettingState>): void {
      this.$state = merge(this.$state || {}, config);
      locStorage.set(PROJECT_CONFIG_KEY, this.$state)
    },
  },
}); 
