import { http } from "@/utils/http";
import { PaginationState } from "../type";

//-----------------司机钱包管理-------------------------

/**
 * 司机钱包分页
 */
interface WalletPageInter {
    page: PaginationState;
    search: {
        driverNoLike: string | null;
        operationCompanyIdEq: string | null;
    };
}
export function getWalletPage(data: WalletPageInter) {
    return http.request({
        url: "/driverWallet/driverWalletPage",
        method: "post",
        data: data,
    });
}
/**
 * 司机钱包交易记录
 */
interface RecordPageInter {
    page: PaginationState;
    search: {
        driverWalletIdEq: string | null;
        dealTypeEq: string | null;
        dealTimeGe: string | null;
        dealTimeLe: string | null;
    };
}
export function getRecordPage(data: RecordPageInter) {
    return http.request({
        url: "/driverWallet/driverWalletDealRecordPage",
        method: "post",
        data: data,
    });
}
/**
 * 司机钱包详情
 */
export function getWalletDetail(data: {driverWalletId: string}) {
    return http.request({
        url: "/driverWallet/detail",
        method: "post",
        data: data,
    });
}

/**
 * 修改司机钱包预留阈值
 */
export function updateBalanceLimit(data: { driverWalletId: string;reserveBalanceLimit: number }) {
    return http.request({
        url: "/driverWallet/updateReserveBalanceLimit",
        method: "post",
        data: data,
    });
}
/**
 * 获取司机提现规则
 */
export function getWithdrawalRule() {
    return http.request({
        url: "/driverWalletWithdrawalRule/get",
        method: "post",
    });
}

/**
 * 获取司机提现规则
 */
interface RuleIner{
    driverWalletWithdrawalRuleId:string;
    withdrawalWeek:string;
    effectiveTimeBegin:string;
    effectiveTimeEnd:string;
    withdrawalCount:number;
    withdrawalUpperLimit:number;
    withdrawalDisableDescribe:string;
}
export function editRule(data: RuleIner) {
    return http.request({
        url: "/driverWalletWithdrawalRule/edit",
        method: "post",
        data:data
    });
}