import { http } from '@/utils/http';
import { PaginationState, } from "../type"

/**---------集团客户会员类型-----------*/
/**
 * 集团客户会员类型详情
*/
export function getGroupMemberDetail() {
  return http.request({
    url: '/groupCustomerMember/detail',
    method: 'post',
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
 * 集团客户会员类型保存
*/
export function saveGroupMember() {
  return http.request({
    url: '/groupCustomerMember/save',
    method: 'post',
  });
}

/**
 * 集团客户会员类型列表
*/

/**
 * 运营企业分页
 */
interface GroupPageInter{
  page: PaginationState;
  search: {
    memberNameLike: string | null;
    memberLockEq: number | null;
  };
}
export function getGroupMemberList(data: GroupPageInter) {
  return http.request({
    url: "/groupCustomerMember/list",
    method: "post",
    data: data,
  });
}

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