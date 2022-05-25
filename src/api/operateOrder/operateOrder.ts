import { http } from "@/utils/http";
import { PaginationInter } from "../type";

// 运营订单管理
//-----------------服务中订单-------------------------

/**
 * 服务中订单
 */
interface OrderPageInter {
    page: PaginationInter;
    search: {
        timeGe: string | null;
        timeLe: string | null;
        influxOrderNoEq: string | null;
        influxCodeEq: string | null;
        operationCompanyIdEq: string | null;
        orderStateEq: string | null;
        plateNumberEq: string | null;
        orderTypeEq: string | null;
        driverNoEq: string | null;
        customerPhoneEq: string | null;
    };
}
export function getOrderPage(data: OrderPageInter) {
    return http.request({
        url: "/order/page",
        method: "post",
        data: data,
    });
}
//-----------------已完成订单-------------------------

/**
 * 已完成订单
 */
interface OrderFinishedInter {
    page: PaginationInter;
    search: {
        influxOrderNoEq: string | null;
        influxCodeEq: string | null;
        orderTypeEq: string | null;
        customerPhoneEq: string | null;
        operationCompanyIdEq: string | null;
        driverNoEq: string | null;
        plateNumberEq: string | null;
        orderBusinessTypeEq: string | null;
        useVehicleTimeGe: string | null;
        useVehicleTimeLe: string | null;
    };
}
export function getOrderFinishedPage(data: OrderFinishedInter) {
    return http.request({
        url: "/orderFinished/page",
        method: "post",
        data: data,
    });
}