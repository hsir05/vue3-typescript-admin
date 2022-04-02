import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { CafeOutline as CafeIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/capacity",
    name: "capacity",
    redirect: "/capacity/operateing-company",
    component: PARENTLAYOUT,
    meta: {
      title: "运力管理",
      icon: renderIcon(CafeIcon),
      sort: 1,
    },
    children: [
      {
        path: "/capacity/operateing-company",
        name: `capacity_operateing-company`,
        meta: {
          title: "运营企业管理",
        },
        component: () => import("@/views/capacity/operateingCompany/operateingCompany.vue"),
      },
      {
        path: "/capacity/agent",
        name: `capacity_agent`,
        meta: {
          title: "代理商管理",
        },
        component: () => import("@/views/capacity/agent/agent.vue"),
      },
      {
        path: "/capacity/order-commissions",
        name: `capacity_order-commissions`,
        meta: {
          title: "订单抽成比率",
        },
        component: () => import("@/views/capacity/orderCommissions/orderCommissions.vue"),
      },
       {
        path: "/capacity/vehicles",
        name: `capacity_vehicles`,
        meta: {
          title: "车辆管理",
        },
        component: () => import("@/views/capacity/vehicles/vehicles.vue"),
      },
      {
        path: "/capacity/drivers",
        name: `capacity_drivers`,
        meta: {
          title: "司机管理",
        },
        component: () => import("@/views/capacity/drivers/drivers.vue"),
      },
       {
        path: "/capacity/vehicle-allocation",
        name: `capacity_vehicle-allocation`,
        meta: {
          title: "车辆分配",
        },
        component: () => import("@/views/capacity/vehicleAllocation/vehicleAllocation.vue"),
      },
       {
        path: "/capacity/team",
        name: `capacity_team`,
        meta: {
          title: "班级管理",
        },
        component: () => import("@/views/capacity/team/team.vue"),
      },
      {
        path: "/capacity/driver-member",
        name: `capacity_driver-member`,
        meta: {
          title: "司机会员产品管理",
        },
        component: () => import("@/views/capacity/driverMember/driverMember.vue"),
      },
    ],
  },
];

export default routes;
