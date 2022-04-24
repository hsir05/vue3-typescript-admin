import { http } from "@/utils/http";

//获取流量方
export function getInfluxList() {
  return http.request({
    url: "/dictionary/influxList",
    method: "post",
  });
}

//获取所有运营企业列表
export function getOperationCompany() {
  return http.request({
    url: "/operationCompany/getAllOperationCompany",
    method: "post",
  });
}

//获得所有开通城市
export function getAllOpenCity() {
  return http.request({
    url: "/openCity/openCityList",
    method: "post",
  });
}
// 通过父字典编码查询子字典集合
export function getDict(data: { parentEntryCode: string}) {
  return http.request({
    url: "/dictionary/listByParentEntryCode",
    method: "post",
    data
  });
}

//下载流文件
export function download() {
  return http.request({
    url: "/openCity/openCityList",
    method: "post",
  });
}

