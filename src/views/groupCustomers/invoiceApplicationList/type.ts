export interface TableDataItemInter{
    groupCustomerInvoiceApplicationId:string
    invoiceApplicationTime: number
    invoiceApplicationState: number
    invoiceWay: number
    invoiceApplicationTypeCode: string
}

export interface QueryFormInter{
     groupCustomerNameLike: string | null;
    invoiceApplicationTimeGe: string | null;
    invoiceApplicationTimeLe: string | null;
    invoiceApplicationStateEq: string | null;
}
export interface FormInter{
    groupCustomerInvoiceApplicationId: string | null; 
    note: string | null
}