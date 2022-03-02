import { defineStore } from "pinia";
import { ProjectSettingInter } from "@/interface/projectSetting";
import { projectSetting } from "@/config/projectSetting";
import { merge } from "lodash-es";

interface AppState {
    projectSetting:ProjectSettingInter
}

export const useAppProjectStore = defineStore({
  id: "useAppStore",
  state: (): AppState => ({
    projectSetting: projectSetting
  }),
  getters: {
    getCollapsed(): boolean {
      return this.projectSetting.collapsed;
    },
  },
  actions: {
      setProjectSetting(config: Partial<ProjectSettingInter>): void {
          this.projectSetting = merge(this.projectSetting || {}, config);
      }
  },
});
