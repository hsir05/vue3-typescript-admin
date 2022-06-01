import { http } from "@/utils/http";
import { PaginationInter } from "../type";


//-----------------美团工单管理-------------------------

/**
 * 工单分页
 */
interface pageSate {
  page: PaginationInter;
  search: {
    mtOrderIdEq: string | null;
    processStateEq: string | null;
    refundTypeEq: string | null;
  };
}
export function getMeiTuanPage(data: pageSate) {
  return http.request({
    url: "/orderMeitComplaint/page",
    method: "post",
    data: data,
  });
}