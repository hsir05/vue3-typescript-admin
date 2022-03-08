import { defineStore } from "pinia";

export const useAppUserStore = defineStore({
  id: "app-user",
  state: () => ({
    token: "",
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
  },
  actions: {},
});
