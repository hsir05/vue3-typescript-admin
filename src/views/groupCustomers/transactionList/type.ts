export interface TableDataItemInrter{
    groupCustomerWalletDealRecordId: string
    dealType: number
    dealTime:number
}

export interface QueryFormInter{
    dealSerialNumberEq: string | null;
    dealTypeEq: string | null;
    dealTimeGe: string | null;
    dealTimeLe: string | null;
}