import { defineStore } from "pinia";
import { ProjectSettingInter } from "@/interface/projectSetting";
import { projectSetting } from "@/config/projectSetting";
import { merge } from "lodash-es";

const { collapsed, darkTheme, appTheme, isBreadcrumb, isPageAnimate, pageAnimateType } =
  projectSetting;

export const useAppProjectStore = defineStore({
  id: "projectSetting",
  state: (): ProjectSettingInter => ({
    collapsed,
    appTheme,
    darkTheme,
    isPageAnimate,
    pageAnimateType,
    isBreadcrumb,
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
    setProjectSetting(config: Partial<ProjectSettingInter>): void {
      this.$state = merge(this.$state || {}, config);
    },
  },
});
