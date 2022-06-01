import { http } from "@/utils/http";
import { PaginationInter } from "../type";

//-----------------司机钱包管理-------------------------

/**
 * 司机钱包分页
 */
interface WalletPageInter {
    page: PaginationInter;
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
    page: PaginationInter;
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

//-------------------司机体现设置-------------------------
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
 * 保存司机提现规则
 */
interface RuleIner{
    driverWalletWithdrawalRuleId:string | null;
    withdrawalWeek:string | null;
    effectiveTimeBegin:string | null;
    effectiveTimeEnd:string | null;
    withdrawalCount:number | null;
    withdrawalUpperLimit:number | null;
    withdrawalDisableDescribe:string | null;
}
export function editRule(data: RuleIner) {
    return http.request({
        url: "/driverWalletWithdrawalRule/edit",
        method: "post",
        data:data
    });
}

//-------------------司机提现统计-------------------------
/**
 * 司机提现分页
 */
interface DrawalPageInter {
    page: PaginationInter;
    search: {
        operationCompanyIdEq: string | null;
        dealTimeGe: string | null;
        dealTimeLe: string | null;
    };
}
export function getDriverDrawalPage(data: DrawalPageInter) {
    return http.request({
        url: "/driverWithdrawalStatistics/page",
        method: "post",
        data: data,
    });
}
/**
 * 司机提现分页
 */
interface OverviewInter {
    operationCompanyId: string | null;
    beginDate: string | null; //yyyy-MM-dd
    endDate: string | null;
}
export function getDriverOverview(data: OverviewInter) {
    return http.request({
        url: "/driverWithdrawalStatistics/overview",
        method: "post",
        data: data,
    });
}