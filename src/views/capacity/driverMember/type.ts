export interface TableItemInter {
  operationCompanyOpenedDriverMemberId: string | null;
  account: null | string;
  contacts: null | string;
  agent: null | string;
  status: null | number;
  create_time: null | string;
  phone?: null | string;
  sex?: null | number;
  operateCity: null | string
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