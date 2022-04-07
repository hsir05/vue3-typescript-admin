import { http } from '@/utils/http';
import { getOderState } from "../type"


//获取路由菜单
export function getOder(data: getOderState) {    
  return http.request({
    url: '/order/getCityOrderStatistics',
    method: 'post',
    data
  });
}