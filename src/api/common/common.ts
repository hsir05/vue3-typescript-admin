import { http } from '@/utils/http';


//获取流量方
export function getInfluxList() {    
  return http.request({
    url: '/dictionary/influxList',
    method: 'post',
  });
}


//获取所有运营企业列表
export function getOperationCompany() {    
  return http.request({
    url: '/operationCompany/getAllOperationCompany',
    method: 'post',
  });
}

//获得所有开通城市
export function getOpenCity() {    
  return http.request({
    url: '/openCity/openCityList',
    method: 'post',
  });
}