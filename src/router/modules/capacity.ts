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
        path: "/capacity/undertake-business",
        name: `capacity_undertake-business`,
        meta: {
          title: "企业承接业务设置",
        },
        component: () => import("@/views/capacity/undertakeBusiness/undertakeBusiness.vue"),
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
        path: "/capacity/ente-eme-contact",
        name: `capacity_ente-eme-contact`,
        meta: {
          title: "企业紧急联系人",
        },
        component: () => import("@/views/capacity/enteEmeContact/enteEmeContact.vue"),
      },
      {
        path: "/capacity/dispatcher",
        name: `capacity_dispatcher`,
        meta: {
          title: "企业值班调度人",
        },
        component: () => import("@/views/capacity/dispatcher/dispatcher.vue"),
      },

       {
        path: "/capacity/registration-review",
        name: `capacity_registration-review`,
        meta: {
          title: "司机注册审核",
        },
        component: () => import("@/views/capacity/registrationReview/registrationReview.vue"),
      },

       {
        path: "/capacity/order-limit",
        name: `capacity_order-limit`,
        meta: {
          title: "实时单量上限",
        },
        component: () => import("@/views/capacity/orderLimit/orderLimit.vue"),
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
