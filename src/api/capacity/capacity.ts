import { http } from '@/utils/http';
import { PaginationState } from "../type"
//----------------------企业紧急联系人管理-----------------------
/**
 * 企业紧急联系人分页
*/
interface pageSate  {
    page: PaginationState,
    search: {
        operationCompanyIdEq: string | null
        operationCompanyEmergencyContactNameLike: string | null
        operationCompanyEmergencyContactPhoneLike: string | null
    }
}
export function getPage(data: pageSate) {
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
 * 企业紧急联系人分页
*/
interface pageSate  {
    page: PaginationState,
    search: {
        operationCompanyIdEq: string | null
        operationCompanyEmergencyContactNameLike: string | null
        operationCompanyEmergencyContactPhoneLike: string | null
    }
}
export function getExpendPage(data: pageSate) {
  return http.request({
    url: '/operationCompanyExpendContact/page',
    method: 'post',
    data: data
  });
}