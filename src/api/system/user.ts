import { http } from '@/utils/http';
import { getUsersDataState } from "../type"


//获取路由菜单
export function getUsers(data: getUsersDataState) {
  return http.request({
    url: '/users',
    method: 'post',
    data: {
        ...data
    }
  });
}