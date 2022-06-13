export interface TableDataItemInter {
  exchangeCodeId: string
  exchangeCodeUseTime: number
  exchangeCodeEffectiveTimeEnd: number
  exchangeCodeCreateTime: number
  exchangeCodeExchangeType:string
  exchangeCodeEffectiveTimeBegin:number,
  exchangeCodeAchieveOpportunity:string,
  exchangeCodeState:string
}

export interface QueryFormInter {
  taskName:string | null
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
  taskName:string | null
  exchangeCodeCount: number | null
  exchangeCode: string | null,
  exchangeCodeEffectiveTimeBegin: number | null,
  exchangeCodeEffectiveTimeEnd: number | null,
  exchangeCodeUsableCount: number | null
}

export interface CouponInter{
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
