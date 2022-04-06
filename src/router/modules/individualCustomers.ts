import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { CafeOutline as CafeIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/individual-customers",
    name: "individual-customer",
    redirect: "/individual-customers/membership-type",
    component: PARENTLAYOUT,
    meta: {
      title: "个人客户关系管理",
      icon: renderIcon(CafeIcon),
      sort: 1,
    },
    children: [
      {
        path: "/individual-customers/membership-type",
        name: `individual-customers_membership-type`,
        meta: {
          title: "个人客户会员类型管理",
        },
        component: () => import("@/views/individualCustomers/membershipType/membershipType.vue"),
      },
      {
        path: "/individual-customers/customer",
        name: `individual-customers_customer`,
        meta: {
          title: "个人客户管理",
        },
        component: () => import("@/views/individualCustomers/customer/customer.vue"),
      },
      {
        path: "/individual-customers/cancel-customer",
        name: `individual-customers_cancel-customer`,
        meta: {
          title: "已注销个人客户",
        },
        component: () => import("@/views/individualCustomers/cancelCustomer/cancelCustomer.vue"),
      },
      {
        path: "/individual-customers/wallet",
        name: `individual-customers_wallet`,
        meta: {
          title: "个人客户钱包管理",
        },
        component: () => import("@/views/individualCustomers/wallet/wallet.vue"),
      },
      {
        path: "/individual-customers/transaction-list",
        name: `individual-customers_transaction-list`,
        meta: {
          title: "个人客户钱包交易总览",
        },
        component: () => import("@/views/individualCustomers/transactionList/transactionList.vue"),
      },
      {
        path: "/individual-customers/invoice-list",
        name: `individual-customers_invoice-list`,
        meta: {
          title: "个人客户发票申请管理",
        },
        component: () =>
          import("@/views/individualCustomers/invoiceApplicationList/invoiceApplicationList.vue"),
      },
      {
        path: "/individual-customers/wallet-refund-application",
        name: `individual-customers_wallet-refund-application`,
        meta: {
          title: "钱包退款申请管理",
        },
        component: () =>
          import("@/views/individualCustomers/walletRefundApplication/walletRefundApplication.vue"),
      },
    ],
  },
];

export default routes;
