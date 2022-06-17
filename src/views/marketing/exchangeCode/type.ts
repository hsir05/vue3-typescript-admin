export interface TableDataItemInter {
  exchangeCodeId: string
  exchangeCodeUseTime: number
  exchangeCodeEffectiveTimeEnd: number
  exchangeCodeCreateTime: number
  exchangeCodeExchangeType: string
  exchangeCodeEffectiveTimeBegin: number,
  exchangeCodeAchieveOpportunity: string,
  exchangeCodeState: string
}

export interface QueryFormInter {
  taskName: string | null
  exchangeCodeCount: number | null
  exchangeCode: string | null
  exchangeCodeEffectiveTimeBegin: number | null
  exchangeCodeEffectiveTimeEnd: number | null
  exchangeCodeUsableCount: number | null
  walletAmount: {
    exchangeRechargeAmount: number | null
    exchangeGiftAmount: number | null
  }
}

export interface ExchangeCodeCouponInter {
  taskName: string | null
  exchangeCodeCount: number | null
  exchangeCode: string | null,
  exchangeCodeEffectiveTimeBegin: number | null,
  exchangeCodeEffectiveTimeEnd: number | null,
  exchangeCodeUsableCount: number | null
}

export interface CouponInter {
  couponName: string | null
  couponDenomination: number | null
  couponEffectiveDays: number | null
  customerCouponConsumeRuleId: string | null
  couponCount: number | null
}

export interface DataImportTaskITemInter {
  dataImportTaskId: string
  taskName: string
  importType: string
  beginTime: number
  endTime: number | null
  importCount: number
  successCount: number
  failureCount: number
  importLog: string
  operatorName: string
}

export interface CouponListInter{
  couponName: string | null
  couponCount: number | null,
  couponDenomination: number | null,
  couponEffectiveDays: number | null,
  customerCouponConsumeRule: {
    customerCouponConsumeRuleId: string | null,
    customerCouponConsumeRuleName: string | null,
    couponLimitedAmount: number | null,
    couponUsedCityCodes: string | null,
    couponUsedCityNames: string | null,
    couponUsedOrderTypes: string | null,
    couponUsedOrderTypeNames: string | null,
    couponUsedVehicleTypeIds: string | null,
    couponUsedVehicleTypeNames: string | null,
    couponUsedDayTimeSection: string | null,
    couponUsedDayTimeSectionDesc: string | null,
    couponUsedWeekSection: string | null,
    couponUsedWeekSectionDesc: string | null
  } | null
}
