import {RouteRecordRaw} from "vue-router";
import {PARENTLAYOUT} from "@/router/constant";
import {FileTrayFullOutline} from "@vicons/ionicons5";
import {renderIcon} from "@/utils/index";


//activeMenu: "" 用于没有菜单,有页面的功能
const routes: Array<RouteRecordRaw> = [
  {
    path: "/operate-order",
    name: "operateOrder",
    redirect: "/operate-order/serving",
    component: PARENTLAYOUT,
    meta: {
      title: "运营订单管理",
      icon: renderIcon(FileTrayFullOutline),
      sort: 1,
    },
    children: [
      {
        path: "/operate-order/serving",
        name: `operate-order_serving`,
        meta: {
          title: "服务中订单",
        },
        component: () => import("@/views/operateOrder/servingOrder/servingOrder.vue"),
      },
      {
        path: "/operate-order/finished",
        name: `operate-order_finished`,
        meta: {
          title: "已完成订单",
        },
        component: () => import("@/views/operateOrder/finishedOrder/finishedOrder.vue"),
      },

      {
        path: "/operate-order/channel",
        name: `operate-order_channel`,
        meta: {
          title: "已取消订单",
        },
        component: () => import("@/views/operateOrder/channelOrder/channelOrder.vue"),
      },
      {
        path: "/operate-order/invalid",
        name: `operate-order_invalid`,
        meta: {
          title: "无效订单",
        },
        component: () => import("@/views/operateOrder/invalidOrder/invalidOrder.vue"),
      },
      {
        path: "/operate-order/order-detail",
        name: `operate-order_order-detail`,
        meta: {
          title: "订单详情",
          activeMenu: "",
          activeBreadcrumb:true
        },
        component: () => import("@/views/operateOrder/orderDetail/orderDetail.vue"),
      },
      {
        path: "/operate-order/order-comment",
        name: `operate-order_order-comment`,
        meta: {
          title: "评论订单",
        },
        component: () => import("@/views/operateOrder/orderComment/orderComment.vue"),
      }, {
        path: "/operate-order/change-dispatch",
        name: 'operate-order_change-dispatch',
        meta: {
          title: "订单改派",
          activeMenu: "",
          activeBreadcrumb:true
        },
        component: () => import("@/views/operateOrder/servingOrder/changeDispatch.vue"),
      },
      {
        path: "/operate-order/dispatch",
        name: 'operate-order_dispatch',
        meta: {
          title: "人工派单",
          activeMenu: "",
          activeBreadcrumb:true
        },
        component: () => import("@/views/operateOrder/servingOrder/dispatch.vue"),
      },
    ],
  },
];

export default routes;
