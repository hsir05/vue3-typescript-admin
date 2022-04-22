import { http } from '@/utils/http';

/**---------实时运营监测------*/
/**
 * 根据查询条件获取图表数据
*/
export function getChartsData(data: {operationCompanyId: String | null, orderBusinessType: String }) {
  return http.request({
    url: '/realtimeOperationDetection/getChartsData',
    method: 'post',
    data
  });
}

/**
 * 根据企业id获取订单业务类型
*/
export function getOrderBusinessType(data: {operationCompanyId: string | null }) {
  return http.request({
    url: '/realtimeOperationDetection/getOrderBusinessTypeList',
    method: 'post',
    data
  });
}

/**
 * 根据企业ID获取正在上班的司机列表
*/
export function getWorkingDriverList(data: {operationCompanyId: string | null }) {
  return http.request({
    url: '/driverRealtime/getWorkingDriverList',
    method: 'post',
    data
  });
}

/**
 * 根据司机ID获取该司机的详细信息
*/
export function getDriverDetail(data: {driverId: string }) {
  return http.request({
    url: '/driverRealtime/simpleJsonDetail',
    method: 'post',
    data
  });
}

/**
 * 查询司机实时位置
*/
export function driverPosition(data: {operationCompanyId: string | null, driverId: string, vehicleType: string }) {
  return http.request({
    url: '/driverRealtime/refreshDrvierPosition',
    method: 'post',
    data
  });
}