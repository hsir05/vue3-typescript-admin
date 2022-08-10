import { RouteRecordRaw } from 'vue-router';
import { PARENTLAYOUT } from '@/router/constant';
import { HomeOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: PARENTLAYOUT, 
    meta: {
      title: '主页',
      icon: renderIcon(HomeOutline),
    },
    children: [
      {
        path: '/dashboard',
        name: `dashboard`,
        meta: {
          title: '主页',
        },
        component: () => import('@/views/dashboard/dashboard.vue'),
      },
    ],
  },
];

export default routes;
