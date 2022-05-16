import { http } from '@/utils/http';
import { PaginationInter, } from "../type"

/**---------集团客户会员类型-----------*/
/**
 * 集团客户会员类型列表
*/

interface GroupPageInter{
  page: PaginationInter;
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
interface BusLimitInter {
    orderBusinessType: string
    groupCustomerMemberCreateOrderLimit: number
}
export interface FormInter {
    groupCustomerMemberId?: string | null
    groupCustomerMemberType: string | null
    groupCustomerMemberName: string | null
    groupCustomerMemberDesc: string | null
    groupCustomerMemberLock: number  | null
    groupCustomerMemberDiscountRateList: BusRateInter[]
    groupCustomerMemberCreateOrderLimitList: BusLimitInter[]
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

export function getAllGroupMember() {
  return http.request({
    url: "/groupCustomerMember/list",
    method: "post",
  });
}

/**-------------集团客户管理--------------------*/
/**
 * 集团客户会员类型列表
*/

interface CustomerPageInter{
  page: PaginationInter;
  search: {
    groupCustomerNameLike: string | null;
    contactNameLike: string | null;
    contactPhoneLike: string | null;
    groupCustomerLockEq: string | null;
  };
}
export function getGroupCustomerPage(data:CustomerPageInter) {
  return http.request({
    url: "/groupCustomer/page",
    method: "post",
    data: data
  });
}
/**
 * 集团客户详情
*/
export function getGroupCustomerDetail(data:{groupCustomerId: string}) {
  return http.request({
    url: '/groupCustomer/detail',
    method: 'post',
    data:data
  });
}
/**
 * 集团客户锁定
*/
export function lockGroupCustomer(data:{groupCustomerId:string}) {
  return http.request({
    url: '/groupCustomer/lockGroupCustomer',
    method: 'post',
    data:data
  });
}
/**
 * 集团客户新增
*/
export interface CustomerInter {
    groupCustomerId?: string | null
    groupCustomerName: string | null
    groupCustomerMemberId: string | null
    groupCustomerLoginAccount: string | null
    contactName: string  | null
    contactPhone: string | null
}
export function addGroupCustomer(data: CustomerInter) {
  return http.request({
    url: '/groupCustomer/add',
    method: 'post',
    data: data
  });
}
/**
 * 集团客户编辑
*/
export function editGroupCustomer(data: CustomerInter) {
  return http.request({
    url: '/groupCustomer/edit',
    method: 'post',
    data: data
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
export function removeGroupCustomer(data:{ groupCustomerId: string}) {
  return http.request({
    url: '/groupCustomer/delete',
    method: 'post',
    data:data
  });
}
