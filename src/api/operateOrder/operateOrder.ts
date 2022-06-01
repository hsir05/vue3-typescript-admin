import { http } from "@/utils/http";
import { PaginationInter } from "../type";


/**
 * 查询预付款信息
 */
export function getOrderAdvance(data: {orderId: string}) {
    return http.request({
        url: "/orderAdvance/listByOrderId",
        method: "post",
        data: data,
    });
}
/**
 * 根据订单流水号查询行程录音文件
 */
export function getOrderSoundRecordingAttachfile(data: {orderId: string}) {
    return http.request({
        url: "/orderSoundRecordingAttachfile/listByOrderNo",
        method: "post",
        data: data,
    });
}
/**
 * 查询订单异常支付记录
 */
export function getNetworkPaymentOrderData(data: {orderId: string}) {
    return http.request({
        url: "/networkPaymentOrderData/listByOrderId",
        method: "post",
        data: data,
    });
}
/**
 * 查询订单支付记录
 */
export function getOrderPayInfo(data: {orderId: string}) {
    return http.request({
        url: "/orderPayInfo/listByOrderIdd",
        method: "post",
        data: data,
    });
}
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
/**
 * 服务中订单详情
 */
export function getOrderDetail(data: {orderId: string}) {
    return http.request({
        url: "/order/detail",
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
/**
 * 已完成订单详情
 */
export function getOrderFinishedDetail(data: {orderId: string}) {
    return http.request({
        url: "/orderFinished/detail",
        method: "post",
        data: data,
    });
}

//-----------------已取消订单-------------------------

/**
 * 已取消订单
 */
interface OrderChannelInter {
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
        orderBusinessType: string | null;
    };
}

export function getOrderChannelPage(data: OrderChannelInter) {
    return http.request({
        url: "/orderCancelled/page",
        method: "post",
        data: data,
    });
}
/**
 * 已取消订单详情
 */
export function getOrderCannelDetail(data: {orderId: string}) {
    return http.request({
        url: "/orderCancelled/detail",
        method: "post",
        data: data,
    });
}
//-----------------无效订单-------------------------

/**
 * 无效订单
 */
interface OrderInvalidInter {
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
        orderBusinessType: string | null;
    };
}
export function getOrderInvalidPage(data: OrderInvalidInter) {
    return http.request({
        url: "/orderInvalid/page",
        method: "post",
        data: data,
    });
}
/**
 * 无效订单详情
 */
export function getOrderInvalidDetail(data: {orderId: string}) {
    return http.request({
        url: "/orderInvalid/detail",
        method: "post",
        data: data,
    });
}
//-----------------评论订单-------------------------

/**
 * 评论订单
 */
// interface OrderEvaluationInter {
//     page: PaginationInter;
//     search: {
//         timeGe: null,
//             timeLe: null,
//             plateNumberEq: null,
//             orderTypeEq: null,
//             driverNoEq: null,
//             customerPhoneEq: null,
//     };
// }
export function getOrderEvaluationPage(data: {}) {
    return http.request({
        url: "/orderEvaluation/page",
        method: "post",
        data: data,
    });
}