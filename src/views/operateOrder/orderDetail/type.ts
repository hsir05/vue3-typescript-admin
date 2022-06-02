export interface TableDataItemInter {
    orderId: string
    orderPayTime: number
    dealSerialNumber: number
}

export interface DataItemInter {
    flowOutBeginTime: number
    flowOutEndTime: number
}

export interface StepInter {
    orderState: string;
    date?: number | null;
    isDate?: boolean;
}