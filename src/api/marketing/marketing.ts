import { http } from "@/utils/http";
import { PaginationState } from "../type";

//-----------------广告管理-------------------------

/**
 * 广告分页
 */
interface AdPageInter {
  page: PaginationState;
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
  advertisementEffectiveTimeBegin: number;
  advertisementEffectiveTimeEnd: number;
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
    url: "/operationCompany/edit",
    method: "post",
    data: data,
  });
}

/**
 * 广告详情
 */
export function getAdDetail(data: {openCityAdvertisementId: string}) {
  return http.request({
    url: "/openCityAdvertisement/detail",
    method: "post",
    data: data,
  });
}
