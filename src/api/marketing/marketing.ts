import { http } from "@/utils/http";
import { PaginationInter } from "../type";

//-----------------广告管理-------------------------

/**
 * 广告分页
 */
interface AdPageInter {
    page: PaginationInter;
    search: {
        cityCodeEq: string | null;
    };
}
export function getAdPage(data: AdPageInter) {
    return http.request({
        url: "/openCityAdvertisement/page",
        method: "post",
        data: data,
    });
}
/**
 * 新增广告
 */
interface AdvertisementInter {
    openCityAdvertisementId?: string | null;
    cityCode: string | null;
    advertisementTitle: string | null;
    advertisementImageUrl: string | null;
    advertisementH5Url: string | null;
    advertisementEffectiveTimeBegin: string | null;
    advertisementEffectiveTimeEnd: string | null;
}
export function addAdvertisement(data: AdvertisementInter) {
    return http.request({
        url: "/openCityAdvertisement/add",
        method: "post",
        data: data,
    });
}
/**
 * 编辑广告
 */
export function editAdvertisement(data: AdvertisementInter) {
    return http.request({
        url: "/openCityAdvertisement/edit",
        method: "post",
        data: data,
    });
}

/**
 * 广告详情
 */
export function getAdDetail(data: { openCityAdvertisementId: string }) {
    return http.request({
        url: "/openCityAdvertisement/detail",
        method: "post",
        data: data,
    });
}
/**
 * 删除
 */
export function removeAd(data: { openCityAdvertisementId: string }) {
    return http.request({
        url: "/openCityAdvertisement/delete",
        method: "post",
        data: data,
    });
}

/**
 * 城市广告序列前移
 */
export function upAdvertisement(data: { openCityAdvertisementId: string }) {
    return http.request({
        url: "/openCityAdvertisement/upgradeAdvertisementSeq",
        method: "post",
        data: data,
    });
}

/**
 * 城市广告序列后移
 */
export function downAdvertisement(data: { openCityAdvertisementId: string }) {
    return http.request({
        url: "/openCityAdvertisement/lowerAdvertisementSeq",
        method: "post",
        data: data,
    });
}

//-----------------代金券消费规则配置-------------------------

/**
 * 代金券分页
 */
interface CouponRulePageInter {
    page: PaginationInter;
    search: {
        customerCouponConsumeRuleNameLike: string | null;
        couponUsedCityCodesLike: string | null;
        couponUsedOrderTypesLike: string | null;
    };
}
export function getCouponConsumeRulePage(data: CouponRulePageInter) {
    return http.request({
        url: "/customerCouponConsumeRule/page",
        method: "post",
        data: data,
    });
}

/**
 * 代金券消费规则新增
 */
interface CouponInter {
    customerCouponConsumeRuleId?: string | null;
    customerCouponConsumeRuleName: string | null;
    couponLimitedAmount: string | null;
    couponUsedCityCodes: string[] | null;
    couponUsedOrderTypes: string[] | null;
    couponUsedVehicleTypeIds: string[] | null;
}
export function addCoupon(data: CouponInter) {
    return http.request({
        url: "/customerCouponConsumeRule/add",
        method: "post",
        data: data,
    });
}
/**
 * 编辑代金券消费规则
 */
export function editCoupon(data: CouponInter) {
    return http.request({
        url: "/customerCouponConsumeRule/edit",
        method: "post",
        data: data,
    });
}

/**
 * 代金券消费规则删除
 */
export function removeCoupon(data: { customerCouponConsumeRuleId: string }) {
    return http.request({
        url: "/customerCouponConsumeRule/delete",
        method: "post",
        data: data,
    });
}
//-----------------代金券管理-------------------------

/**
 * 代金券分页
 */
interface CouponPageInter {
    page: PaginationInter;
    search: {
        couponNameLike: string | null;
        customerPhoneLike: string | null;
        couponAchieveTimeGe: string | null;
        couponAchieveTimeLe: string | null;
        couponAchieveOpportunityEq: string | null;
        couponUseStateEq: string | null;
    };
}
export function getCouponPage(data: CouponPageInter) {
    return http.request({
        url: "/customerCoupon/page",
        method: "post",
        data: data,
    });
}

/**
 * 代金券详情
 */
export function getCouponDetail(data: { customerCouponId: string }) {
    return http.request({
        url: "/customerCoupon/detail",
        method: "post",
        data: data,
    });
}

/**
 * 代金券详情
 */
interface GiftCouponInter {
    customerId: string | null
    couponName: string | null
    customerCouponConsumeRuleId: string | null
    couponDenomination: string | null
    couponEffectiveTimeBegin: string | null
    couponEffectiveTimeEnd: string | null
    couponCount: string | null
}
export function giftCoupon(data: GiftCouponInter) {
    return http.request({
        url: "/customerCoupon/giftCoupon",
        method: "post",
        data: data,
    });
}
//-----------------兑换码管理-------------------------

/**
 * 兑换码分页
 */
interface ExchangeCodePageInter {
    page: PaginationInter;
    search: {
        exchangeCodeLike: string | null;
        exchangeCodeExchangeTypeEq: string | null;
        exchangeCodeCreateTimeGe: string | null;
        exchangeCodeCreateTimeLe: string | null;
    };
}
export function getExchangeCodePage(data: ExchangeCodePageInter) {
    return http.request({
        url: "/exchangeCode/page",
        method: "post",
        data: data,
    });
}
// 兑换码详情
export function getExchangeCodeDetail(data: { exchangeCodeId: string }) {
    return http.request({
        url: "/exchangeCode/detail",
        method: "post",
        data: data,
    });
}
/**
 * 兑换码兑换分页
 */
interface RecordPageInter {
    page: PaginationInter;
    search: {
        exchangeCodeIdEq: string | null;
        customerPhoneLike: string | null;
    };
}
export function getRecordPagePage(data: RecordPageInter) {
    return http.request({
        url: "/exchangeCode/recordPage",
        method: "post",
        data: data,
    });
}
//-----------------钱包充值活动管理-------------------------

/**
 * 钱包充值活动分页
 */
interface WalletRechargeActivityPageInter {
    page: PaginationInter;
    search: {
        paymentChannelTypeEq: string | null;
    };
}
export function getWalletRechargeActivityPage(data: WalletRechargeActivityPageInter) {
    return http.request({
        url: "/customerWalletRechargeActivity/page",
        method: "post",
        data: data,
    });
}

// 详情
export function getRechargeDetail(data: { customerWalletRechargeActivityId: string }) {
    return http.request({
        url: "/customerWalletRechargeActivity/detail",
        method: "post",
        data: data,
    });
}

/**
 * 新增充值活动
 */
interface RechargeActivityInter {
    customerWalletRechargeActivityId?: string | null
    paymentChannelType: string | null;
    rechargeRate: number | null;
    minimumRechargeAmount: number | null;
    cumulativeRechargeAmount: number | null;
    activityBeginTime: string | null;
    activityEndTime: string | null;
    activityDesc: string | null;
}
export function addRechargeActivity(data: RechargeActivityInter) {
    return http.request({
        url: "/customerWalletRechargeActivity/add",
        method: "post",
        data: data,
    });
}
/**
 * 编辑充值活动
 */
export function editRechargeActivity(data: RechargeActivityInter) {
    return http.request({
        url: "/customerWalletRechargeActivity/edit",
        method: "post",
        data: data,
    });
}
//-----------------订单支付渠道-------------------------

/**
 * 获取订单支付渠道列表
 */
interface ActivityInter {
    deviceChannelType: string | null;
    orderBusinessType: string | null;
}
export function getOrderPayChannelList(data: ActivityInter) {
    return http.request({
        url: "/orderPayChannelTypeShow/list",
        method: "post",
        data: data,
    });
}