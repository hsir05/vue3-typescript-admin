import { http } from "@/utils/http";
import { PaginationState } from "../type";

//-----------------运营企业管理-------------------------

/**
 * 运营企业分页
 */
interface pageSate {
  page: PaginationState;
  search: {
    nameLike: string | null;
    operationCompanyCodeLike: string | null;
  };
}
export function getCompanyPage(data: pageSate) {
  return http.request({
    url: "/operationCompany/page",
    method: "post",
    data: data,
  });
}
/**
 * 新增运营企业及管理员
 */
interface companyState {
  operationCompanyId?: string | null;
  operationCompanyCode: string | null;
  operationCompanyName: string | null;
  operationCityCode: string | null;
  unifiedSocialCreditCode: string | null;
  operationCompanyAddress: string | null;
  operationCityName: string | null;
  operationCompanyManagerName: string | null;
  operationCompanyManagerGender: number | null;
  lng: number | null;
  lat: number | null;
  operationCompanyManagerPhone: string | null;
}
export function addCompany(data: companyState) {
  return http.request({
    url: "/operationCompany/add",
    method: "post",
    data: data,
  });
}
/**
 * 编辑运营企业及管理员
 */
export function editCompany(data: companyState) {
  return http.request({
    url: "/operationCompany/edit",
    method: "post",
    data: data,
  });
}

/**
 * 校验运营企业名称唯一
 */
export function uniqueCompanyName(data: { operationCompanyName: string }) {
  return http.request({
    url: "/operationCompany/uniqueOperationCompanyName",
    method: "post",
    data: data,
  });
}
/**
 * 校验运营企业是否有代理商
 */
export function validateIfExistAgency(data: { operationCompanyId: string }) {
  return http.request({
    url: "/operationCompany/validateIfExistAgency",
    method: "post",
    data: data,
  });
}
/**
 * 校验运营企业是否有代理商
 */
export function updateAgentStatus(data: { operationCompanyId: string }) {
  return http.request({
    url: "/operationCompany/modifyAllowAgencyStatus",
    method: "post",
    data: data,
  });
}
//----------------------代理商管理-----------------------
/**
 * 代理商分页
 */
interface agencyPageSate {
  page: PaginationState;
  search: {
    operationCompanyAgencyNameLike: string | null;
  };
}
export function getAgencyPage(data: agencyPageSate) {
  return http.request({
    url: "/operationCompanyAgency/page",
    method: "post",
    data: data,
  });
}
/**
 * 新增代理商
 */
export interface loginCredentialProps {
    loginCredentialState: number
    loginAccount: string | null
}

interface agencyState {
  operationCompanyAgencyId?: string | null;
  operationCompanyAgencyName: string | null;
  loginCredential: string | null;
  operationCompanyAgencyContactName: string | null;
  operationCompanyAgencyContactGender: number | null;
  operationCompanyAgencyContactPhone: string | null;
   operationCompanyIds: null | string[]
}
export function addAgency(data: agencyState) {
  return http.request({
    url: "/operationCompanyAgency/add",
    method: "post",
    data: data,
  });
}
/**
 * 编辑代理商
 */
export function editAgency(data: agencyState) {
  return http.request({
    url: "/operationCompanyAgency/edit",
    method: "post",
    data: data,
  });
}

/**
 * 修改代理商状态
 */
export function updateAgencyStatus(data: {operationCompanyAgencyId:string}) {
  return http.request({
    url: "/operationCompanyAgency/modifyAgencyStatus",
    method: "post",
    data: data,
  });
}
/**
 * 代理商名称去重
 */
export function uniqueAgencyName(data: {operationCompanyAgencyName:string}) {
  return http.request({
    url: "/operationCompanyAgency/uniqueOperationCompanyAgencyName",
    method: "post",
    data: data,
  });
}
/**
 * 校验代理商登录账号是否重复
 */
export function uniqueAgencyLogin(data: {operationCompanyAgencyName:string}) {
  return http.request({
    url: "/operationCompanyAgency/uniqueOperationCompanyAgencyName",
    method: "post",
    data: data,
  });
}
/**
 * 查询可以代理的企业列表
 */

export function getAllowAgencyCompany() {
  return http.request({
    url: "/operationCompany/findAllowAgencyOperationCompanyList",
    method: "post"
  });
}
/**
 * 校验代理商登录账号是否重复
 */
interface ratioSate {
    operationCompanyAgencyId: string 
    operationCompanyId: string
}
export function getRatio(data: ratioSate) {
  return http.request({
    url: "/operationCompanyAgency/getNumberByOperationCompanyId",
    method: "post",
    data: data,
  });
}

//----------------------企业承接业务设置-----------------------
/**
 * 通过开通区域查找该区域下的企业承接业务列表
 */

export function getUndertakeBus(data: {areaCode: string}) {
  return http.request({
    url: "/operationCompanyUndertakeBusiness/getUndertakeBusinessListByAreaCode",
    method: "post",
    data: data,
  });
}

/**
 * 按照开通区域和企业查找该区域下的企业承接业务列表
 */

export function getAreaUndertakeBus(data: {areaCode: string; operationCompanyId: string}) {
  return http.request({
    url: "/operationCompanyUndertakeBusiness/getUndertakeBusinessListByAreaCodeAndCompany",
    method: "post",
    data: data,
  });
}

/**
 * 保存企业承接业务
 */
interface companyUndertakeBusinessState {
    orderType: string
    orderBusinessType: string
}
interface undertakeState {
    areaCode: string | null
    operationCompanyId: string | null
    companyUndertakeBusinessList: companyUndertakeBusinessState[]
}
export function saveUndertakeBus(data: undertakeState) {
  return http.request({
    url: "/operationCompanyUndertakeBusiness/save",
    method: "post",
    data: data,
  });
}

//----------------------车辆管理-----------------------
interface vehiclePage {
  page: PaginationState;
  search: {
    operationCompanyIdEq: string | null;
    plateNumberLike: string | null;
    vehicleTypeIdEq: string | null;
    vehicleStateEq: string | null;
  };
}
export function getVehiclePage(data: vehiclePage) {
  return http.request({
    url: "/vehicle/page",
    method: "post",
    data: data,
  });
}

//----------------------企业紧急联系人管理-----------------------
/**
 * 企业紧急联系人分页
 */
interface emeContactSate {
  page: PaginationState;
  search: {
    operationCompanyIdEq: string | null;
    operationCompanyEmergencyContactNameLike: string | null;
    operationCompanyEmergencyContactPhoneLike: string | null;
  };
}
export function getEmeConactPage(data: emeContactSate) {
  return http.request({
    url: "/operationCompanyEmergencyContact/page",
    method: "post",
    data: data,
  });
}
/**
 * 编辑紧急联系人
 */
interface editorState {
  operationCompanyEmergencyContactId?: string | null;
  operationCompanyId: string | null;
  // oldOperationCompanyEmergencyContactPhone: string | null
  // oldOperationCompanyEmergencyContactEmail: string | null
  operationCompanyEmergencyContactName: string | null;
  operationCompanyEmergencyContactPhone: string | null;
  operationCompanyEmergencyContactEmail: string | null;
  createTime?: string | null;
  dutyTimeBegin: string | null;
  dutyTimeEnd: string | null;
}
export function editEmeContact(data: editorState) {
  return http.request({
    url: "/operationCompanyEmergencyContact/edit",
    method: "post",
    data: data,
  });
}
/**
 * 新增紧急联系人
 */
export function addEmeContact(data: editorState) {
  return http.request({
    url: "/operationCompanyEmergencyContact/add",
    method: "post",
    data: data,
  });
}
/**
 * 删除
 */
export function removeEmeContact(data: { operationCompanyEmergencyContactId: string }) {
  return http.request({
    url: "/operationCompanyEmergencyContact/delete",
    method: "post",
    data: data,
  });
}

/**
 * 校验同一企业下紧急联系人手机号不能重复
 */
export function uniqueContactPhone(data: {
  operationCompanyId: string | null;
  operationCompanyEmergencyContactPhone: string | null;
}) {
  return http.request({
    url: "/operationCompanyEmergencyContact/uniqueOperationCompanyEmergencyContactPhone",
    method: "post",
    data: data,
  });
}

/**
 * 校验同一企业下紧急联系人邮箱不能重复
 */
export function uniqueContactEmail(data: {
  operationCompanyId: string | null;
  operationCompanyEmergencyContactEmail: string | null;
}) {
  return http.request({
    url: "/operationCompanyEmergencyContact/uniqueOperationCompanyEmergencyContactEmail",
    method: "post",
    data: data,
  });
}

/**
 * 按照运营企业主键和紧急联系人主键获取值班时间范围
 */
export function getTimeRange(data: {
  operationCompanyId: string | null;
  operationCompanyEmergencyContactId: string | null;
}) {
  return http.request({
    url: "/operationCompanyEmergencyContact/findDutyTimeStrByOprCompanyIdAndContactId",
    method: "post",
    data: data,
  });
}

//-----------------企业值班调度人-------------------------
/**
 * 企业值班调度人分页
 */
interface expendPageState {
  page: PaginationState;
  search: {
    operationCompanyIdEq: string | null;
    operationCompanyExpendContactNameLike: string | null;
    operationCompanyExpendContactPhoneLike: string | null;
  };
}
export function getExpendPage(data: expendPageState) {
  return http.request({
    url: "/operationCompanyExpendContact/page",
    method: "post",
    data: data,
  });
}

/**
 * 新增企业值班调度人
 */
interface expendContactState {
  operationCompanyExpendContactId?: string | null;
  operationCompanyId: string | null;
  operationCompanyExpendContactName: string | null;
  operationCompanyExpendContactPhone: string | null;
  operationCompanyExpendContactEmail: string | null;
  dutyTimeBegin: string | number | null;
  dutyTimeEnd: string | number | null;
}
export function addExpendContact(data: expendContactState) {
  return http.request({
    url: "/operationCompanyExpendContact/add",
    method: "post",
    data: data,
  });
}
/**
 * 编辑企业值班调度人
 */
export function editExpendContact(data: expendContactState) {
  return http.request({
    url: "/operationCompanyExpendContact/edit",
    method: "post",
    data: data,
  });
}

/**
 * 编辑企业值班调度人
 */
export function getCompanyRangeTime(data: {
  operationCompanyId: string;
  operationCompanyExpendContactId: string | null;
}) {
  return http.request({
    url: "/operationCompanyExpendContact/findDutyTimeStrByOprCompanyIdAndContactId",
    method: "post",
    data: data,
  });
}
/**
 * 删除开通城市
 */
export function removeExpendContact(data: { operationCompanyExpendContactId: string }) {
  return http.request({
    url: "/operationCompanyExpendContact/delete",
    method: "post",
    data: data,
  });
}
//----------------------司机注册审核管理-----------------------
/**
 * 企业值班调度人分页
 */
interface driverRegisterState {
  page: PaginationState;
  search: {
    registerStateEq: string;
    driverFullNameLike: string | null;
    operationCompanyExpendContactPhoneLike: string | null;
  };
}
export function getDriverRegisterPage(data: driverRegisterState) {
  return http.request({
    url: "/driverRegister/page",
    method: "post",
    data: data,
  });
}