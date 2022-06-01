import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { PeopleOutline as PeopleIcon } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/group-customers",
    name: "group-customer",
    redirect: "/group-customers/membership-type",
    component: PARENTLAYOUT,
    meta: {
      title: "集团客户关系管理",
      icon: renderIcon(PeopleIcon),
      sort: 1,
    },
    children: [
      {
        path: "/group-customers/membership-type",
        name: `group-customers_membership-type`,
        meta: {
          title: "集团客户会员类型管理",
        },
        component: () => import("@/views/groupCustomers/membershipType/membershipType.vue"),
      },
       { 
        path: "/group-customers/customer",
        name: `group-customers_customer`,
        meta: {
          title: "集团客户管理",
        },
        component: () => import("@/views/groupCustomers/customer/customer.vue"),
      },
       {
        path: "/group-customers/wallet",
        name: `group-customers_wallet`,
        meta: {
          title: "集团客户钱包管理",
        },
        component: () => import("@/views/groupCustomers/wallet/wallet.vue"),
      },
      {
        path: "/group-customers/transaction-list",
        name: `group-customers_transaction-list`,
        meta: {
          title: "集团客户钱包交易总览",
        },
        component: () => import("@/views/groupCustomers/transactionList/transactionList.vue"),
      },
       {
        path: "/group-customers/invoice-list",
        name: `group-customers_invoice-list`,
        meta: {
          title: "集团客户发票申请管理",
        },
        component: () =>
          import("@/views/groupCustomers/invoiceApplicationList/invoiceApplicationList.vue"),
      },
    ],
  },
];

export default routes;