import { defineStore } from "pinia";

export const useAppStore = defineStore({
  id: "useAppStore",
  state: () => ({
    projectConfig: {
      isCachh: true,
    },
  }),
  getters: {
    getIsCache(): boolean {
      return this.projectConfig.isCachh;
    },
  },
  actions: {},
});
