export interface TableDataItemInter{
    orderId: string
    orderCancelTime:number
    operationCompanyName: string
    driverNo: string
    plateNumber: string | null
    orderBusinessType: string | null
    orderType: string | null
    
}

export interface FormInter {
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