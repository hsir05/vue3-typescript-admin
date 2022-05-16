export interface TableItemInter {
  operationCompanyOpenedDriverMemberId: string;
  dispatchOrderLimitBeginTime: number
  openTime: number
}

export interface FormInter {
    goodsName: string | null
    companyIds: string[] | null
    goodsTagPrice: number | null
    goodsSellingPrice: number | null
    goodsType: string | null
    memberEndTime: number | null
    memberRenewalTimeUnit: number | null
    memberRenewalCount: number | null
    purchasableDaysBeforeMemberExpire: number | null
    effectBeginTime: number | null
    effectEndTime: number | null
    goodsRemark: string | null
    createUser: string | null
}

export interface OrderLimitTime {
    operationCompanyOpenedDriverMemberId: string | null
    dispatchOrderLimitBeginTime: string | null
}