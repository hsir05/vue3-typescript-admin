export interface TableDataItemInter {
    customerInvoiceApplicationId: string
    invoiceApplicationTime: number
    invoiceApplicationState: number
    invoiceWay: number
    invoiceApplicationTypeCode: string
    invoiceType: number
}

export interface FormInter {
    customerInvoiceApplicationId: string | null;
    contactMail: string | null
}

export interface ReturnFormInter {
    customerInvoiceApplicationId: string | null;
    invoiceApplicationReturnReason: string | null
}

export interface InvoiceOpenFormInter {
    customerInvoiceApplicationId: string | null;
    invoiceWay: number | null
}
export interface RepeatFormInter {
    customerInvoiceApplicationId: string | null;
    contactMail: string | null
}

export interface MailFormInter {
    customerInvoiceApplicationId: string | null;
    expressName: string | null
    expressNum: string | null
}

