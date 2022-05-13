
export interface TableItemInter {
    groupCustomerId: string
    groupCustomerLock: number | null
    membershipType: string | null
    groupCustomerRegTime: number
}

export interface FormInter {
    groupCustomerId?: string | null
    groupCustomerName: string | null
    groupCustomerMemberId: string | null
    groupCustomerLoginAccount: string | null
    contactName: string | null
    contactPhone: string | null
}