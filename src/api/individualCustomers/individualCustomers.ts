import { http } from "@/utils/http";
import { PaginationInter } from "../type";
import { otherHttp } from "@/utils/http"

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

// ----------------所有个人钱包交易总览管理--------------------
/**
 * 所有个人钱包交易总览分页
*/
interface OverviewPageInter{
  page: PaginationInter;
  search: {
    dealTypeEQ: string | null;
    dealTimeGE: string | null;
    dealTimeLE: string | null;
    dealSerialNumberEQ: string | null;
  };
}
export function getOverviewPage(data:OverviewPageInter) {
  return http.request({
    url: "/customerWallet/aggregatedCustomerWalletDealRecordPage",
    method: "post",
    data: data
  });
}
// ----------------个人客户发票申请管理--------------------
/**
 * 个人客户发票申请分页
*/
interface InvoiceAppPageInter{
  page: PaginationInter;
  search: {
    invoiceApplicationTimeLE: string | null;
    invoiceApplicationTimeGE: string | null;
    invoiceApplicationStateEQ: string | null;
    customerPhoneLike: string | null;
  };
}
export function getInvoiceAppPage(data:InvoiceAppPageInter) {
  return http.request({
    url: "/customerInvoiceApplication/page",
    method: "post",
    data: data
  });
}
/**
 * 发票详情
*/
export function getIndInvoiceDetail(data:{customerInvoiceApplicationId: string}) {
  return http.request({
    url: '/customerInvoiceApplication/detail',
    method: 'post',
    data:data
  });
}
/**
 * 确认个人客户开票
*/
export function confirmInvoice(data:{customerInvoiceApplicationId: string; invoiceApplicationSuccessNote: string}) {
  return http.request({
    url: '/customerInvoiceApplication/confirmInvoice',
    method: 'post',
    // responseType: 'blob',
    data:data
  });
}
/**
 * 按条件导出发票关联的行程单
*/
export function downloadRelativeItinerary(data:{customerInvoiceApplicationId: string}) {
  return http.request({
    url: '/customerInvoiceApplication/exportRelativeItineraryData',
    method: 'post',
    responseType: 'blob',
    data:data
  });
}

/**
 * 发电子发票
*/
export function sendMail(data:{customerInvoiceApplicationId: string | null; expressName: string | null,expressNum: string | null}) {
  return http.request({
    url: `/customerInvoiceApplication/postInvoice`,
    method: 'post',
    data:data
  });
}
/**
 * 重发电子发票
 * 调用第三方地址
*/
export function repeatSendMail(data:{customerInvoiceApplicationId: string | null; contactMail: string | null}) {
  return otherHttp.request({
    url: `/customerInvoiceApplication/platform/invoiceMail`,
    method: 'post',
    headers: {
      Origin: "http://test-ngcxpm-web.yiminyueche.com/",
    },
    data:data
  });
}
/**
 * 开票
*/
export function invoiceOpen(data:{customerInvoiceApplicationId: string | null; invoiceWay: number | null}) {
  return otherHttp.request({
    url: `/customerInvoiceApplication/platform/invoiceOpen`,
    method: 'post',
    data:data
  });
}
/**
 * 重新开票
*/
export function invoiceReOpen(data:{customerInvoiceApplicationId: string | null;}) {
  return otherHttp.request({
    url: `/customerInvoiceApplication/platform/invoiceReOpen`,
    method: 'post',
    data:data
  });
}
/**
 * 打印
*/
export function invoicePrint(data:{customerInvoiceApplicationId: string | null;}) {
  return otherHttp.request({
    url: `/customerInvoiceApplication/platform/invoicePrint`,
    method: 'post',
    data:data
  });
}
/**
 * 开票申请退回
*/
export function returnInvoice(data:{customerInvoiceApplicationId: string | null; invoiceApplicationReturnReason: string | null}) {
  return http.request({
    url: `/customerInvoiceApplication/returnInvoice`,
    method: 'post',
    data:data
  });
}
// ----------------钱包退款申请管理--------------------
/**
 * 所有个人钱包交易总览分页
*/
interface RefundApplicationPageInter{
  page: PaginationInter;
  search: {
    invoiceApplicationTimeLE: string | null;
    contactPhoneLike: string | null;
    dealStateEq: number | null;
  };
}
export function getRefundApplicationPage(data:RefundApplicationPageInter) {
  return http.request({
    url: "/customerWalletRefundApplication/page",
    method: "post",
    data: data
  });
}
/**
 * 钱包退款申请状态修改
*/
interface ChangeDealInter{
  dealResult: string | null
  customerWalletRefundApplicationId: string | null
}
export function changeDealState(data:ChangeDealInter) {
  return http.request({
    url: "/customerWalletRefundApplication/changeDealState",
    method: "post",
    data: data
  });
}
