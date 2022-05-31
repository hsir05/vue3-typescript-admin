
interface CouponInter{
    customerCouponConsumeRuleName: string | null;
    couponLimitedAmount: string | null;
    couponUsedCityCodes: string | null;
    couponUsedOrderTypes: string | null;
    couponUsedVehicleTypeIds: string | null;
    couponUsedDayTimeSection: string | null;
    couponUsedWeekSection: string | null;
}

export interface TableDataItemInter extends CouponInter{
    customerCouponConsumeRuleId: string
}

export interface FormInter  {
    customerCouponConsumeRuleId?: string | null;
    customerCouponConsumeRuleName: string | null;
    couponLimitedAmount: string | null;
    couponUsedOrderTypes: string[] | null
    couponUsedVehicleTypeIds: string[] | null
    couponUsedDayTimeSection: string | null;
    couponUsedWeekSection: string | null;
    couponUsedCityCodes:string[] | null
}