export interface TableDataItemInter {
    customerWalletRechargeActivityId: string
    activityEndTime: number
    activityBeginTime: number
}

export interface FormInter {
    customerWalletRechargeActivityId?:string | null
    paymentChannelType: string | null;
      rechargeRate: number | null;
      minimumRechargeAmount: number | null;
      cumulativeRechargeAmount: number | null;
      activityBeginTime: number | null;
      activityEndTime: number | null;
      activityDesc: string | null;

}