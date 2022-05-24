
export interface TableDataItemInter {
    customerWalletId: string
    customerWalletCreateTime: number
}

export interface RecordTableInter{
    customerWalletDealRecordId:string
    dealTime: number
}

export interface RecordFormInter {
     customerWalletIdEQ: string | null;
    dealTypeEQ: string | null;
    dealTimeGE: string | null;
    dealTimeLE: string | null;
}

export interface WalletInfoInter {
    customerPhone: string
    customerNickname: string
    customerName: string
    rechargeAmountBalance: number
    giftAmountBalance: number
    frozenAmount: number
    availableBalance: number
    totalBalance: number
    customerWalletCreateTime: number
}

export interface RechargeInter{
    customerWalletId: string | null
    rechargeAmount: number | null
    giftAmount: number | null
    rechargeNote: string | null
    password: string | null
}

export interface TransferInter{
    customerWalletId:string | null
    targetCustomerId:string | null
    rechargeAmount:number | null
    giftAmount:number | null
    transferNote:string | null
    password: string | null
}