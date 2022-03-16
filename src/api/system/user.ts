import { http } from '@/utils/http';
import { getUsersDataState } from "../type"


//获取路由菜单
export function getUsers(data: getUsersDataState) {
    console.log(data);
    
  return http.request({
    url: '/users',
    method: 'post',
    data
  });
}

// export function getMenuList(params?) {
//   return http.request({
//     url: '/menu/list',
//     method: 'GET',
//     params,
//   });
// }