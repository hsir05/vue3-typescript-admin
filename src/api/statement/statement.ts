import { http } from "@/utils/http";
import { UsersDataInter } from "../type";

//对帐单
export function getInflux(data: UsersDataInter) {
  return http.request({
    url: "/orderStatementOfInflux/getOverview",
    method: "post",
    data,
  });
}
 
//对帐单详情
export function getInfluxDetail(data: {
  influxCode: string;
  cityCode: string;
  beginDate: string;
  endDate: string;
  page: number;
  pageSize: number;
}) {
  return http.request({
    url: "/orderStatementOfInflux/getDetail",
    method: "post",
    data,
  });
}

// 下载对帐单
/**
 * influxCode 流量方编码
 * cityCode 城市编码
 * beginDate 开始日期
 * endDate 结束日期
 * page 页码，默认为0
 * cityName 城市名称
 * influxName 流量方名称
 */
export function downloadInflux(data: {
  influxCode: string;
  cityCode: string;
  beginDate: string;
  endDate: string;
  page: number;
  influxName: string;
}) {
  return http.request({
    url: "/orderStatementOfInflux/download",
    method: "post",
    data,
  });
}
