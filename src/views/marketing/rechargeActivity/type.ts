export interface TableDataItemInter {
    customerWalletRechargeActivityId: string
    activityEndTime: number
    activityBeginTime: number
}

export interface FormInter {
    paymentChannelType: string | null;
      rechargeRate: string | null;
      minimumRechargeAmount: string | null;
      cumulativeRechargeAmount: string | null;
      activityBeginTime: number | null;
      activityEndTime: number | null;
      activityDesc: string | null;

}