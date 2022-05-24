
export interface TableDataItemInter{
    customerWalletRefundApplicationId: string
    dealState: number
    dealTime: number
    createTime: number
}

export interface FormInter{
    dealResult: string | null
    customerWalletRefundApplicationId: string | null
}

export interface QueryFormInter{
    invoiceApplicationTimeLE: string | null;
    contactPhoneLike: string | null;
    dealStateEq: number | null;
}