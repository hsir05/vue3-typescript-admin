export interface TableDataItemInter {
    orderAdvancePayChannelTypeShowId: string
    orderAdvancePayChannelTypeLock: null | number
}

export interface QueryFormInter {
    deviceChannelType: string | null
}

export interface FormInter{
     orderAdvancePayChannelTypeShowId?: string | null
    orderAdvancePayChannelTypeShowName: string | null;
    paymentChannelType: string | null;
    deviceChannelType: string | null;
    orderAdvancePayChannelTypeShowDesc: string | null;
    orderAdvancePayChannelTypeLock: number | null;
}