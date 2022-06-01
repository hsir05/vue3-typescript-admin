import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { ColorFilterOutline } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/marketing",
    name: "marketing",
    redirect: "/marketing/ad",
    component: PARENTLAYOUT,
    meta: {
      title: "营销管理",
      icon: renderIcon(ColorFilterOutline),
      sort: 1,
    },
    children: [
      {
        path: "/marketing/ad",
         name: `marketing_ad`,
        meta: {
          title: "广告配置",
        },
        component: () => import("@/views/marketing/ad/ad.vue"),
      },
       {
        path: "/marketing/vouchers",
         name: `marketing_vouchers`,
        meta: {
          title: "代金券配置",
        },
        component: () => import("@/views/marketing/vouchers/vouchers.vue"),
      },
      {
        path: "/marketing/vouchers-rule",
         name: `marketing_vouchers-rule`,
        meta: {
          title: "代金券消费规则配置",
        },
        component: () => import("@/views/marketing/vouchersRule/vouchersRule.vue"),
      },
      {
        path: "/marketing/recharge-activity",
         name: `marketing_recharge-activity`,
        meta: {
          title: "钱包充值活动管理",
        },
        component: () => import("@/views/marketing/rechargeActivity/rechargeActivity.vue"),
      },
       {
        path: "/marketing/payment-channel",
         name: `marketing_payment-channel`,
        meta: {
          title: "订单支付渠道管理",
        },
        component: () => import("@/views/marketing/paymentChannel/paymentChannel.vue"),
      },
      {
        path: "/marketing/advance-charge",
         name: `marketing_advance-charge`,
        meta: {
          title: "订单预支付渠道管理",
        },
        component: () => import("@/views/marketing/advanceCharge/advanceCharge.vue"),
      },
      {
        path: "/marketing/exchange-code",
         name: `marketing_exchange-code`,
        meta: {
          title: "兑换码管理",
        },
        component: () => import("@/views/marketing/exchangeCode/exchangeCode.vue"),
      }
    ],
  },
];

export default routes;
