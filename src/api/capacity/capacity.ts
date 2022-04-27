import { http } from '@/utils/http';
import { PaginationState } from "../type"


//-----------------运营企业管理-------------------------


/**
 * 运营企业分页
*/
interface pageSate  {
    page: PaginationState,
    search: {
        nameLike: string | null
        operationCompanyCodeLike: string | null
    }
}
export function getCompanyPage(data: pageSate) {
  return http.request({
    url: '/operationCompany/page',
    method: 'post',
    data: data
  });
}
/**
 * 新增运营企业及管理员
*/
interface companyState  {
    operationCompanyId?: string | null
    operationCompanyCode: string | null
    operationCompanyName: string | null
    operationCityCode: string | null
    unifiedSocialCreditCode: string | null
    operationCompanyAddress: string | null
    operationCityName: string | null
    operationCompanyManagerName: string | null
    operationCompanyManagerGender: number | null
    lng: number | null
    lat: number | null
    operationCompanyManagerPhone: string | null
}
export function addCompany(data: companyState) {
  return http.request({
    url: '/operationCompany/add',
    method: 'post',
    data: data
  });
}
/**
 * 编辑运营企业及管理员
*/
export function editCompany(data: companyState) {
  return http.request({
    url: '/operationCompany/edit',
    method: 'post',
    data: data
  });
}

/**
 * 校验运营企业名称唯一
*/
export function uniqueCompanyName(data: {operationCompanyName: string}) {
  return http.request({
    url: '/operationCompany/uniqueOperationCompanyName',
    method: 'post',
    data: data
  });
}
/**
 * 校验运营企业是否有代理商
*/
export function validateIfExistAgency(data: {operationCompanyId: string}) {
  return http.request({
    url: '/operationCompany/validateIfExistAgency',
    method: 'post',
    data: data
  });
}
/**
 * 校验运营企业是否有代理商
*/
export function updateAgentStatus(data: {operationCompanyId: string}) {
  return http.request({
    url: '/operationCompany/modifyAllowAgencyStatus',
    method: 'post',
    data: data
  });
}
//----------------------代理商管理-----------------------
/**
 * 运营企业分页
*/
interface agencyPageSate  {
    page: PaginationState,
    search: {
        operationCompanyAgencyNamelike: string | null
    }
}
export function getAgencyPage(data: agencyPageSate) {
  return http.request({
    url: '/operationCompanyAgency/page',
    method: 'post',
    data: data
  });
}




//----------------------企业紧急联系人管理-----------------------
/**
 * 企业紧急联系人分页
*/
interface emeContactSate  {
    page: PaginationState;
    search: {
        operationCompanyIdEq: string | null
        operationCompanyEmergencyContactNameLike: string | null
        operationCompanyEmergencyContactPhoneLike: string | null
    }
}
export function getEmeConactPage(data: emeContactSate) {
  return http.request({
    url: '/operationCompanyEmergencyContact/page',
    method: 'post',
    data: data
  });
}
/**
 * 编辑紧急联系人
*/
interface editorState  {
    operationCompanyEmergencyContactId?: string | null
    operationCompanyId: string | null
    // oldOperationCompanyEmergencyContactPhone: string | null
    // oldOperationCompanyEmergencyContactEmail: string | null
    operationCompanyEmergencyContactName: string | null
    operationCompanyEmergencyContactPhone: string | null
    operationCompanyEmergencyContactEmail: string | null
    createTime?: string | null
    dutyTimeBegin: string | null
    dutyTimeEnd: string | null
}
export function editEmeContact(data: editorState) {
  return http.request({
    url: '/operationCompanyEmergencyContact/edit',
    method: 'post',
    data: data
  });
}
/**
 * 新增紧急联系人
*/
export function addEmeContact(data: editorState) {
  return http.request({
    url: '/operationCompanyEmergencyContact/add',
    method: 'post',
    data: data
  });
}
/**
 * 删除
*/
export function removeEmeContact(data: {operationCompanyEmergencyContactId: string}) {
  return http.request({
    url: '/operationCompanyEmergencyContact/delete',
    method: 'post',
    data: data
  });
}

/**
 * 校验同一企业下紧急联系人手机号不能重复
*/
export function uniqueContactPhone(data: {operationCompanyId: string | null;operationCompanyEmergencyContactPhone: string | null;}) {
  return http.request({
    url: '/operationCompanyEmergencyContact/uniqueOperationCompanyEmergencyContactPhone',
    method: 'post',
    data: data
  });
}

/**
 * 校验同一企业下紧急联系人邮箱不能重复
*/
export function uniqueContactEmail(data: {operationCompanyId: string | null;operationCompanyEmergencyContactEmail: string | null;}) {
  return http.request({
    url: '/operationCompanyEmergencyContact/uniqueOperationCompanyEmergencyContactEmail',
    method: 'post',
    data: data
  });
}

/**
 * 按照运营企业主键和紧急联系人主键获取值班时间范围
*/
export function getTimeRange(data: {operationCompanyId: string | null;operationCompanyEmergencyContactId: string | null;}) {
  return http.request({
    url: '/operationCompanyEmergencyContact/findDutyTimeStrByOprCompanyIdAndContactId',
    method: 'post',
    data: data
  });
}

//-----------------企业值班调度人-------------------------
/**
 * 企业值班调度人分页
*/
interface expendPageState  {
    page: PaginationState,
    search: {
        operationCompanyIdEq: string | null
        operationCompanyEmergencyContactNameLike: string | null
        operationCompanyEmergencyContactPhoneLike: string | null
    }
}
export function getExpendPage(data: expendPageState) {
  return http.request({
    url: '/operationCompanyExpendContact/page',
    method: 'post',
    data: data
  });
}