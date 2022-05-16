export interface TableItemInter {
  operationCompanyOpenedDriverMemberId: string;
  operationCompanyId: string
  dispatchOrderLimitBeginTime: number
  operationCompanyName:string
  openTime: number
}

export interface TableMemberItemInter {
    driverMemberGoodsId:string
    operationCompanyId: string
    operationCompanyName:string
    createTime: number
    effectBeginTime:number
    effectEndTime:number
}

export interface MemberFormInter{
    operationCompanyIdEq: string | null;
    goodsNameLike: string | null;
}

export interface FormInter {
    driverMemberGoodsId?:string;
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