import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { CafeOutline as CafeIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/individual-customer",
    name: "individual-customer",
    redirect: "/individual-customer/membership-type",
    component: PARENTLAYOUT,
    meta: {
      title: "个人客户关系管理",
      icon: renderIcon(CafeIcon),
      sort: 1,
    },
    children: [
      {
        path: "/individual-customer/membership-type",
        name: `individual-customer_membership-type`,
        meta: {
          title: "个人客户会员类型管理",
        },
        component: () => import("@/views/individualCustomer/membershipType/membershipType.vue"),
      },
      {
        path: "/individual-customer/customer",
        name: `individual-customer_customer`,
        meta: {
          title: "个人客户管理",
        },
        component: () => import("@/views/individualCustomer/customer/customer.vue"),
      },
      {
        path: "/individual-customer/cancel-customer",
        name: `individual-customer_cancel-customer`,
        meta: {
          title: "已注销个人客户",
        },
        component: () => import("@/views/individualCustomer/cancelCustomer/cancelCustomer.vue"),
      },
      {
        path: "/individual-customer/wallet",
        name: `individual-customer_wallet`,
        meta: {
          title: "个人客户钱包管理",
        },
        component: () => import("@/views/individualCustomer/wallet/wallet.vue"),
      },
      {
        path: "/individual-customer/transaction-list",
        name: `individual-customer_transaction-list`,
        meta: {
          title: "个人客户钱包交易总览",
        },
        component: () => import("@/views/individualCustomer/transactionList/transactionList.vue"),
      },
      {
        path: "/individual-customer/invoice-list",
        name: `individual-customer_invoice-list`,
        meta: {
          title: "个人客户发票申请管理",
        },
        component: () =>
          import("@/views/individualCustomer/invoiceApplicationList/invoiceApplicationList.vue"),
      },
      {
        path: "/individual-customer/wallet-refund-application",
        name: `individual-customer_wallet-refund-application`,
        meta: {
          title: "钱包退款申请管理",
        },
        component: () =>
          import("@/views/individualCustomer/walletRefundApplication/walletRefundApplication.vue"),
      },
    ],
  },
];

export default routes;
