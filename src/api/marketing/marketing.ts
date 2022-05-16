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
interface CouponPageInter {
    page: PaginationInter;
    search: {
        customerCouponConsumeRuleNameLike: string | null;
        couponUsedCityCodesLike: string | null;
        couponUsedOrderTypesLike: string | null;
    };
}
export function getCouponConsumeRulePage(data: CouponPageInter) {
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
