import { http } from "@/utils/http";

/**
 * 车辆类型管理
 * 获取所有车辆类型传递 空字符串
 */
export function getVehicleType(data: { operationCompanyId: string }) {
  return http.request({
    url: "/vehicleType/list",
    method: "post",
    data: data,
  });
}

/**
 * 查询车辆类型详情
 */
export function getVehicleTypeDetail() {
  return http.request({
    url: "/vehicleType/vehicleType",
    method: "post",
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
  vehicleTypeId: string;
  vehicleTypeDesc: string;
  vehicleTypeImageId: string;
  vehicleTypeFreeIconId: string;
  vehicleTypeBusyIconId: string;
  vehicleTypeLock: number;
}
export function vehicleTypeSave(data: vehicleTypeState) {
  return http.request({
    url: "/vehicleType/save",
    method: "post",
    data,
  });
}

/*---------开通城市---------------*/
/**
 * 保存开通城市
 */
export function openCitySave(data: {
  cityName: string;
  cityCode: string;
  lng: number;
  lat: number;
}) {
  return http.request({
    url: "/openCity/save",
    method: "post",
    data: data,
  });
}
/**
 * 删除开通城市
 */
export function removeOpenCity(data: { cityCode: string }) {
  return http.request({
    url: "/openCity/delete",
    method: "post",
    data: data,
  });
}

/**
 * 保存开通城市的中心点坐标
 */
interface CenterPointInter {
  cityName: string | null;
  cityCode: string | null;
  lng: number | null;
  lat: number | null;
}
export function saveCenterPoint(data: CenterPointInter) {
  return http.request({
    url: "/openCity/saveCenterPoint",
    method: "post",
    data: data,
  });
}
/**
 * 校验开通城市是否重复
 */
export function uniqueCityName(data: { cityCode: string }) {
  console.log(data);

  return http.request({
    url: "/openCity/uniqueCityCode",
    method: "post",
    data: data,
  });
}

/*****开通区域管理---------------------****/
/**
 * 删除开通区域
 */
export function removeArea(data: { areaCode: string | null }) {
  return http.request({
    url: "/openArea/delete",
    method: "post",
    data,
  });
}
/**
 * 根据企业id查询开通区域
 */
export function getCompanyOpenArea(data: { companyId: string }) {
  return http.request({
    url: "/openArea/openAreaListByCompanyId",
    method: "post",
    data,
  });
}
/**
 * 保存开通区域及下属的关键点信息
 */
interface SaveAreaInter {
  areaCode: string | null;
  areaName: string | null;
  cityCode: string | null;
  areaLock?: number | null;
  openAreaPointList: {
    lng: number | null;
    lat: number | null;
  };
}
export function saveOpenArea(data: SaveAreaInter) {
  return http.request({
    url: "/openArea/editOpenArea",
    method: "post",
    data,
  });
}
/**
 * 获取开通区域的关键点
 */
export function getOpenAreaPointList(data: { areaCode: string }) {
  return http.request({
    url: "/openArea/getOpenAreaPointList",
    method: "post",
    data,
  });
}

/**
 * 获取坐标范围内，区域不可选择的点
 */
interface NonEditInter {
  areaCode?: string;
  lngMin: number;
  lngMax: number;
  latMin: number;
  latMax: number;
}
export function getNonEditablePointList(data: NonEditInter) {
  return http.request({
    url: "/openArea/getNonEditablePointList",
    method: "post",
    data,
  });
}
/*****开通机场管理---------------------****/

/**
 * 根据城市code查找机场列表
 */
export function getOpenCityAirportList(data: { cityCode: string | null }) {
  return http.request({
    url: "/openCityAirport/openCityAirportList",
    method: "post",
    data,
  });
}
/**
 * 删除开通机场
 */
export function removeAirport(data: { openCityAirportId: string | null }) {
  return http.request({
    url: "/openCityAirport/delete",
    method: "post",
    data,
  });
}
/**
 * 交换两个开通机场的序列
 */
export function swapOpenSeq(data: {
  firstOpenCityAirportId: string | null;
  secondOpenCityAirportId: string | null;
}) {
  return http.request({
    url: "/openCityAirport/swapOpenSeq",
    method: "post",
    data,
  });
}

/**
 * 保存开通机场
 */
interface AirInter {
  openCityAirportId: string | null;
  cityCode: string | null;
  airportLng: number | null;
  airportLat: number | null;
  airportAddressDetail: string | null;
  openLock: number | null;
  airportName: string | null;
}
export function saveAirport(data: AirInter) {
  return http.request({
    url: "/openCityAirport/save",
    method: "post",
    data,
  });
}
/**
 * 校验机场名称唯一性
 */
export function uniqueOpenCityAirport(data: {
  cityCode: string | null;
  airportName: string | null;
  oldAirportName: string | null;
}) {
  return http.request({
    url: "/openCityAirport/uniqueOpenCityAirport",
    method: "post",
    data,
  });
}
/*****开通业务管理---------------------****/

export function getOpenAreaList() {
  return http.request({
    url: "/openArea/openAreaList",
    method: "post"
  });
}
/**
 * 获取开通区域 
 */
export function getCityOpenArea(data: { cityCode: string | null }) {
  return http.request({
    url: "/openArea/openAreaListByCityCode",
    method: "post",
    data,
  });
}

/**
 * 开通区域编码查找该开通区域的开通业务列表 
 */
export function getOpenAreaBuss(data: { areaCode: string }) {
  return http.request({
    url: "/openBusiness/getOpenBusinessListByAreaCode",
    method: "post",
    data,
  });
}
/**
 * 开通区域编码查找该开通区域的开通业务列表
 */
interface saveOpenAreaState {
  openBusinessId?: string | null;
  areaCode: string | null;
  orderType: string | null;
  vehicleTypeId: string | null;
  chargeRuleBaseId?: string | null;
  chargeRuleMileageId?: string | null;
  chargeRuleDurationId?: string | null;
  chargeRuleCancelId?: string | null;
  chargeRuleWaitId?: string | null;
  chargeRuleFloatHolidayId?: string | null;
  chargeRuleFloatWorkdayId?: string | null;
  // openBusinessId?: string | null
  // areaCode: string | null
  // orderType: string | null
  // vehicleTypeId: string | null
  // chargeRuleBaseId: string | null
  // chargeRuleMileageId: string | null
  // chargeRuleDurationId: string | null
  // chargeRuleCancelId: string | null
  // chargeRuleWaitId: string | null
  // chargeRuleFloatHolidayId: string | null
  // chargeRuleFloatWorkdayId: string | null
}
export function saveBusiness(data: saveOpenAreaState) {
  return http.request({
    url: "/openBusiness/save",
    method: "post",
    data,
  });
}
/**
 * 删除（关闭）开通业务
 */
export function removeBusiness(data: { openBusinessId: string | null }) {
  return http.request({
    url: "/openBusiness/delete",
    method: "post",
    data,
  });
}
//-----------------------接单预留时间管理----------------------------
/**
 * 根据城市编码获取接单预留时间设置集合
 */
export function getAcceptOrderTime(data: { cityCode: string | null }) {
  return http.request({
    url: "/acceptOrderReserveTimeSetting/getAcceptOrderReserveTimeSettingByCityCode",
    method: "post",
    data,
  });
}
/**
 * 保存接单预留时间设置
 */
interface saveTiemState {
  acceptOrderReserveTimeSettingId?: string | null;
  orderType: string | null;
  orderBusinessType: string | null;
  reserveTime: number | null;
  cityCode: string | null;
}
export function saveAccptOrderTime(data: saveTiemState) {
  return http.request({
    url: "/acceptOrderReserveTimeSetting/save",
    method: "post",
    data,
  });
}
/**
 * 删除接单预留时间设置
 */
export function removeAcceptOrderTime(data: { acceptOrderReserveTimeSettingId: string | null }) {
  return http.request({
    url: "/acceptOrderReserveTimeSetting/delete",
    method: "post",
    data,
  });
}


//--------------虚拟车头管理-----------------
/**
 * 通过流量方和城市编码查询虚拟司机列表
 */
export function getDiriver(data: { influxCode: string; cityCode: string }) {
  return http.request({
    url: "/virtualDriver/virtualDriverList",
    method: "post",
    data,
  });
}

/**
 * 保存虚拟车头信息
 */
interface saveVirtualState {
  cityCode: string | null;
  influxCode: string | null;
  driverFullName: string | null;
  driverPhone: string | null;
  plateNumber: string | null;
  vehicleBrand: string | null;
  vehicleSeries: string | null;
  vehicleColor: string | null;
  vehicleTypeId: string | null;
  vehicleNote: string | null;
  driverIdentificationPhotoUrl: string | null;
}
export function saveVirtual(data: saveVirtualState) {
  return http.request({
    url: "/virtualDriver/save",
    method: "post",
    data,
  });
}

/**
 * 查询虚拟车头详情
 */
export function getVirtual(data: { virtualDriverId: string }) {
  return http.request({
    url: "/virtualDriver/getOne",
    method: "post",
    data,
  });
}
/**
 * 查询虚拟车头详情
 */
export function removeVirtual(data: { virtualDriverId: string }) {
  return http.request({
    url: "/virtualDriver/delete",
    method: "post",
    data,
  });
}
/**
 * 校验同一业务类型下司机手机号是否重复
 */
interface phoneState {
  driverPhone: string | null;
  influxCode: string | null;
  cityCode: string | null;
}
export function uniqueDriverPhone(data: phoneState) {
  return http.request({
    url: "/virtualDriver/uniqueDriverPhone",
    method: "post",
    data,
  });
}
/**
 * 校验同一业务类型下司机手机号是否重复
 */
interface plateNumberState {
  plateNumber: string | null;
  influxCode: string | null;
  cityCode: string | null;
}
export function uniquePlateNumber(data: plateNumberState) {
  return http.request({
    url: "/virtualDriver/uniquePlateNumber",
    method: "post",
    data,
  });
}

// ----------------平台紧急联系人---------------------
/**
 * 查找平台紧急联系人集合
 */
export function getEmergencyContact() {
  return http.request({
    url: "/platformEmergencyContact/getPlatformEmergencyContactList",
    method: "post",
  });
}
/**
 * 平台紧急联系人保存
 */
interface emeContactState {
  contactId?: string | null;
  contactName: string | null;
  contactPhone: string | null;
}
export function saveEmeContact(data: emeContactState) {
  return http.request({
    url: "/platformEmergencyContact/save",
    method: "post",
    data,
  });
}
/**
 * 平台紧急联系人删除
 */
export function removeEmeContact(data: { contactId: string }) {
  return http.request({
    url: "/platformEmergencyContact/delete",
    method: "post",
    data,
  });
}

/**
 * 校验平台紧急联系人电话号码是否重复
 */
export function uniqueContactPhone(data: { contactPhone: string }) {
  return http.request({
    url: "/platformEmergencyContact/uniqueContactPhone",
    method: "post",
    data,
  });
}
