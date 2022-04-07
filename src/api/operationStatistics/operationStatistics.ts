import { http } from '@/utils/http';
import { getCityOderState, getCompanyOderState } from "../type"


//获取城市单量
export function getCityOder(data: getCityOderState) {    
  return http.request({
    url: '/order/getCityOrderStatistics',
    method: 'post',
    data
  });
}



//获取企业单量
export function getCompanyOder(data: getCompanyOderState) {    
  return http.request({
    url: '/order/getCompanyOrderStatistics',
    method: 'post',
    data
  });
}