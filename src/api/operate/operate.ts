import { http } from '@/utils/http';


/**
 * 车辆类型管理
*/
export function getVehicleType() {
  return http.request({
    url: '/vehicleType/vehicleTypeList',
    method: 'post',
  });
}
/**
 * 查询车辆类型详情 
*/
export function getVehicleTypeDetail() {
  return http.request({
    url: '/vehicleType/vehicleType',
    method: 'post',
  });
}

/**
 * 车辆类型保存 
 * 
 * vehicleTypeId 车辆类型id
vehicleTypeDesc 车辆类型描述
vehicleTypeImageId 车辆类型图片（附件表id）
vehicleTypeFreeIconId 车辆类型忙碌图标（附件表id）
vehicleTypeLock 车型锁定(0:否1:是)
*/
interface vehicleTypeState {
    vehicleTypeId: string
    vehicleTypeDesc: string
    vehicleTypeImageId: string
    vehicleTypeFreeIconId: string
    vehicleTypeBusyIconId: string 
    vehicleTypeLock: number
}
export function vehicleTypeSave(data: vehicleTypeState) {
  return http.request({
    url: '/vehicleType/save',
    method: 'post',
    data
  });
}

/*---------开通城市---------------*/
/**
 * 保存开通城市 
*/
export function openCitySave(data: { cityName: string; cityCode: string; lng: number; lat: number}) {
  return http.request({
    url: '/openCity/save',
    method: 'post',
    data: data
  });
}
/**
 * 删除开通城市 
*/
export function removeOpenCity(data: {cityCode: string}) {
  return http.request({
    url: '/openCity/delete',
    method: 'post',
    data: data
  });
}

/**
 * 保存开通城市的中心点坐标 
*/
export function saveCenterPoint(data: {lng: number, lat: number}) {
  return http.request({
    url: '/openCity/saveCenterPoint',
    method: 'post',
    data
  });
}
/**
 * 校验开通城市是否重复 
*/
export function uniqueCityName(data: {cityCode: string}) {
  return http.request({
    url: '/openCity/uniqueCityCode',
    method: 'post',
    data
  });
}


/*****开通业务管理---------------------****/

/**
 * 获取开通区域 
*/
export function getCityOpenArea(data: {cityCode: string | null}) {
  return http.request({
    url: '/openArea/openAreaListByCityCode',
    method: 'post',
    data
  });
}

/**
 * 开通区域编码查找该开通区域的开通业务列表 
*/
export function getOpenAreaBuss(data: {areaCode: string}) {
  return http.request({
    url: '/openBusiness/getOpenBusinessListByAreaCode',
    method: 'post',
    data
  });
}
/**
 * 开通区域编码查找该开通区域的开通业务列表 
*/
interface saveOpenAreaState {
    openBusinessId: string | null	
    areaCode: string | null	
    orderType: string | null	
    vehicleTypeId: string | null	
    chargeRuleBaseId: string | null	
    chargeRuleMileageId: string | null	
    chargeRuleDurationId: string | null	
    chargeRuleCancelId: string | null	
    chargeRuleWaitId: string | null	
    chargeRuleFloatHolidayId: string | null	
    chargeRuleFloatWorkdayId: string | null
}
export function saveBusiness(data: saveOpenAreaState) {
  return http.request({
    url: '/openBusiness/save',
    method: 'post',
    data
  });
}
/**
 * 开通区域编码查找该开通区域的开通业务列表 
*/
export function delBusiness(data: {openBusinessId: string | null}) {
  return http.request({
    url: '/openBusiness/delete',
    method: 'post',
    data
  });
}

/**
 * 根据城市编码获取接单预留时间设置集合 
*/
export function setTime(data: {cityCode: string | null}) {
  return http.request({
    url: '/acceptOrderReserveTimeSetting/getAcceptOrderReserveTimeSettingByCityCode',
    method: 'post',
    data
  });
}
/**
 * 保存接单预留时间设置 
*/
interface saveTiemState {
    acceptOrderReserveTimeSettingId: string | null
    orderType: string | null
    orderBusinessType: string | null
    reserveTime: string | null
    cityCode: string | null
}
export function saveTime(data: saveTiemState) {
  return http.request({
    url: '/acceptOrderReserveTimeSetting/save',
    method: 'post',
    data
  });
}
/**
 * 删除接单预留时间设置 
*/
export function removeTime(data: {acceptOrderReserveTimeSettingId: string | null}) {
  return http.request({
    url: '/acceptOrderReserveTimeSetting/delete',
    method: 'post',
    data
  });
}