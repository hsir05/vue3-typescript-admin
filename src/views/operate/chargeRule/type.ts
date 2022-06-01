export interface TableDataItemInter {
  chargeRuleBaseId?: string | null;
  chargeRuleMileageId?: string | null;
  chargeRuleDurationId?: string | null;
  chargeRuleWaitId?: string | null;
  chargeRuleCancelId?: string | null;
  chargeRuleFloatId?: string | null;
}


export interface FormInter{
    packagePrice:number | null
    containMileage:number | null
    containDuration:number | null
}

export interface DistributionInter {
    ruleId: string | null
    ruleType: string | null
    orderType: string | null
    vehicleType: string | null
    openArea: string | null
}