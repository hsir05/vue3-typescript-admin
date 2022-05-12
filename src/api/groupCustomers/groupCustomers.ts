import { http } from '@/utils/http';
import { PaginationState, } from "../type"

/**---------集团客户会员类型-----------*/
/**
 * 集团客户会员类型列表
*/

interface GroupPageInter{
  page: PaginationState;
  search: {
    groupCustomerMemberNameLike: string | null;
    groupCustomerMemberLockEq: number | null;
  };
}
export function getGroupMemberPage(data:GroupPageInter) {
  return http.request({
    url: "/groupCustomerMember/page",
    method: "post",
    data: data
  });
}
/**
 * 集团客户会员类型详情
*/
export function getGroupMemberDetail(data: {groupCustomerMemberId: string}) {
  return http.request({
    url: '/groupCustomerMember/detail',
    method: 'post',
    data:data
  });
} 
/**
 * 集团客户会员类型预编辑
*/
export function getGroupPreEdit() {
  return http.request({
    url: '/groupCustomerMember/preEdit',
    method: 'post',
  });
}
/**
 * 集团客户会员类型新增
*/
interface BusRateInter {
    orderBusinessType: string
    groupCustomerMemberDiscountRate: number
}
export interface FormInter {
    groupCustomerMemberId?: string | null
    groupCustomerMemberType: string | null
    groupCustomerMemberName: string | null
    groupCustomerMemberDesc: string | null
    groupCustomerMemberLock: number  | null
    groupCustomerMemberDiscountRateList: BusRateInter
    groupCustomerMemberCreateOrderLimitList: BusRateInter
}
export function addGroupMember(data: FormInter) {
  return http.request({
    url: '/groupCustomerMember/add',
    method: 'post',
    data: data
  });
}
/**
 * 集团客户会员类型编辑
*/
export function editGroupMember(data: FormInter) {
  return http.request({
    url: '/groupCustomerMember/add',
    method: 'post',
    data: data
  });
}

// /**
//  * 集团客户会员类型列表
// */

// interface GroupPageInter{
//   page: PaginationState;
//   search: {
//     customerMemberNameLike: string | null;
//     customerMemberLockEq: number | null;
//   };
// }
// export function getGroupMemberPage(data:GroupPageInter) {
//   return http.request({
//     url: "/groupCustomerMember/list",
//     method: "post",
//     data: data
//   });
// }

/**-------------集团客户管理--------------*/
/**
 * 集团客户锁定
*/
export function lockGroupCustomer() {
  return http.request({
    url: '/groupCustomer/lockGroupCustomer',
    method: 'post',
  });
}

/**
 * 集团客户锁定
*/
export function saveGroupCustomer() {
  return http.request({
    url: '/groupCustomer/save',
    method: 'post',
  });
}
/**
 * 集团客户预编辑
*/
export function preEdit() {
  return http.request({
    url: '/groupCustomer/preEdit',
    method: 'post',
  });
}
/**
 * 集团客户删除
*/
export function removeGroupCustomer() {
  return http.request({
    url: '/groupCustomer/delete',
    method: 'post',
  });
}