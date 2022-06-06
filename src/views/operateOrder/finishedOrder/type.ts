export interface TableDataItemInter{
    orderId: string
    orderPayTime: number
    dealSerialNumber: number
    orderPayAmount: number
    orderType: string
    orderBusinessType: string
}

export interface DataItemInter {
    flowOutBeginTime: number
    flowOutAmount: number
    flowOutEndTime: string | null
    flowOutState: string
    flowOutType: string
}

