export interface TableDataItemInter {
    orderPayChannelTypeShowId: string
    orderPayChannelTypeLock: null | number
}

export interface QueryFormInter {
    deviceChannelType: string | null
    orderBusinessType: string | null
}

export interface FormInter{
     orderPayChannelTypeShowId?: string | null;
    orderPayChannelTypeShowName: string | null;
    paymentChannelType: string | null;
    orderPayChannelTypeShowDesc: string | null;
    orderPayChannelTypeLock: number | null;
}