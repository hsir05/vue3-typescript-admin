export interface TableDataItemInter{
    orderId: string
    orderCancelTime:number
}

export interface FormInter {
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
}