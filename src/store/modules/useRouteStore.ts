import { defineStore } from "pinia";
import { RouteRecordRaw } from 'vue-router';
import { constantRouter } from '@/router/index';
import { getMenus } from "@/api/system/system"

export interface RouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  keepAliveComponents: string[];
}

export const useAppRouteStore = defineStore({
  id: "app-Route",
  state: ():RouteState => ({
      menus: [],
      routers: constantRouter,
      keepAliveComponents: []
  }),
  getters: {
      getMenus() {}
  },
  actions: {
    async generateRoutes(){
        return await getMenus()
    }
  }
})