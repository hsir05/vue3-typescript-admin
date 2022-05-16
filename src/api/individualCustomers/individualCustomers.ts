import { http } from "@/utils/http";
import { PaginationInter } from "../type";

//-----------------个人会员类型管理-------------------------

/**
 * 个人会员类型分页
 */
interface CustomerPageInter {
    page: PaginationInter;
    search: {
        customerMemberNameLike: string | null;
        customerMemberLockEq: string | null;
    };
}
export function getCustomerMemberPage(data: CustomerPageInter) {
    return http.request({
        url: "/customerMember/page",
        method: "post",
        data: data,
    });
}
/**
 * 个人会员类型获取所有
 */
export function getAllCustomerMember() {
    return http.request({
        url: "/customerMember/page",
        method: "post",
    });
}
/**
 * 新增个人会员
 */
interface BusRateInter {
    orderBusinessType: string
    customerMemberDiscountRate: number
}
interface BusLimitInter {
    orderBusinessType: string
    customerMemberCreateOrderLimit: number
}
interface CustomerMemberInter {
    customerMemberId?: string | null
    customerMemberType: string | null
    customerMemberName: string | null
    customerMemberDesc: string | null
    customerMemberLock: number | null
    customerMemberDiscountRateMap: BusRateInter[]
    customerMemberCreateOrderLimitMap: BusLimitInter[]
}
export function addCustomerMember(data: CustomerMemberInter) {
    return http.request({
        url: "/customerMember/save",
        method: "post",
        data: data,
    });
}
/**
 * 编辑个人会员
 */
export function editCustomerMember(data: CustomerMemberInter) {
    return http.request({
        url: "/customerMember/edit",
        method: "post",
        data: data,
    });
}
// ----------------个人客户管理--------------------
/**
 * 个人客户分页列表
*/
interface InCustomerPageInter{
  page: PaginationInter;
  search: {
    customerPhoneLike: string | null;
    customerMemberNameEq: string | null;
    customerLockEq: string | null;
    customerRegTimeGE: string | null;
    customerRegTimeLE: string | null;
  };
}
export function getCustomerPage(data:InCustomerPageInter) {
  return http.request({
    url: "/customer/page",
    method: "post",
    data: data
  });
}
/**
 * 个人客户详情
*/
export function getGroupCustomerDetail(data:{groupCustomerId: string}) {
  return http.request({
    url: '/groupCustomer/detail',
    method: 'post',
    data:data
  });
}
/**
 * 个人客户锁定
*/
export function lockCustomer(data:{groupCustomerId:string}) {
  return http.request({
    url: '/groupCustomer/lockGroupCustomer',
    method: 'post',
    data:data
  });
}