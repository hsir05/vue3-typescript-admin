
export interface TableItemInter{
    customerMemberId: string
    customerRegTime: number | null 
    customerLock:number | null
    customerId:string
}

export interface FormInter{
    customerId: string | null
    customerMemberId: string | null
}