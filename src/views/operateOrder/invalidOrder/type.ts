export interface TableDataItemInter {
    orderId: string
    orderCancelTime: number
    orderBusinessType: string
    orderType: string
}

export interface FormInter {
    influxOrderNoEq: string | null;
    influxCodeEq: string | null;
    orderBusinessTypeEq: string | null;
    orderTypeEq: string | null;
    passengerPhone: string | null;
    customerPhoneEq: string | null;
    orderInvalidTimeGe: number | null;
    orderInvalidTimeLe: number | null;
}