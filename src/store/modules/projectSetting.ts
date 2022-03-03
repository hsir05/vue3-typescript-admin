import { defineStore } from "pinia";
import { ProjectSettingInter } from "@/interface/projectSetting";
import { projectSetting } from "@/config/projectSetting";
import { merge } from "lodash-es";

interface ProjectState {
    projectSetting:ProjectSettingInter
}

export const useAppProjectStore = defineStore({
  id: "projectSetting",
  state: (): ProjectState => ({
    projectSetting: projectSetting
  }),
  getters: {
    getCollapsed(): boolean {
      return this.projectSetting.collapsed;
    },
    getDarkTheme(): boolean{
        return this.projectSetting.darkTheme
    },
    getAppTheme(): string {
        return this.projectSetting.appTheme
    }
  },
  actions: {
      setProjectSetting(config: Partial<ProjectSettingInter>): void {
          this.projectSetting = merge(this.projectSetting || {}, config);
      }
  },
});
