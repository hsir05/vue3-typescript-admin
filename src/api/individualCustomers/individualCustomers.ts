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
        url: "/customer/findOtherCustomerCouponList",
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
/**
 * 个人会员详情
*/
export function getIndMemberDetail(data:{customerMemberId: string}) {
  return http.request({
    url: '/customerMember/detail',
    method: 'post',
    data:data
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
export function getCustomerDetail(data:{customerId: string}) {
  return http.request({
    url: '/customer/detail',
    method: 'post',
    data:data
  });
}
/**
 * 个人客户锁定
*/
export function lockCustomer(data:{customerId:string}) {
  return http.request({
    url: '/groupCustomer/lockGroupCustomer',
    method: 'post',
    data:data
  });
}

/**
 * 变更客户会员类型
*/
export function updateCustomerType(data:{customerId:string; customerMemberId: string}) {
  return http.request({
    url: '/customer/customerMemberSave',
    method: 'post',
    data:data
  });
}

// ----------------已注销客户管理--------------------
/**
 * 已注销客户分页
*/
interface InCustomerInvalidPageInter{
  page: PaginationInter;
  search: {
    customerPhoneLike: string;
  };
}
export function getCustomerInvalidPage(data:InCustomerInvalidPageInter) {
  return http.request({
    url: "/customerInvalid/page",
    method: "post",
    data: data
  });
}

// ----------------个人客户钱包管理--------------------
/**
 * 个人客户钱包分页
*/
interface InCustomerWalletPageInter{
  page: PaginationInter;
  search: {
    customerPhoneLike: string | null;
  };
}
export function getCustomerWalletPage(data:InCustomerWalletPageInter) {
  return http.request({
    url: "/customerWallet/customerWalletPage",
    method: "post",
    data: data
  });
}

/**
 * 当前个人钱包交易明细分页
*/
interface WalletRecordtPageInter{
  page: PaginationInter;
  search: {
    customerWalletIdEQ: string | null;
    dealTypeEQ: string | null;
    dealTimeGE: string | null;
    dealTimeLE: string | null;
  };
}
export function getWalletDealRecordPage(data:WalletRecordtPageInter) {
  return http.request({
    url: "/customerWallet/customerWalletDealRecordPage",
    method: "post",
    data: data
  });
}
/**
 * 当前个人钱包交易明细分页
*/
interface WalletRechargeInter{
    customerWalletId: string | null
    rechargeAmount: number | null
    giftAmount: number | null
    rechargeNote: string | null
    password: string | null
}
export function customerWalletRecharge(data:WalletRechargeInter) {
  return http.request({
    url: "/customerWallet/customerWalletRecharge",
    method: "post",
    data: data
  });
}
/**
 * 退款操作
*/
export function getPhoneCusotmer(data:{customerPhoneHeader: string;}) {
  return http.request({
    url: '/customer/findByCustomerPhoneHeader',
    method: 'post',
    data:data
  });
}
/**
 * 钱包详情
*/
export function getWalletDetail(data:{customerWalletId: string}) {
  return http.request({
    url: '/customerWallet/customerWalletDetail',
    method: 'post',
    data:data
  });
}
/**
 * 退款操作
*/
export function customerWalletRefund(data:{customerWalletId: string; password: string}) {
  return http.request({
    url: '/customerWallet/customerWalletRefund',
    method: 'post',
    data:data
  });
}
/**
 * 转账操作
*/
interface TransferInter {
    customerWalletId:string | null
    targetCustomerId:string | null
    rechargeAmount:number | null
    giftAmount:number | null
    transferNote:string | null
    password: string | null

}
export function customerWalletTransfer(data:TransferInter) {
  return http.request({
    url: '/customerWallet/customerWalletTransfer',
    method: 'post',
    data:data
  });
}