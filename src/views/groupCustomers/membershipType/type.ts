
interface BusRateInter {
    orderBusinessType: string
    groupCustomerMemberDiscountRate: number
}

export interface TableItemInter {
    groupCustomerMemberId: string
    groupCustomerMemberType:string
    groupCustomerMemberName:string
    groupCustomerMemberDesc:string
    groupCustomerMemberLock: number
    groupCustomerMemberDiscountRateList: string
    groupCustomerMemberCreateOrderLimitList:string
}


export interface FormInter {
    groupCustomerMemberId?: string | null
    groupCustomerMemberType: string | null
    groupCustomerMemberName: string | null
    groupCustomerMemberDesc: string | null
    groupCustomerMemberLock: number  | null
    groupCustomerMemberDiscountRateList: string | null
    groupCustomerMemberCreateOrderLimitList: string | null

    // groupCustomerMemberDiscountRateList: BusRateInter
    // groupCustomerMemberCreateOrderLimitList: BusRateInter
}
export interface FormItem {
    rate: number | null;
    limit: number | null
}