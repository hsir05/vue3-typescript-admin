export interface BusRateInter {
  orderBusinessType: string;
  groupCustomerMemberDiscountRate: number;
}

export interface BusLimitInter {
  orderBusinessType: string;
  groupCustomerMemberCreateOrderLimit: number;
}
export interface TableItemInter {
  groupCustomerMemberId: string;
  groupCustomerMemberType: string;
  groupCustomerMemberName: string;
  groupCustomerMemberDesc: string;
  groupCustomerMemberLock: number;
  groupCustomerMemberDiscountRateList: string;
  groupCustomerMemberCreateOrderLimitList: string;
}

export interface busTypeInter {
  limit: number | null
  rate: number | null
  orderBusinessType: string
  orderBusinessTypeName: string
}
export interface FormInter {
  groupCustomerMemberId?: string | null;
  groupCustomerMemberType: string | null;
  groupCustomerMemberName: string | null;
  groupCustomerMemberLock: number | null;
  groupCustomerMemberDesc: string | null
  rateLimitData: busTypeInter[];

}
export interface FormItemInter {
  rate: number | null;
  limit: number | null;
  orderBusinessType: string | null
}
