export interface TableDataItemInter{
    customerInvoiceApplicationId: string
    invoiceApplicationTime: number
    invoiceApplicationState: number
    invoiceWay: number
    invoiceApplicationTypeCode: string
}

export interface FormInter{
    customerInvoiceApplicationId: string | null; 
    contactMail: string | null
}