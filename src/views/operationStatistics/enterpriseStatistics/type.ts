
export interface TableInter {
    finished: number
    cancelled: number
}
export interface TableDataItemInter {
    id: string
    liji: TableInter
    yuyue: TableInter
    jieji: TableInter
    songji: TableInter
    banrizu: TableInter
    quanrizu: TableInter
    total: TableInter
}

export type ArrItemInter = number[]

export interface ItemInter {
    label: string
    value: string
}

export type OrderItemInter = {
    [symbol: string]: TableInter | string,
}

export interface DataItemInter {
    date: string
    orderBelong: string
    orderCount: number
    orderTypeCode: string
    orderTypeName: string
    vehicleTypeId: string
}
export interface VehicleTypeDataInter {
    vehicleTypeName: string
    vehicleTypeId: string
}