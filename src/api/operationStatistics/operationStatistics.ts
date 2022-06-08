import { http } from '@/utils/http';


//获取城市单量
interface CityOderInter {
    cityCode: string
    beginDate: string
    endDate: string
}
export function getCityOrder(data: CityOderInter) {
  return http.request({
    url: '/operationAnalysis/getCityOrderStatistics',
    method: 'post',
    data
  });
}
//获取司机单量
interface DriverOderInter {
    operationCompanyId: string
    beginDate: string
    endDate: string
}
export function getDriverOrder(data: DriverOderInter) {
  return http.request({
    url: '/operationAnalysis/getDriverOrderStatistics',
    method: 'post',
    data
  });
}
// ---------------司机在线时长---------------------
//获取班组列表
export function getDriverClazzs(data: {operationCompanyId: string}) {
  return http.request({
    url: '/driverOnlineTime/getDriverClazzs',
    method: 'post',
    data
  });
}
//按日统计司机在线时长（分钟
interface OnlineInfoInter{
  operationCompanyId: string | null
  day: string | null
  checkType: string | null
  driverClazzId: string | null
  driverId: string | null
}
export function findDriverDayOnlineTimeInfo(data: OnlineInfoInter) {
  return http.request({
    url: '/driverOnlineTime/findDriverDayOnlineTimeInfo',
    method: 'post',
    data
  });
}

//按月统计司机在线时长（分钟
interface OnlineInfoMonthInter{
  operationCompanyId: string | null
  month: string | null
  checkType: string | null
  driverClazzId: string | null
  driverId: string | null
}
export function findDriverMonthOnlineTimeInfo(data: OnlineInfoMonthInter) {
  return http.request({
    url: '/driverOnlineTime/findDriverMonthOnlineTimeInfo',
    method: 'post',
    data
  });
}
//按日统计司机在线时长（分钟
interface RecordInter{
    operationCompanyId: string | null
    day: string | null
    driverId: string | null
}
export function getDriverWorkRestRecord(data: RecordInter) {
  return http.request({
    url: '/driverOnlineTime/getDriverWorkRestRecord',
    method: 'post',
    data
  });
}
//-------------------------获取司机满意度------------------------
//获取司机满意度
interface SatisfactionInter {
    operationCompanyId: string
    beginDate: string
    endDate: string
}
export function getSatisfaction(data: SatisfactionInter) {
  return http.request({
    url: '/operationAnalysis/getDriverServiceSatisfiedStatistics',
    method: 'post',
    data
  });
}
// ---------------个人用户统计---------------------
//个人用户统计
interface MonthInter {
    month: string | null
}
export function getCustomer(data: MonthInter) {
  return http.request({
    url: '/operationAnalysis/customerStatisticsMonth',
    method: 'post',
    data
  });
}

// ---------------订单当日时间区间分布---------------------
//订单当日时间区间分布
interface DistributedInter {
    cityCode: string | null
    date: string | null
}
export function getOrderTimeIntervalDistributed(data: DistributedInter) {
  return http.request({
    url: '/operationAnalysis/getOrderTimeIntervalDistributed',
    method: 'post',
    data
  });
}

// ---------------城市订单热力图---------------------
//城市订单热力图
interface LocationsInter {
    cityCode: string | null
    beginDate: string | null
    endDate: string | null
}
export function findOrderLocations(data: LocationsInter) {
  return http.request({
    url: '/operationAnalysis/findOrderLocations',
    method: 'post',
    data
  });
}

// ---------------企业单量统计---------------------
//企业单量统计
interface CompanyOrderInter {
    operationCompanyId: string | null
    beginDate: string | null
    endDate: string | null
}
export function getCompanyOrder(data: CompanyOrderInter) {
  return http.request({
    url: '/operationAnalysis/getCompanyOrderStatistics',
    method: 'post',
    data
  });
}
