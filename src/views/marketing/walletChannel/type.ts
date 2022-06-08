export interface TableDataItemInter {
    customerWalletRechargeChannelShowId: string
    customerWalletRechargeChannelLock: null | number
    deviceChannelType: string
}

export interface QueryFormInter {
    deviceChannelType: string | null
    // orderBusinessType: string | null
}

export interface FormInter{
    customerWalletRechargeChannelShowId?: string | null;
    customerWalletRechargeChannelShowName: string | null;
    paymentChannelType: string | null;
    deviceChannelType: string | null;
    customerWalletRechargeChannelLock: number | null;
}