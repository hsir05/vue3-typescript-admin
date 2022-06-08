export interface TableDataItemInter {
    exchangeCodeId: string
    exchangeCodeUseTime: number
    exchangeCodeEffectiveTimeEnd: number
    exchangeCodeCreateTime: number
}

export interface QueryFormInter {
  exchangeCode:string | null
  exchangeCodeEffectiveTimeBegin:number |null
  exchangeCodeEffectiveTimeEnd:number |null
  exchangeCodeUsableCount:number |null
  walletAmount: {
    exchangeRechargeAmount:number |null
    exchangeGiftAmount:number |null
  }
}
