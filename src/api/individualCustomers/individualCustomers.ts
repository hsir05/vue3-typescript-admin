import { http } from "@/utils/http";
import { PaginationState } from "../type";

//-----------------个人会员类型管理-------------------------

/**
 * 个人会员类型分页
 */
interface CustomerPageInter {
    page: PaginationState;
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
 * 新增广告
 */
// interface AdvertisementInter {
//     customerMemberType: string | null
//     customerMemberName: string | null
//     customerMemberDesc: string | null
//     customerMemberLock: number | null
//     customerMemberDiscountRateMap: string | null
//     customerMemberCreateOrderLimitMap: string | null
//     customerMemberId: string | null
// }
// export function addAdvertisement(data: AdvertisementInter) {
//     return http.request({
//         url: "/openCityAdvertisement/add",
//         method: "post",
//         data: data,
//     });
// }
// /**
//  * 编辑广告
//  */
// export function editAdvertisement(data: AdvertisementInter) {
//     return http.request({
//         url: "/openCityAdvertisement/edit",
//         method: "post",
//         data: data,
//     });
// }

// /**
//  * 广告详情
//  */
// export function getAdDetail(data: { openCityAdvertisementId: string }) {
//     return http.request({
//         url: "/openCityAdvertisement/detail",
//         method: "post",
//         data: data,
//     });
// }
// /**
//  * 删除
//  */
// export function removeAd(data: { openCityAdvertisementId: string }) {
//     return http.request({
//         url: "/openCityAdvertisement/delete",
//         method: "post",
//         data: data,
//     });
// }