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

//获取司机在线时长
//获取添加班组列表
export function getClass(data: getCompanyOderState) {    
  return http.request({
    url: '/driverClass/getDriverClazzs',
    method: 'post',
    data
  });
}
//获取司机作息
export function getDriverWorkRestRecord(data: getCompanyOderState) {    
  return http.request({
    url: '/driverWorkRestRecord/getDriverWorkRestRecord',
    method: 'post',
    data
  });
}
//按日统计司机在线时长
export function getDriverDayTime(data: getCompanyOderState) {    
  return http.request({
    url: '/driverOnlineTime/findDriverDayOnlineTimeInfo',
    method: 'post',
    data
  });
}
//按月统计司机在线时长
export function getDriverMonthTime(data: getCompanyOderState) {    
  return http.request({
    url: '/driverOnlineTime/findDriverMonthOnlineTimeInfo',
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

//获取司机满意度
export function getSatisfaction(data: getCompanyOderState) {    
  return http.request({
    url: '/driverServiceSatisfiedStatistics/getDriverServiceSatisfiedStatistics',
    method: 'post',
    data
  });
}