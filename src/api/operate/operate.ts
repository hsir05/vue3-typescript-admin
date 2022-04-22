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
export function openCitySave() {
  return http.request({
    url: '/openCity/save',
    method: 'post',
  });
}
/**
 * 删除开通城市 
*/
export function removeOpenCity() {
  return http.request({
    url: '/openCity/delete',
    method: 'post',
  });
}

/**
 * 查询所有开通城市 
*/
export function getAllOpenCity() {
  return http.request({
    url: '/openCity/openCityList',
    method: 'post',
  });
}
/**
 * 保存开通城市的中心点坐标 
*/
export function saveCenterPoint() {
  return http.request({
    url: '/openCity/saveCenterPoint',
    method: 'post',
  });
}
/**
 * 校验开通城市是否重复 
*/
export function uniqueCityName() {
  return http.request({
    url: '/openCity/uniqueCityName',
    method: 'post',
  });
}
/**
 * 校验开通城市是否重复 
*/
// export function uniqueCityName() {
//   return http.request({
//     url: '/openCity/uniqueCityName',
//     method: 'post',
//   });
// }