import { RouteRecordRaw } from "vue-router";
import { PARENTLAYOUT } from "@/router/constant";
import { OptionsSharp } from "@vicons/ionicons5";
import { renderIcon } from "@/utils/index";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/order",
        name: "order",
        redirect: "/order/list",
        component: PARENTLAYOUT,
        meta: {
            title: "订单管理",
            icon: renderIcon(OptionsSharp),
            sort: 1,
        },
        children: [
            {
                path: "/order/list",
                name: `order_list`,
                meta: {
                    title: "订单管理",
                },
                component: () => import("@/views/order/order.vue"),
            }
        ],
    },
];

export default routes;
