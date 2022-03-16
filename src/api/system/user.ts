import { http } from '@/utils/http';

//获取路由菜单
export function getUsers() {
  return http.request({
    url: '/users',
    method: 'post',
  });
}