import { http } from "@/utils/http";
import { PaginationInter } from "../type";
import { otherHttp } from "@/utils/http"
import { ContentTypeEnum } from "@/enums/httpEnum";
/**
 * 查询预付款信息
 */
export function getOrderAdvance(data: { orderId: string }) {
    return http.request({
        url: "/orderAdvance/listByOrderId",
        method: "post",
        data: data,
    });
}
/**
 * 根据订单流水号查询行程录音文件
 */
export function getOrderSoundfile(data: { orderNo: string }) {
    return http.request({
        url: "/orderSoundRecordingAttachfile/listByOrderNo",
        method: "post",
        data: data,
    });
}
/**
 * 查询订单异常支付记录
 */
export function getNetworkPaymentOrderData(data: { orderId: string }) {
    return http.request({
        url: "/networkPaymentOrderData/listByOrderId",
        method: "post",
        data: data,
    });
}
/**
 * 查询订单支付记录
 */
export function getOrderPayInfo(data: { orderId: string }) {
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
export function getOrderDetail(data: { orderId: string | null }) {
    return http.request({
        url: "/order/detail",
        method: "post",
        data: data,
    });
}

/**
 * 批量结单
 */
export function batchFinishOrder(data: { orderId: string }) {
    return otherHttp.request({
        url: "/order/batchFinishOrder",
        method: "post",
        data: data,
        headers: { Accept: ContentTypeEnum.JSON, "Content-Type": ContentTypeEnum.FORM_URLENCODED },
    });
}
/**
 * 单个结单
 */
export function singleFinishOrder(data: { influxOrderNo: string }) {
    return otherHttp.request({
        url: "/orderWaitPay/platform/finishOrder",
        method: "post",
        data: data,
    });
}
interface calculateOrderPriceInterface {
  orderId: string | null,
  orderFixedCost: number  | null,
  orderServiceMileage: number  | null,
  orderServiceDuration: number  | null,
  roadCost: number  | null,
  parkingCost: number  | null,
  cleaningCost: number  | null,
  otherCost: number  | null,
  driverWaitPassengerDuration: number  | null
}
export function calculateOrderPrice(data:calculateOrderPriceInterface) {
  return http.request({
    url: "/order/calculateOrderPrice",
    method: "post",
    data: data,
  });
}
/**
 * 根据区域编码，司机工号头，下单车型和订单类型查询
 * @param data
 */
export function findByDriverNoHeaderAndOrderPlaceVehicleAndOrderTypeAndAreaCode(data:{areaCode:string,driverNoHeader:string,orderPlaceVehicleId:string,orderType:string}) {
  return http.request({
    url:"/operationCompanyDriver/findByDriverNoHeaderAndOrderPlaceVehicleAndOrderTypeAndAreaCode",
    method:"post",
    data:data
  })
}

/**
 * 通过企业id和司机工号头来模糊查找司机
 * @param data
 */
export function findByDriverNoHeaderUnlock(data:{operationCompanyId:string,driverNoHeader:string}) {
  return http.request({
    url:"/operationCompanyDriver/findByDriverNoHeaderUnlock",
    method:"post",
    data:data
  })
}

/**
 * 通过订单id查询下单车型
 * @param data
 */
export function findVehicleTypeByOrderId(data:{orderId:string}) {
  return http.request({
    url:"/order/findVehicleTypeByOrderId",
    method:"post",
    data:data
  })
}

/**
 * 订单改派
 */
export function artificialDistributeOrder(data:{orderId:string | null,operationCompanyDriverId:string | null,loginCredentialId:string | null,loginPassword:string | null}){

  return otherHttp.request({
    url:"/orderInService/platform/artificialDistributeOrder",
    method:"post",
    data:data,
  })
}
interface AdjustFinishOrderPriceInter{
  orderId:string | null,
  orderFixedCost: number | null,
  orderServiceMileage: number | null,
  orderServiceDuration: number | null,
  roadCost: number | null,
  parkingCost: number | null,
  cleaningCost: number | null,
  otherCost: number | null,
  driverWaitPassengerDuration: number | null,
  adjustReason: string | null,
  password:string
}
/**
 * 调整完成待支付的订单价格
 */
export function adjustFinishOrderPrice(data:AdjustFinishOrderPriceInter) {
  return http.request({
    url:"/order/adjustFinishOrderPrice",
    method:"post",
    data:data,
  })
}
interface AdjustCancelOrderPriceInter{
  orderId:string | null,
  orderCancelCost:number | null
  adjustReason: string | null,
  password:string
}

/**
 * 调整取消待支付的订单价格
 * @param data
 */
export function adjustCancelOrderPrice(data:AdjustCancelOrderPriceInter){
  return http.request({
    url:"/order/adjustCancelOrderPrice",
    method:"post",
    data:data,
  })
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
        useVehicleTimeGe: number | null;
        useVehicleTimeLe: number | null;
    };
}
export function getOrderFinishedPage(data: OrderFinishedInter) {
    return http.request({
        url: "/orderFinished/page",
        method: "post",
        data: data,
    });
}
// 到处行程单
interface DownloadInter {
    search: {
        useVehicleTimeGe: number | null
        useVehicleTimeLe: number | null
        influxCodeEq: string | null
        plateNumberEq: string | null
        orderTypeEq: string | null
        orderBusinessTypeEq: string | null
        operationCompanyIdEq: string | null
        driverNoEq: string | null
        influxOrderNoEq: string | null
        customerPhoneEq: string | null
    }
}
export function downloadOrderFinished(data: DownloadInter) {
    return http.request({
        url: "/orderFinished/exportOrderFinished",
        method: "post",
        data: data,
        responseType: 'blob',
    });
}

/**
 * 已完成订单详情
 */
export function getOrderFinishedDetail(data: { orderId: string }) {
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
         timeGe: number | null
        timeLe: number | null
        influxOrderNoEq: string | null
        influxCodeEq: string | null
        operationCompanyIdEq: string | null
        orderStateEq: string | null
        plateNumberEq: string | null
        orderTypeEq: string | null
        driverNoEq: string | null
        customerPhoneEq: string | null
        orderBusinessType: string | null
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
export function getOrderCannelDetail(data: { orderId: string }) {
    return http.request({
        url: "/orderCancelled/detail",
        method: "post",
        data: data,
    });
}


// 导出已取消订单行程单
interface OrderCancelledInter {
    search: {
        timeGe: number | null
        timeLe: number | null
        influxOrderNoEq: string | null
        influxCodeEq: string | null
        operationCompanyIdEq: string | null
        orderStateEq: string | null
        plateNumberEq: string | null
        orderTypeEq: string | null
        driverNoEq: string | null
        customerPhoneEq: string | null
        orderBusinessType: string | null
    }
}
export function downloadOrderCancelled(data: OrderCancelledInter) {
    return http.request({
        url: "/orderCancelled/exportOrderCancelled",
        method: "post",
        data: data,
        responseType: 'blob',
    });
}

// 导出行程单
interface StatementInter {
    search: {
        timeGe: number | null
        timeLe: number | null
        influxOrderNoEq: string | null
        influxCodeEq: string | null
        operationCompanyIdEq: string | null
        orderStateEq: string | null
        plateNumberEq: string | null
        orderTypeEq: string | null
        driverNoEq: string | null
        customerPhoneEq: string | null
        orderBusinessType: string | null
    }
}
export function downloadStatement(data: StatementInter) {
    return http.request({
        url: "/orderCancelled/exportStatement",
        method: "post",
        data: data,
        responseType: 'blob',
    });
}
//-----------------无效订单-------------------------

/**
 * 无效订单
 */
interface OrderInvalidInter {
    page: PaginationInter;
    search: {
        influxOrderNoEq: string | null;
        influxCodeEq: string | null;
        orderBusinessTypeEq: string | null;
        orderTypeEq: string | null;
        passengerPhone: string | null;
        customerPhoneEq: string | null;
        orderInvalidTimeGe: number | null;
        orderInvalidTimeLe: number | null;
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
export function getOrderInvalidDetail(data: { orderId: string }) {
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
interface OrderEvaluationInter {
    page: PaginationInter;
    search: {
        orderNoEq: string | null
        customerPhoneEq: string | null
        serviceStarEq: string | null
        evaluationTimeGe: string | null
        evaluationTimeLe: string | null
    };
}
export function getOrderEvaluationPage(data: OrderEvaluationInter) {
    return http.request({
        url: "/orderEvaluation/page",
        method: "post",
        data: data,
    });
}

/**
 * 查询订单类型
*/

export function getOrderType(data: { orderId: string }) {
    return http.request({
        url: "/orderEvaluation/getOrderType",
        method: "post",
        data: data,
    });
}
