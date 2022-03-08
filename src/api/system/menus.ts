import { http } from '@/utils/http';

//获取路由菜单
export function getMenus() {
  return http.request({
    url: '/menus',
    method: 'post',
  });
}