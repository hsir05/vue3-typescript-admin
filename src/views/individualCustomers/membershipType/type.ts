export interface BusRateInter {
    orderBusinessType: string;
    customerMemberDiscountRate: number;
}

export interface BusLimitInter {
    orderBusinessType: string;
    customerMemberCreateOrderLimit: number;
}
export interface TableItemInter {
    customerMemberId: string;
    customerMemberType: string;
    customerMemberName: string;
    customerMemberDesc: string;
    customerMemberLock: number;
    customerMemberDiscountRateMap: string;
    customerMemberCreateOrderLimitMap: string;
}

export interface busTypeInter {
    customerMemberCreateOrderLimit: number | null,
    customerMemberDiscountRate: number | null,
    orderBusinessType: string
    orderBusinessTypeName: string
}
export interface FormInter {
    customerMemberId?: string | null;
    customerMemberType: string | null;
    customerMemberName: string | null;
    customerMemberLock: number | null;
    customerMemberDesc: string | null
    rateLimitData: busTypeInter[];

}
export interface FormItemInter {
    rate: number | null;
    limit: number | null;
    orderBusinessType: string | null
}
export interface ItemLimitInter {
    orderBusinessType: string;
    customerMemberCreateOrderLimit: number
}
export interface ItemRateInter {
    orderBusinessType: string;
    customerMemberDiscountRate: number
}